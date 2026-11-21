// Das Logo von Herrn Schönnbrun (Wiki: der Held von BrunnenTV hat ein eigenes Logo): eine runde Plakette mit Goldrand,
// darin ein kleiner Brunnen als Herr – Becken mit Augen und gezwirbeltem Schnurrbart, der Strahl trägt eine Melone,
// das Wasser fällt in zwei Bögen ins Becken zurück. Ohne Schrift (die Bauchbinde nennt ihn), auf einer Zeichenfläche
// gemalt, damit es in jeder Größe scharf ist; die Bauchbinde (ui.js) und das Album (ui/album.js) zeigen es.

const GOLD = '#f4c752';
const GOLD_DARK = '#c8952a';
const INK = '#1e2128';

/** Das Logo in das Quadrat (x, y, s) zeichnen. */
export function drawSchoennbrunLogo(ctx, x, y, s) {
  const cx = x + s / 2;
  const cy = y + s / 2;
  const u = s / 100; // ein Hundertstel der Größe
  ctx.save();
  // Plakette: Goldrand, darin Brunnenblau mit Licht von oben links
  ctx.beginPath();
  ctx.arc(cx, cy, 48 * u, 0, Math.PI * 2);
  const ring = ctx.createLinearGradient(x, y, x + s, y + s);
  ring.addColorStop(0, GOLD);
  ring.addColorStop(1, GOLD_DARK);
  ctx.fillStyle = ring;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 42.5 * u, 0, Math.PI * 2);
  const blue = ctx.createRadialGradient(cx - 14 * u, cy - 18 * u, 4 * u, cx, cy, 44 * u);
  blue.addColorStop(0, '#3d97e3');
  blue.addColorStop(1, '#123f86');
  ctx.fillStyle = blue;
  ctx.fill();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // Wasser: zwei Bögen von der Hutkrempe ins Becken, dazu ein paar Tropfen
  ctx.strokeStyle = '#d9f1ff';
  ctx.lineWidth = 4.2 * u;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + side * 9 * u, cy - 15 * u);
    ctx.bezierCurveTo(cx + side * 26 * u, cy - 24 * u, cx + side * 33 * u, cy - 4 * u, cx + side * 27 * u, cy + 12 * u);
    ctx.stroke();
    ctx.fillStyle = '#d9f1ff';
    for (const [dx, dy, r] of [[35, -9, 2.4], [37, 3, 1.9], [21, -27, 1.8]]) {
      ctx.beginPath();
      ctx.arc(cx + side * dx * u, cy + dy * u, r * u, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Strahl: vom Becken hinauf bis unter die Krempe
  const jet = ctx.createLinearGradient(cx, cy + 14 * u, cx, cy - 16 * u);
  jet.addColorStop(0, '#9fdcff');
  jet.addColorStop(1, '#f2fbff');
  ctx.fillStyle = jet;
  ctx.beginPath();
  ctx.moveTo(cx - 4.5 * u, cy + 14 * u);
  ctx.quadraticCurveTo(cx - 3 * u, cy - 4 * u, cx - 5 * u, cy - 15 * u);
  ctx.lineTo(cx + 5 * u, cy - 15 * u);
  ctx.quadraticCurveTo(cx + 3 * u, cy - 4 * u, cx + 4.5 * u, cy + 14 * u);
  ctx.closePath();
  ctx.fill();
  // Melone: Krempe, Kopf mit Glanzlicht, goldenes Band
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 16 * u, 17 * u, 4.6 * u, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 11 * u, cy - 17 * u);
  ctx.bezierCurveTo(cx - 12 * u, cy - 40 * u, cx + 12 * u, cy - 40 * u, cx + 11 * u, cy - 17 * u);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(cx - 11.2 * u, cy - 18.5 * u);
  ctx.lineTo(cx + 11.2 * u, cy - 18.5 * u);
  ctx.lineTo(cx + 11.6 * u, cy - 23.5 * u);
  ctx.lineTo(cx - 11.6 * u, cy - 23.5 * u);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2.2 * u;
  ctx.beginPath();
  ctx.arc(cx - 2 * u, cy - 26 * u, 7 * u, Math.PI * 1.08, Math.PI * 1.42);
  ctx.stroke();
  // Becken: helle Steinschale mit Wasserspiegel
  ctx.fillStyle = '#eef4f9';
  ctx.beginPath();
  ctx.moveTo(cx - 29 * u, cy + 12 * u);
  ctx.bezierCurveTo(cx - 27 * u, cy + 33 * u, cx + 27 * u, cy + 33 * u, cx + 29 * u, cy + 12 * u);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c9d9e6';
  ctx.beginPath();
  ctx.moveTo(cx - 24 * u, cy + 24 * u);
  ctx.bezierCurveTo(cx - 14 * u, cy + 33 * u, cx + 14 * u, cy + 33 * u, cx + 24 * u, cy + 24 * u);
  ctx.bezierCurveTo(cx + 14 * u, cy + 30 * u, cx - 14 * u, cy + 30 * u, cx - 24 * u, cy + 24 * u);
  ctx.fill();
  ctx.fillStyle = '#7cc8f4';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 12 * u, 29 * u, 5 * u, 0, 0, Math.PI * 2);
  ctx.fill();
  // Gesicht am Becken: zwei Augen mit Glanzpunkt, gezwirbelter Schnurrbart
  for (const side of [-1, 1]) {
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(cx + side * 8 * u, cy + 20 * u, 2.9 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx + side * 8 * u - 0.9 * u, cy + 19 * u, 0.95 * u, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#4a3423';
  ctx.lineWidth = 3.2 * u;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + 25.5 * u);
    ctx.bezierCurveTo(cx + side * 6 * u, cy + 23 * u, cx + side * 12 * u, cy + 29 * u, cx + side * 16 * u, cy + 24.5 * u);
    ctx.quadraticCurveTo(cx + side * 17.5 * u, cy + 21.5 * u, cx + side * 15 * u, cy + 21.8 * u);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Das Logo als Bild für Bauchbinde und Album: eine Zeichenfläche mit der Klasse cls, gemalt in dreifacher Auflösung der
 * Größe px (CSS-Pixel; die Größe im Bild legt style.css fest) – so bleibt es auf jedem Bildschirm scharf.
 */
export function schoennbrunBadge(doc, cls, px) {
  const c = doc.createElement('canvas');
  c.className = cls;
  c.width = c.height = px * 3;
  c.setAttribute('role', 'img');
  c.setAttribute('aria-label', 'Logo von Herrn Schönnbrun');
  drawSchoennbrunLogo(c.getContext('2d'), 0, 0, px * 3);
  return c;
}
