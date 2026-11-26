// Kleine Bildzeichen der Karte, mit Leinwand-Befehlen gezeichnet (keine Bilddateien): Auto mit Mini Adam, Zielfahne,
// Autobahnschild, Fähre, Autozug und Flugzeug, Pfeile der Navi-Ansage, Herz für besuchte Orte. Gebraucht von der Navi-
// Ansicht im Mittelbildschirm (navview.js), der großen Karte im Menü (src/ui/mapscreen.js), den Kacheln (mapview.js)
// und der Navi-Zeile im HUD.
export const FONT = '"Helvetica Neue", Arial, sans-serif';
const ADAM = { skin: '#d9a477', cap: '#141416', live: '#e0301e' };
/** Farben der Überfahrten (Linie und Bildzeichen). */
export const TRANSIT_COLOR = { faehre: '#4d86c6', zug: '#6d7078', flug: '#7b74c9' };

export function rrect(ctx, x, y, w, h, r) {
  const q = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + q, y);
  ctx.arcTo(x + w, y, x + w, y + h, q);
  ctx.arcTo(x + w, y + h, x, y + h, q);
  ctx.arcTo(x, y + h, x, y, q);
  ctx.arcTo(x, y, x + w, y, q);
  ctx.closePath();
}
/** Text kürzen, bis er passt (mit „…“). */
export function fit(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t.trimEnd() + '…';
}

/**
 * Pfeil-Bildzeichen der Ansage (in einem Kasten der Größe s, Mitte bei cx, cy): 'exit', 'straight', 'merge',
 * 'arrive', 'stop' (Ladestopp), 'faehre', 'zug', 'flug', 'none'.
 */
export function drawTurnIcon(ctx, turn, cx, cy, s, color = '#ffffff') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s / 100, s / 100);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const head = (x, y, a) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(17, 6);
    ctx.lineTo(-17, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  if (turn === 'exit') {
    // Hauptfahrbahn dünn geradeaus, Ausfahrt kräftig nach rechts
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(-12, 42);
    ctx.lineTo(-12, -36);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(-12, 42);
    ctx.lineTo(-12, 14);
    ctx.quadraticCurveTo(-12, -6, 14, -20);
    ctx.stroke();
    head(22, -25, Math.atan2(-14, 20) + Math.PI / 2);
  } else if (turn === 'merge') {
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(-14, 42);
    ctx.lineTo(-14, -20);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(26, 42);
    ctx.quadraticCurveTo(26, 4, -6, -12);
    ctx.lineTo(-6, -24);
    ctx.stroke();
    head(-6, -30, 0);
  } else if (turn === 'arrive') {
    // Zielfahne
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-22, 44);
    ctx.lineTo(-22, -40);
    ctx.stroke();
    const w = 52;
    const hh = 34;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.globalAlpha = (i + j) % 2 ? 0.35 : 1;
        ctx.fillRect(-20 + (i * w) / 4, -40 + (j * hh) / 3, w / 4 + 0.5, hh / 3 + 0.5);
      }
    }
    ctx.globalAlpha = 1;
  } else if (turn === 'stop') {
    // Ladestopp: Stecker mit zwei Stiften, das Kabel geht unten in einem Bogen ab
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(-14, -42);
    ctx.lineTo(-14, -22);
    ctx.moveTo(14, -42);
    ctx.lineTo(14, -22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-30, -24);
    ctx.lineTo(30, -24);
    ctx.lineTo(30, -2);
    ctx.quadraticCurveTo(30, 20, 0, 22);
    ctx.quadraticCurveTo(-30, 20, -30, -2);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.quadraticCurveTo(0, 44, 24, 44);
    ctx.stroke();
  } else if (turn === 'faehre' || turn === 'zug' || turn === 'flug') {
    drawTransitShape(ctx, turn, 0, 0, 1.6, color);
  } else if (turn === 'straight') {
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(0, 42);
    ctx.lineTo(0, -16);
    ctx.stroke();
    head(0, -24, 0);
  } else {
    // keine Ansage: ein ruhiger Punkt
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Kleines Bildzeichen für Fähre, Autozug und Flug (Mitte bei x, y; k = Maßstab, 1 ≈ 30 Bildpunkte breit). */
export function drawTransitShape(ctx, kind, x, y, k, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  if (kind === 'faehre') {
    ctx.beginPath();
    ctx.moveTo(-16, 1);
    ctx.lineTo(16, 1);
    ctx.lineTo(11, 11);
    ctx.lineTo(-11, 11);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(-9, -7, 15, 7);
    ctx.fillRect(-3, -13, 5, 7);
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-16, 16);
    ctx.quadraticCurveTo(-12, 13, -8, 16);
    ctx.quadraticCurveTo(-4, 19, 0, 16);
    ctx.quadraticCurveTo(4, 13, 8, 16);
    ctx.quadraticCurveTo(12, 19, 16, 16);
    ctx.stroke();
  } else if (kind === 'zug') {
    rrect(ctx, -12, -15, 24, 25, 6);
    ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(-8, -10, 16, 8);
    ctx.beginPath();
    ctx.arc(-6, 4, 2.6, 0, Math.PI * 2);
    ctx.arc(6, 4, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-8, 12);
    ctx.lineTo(-13, 18);
    ctx.moveTo(8, 12);
    ctx.lineTo(13, 18);
    ctx.stroke();
  } else {
    // Flugzeug von oben, Nase nach oben
    ctx.beginPath();
    ctx.moveTo(0, -17);
    ctx.quadraticCurveTo(3.5, -14, 3.5, -8);
    ctx.lineTo(3.5, -3);
    ctx.lineTo(17, 4);
    ctx.lineTo(17, 8);
    ctx.lineTo(3.5, 4);
    ctx.lineTo(3, 11);
    ctx.lineTo(8, 15);
    ctx.lineTo(8, 17.5);
    ctx.lineTo(0, 15.5);
    ctx.lineTo(-8, 17.5);
    ctx.lineTo(-8, 15);
    ctx.lineTo(-3, 11);
    ctx.lineTo(-3.5, 4);
    ctx.lineTo(-17, 8);
    ctx.lineTo(-17, 4);
    ctx.lineTo(-3.5, -3);
    ctx.lineTo(-3.5, -8);
    ctx.quadraticCurveTo(-3.5, -14, 0, -17);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Das Auto als kleiner schwarzer Pfeil mit einem Hauch Mini Adam (Plüschkopf mit schwarzer Cap und rotem LIVE-Punkt).
 * Mitte bei x, y, Spitze in Richtung a (Bogenmaß, 0 = nach oben auf dem Bild), size ≈ Länge in Bildpunkten.
 */
export function drawCar(ctx, x, y, a, size, glow = 'rgba(47,111,228,0.18)') {
  ctx.save();
  ctx.translate(x, y);
  if (glow) {
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.95, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.rotate(a);
  const k = size / 40;
  ctx.scale(k, k);
  ctx.lineJoin = 'round';
  // schlanker Pfeil mit tiefer Kerbe (liest sich auch klein eindeutig als Richtung), weich gerundete Flügel
  const body = () => {
    ctx.beginPath();
    ctx.moveTo(0, -21);
    ctx.lineTo(13, 13.5);
    ctx.quadraticCurveTo(14.2, 17.4, 10.6, 16.2);
    ctx.lineTo(0, 7);
    ctx.lineTo(-10.6, 16.2);
    ctx.quadraticCurveTo(-14.2, 17.4, -13, 13.5);
    ctx.closePath();
  };
  // weicher Schatten, weißer Rand, schwarzer Körper mit hellerer rechter Hälfte (wirkt wie ein kleines Spielzeug)
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.save();
  ctx.translate(1.2, 2.4);
  body();
  ctx.fill();
  ctx.restore();
  body();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4.5;
  ctx.stroke();
  ctx.fillStyle = '#17181b';
  ctx.fill();
  ctx.fillStyle = '#3a3d44';
  ctx.beginPath();
  ctx.moveTo(0, -21);
  ctx.lineTo(13, 13.5);
  ctx.quadraticCurveTo(14.2, 17.4, 10.6, 16.2);
  ctx.lineTo(0, 7);
  ctx.closePath();
  ctx.fill();
  // Mini Adam von oben: Kopf mit schwarzer Cap (Schirm nach vorn) und rotem LIVE-Punkt
  ctx.fillStyle = ADAM.skin;
  ctx.beginPath();
  ctx.arc(0, 0.2, 5.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = ADAM.cap;
  ctx.beginPath();
  ctx.arc(0, -0.4, 4.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -4.2, 3.6, 2.2, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = ADAM.live;
  ctx.beginPath();
  ctx.arc(0, -0.1, 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Autobahnschild (blau, weiße Schrift) bzw. Bundesstraße (gelb, schwarze Schrift), Mitte bei x, y. */
export function drawShield(ctx, text, x, y, h, kind = 'ab') {
  ctx.font = `700 ${Math.round(h * 0.62)}px ${FONT}`;
  const w = Math.max(h * 1.25, ctx.measureText(text).width + h * 0.55);
  ctx.fillStyle = kind === 'ab' ? '#2a5bb8' : '#f2c230';
  rrect(ctx, x - w / 2, y - h / 2, w, h, h * 0.24);
  ctx.fill();
  ctx.strokeStyle = kind === 'ab' ? '#ffffff' : '#1d1f22';
  ctx.lineWidth = Math.max(1.4, h * 0.07);
  rrect(ctx, x - w / 2 + h * 0.09, y - h / 2 + h * 0.09, w - h * 0.18, h - h * 0.18, h * 0.17);
  ctx.stroke();
  ctx.fillStyle = kind === 'ab' ? '#ffffff' : '#1d1f22';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + h * 0.03);
  return w;
}

/** Zielfahne an der Stelle x, y (Spitze des Stabs unten), k = Größe (1 ≈ 34 Bildpunkte hoch). */
export function drawFlag(ctx, x, y, k = 1, pole = '#1d1f22') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 2.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = pole;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -34);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(1, -34);
  ctx.quadraticCurveTo(10, -38, 22, -32);
  ctx.lineTo(22, -18);
  ctx.quadraticCurveTo(10, -24, 1, -20);
  ctx.closePath();
  ctx.fillStyle = '#e8352b';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.restore();
}

/** Auf diesem Anteil seiner Länge läuft ein Fluss der Karte an jedem Ende aus. */
export const RIVER_FADE = 0.2;
/**
 * Fluss der Karte: Wasser in der Farbe color ('#rrggbb') als Band der halben Breite hw um die Achse von (ax, ay) nach
 * (bx, by). An beiden Enden läuft es aus – der Fluss endet nicht an einer Kante, er verliert sich im Land.
 */
export function fillRiver(ctx, ax, ay, bx, by, hw, color) {
  const len = Math.hypot(bx - ax, by - ay);
  if (!(len > 0)) return;
  const nx = (-(by - ay) / len) * hw;
  const ny = ((bx - ax) / len) * hw;
  const g = ctx.createLinearGradient(ax, ay, bx, by);
  g.addColorStop(0, color + '00');
  g.addColorStop(RIVER_FADE, color);
  g.addColorStop(1 - RIVER_FADE, color);
  g.addColorStop(1, color + '00');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(ax + nx, ay + ny);
  ctx.lineTo(bx + nx, by + ny);
  ctx.lineTo(bx - nx, by - ny);
  ctx.lineTo(ax - nx, ay - ny);
  ctx.closePath();
  ctx.fill();
}
/**
 * Name eines Flusses auf seinem Wasser: Mitte bei x, y, längs der Richtung a (Bogenmaß; die Schrift steht nie kopf),
 * schräg gesetzt wie Gewässernamen auf Karten. size = Schriftgröße, color = Schrift, water = Farbe des Wassers als
 * Saum (ist der Fluss schmaler als die Schrift, steht sie so in einer kleinen Bucht statt auf dem Land).
 */
export function drawRiverName(ctx, name, x, y, a, size, color, water) {
  let r = Math.atan2(Math.sin(a), Math.cos(a));
  if (r > Math.PI / 2) r -= Math.PI;
  else if (r < -Math.PI / 2) r += Math.PI;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(r);
  ctx.font = `italic 600 ${size}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(3, size * 0.3);
  ctx.strokeStyle = water;
  ctx.strokeText(name, 0, 0);
  ctx.fillStyle = color;
  ctx.fillText(name, 0, 0);
  ctx.restore();
}

/** Herz (besuchter Ort), Mitte bei x, y, r ≈ halbe Breite; ring = Randfarbe (oder null). */
export function drawHeart(ctx, x, y, r, color, ring = null) {
  ctx.save();
  ctx.translate(x, y + r * 0.08);
  ctx.scale(r / 10, r / 10);
  ctx.beginPath();
  ctx.moveTo(0, 9);
  ctx.bezierCurveTo(-4, 5.5, -10.5, 1.5, -10.5, -3.5);
  ctx.bezierCurveTo(-10.5, -7.5, -7.5, -9.5, -5, -9.5);
  ctx.bezierCurveTo(-2.6, -9.5, -0.9, -8, 0, -6);
  ctx.bezierCurveTo(0.9, -8, 2.6, -9.5, 5, -9.5);
  ctx.bezierCurveTo(7.5, -9.5, 10.5, -7.5, 10.5, -3.5);
  ctx.bezierCurveTo(10.5, 1.5, 4, 5.5, 0, 9);
  ctx.closePath();
  if (ring) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3.2;
    ctx.strokeStyle = ring;
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.fill();
  // kleiner Glanzpunkt: wirkt wie ein Aufkleber
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.ellipse(-4.6, -4.6, 2.2, 1.5, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Rundes Abzeichen mit dem Bildzeichen einer Überfahrt (Fähre, Autozug, Flug), Mitte bei x, y, Halbmesser r. */
export function drawTransitBadge(ctx, kind, x, y, r, bg = '#ffffff') {
  ctx.fillStyle = 'rgba(0,0,0,0.16)';
  ctx.beginPath();
  ctx.arc(x, y + r * 0.12, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = Math.max(1, r * 0.14);
  ctx.strokeStyle = TRANSIT_COLOR[kind];
  ctx.stroke();
  const k = (r * 1.25) / 30;
  drawTransitShape(ctx, kind, x, y - (kind === 'faehre' ? 3 : kind === 'zug' ? 1.5 : 0) * k, k, TRANSIT_COLOR[kind]);
}
