// Kleine HUD-Anzeigen der Fahrt: der Wagen von oben mit farbigen Zonen und den übrigen Karosserie-Punkten (ersetzt die
// bloßen Herzen) und das Tempomat-Schild neben dem Tempo. Beide fassen das DOM nur an, wenn sich etwas geändert hat.
import { ZONES } from '../game/damage.js';

const NS = 'http://www.w3.org/2000/svg';
/** Farben je Stufe: heil, verschrammt, verbeult, hängt schief */
export const ZONE_COLORS = ['#e9edf3', '#ffd24a', '#ff9838', '#ff5b57'];

const svg = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
};

/**
 * Wagen von oben (Bug rechts, wie er durchs Bild fährt): Heck links, Bug rechts, linke Seite oben, rechte unten.
 * Pflaster für reparierte Stellen, ein feiner Strich für Leitplanken-Kratzer.
 */
export class DamageBadge {
  /** @param {HTMLElement} row die .stat-Zeile; das Symbol wird ersetzt, die Herzen stehen in valueEl */
  constructor(row, valueEl) {
    this.row = row;
    this.valueEl = valueEl;
    this.d = null;
    const icon = row.querySelector('.stat-icon');
    icon.textContent = '';
    icon.classList.add('dmg-icon');
    row.classList.add('dmg-row');
    const s = svg('svg', { viewBox: '0 0 30 17', width: '30', height: '17', 'aria-hidden': 'true' }, icon);
    const clip = svg('clipPath', { id: 'dmg-clip' }, svg('defs', {}, s));
    svg('rect', { x: 1, y: 1.5, width: 28, height: 14, rx: 5 }, clip);
    const g = svg('g', { 'clip-path': 'url(#dmg-clip)' }, s);
    svg('rect', { x: 0, y: 0, width: 30, height: 17, fill: ZONE_COLORS[0] }, g);
    this.zone = {
      rear: svg('rect', { x: 0, y: 0, width: 7.2, height: 17 }, g),
      front: svg('rect', { x: 22.8, y: 0, width: 8, height: 17 }, g),
      left: svg('rect', { x: 7.2, y: 0, width: 15.6, height: 4.4 }, g),
      right: svg('rect', { x: 7.2, y: 12.6, width: 15.6, height: 4.4 }, g),
    };
    // Kratzer der Leitplanke: feine Linien an den Seiten
    this.scratch = {
      left: svg('path', { d: 'M9 3.1 L13 2.6 M14.5 3.2 L19 2.7', stroke: 'rgba(60,64,72,0.75)', 'stroke-width': 0.7, fill: 'none' }, g),
      right: svg('path', { d: 'M9 13.9 L13 14.4 M14.5 13.8 L19 14.3', stroke: 'rgba(60,64,72,0.75)', 'stroke-width': 0.7, fill: 'none' }, g),
    };
    svg('rect', { x: 1, y: 1.5, width: 28, height: 14, rx: 5, fill: 'none', stroke: 'rgba(0,0,0,0.6)', 'stroke-width': 1 }, s);
    // Glasdach und Frontscheibe
    svg('rect', { x: 9.4, y: 5.1, width: 10.6, height: 6.8, rx: 2.2, fill: '#26303f' }, s);
    svg('path', { d: 'M20.8 5.4 Q23.6 8.5 20.8 11.6 Z', fill: '#3a4a62' }, s);
    // Pflaster: kleine beige Streifen über der Zone
    const plaster = (x, y, rot) => {
      const p = svg('g', { transform: `translate(${x} ${y}) rotate(${rot})` }, s);
      svg('rect', { x: -3.4, y: -1.3, width: 6.8, height: 2.6, rx: 0.9, fill: '#f3d9a8', stroke: 'rgba(120,86,40,0.7)', 'stroke-width': 0.5 }, p);
      svg('rect', { x: -1, y: -1.3, width: 2, height: 2.6, fill: '#e2c08a' }, p);
      return p;
    };
    this.plaster = { rear: plaster(4.2, 8.5, 60), front: plaster(25.8, 8.5, -60), left: plaster(15, 2.6, -12), right: plaster(15, 14.4, 12) };
  }

  /** @param {import('../game/damage.js').Damage} d */
  update(d) {
    if (!d) return;
    const left = d.left;
    if (d === this.d && d.version === this.version && left === this.left) return;
    // ein neuer Rempler lässt das Symbol kurz hüpfen, eine Reparatur kurz grün leuchten (nicht beim Wechsel des Zustands)
    const pop = d === this.d && d.hits > this.hits ? 'dmg-pop' : d === this.d && d.repairs > this.repairs ? 'dmg-heal' : null;
    this.d = d;
    this.version = d.version;
    this.left = left;
    this.hits = d.hits;
    this.repairs = d.repairs;
    if (pop) {
      this.row.classList.remove('dmg-pop', 'dmg-heal');
      void this.row.offsetWidth; // Animation neu starten
      this.row.classList.add(pop);
    }
    const patched = new Set(d.patches.map((p) => p.zone));
    for (const z of ZONES) {
      this.zone[z].setAttribute('fill', ZONE_COLORS[d.zones[z]]);
      this.plaster[z].style.display = patched.has(z) ? '' : 'none';
      if (this.scratch[z]) this.scratch[z].style.display = d.scratches[z] > 0 && d.zones[z] === 0 ? '' : 'none';
    }
    this.valueEl.textContent = '♥'.repeat(left) + '♡'.repeat(Math.max(0, d.maxHits - left));
    const worst = d.worstZone();
    this.row.title = 'Karosserie: ' + (worst ? ZONES.filter((z) => d.zones[z] > 0).map((z) => d.word(z)).join(', ') : 'alles heil');
    this.row.classList.toggle('dmg-last', left === 1);
  }
}

/** „Tempomat 130“ neben dem Tempo, solange der Tempomat ein Tempo hält. */
export class CruiseBadge {
  constructor(row) {
    this.el = document.createElement('span');
    this.el.className = 'cruise-badge hidden';
    row.appendChild(this.el);
    this.text = '';
  }

  update(p) {
    const on = p.cruiseSet !== null && p.cruiseSet !== undefined;
    const text = on ? 'Tempomat ' + Math.round(p.cruiseSet * 3.6) : '';
    if (text === this.text) return;
    this.text = text;
    this.el.classList.toggle('hidden', !on);
    this.el.textContent = text;
  }
}
