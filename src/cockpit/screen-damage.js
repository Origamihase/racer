// Schaden auf dem Mittelbildschirm: links neben dem Tempo der Wagen von oben (Bug oben) mit farbigen Zonen und
// Pflastern, im Statusstreifen unten abwechselnd mit dem Spur-Hinweis ein Satz wie „Stoßfänger vorn: verbeult“.
// Der Bildschirm zeichnet ohnehin 15× pro Sekunde neu; hier kommt nur ein Dutzend Pfade dazu.
import { ZONES } from '../game/damage.js';
import { ZONE_COLORS } from '../ui/drive-hud.js';

const seen = new WeakMap(); // Schadens-Objekt → { version, t } (wann zuletzt geändert, für den Statusstreifen)

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Wagen von oben (Bug oben) in das Rechteck x, y, w, h zeichnen.
 * @param {CanvasRenderingContext2D} ctx @param {import('../game/damage.js').Damage} d @param {object} T Farben (sub, text)
 */
export function drawDamageCar(ctx, d, x, y, w, h, T) {
  const r = w * 0.36;
  ctx.save();
  rr(ctx, x, y, w, h, r);
  ctx.fillStyle = '#e4e7ec';
  ctx.fill();
  ctx.save();
  ctx.clip();
  const band = h * 0.2;
  const side = w * 0.22;
  const zone = { front: [x, y, w, band], rear: [x, y + h - band, w, band], left: [x, y + band, side, h - 2 * band], right: [x + w - side, y + band, side, h - 2 * band] };
  for (const z of ZONES) {
    const lv = d.zones[z];
    if (!lv) continue;
    ctx.fillStyle = ZONE_COLORS[lv];
    ctx.fillRect(...zone[z]);
  }
  ctx.restore();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#2a2d33';
  rr(ctx, x, y, w, h, r);
  ctx.stroke();
  // Glasdach mit Frontscheibe und Heckscheibe
  ctx.fillStyle = '#2b3442';
  rr(ctx, x + w * 0.27, y + h * 0.27, w * 0.46, h * 0.5, w * 0.12);
  ctx.fill();
  ctx.fillStyle = 'rgba(150,180,220,0.55)';
  rr(ctx, x + w * 0.3, y + h * 0.29, w * 0.4, h * 0.1, w * 0.06);
  ctx.fill();
  // Spiegel
  ctx.fillStyle = '#2a2d33';
  ctx.fillRect(x - w * 0.1, y + h * 0.33, w * 0.1, h * 0.05);
  ctx.fillRect(x + w, y + h * 0.33, w * 0.1, h * 0.05);
  // Pflaster der reparierten Stellen (neueste obenauf)
  const at = { front: [x + w * 0.5, y + band * 0.55, -0.35], rear: [x + w * 0.5, y + h - band * 0.55, 0.35], left: [x + side * 0.5, y + h * 0.56, 1.25], right: [x + w - side * 0.5, y + h * 0.56, -1.25] };
  const done = new Set();
  for (let i = d.patches.length - 1; i >= 0; i--) {
    const z = d.patches[i].zone;
    if (done.has(z)) continue;
    done.add(z);
    const [px, py, rot] = at[z];
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.fillStyle = '#f2d6a2';
    ctx.strokeStyle = 'rgba(120,86,40,0.8)';
    ctx.lineWidth = 1.5;
    rr(ctx, -w * 0.28, -w * 0.09, w * 0.56, w * 0.18, w * 0.06);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ddb57a';
    ctx.fillRect(-w * 0.07, -w * 0.09, w * 0.14, w * 0.18);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Satz für den Statusstreifen: nach jeder Änderung 6 s lang, danach im Wechsel (4 s Schaden, 4 s Spur-Hinweis).
 * Gibt { text, color } zurück oder null (dann zeigt der Streifen den Spur-Hinweis).
 */
export function damageBand(d, t) {
  if (!d) return null;
  let s = seen.get(d);
  if (!s || s.version !== d.version) {
    s = { version: d.version, t };
    seen.set(d, s);
  }
  const z = d.worstZone();
  const since = t - s.t;
  if (!z) {
    // gerade repariert: kurz das Pflaster loben
    if (d.patches.length && since < 5) return { text: 'Repariert · mit Pflaster', color: '#2f9e5a' };
    return null;
  }
  if (since > 6 && Math.floor((since - 6) / 4) % 2 === 1) return null;
  const lv = d.zones[z];
  return { text: d.word(z), color: lv >= 3 ? '#e0453e' : lv >= 2 ? '#e07a1e' : '#c99a10' };
}
