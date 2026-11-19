// Schaden außen am Tesla, im knuffigen Stil des Spiels: je Zone drei klar verschiedene Stufen.
//   vorn/hinten  1: Schrammen und eine weiche Delle
//                2: größere Delle, verbogenes Kennzeichen, eine Leuchte flackert
//                3: Stoßfänger hängt an einer Ecke herunter, Haube bzw. Klappe steht einen Spalt offen, Leuchte aus
//   Seiten       1: Schrammen und eine weiche Delle
//                2: größere Delle, die Spiegelkappe sitzt schief, eine Leuchte flackert
//                3: der Spiegel hängt herunter, eine Leuchte ist aus
// Reparierte Stellen bleiben bis zum Ende der Runde als Pflaster oder Klebeband-Kreuz sichtbar; am letzten Punkt
// steigen ein paar freundliche Dampfwölkchen aus der Haube. Kein Glasbruch, keine scharfen Trümmer, kein Feuer.
// Jeder Rempler pufft ein paar Staubwölkchen mit gelbem Funkeln aus der getroffenen Zone; klemmt die Kofferraumklappe,
// rieseln ab und zu Konfetti aus dem Spalt (die Konfetti-Kanone aus dem Stream lässt grüßen).
//
// Dellen, der hängende Stoßfänger, die offene Klappe und der Spiegel verformen die vorhandenen Teile (keine neuen
// Zeichenaufrufe; Normalen werden mitgedreht, damit der schwarze Lack die Delle spiegelt). Die Comic-Zeichnung der
// Dellen, Schrammen, Spalten und Pflaster liegt als Aufkleber auf der Karosserie: Auf schwarzem Lack sieht man eine
// Delle sonst kaum. Was hinten passiert, sitzt auf der flachen Heckwand und an den hinteren Ecken: Die sieht die
// Drohne hinter dem Wagen. Neu sind höchstens sechs Zeichenaufrufe (Aufkleber, Leuchten aus, Leuchten flackernd,
// Dampf, Wölkchen, Konfetti; die letzten drei nur, solange sie zu sehen sind), neu gebaut wird nur, wenn sich der
// Schaden ändert.
import * as THREE from 'three';
import { W, curve } from '../curve.js';
import { mulberry32 } from '../util.js';
import { surfacePatch } from './loft.js';

const smooth = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// --- Aufkleber-Atlas (512 × 512, 4 × 4 Felder zu 128 px) ------------------------------------------------------
// Alles kräftig und mit Abstand zum Feldrand gezeichnet: Aus der Drohne ist ein Aufkleber nur ein paar Dutzend
// Bildpunkte groß, feine Linien würden zu einem milchigen Fleck verschwimmen.
const COLS = 4;
const ROWS = 4;
const CELL = { scuff: 0, scuffHeavy: 1, rail: 2, plaster: 3, tapeX: 4, gap: 5, tape: 6, heart: 7, dent: 8, dentBig: 9, seam: 10 };

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Spitz zulaufender Strich entlang der Punkte pts (Breite w0 am Anfang, w1 am Ende, runder Anfang). */
function taper(g, pts, w0, w1) {
  const n = pts.length;
  const left = [];
  const right = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    dx /= l;
    dy /= l;
    const w = (w0 + ((w1 - w0) * i) / (n - 1)) / 2;
    left.push([pts[i][0] - dy * w, pts[i][1] + dx * w]);
    right.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  g.beginPath();
  g.moveTo(left[0][0], left[0][1]);
  for (const p of left) g.lineTo(p[0], p[1]);
  for (let i = n - 1; i >= 0; i--) g.lineTo(right[i][0], right[i][1]);
  g.closePath();
  g.fill();
  g.beginPath();
  g.arc(pts[0][0], pts[0][1], w0 / 2, 0, Math.PI * 2);
  g.fill();
}

/** Leicht gebogene Linie von (x0, y0) nach (x1, y1) als Punkte (bend: Ausbuchtung in px). */
function bentLine(x0, y0, x1, y1, bend, n = 14) {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const l = Math.hypot(x1 - x0, y1 - y0) || 1;
  const cx = mx - ((y1 - y0) / l) * bend;
  const cy = my + ((x1 - x0) / l) * bend;
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = (1 - t) * (1 - t);
    const b = 2 * t * (1 - t);
    const c = t * t;
    out.push([a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1]);
  }
  return out;
}

/** Punkte auf einer Ellipse (Mitte cx, cy, Halbachsen rx, ry) von Winkel a0 bis a1. */
function arcPts(cx, cy, rx, ry, a0, a1, n = 18) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return out;
}

/** Bogen, der zu beiden Enden spitz ausläuft (Glanzlicht am Rand einer Delle). */
function sickle(g, cx, cy, rx, ry, a0, a1, w) {
  const pts = arcPts(cx, cy, rx, ry, a0, a1, 24);
  const mid = Math.floor(pts.length / 2);
  taper(g, pts.slice(0, mid + 1).reverse(), w, 0.4);
  taper(g, pts.slice(mid), w, 0.4);
}

function atlasTexture() {
  const c = document.createElement('canvas');
  c.width = 128 * COLS;
  c.height = 128 * ROWS;
  const g = c.getContext('2d');
  const rnd = mulberry32(20261117);
  const cell = (i, fn) => {
    g.save();
    g.translate((i % COLS) * 128, Math.floor(i / COLS) * 128);
    g.beginPath();
    g.rect(2, 2, 124, 124);
    g.clip();
    fn();
    g.restore();
  };
  const LIGHT = (a) => `rgba(236,239,244,${a})`;
  // Lack angeraut: ganz zarte, weich auslaufende Fläche (macht die Stelle matt, kein Nebel)
  const matte = (rx, ry, a) => {
    g.save();
    g.translate(64, 64);
    g.scale(1, ry / rx);
    const grd = g.createRadialGradient(0, 0, rx * 0.2, 0, 0, rx);
    grd.addColorStop(0, `rgba(196,204,216,${a})`);
    grd.addColorStop(1, 'rgba(196,204,216,0)');
    g.fillStyle = grd;
    g.beginPath();
    g.arc(0, 0, rx, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };
  // Schrammen: wenige kräftige, spitz auslaufende Striche und ein paar Lacksplitter
  const scratches = (n, x0, x1, y0, y1, wMax, alpha) => {
    for (let i = 0; i < n; i++) {
      const y = y0 + ((i + 0.5) / n) * (y1 - y0) + (rnd() - 0.5) * 5;
      const a = x0 + rnd() * 14;
      const b = x1 - rnd() * 14;
      const tilt = (rnd() - 0.5) * 10;
      g.fillStyle = LIGHT(alpha * (0.8 + rnd() * 0.2));
      taper(g, bentLine(a, y - tilt, b, y + tilt, (rnd() - 0.5) * 6), wMax * (0.7 + rnd() * 0.3), 0.8);
    }
  };
  const chips = (n, rx, ry) => {
    for (let i = 0; i < n; i++) {
      const t = rnd() * Math.PI * 2;
      const r = 0.35 + rnd() * 0.6;
      g.fillStyle = LIGHT(0.85);
      g.beginPath();
      g.arc(64 + Math.cos(t) * rx * r, 64 + Math.sin(t) * ry * r, 1.4 + rnd() * 1.6, 0, Math.PI * 2);
      g.fill();
    }
  };
  cell(CELL.scuff, () => {
    matte(52, 26, 0.14);
    scratches(4, 18, 110, 50, 78, 4.5, 0.95);
    chips(5, 44, 20);
  });
  cell(CELL.scuffHeavy, () => {
    matte(58, 34, 0.18);
    scratches(7, 10, 118, 40, 88, 5, 0.95);
    // zwei tiefe Kratzer bis aufs Blech: hell mit einer dunklen Kante darunter
    for (const y of [56, 72]) {
      const pts = bentLine(22 + rnd() * 10, y, 100 + rnd() * 14, y + (rnd() - 0.5) * 8, (rnd() - 0.5) * 8);
      g.fillStyle = 'rgba(0,0,0,0.55)';
      taper(g, pts.map(([x, yy]) => [x, yy + 2.6]), 3, 0.8);
      g.fillStyle = 'rgba(255,255,255,1)';
      taper(g, pts, 3.4, 0.8);
    }
    chips(9, 52, 28);
  });
  cell(CELL.rail, () => {
    // Leitplanken-Kratzer: lange, leicht gewellte Linien längs auf weich auslaufend mattem Lack
    matte(62, 26, 0.12);
    for (let i = 0; i < 9; i++) {
      const y = 42 + (i / 8) * 44 + (rnd() - 0.5) * 4;
      g.fillStyle = LIGHT(0.55 + rnd() * 0.4);
      taper(g, bentLine(4 + rnd() * 16, y, 124 - rnd() * 18, y + (rnd() - 0.5) * 4, (rnd() - 0.5) * 3), 1.8 + rnd() * 1.6, 0.8);
    }
  });
  // Delle auf Glanzlack: weich auslaufende dunkle Mulde, unten innen fängt sie den Himmel (heller Bogen mit Glanzlinie),
  // oben außen eine zarte Lichtkante – so liest man sie auch auf Schwarz, ohne dass sie wie ein Aufkleber wirkt
  const dent = (rx, ry, depth) => {
    g.save();
    g.translate(64, 64);
    g.scale(1, ry / rx);
    const grd = g.createRadialGradient(-rx * 0.12, -rx * 0.18, rx * 0.1, 0, 0, rx);
    grd.addColorStop(0, `rgba(0,0,0,${depth})`);
    grd.addColorStop(0.7, `rgba(0,0,0,${depth * 0.5})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.beginPath();
    g.arc(0, 0, rx, 0, Math.PI * 2);
    g.fill();
    g.restore();
    g.save();
    g.filter = 'blur(3px)';
    g.fillStyle = LIGHT(0.8);
    sickle(g, 64, 64, rx * 0.74, ry * 0.74, 0.12 * Math.PI, 0.88 * Math.PI, 9);
    g.fillStyle = LIGHT(0.45);
    sickle(g, 64, 64, rx * 0.98, ry * 1.0, 1.16 * Math.PI, 1.84 * Math.PI, 5);
    g.restore();
    g.fillStyle = LIGHT(0.95);
    sickle(g, 64, 64, rx * 0.74, ry * 0.74, 0.3 * Math.PI, 0.7 * Math.PI, 2.4);
  };
  cell(CELL.dent, () => dent(40, 30, 0.45));
  cell(CELL.dentBig, () => {
    dent(54, 40, 0.55);
    // zwei kleine Knicke am Rand
    g.fillStyle = LIGHT(0.7);
    for (const [x0, y0, x1, y1] of [[24, 46, 34, 38], [98, 84, 108, 76]]) taper(g, bentLine(x0, y0, x1, y1, 2), 2.4, 0.8);
  });
  const plaster = (heart) => {
    g.save();
    g.translate(64, 64);
    g.shadowColor = 'rgba(0,0,0,0.35)';
    g.shadowBlur = 4;
    roundRect(g, -56, -21, 112, 42, 17);
    g.fillStyle = '#efc58c';
    g.fill();
    g.shadowColor = 'transparent';
    g.strokeStyle = '#c4945a';
    g.lineWidth = 2;
    g.stroke();
    // Luftlöcher auf den Flügeln
    g.fillStyle = 'rgba(160,110,60,0.55)';
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
          g.beginPath();
          g.arc(sx * (31 + i * 8), -7 + j * 14, 1.7, 0, Math.PI * 2);
          g.fill();
        }
      }
    }
    // Wundauflage
    roundRect(g, -19, -17, 38, 34, 6);
    g.fillStyle = '#fbefdf';
    g.fill();
    g.strokeStyle = 'rgba(196,150,96,0.6)';
    g.lineWidth = 1;
    g.stroke();
    if (heart) {
      g.fillStyle = '#ff6f91';
      g.beginPath();
      g.moveTo(0, 10);
      g.bezierCurveTo(-16, -1, -9, -15, 0, -6);
      g.bezierCurveTo(9, -15, 16, -1, 0, 10);
      g.fill();
    }
    g.restore();
  };
  cell(CELL.plaster, () => plaster(false));
  cell(CELL.heart, () => plaster(true));
  const tapeStrip = (ang, w) => {
    g.save();
    g.translate(64, 64);
    g.rotate(ang);
    g.beginPath();
    g.moveTo(-56, -w / 2);
    g.lineTo(56, -w / 2);
    // ausgefranste Enden
    for (let y = -w / 2; y <= w / 2; y += 4) g.lineTo(56 + (rnd() - 0.5) * 6, y);
    g.lineTo(-56, w / 2);
    for (let y = w / 2; y >= -w / 2; y -= 4) g.lineTo(-56 + (rnd() - 0.5) * 6, y);
    g.closePath();
    const grd = g.createLinearGradient(0, -w / 2, 0, w / 2);
    grd.addColorStop(0, '#d6dade');
    grd.addColorStop(0.5, '#b4bac1');
    grd.addColorStop(1, '#c9ced3');
    g.fillStyle = grd;
    g.shadowColor = 'rgba(0,0,0,0.35)';
    g.shadowBlur = 3;
    g.fill();
    g.shadowColor = 'transparent';
    // Gewebe-Struktur
    g.strokeStyle = 'rgba(255,255,255,0.25)';
    g.lineWidth = 1;
    for (let x = -52; x < 52; x += 5) {
      g.beginPath();
      g.moveTo(x, -w / 2 + 2);
      g.lineTo(x + 3, w / 2 - 2);
      g.stroke();
    }
    g.restore();
  };
  cell(CELL.tapeX, () => {
    tapeStrip(0.6, 26);
    tapeStrip(-0.6, 26);
  });
  cell(CELL.tape, () => tapeStrip(0, 30));
  // Spalt einer offenen Klappe: oben die helle Kante des Blechs, darunter dunkel; zu den Enden hin schmaler
  const band = (yTop, h0, h1) => {
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const x = 6 + (i / 24) * 116;
      const k = i / 24;
      const fade = smooth(0, 0.14, k) * smooth(1, 0.86, k);
      pts.push([x, h0 + (h1 - h0) * k, fade]);
    }
    // dunkles Inneres
    g.beginPath();
    g.moveTo(pts[0][0], yTop);
    for (const [x, , f] of pts) g.lineTo(x, yTop + 1 - (1 - f) * 0.5);
    for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i][0], yTop + pts[i][1] * pts[i][2]);
    g.closePath();
    const grd = g.createLinearGradient(0, yTop, 0, yTop + Math.max(h0, h1));
    grd.addColorStop(0, 'rgba(0,0,0,0.98)');
    grd.addColorStop(0.75, 'rgba(4,5,7,0.92)');
    grd.addColorStop(1, 'rgba(10,12,16,0.75)');
    g.fillStyle = grd;
    g.fill();
    // helle Kante oben (Blechkante im Licht) und ein Hauch unten
    g.fillStyle = 'rgba(214,222,232,0.8)';
    taper(g, pts.map(([x, , f]) => [x, yTop - 1.2 * f]), 0.6, 0.6);
    for (let i = 1; i < pts.length; i++) {
      const [xa, , fa] = pts[i - 1];
      const [xb, , fb] = pts[i];
      g.fillStyle = `rgba(214,222,232,${0.8 * Math.min(fa, fb)})`;
      g.fillRect(xa, yTop - 2.6, xb - xa + 0.5, 2.4);
    }
  };
  cell(CELL.gap, () => band(46, 34, 34));
  cell(CELL.seam, () => band(50, 30, 4));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// --- Was wo passiert ---------------------------------------------------------------------------------------------
// Orte auf der Karosserie als [u, Y, s]: u längs (0 = Bug, 4,69 = Heck), Y Höhe im Querschnitt (−1 unten … 1 oben, die
// Höhe hängt linear davon ab), s Seite (1 rechts, −1 links). Oben auf Haube und Klappe: [u, X, 'top'] mit X quer.
// Auf der flachen Heckwand (die schaut direkt in die Drohne): [x, y, 'back'] in Metern (x rechts, y Höhe, Wand
// 0,42–0,95 m hoch, ±0,77 m breit, Kennzeichen in der Mitte bei 0,62 m).
// Dellen: [u, Y, s, Radius (m), Tiefe (m)]. Aufkleber: [u, Y, s, Breite, Höhe (m), Drehung, Feld]; Breite und Höhe
// gelten im Bild: auf den Seiten ist oben oben, auf Haube und Klappe zeigt oben nach vorn (so liest man es aus der
// Drohne). Eine negative Breite spiegelt.
const LOOK = {
  front: {
    dents: [[[0.12, -0.3, 1, 0.12, 0.012]], [[0.14, -0.2, -1, 0.16, 0.022]], []],
    decals: [
      [[0.12, -0.3, 1, 0.2, 0.2, 0, 'dent'], [0.17, -0.08, 1, 0.3, 0.3, 0.1, 'scuff']],
      [[0.14, -0.2, -1, 0.3, 0.3, 0, 'dentBig'], [0.21, 0.02, -1, 0.36, 0.36, -0.1, 'scuffHeavy']],
      [[0.21, 0.3, 1, 0.56, 0.12, 0, 'seam'], [0.33, 0, 'top', 0.98, 0.07, Math.PI, 'gap']],
    ],
  },
  // hinten vor allem auf der Heckwand: die sieht die Drohne hinter dem Wagen von vorn (die Ecken nur von der Seite)
  rear: {
    dents: [[[4.63, -0.3, -1, 0.12, 0.012]], [[4.64, -0.26, 1, 0.16, 0.022]], []],
    decals: [
      [[0.47, 0.765, 'back', 0.5, 0.3, -0.1, 'scuff'], [-0.46, 0.56, 'back', 0.28, 0.25, 0, 'dent']],
      [[-0.44, 0.79, 'back', 0.32, 0.27, 0, 'dentBig'], [0.5, 0.545, 'back', 0.42, 0.24, 0.08, 'scuffHeavy']],
      // Klappe klemmt: Spalt unter der Kante quer über die Wand; der Stoßfänger hängt links (Riss an der Ecke)
      [[0, 0.9, 'back', 1.04, 0.1, 0, 'gap'], [-0.52, 0.5, 'back', 0.42, 0.09, 0.35, 'seam'], [4.47, 0.42, -1, 0.56, 0.12, 0, 'seam'], [4.6, 0, 'top', 0.9, 0.07, 0, 'gap']],
    ],
  },
  // Seiten: an der Tür (nah, Orbit) und an der hinteren Ecke dieser Seite – die schaut schräg nach hinten, also in die
  // Drohne (die Flanke selbst sieht sie nur streifend)
  left: {
    dents: [[[2.3, -0.15, -1, 0.2, 0.014]], [[3.0, 0.0, -1, 0.26, 0.026]], []],
    decals: [
      [[2.3, -0.15, -1, 0.3, 0.3, 0, 'dent'], [2.05, -0.3, -1, 0.42, 0.42, 0.05, 'scuff'], [4.62, 0.02, -1, 0.5, 0.4, -0.1, 'scuffHeavy']],
      [[3.0, 0.0, -1, 0.42, 0.42, 0, 'dentBig'], [2.72, -0.3, -1, 0.46, 0.4, -0.06, 'scuffHeavy'], [4.6, -0.36, -1, 0.42, 0.32, 0.1, 'scuffHeavy']],
      [],
    ],
  },
  right: {
    dents: [[[2.3, -0.15, 1, 0.2, 0.014]], [[3.0, 0.0, 1, 0.26, 0.026]], []],
    decals: [
      [[2.3, -0.15, 1, 0.3, 0.3, 0, 'dent'], [2.05, -0.3, 1, 0.42, 0.42, -0.05, 'scuff'], [4.62, 0.02, 1, 0.5, 0.4, 0.1, 'scuffHeavy']],
      [[3.0, 0.0, 1, 0.42, 0.42, 0, 'dentBig'], [2.72, -0.3, 1, 0.46, 0.4, 0.06, 'scuffHeavy'], [4.6, -0.36, 1, 0.42, 0.32, -0.1, 'scuffHeavy']],
      [],
    ],
  },
};
// Pflaster je Zone: Plätze für die 1., 2., 3. … Reparatur dort ([u, Y, s, Drehung])
// (hinten und an den hinteren Ecken zuerst: dort schaut die Drohne hin)
const PATCH_SPOTS = {
  front: [[0.13, -0.22, 1, -0.45], [0.15, -0.2, -1, 0.35], [0.24, 0.05, -1, 0.15]],
  rear: [[0.47, 0.74, 'back', 0.35], [-0.46, 0.66, 'back', -0.3], [0.44, 0.52, 'back', -0.15]],
  left: [[4.645, -0.12, -1, 0.4], [2.3, -0.12, -1, -0.25], [3.0, 0.02, -1, 0.1]],
  right: [[4.645, -0.12, 1, -0.4], [2.3, -0.12, 1, 0.25], [3.0, 0.02, 1, -0.1]],
};
// Leitplanken-Kratzer an der Seite (je Schramme ein Streifen mehr): [u, Y, Länge, Höhe]
const RAIL_SPOTS = [[2.6, 0.05, 1.7, 0.13], [3.3, -0.14, 1.2, 0.11], [1.75, -0.02, 0.9, 0.1]];
// Welche Leuchte flackert (Stufe 2) und welche ist aus (Stufe 3): [Art, Seite]
const LAMPS = {
  front: { flicker: ['drl', 1], out: ['head', 1] },
  rear: { flicker: ['tail', -1], out: ['tail', -1] },
  left: { flicker: ['tail', -1], out: ['drl', -1] },
  right: { flicker: ['tail', 1], out: ['drl', 1] },
};
// Spiegel: Stufe 1 leicht verdreht, Stufe 2 sitzt die Kappe schief, Stufe 3 hängt er (nach unten und nach hinten
// geklappt), in rad – aus der Drohne ist der Spiegel das deutlichste Zeichen für einen Seitenschaden
const MIRROR = [null, { droop: 0.07, fold: 0.12 }, { droop: 0.2, fold: 0.28 }, { droop: 0.5, fold: 0.62 }];

/**
 * @param {object} h Haken aus tesla.js (damageHooks): root, body, slots, sticker, plateF, plateR, mirrors (Gehäuse,
 *   Glas), mirrorZ, bodyPoint(u, φ, v), sidePhi(s, φ), L, n, lampUV { head(s), drl(s), tail(s) } (je (a, t) → [u, φ])
 */
export class TeslaDamage {
  constructor(h) {
    this.h = h;
    this.L = h.L;
    this.zF = -h.L / 2;
    this.zR = h.L / 2;
    // Verformbare Teile: Ursprungszustand merken
    const keep = (m) => {
      const g = m.geometry;
      return { m, g, pos0: g.attributes.position.array.slice(), nrm0: g.attributes.normal ? g.attributes.normal.array.slice() : null };
    };
    this.deformables = [h.body, h.slots, h.sticker].filter(Boolean).map(keep);
    this.mirrors = (h.mirrors || []).map(keep);
    this.plates = [h.plateF, h.plateR].filter(Boolean).map((m) => ({ m, p0: m.position.clone(), r0: m.rotation.clone() }));
    const atlas = atlasTexture();
    this.decalMat = W.std({
      map: atlas, transparent: true, depthWrite: false, roughness: 0.55, metalness: 0, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
    });
    this.decals = new THREE.Mesh(new THREE.BufferGeometry(), this.decalMat);
    this.decals.renderOrder = 1;
    this.decals.visible = false;
    const cover = (opacity) => W.basic({
      color: 0x050607, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6,
    });
    this.outMesh = new THREE.Mesh(new THREE.BufferGeometry(), cover(0.9));
    this.flickMesh = new THREE.Mesh(new THREE.BufferGeometry(), cover(0));
    this.outMesh.renderOrder = this.flickMesh.renderOrder = 1;
    this.outMesh.visible = this.flickMesh.visible = false;
    this.steam = new SteamWisps({ count: 14, size: 0.55, origin: new THREE.Vector3(0, 0.72, this.zF + 0.32), spread: 0.45, rise: 0.9 });
    // Staubwölkchen mit gelben Funkeln an der Stelle jedes Remplers (auch aus der Drohne zu sehen, wo es geknufft hat)
    this.puff = new ImpactPuff();
    this.hitsSeen = 0;
    // klemmt die Klappe (Heck Stufe 3), rieseln ab und zu Konfetti aus dem Spalt – die Konfetti-Kanone lässt grüßen
    this.confetti = new ConfettiTrail(new THREE.Vector3(0, 0.98, this.zR - 0.04));
    h.root.add(this.decals, this.outMesh, this.flickMesh, this.steam.points, this.puff.points, this.confetti.points);
    this.d = null;
    this.version = -1;
    this.last = false;
    this.v = new THREE.Vector3();
  }

  /** φ (loft.js) aus einem Ort [u, Y, s] bzw. [u, X, 'top']. */
  phiOf(a, s) {
    const e = this.h.n / 2;
    if (s === 'top') {
      const X = Math.max(-1, Math.min(1, a));
      return Math.acos(Math.sign(X) * Math.pow(Math.abs(X), e));
    }
    const Y = Math.max(-0.999, Math.min(0.999, a));
    const ph = Math.sign(Y) * Math.asin(Math.pow(Math.abs(Y), e));
    return this.h.sidePhi(s, ph);
  }

  /** Punkt (und auf Wunsch die Normale nach außen) zu einem Ort [u, Y, s] bzw. [u, X, 'top']. */
  point(u, a, s, out = new THREE.Vector3(), nrm = null) {
    this.h.bodyPoint(u, this.phiOf(a, s), out);
    if (nrm) this.normalAt(u, a, s, out, nrm);
    return out;
  }

  /** Ableitungen der Fläche nach u und nach a an einem Ort (in m je Einheit). */
  tangents(u, a, s, p, Tu, Ta) {
    const du = u > this.L - 0.01 ? -1e-3 : 1e-3;
    const da = a > 0.9 ? -1e-3 : 1e-3;
    this.point(u + du, a, s, Tu).sub(p).divideScalar(du);
    this.point(u, a + da, s, Ta).sub(p).divideScalar(da);
  }

  normalAt(u, a, s, p, nrm) {
    const A = this.va || (this.va = new THREE.Vector3());
    const B = this.vb || (this.vb = new THREE.Vector3());
    this.tangents(u, a, s, p, A, B);
    nrm.crossVectors(A, B).normalize();
    if (nrm.x * p.x + nrm.y * (p.y - 0.75) + nrm.z * p.z < 0) nrm.negate();
    return nrm;
  }

  /** Verformung für einen Punkt p mit Normale n (beide werden verändert); dents: false lässt die Dellen weg. */
  deform(p, n, dents = true) {
    const F = this.field;
    if (!F) return;
    let along = 0;
    let tx = 0;
    let ty = 0;
    let tz = 0;
    for (const d of dents ? F.dents : []) {
      const dx = d.c.x - p.x;
      const dy = d.c.y - p.y;
      const dz = d.c.z - p.z;
      const r2 = dx * dx + dy * dy + dz * dz;
      if (r2 > 6.25 * d.R * d.R) continue;
      // nur die Seite der Delle (nicht durch die Karosserie hindurch auf die andere Seite)
      if (n.x * d.n.x + n.y * d.n.y + n.z * d.n.z < 0.2) continue;
      const g = Math.exp(-r2 / (d.R * d.R));
      along -= d.A * g;
      // Normale zur Mitte kippen (der schwarze Lack zeigt die Delle über die Spiegelung), bewusst kräftig
      const k = (2.6 * 2 * d.A * g) / (d.R * d.R);
      tx += dx * k;
      ty += dy * k;
      tz += dz * k;
    }
    if (along) p.addScaledVector(n, along);
    // Stoßfänger hängt an einer Ecke herunter: vorn bzw. hinten unterhalb der Fuge, zur Ecke hin immer mehr
    for (const s of F.sags) {
      const zf = s.front ? smooth(this.zF + 0.55, this.zF + 0.06, p.z) : smooth(this.zR - 0.55, this.zR - 0.06, p.z);
      if (zf <= 0) continue;
      const yf = smooth(s.yTop, s.yTop - 0.12, p.y);
      const xf = smooth(-0.9, 0.95, p.x * s.side);
      const w = zf * yf * xf * xf;
      p.y -= s.drop * w;
      p.x += 0.018 * w * Math.sign(p.x || 1);
      p.z += (s.front ? -0.022 : 0.022) * w;
      tx += 0.3 * w * s.side;
      ty += 0.2 * w;
    }
    // Haube bzw. Kofferraumklappe stehen einen Spalt offen (die freie Kante hebt sich)
    for (const l of F.lids) {
      const top = smooth(0.45, 0.75, n.y);
      if (top <= 0) continue;
      const xf = smooth(l.xMax, l.xMax - 0.16, Math.abs(p.x));
      let f;
      if (l.front) f = smooth(this.zF + 0.2, this.zF + 0.36, p.z) * smooth(this.zF + 1.35, this.zF + 0.36, p.z);
      else f = smooth(this.zR - 0.06, this.zR - 0.2, p.z) * smooth(this.zR - 0.8, this.zR - 0.2, p.z);
      p.y += l.lift * top * xf * f;
    }
    if (tx || ty || tz) {
      n.x += tx;
      n.y += ty;
      n.z += tz;
      n.normalize();
    }
  }

  /** Alles nach dem aktuellen Schaden neu aufbauen. */
  rebuild(d) {
    const field = { dents: [], sags: [], lids: [] };
    const last = d.left === 1 && d.hits > 0;
    const decals = [];
    const lampsOut = [];
    const lampsFlick = [];
    const mirror = { left: 0, right: 0 };
    let plateF = 0;
    let plateR = 0;
    for (const z of ['front', 'rear', 'left', 'right']) {
      const lv = d.zones[z];
      const look = LOOK[z];
      for (let k = 0; k < Math.min(lv, 2); k++) {
        for (const [u, Y, s, R, A] of look.dents[k]) {
          const n = new THREE.Vector3();
          const c = this.point(u, Y, s, new THREE.Vector3(), n);
          field.dents.push({ c, n, R, A: lv >= 2 && k === 0 ? A * 1.3 : A });
        }
      }
      for (let k = 0; k < lv; k++) for (const dc of look.decals[k]) decals.push(dc);
      if (lv >= 2) lampsFlick.push(LAMPS[z].flicker);
      if (lv >= 3) {
        lampsOut.push(LAMPS[z].out);
        // flackert dieselbe Leuchte, ist sie jetzt ganz aus
        if (LAMPS[z].out[0] === LAMPS[z].flicker[0] && LAMPS[z].out[1] === LAMPS[z].flicker[1]) lampsFlick.pop();
      }
      if (z === 'front') {
        plateF = lv;
        if (lv >= 3) field.sags.push({ front: true, side: 1, yTop: 0.5, drop: 0.075 });
        // die Haube steht bei Stufe 3 und am letzten Punkt einen Spalt offen (so sieht man es auch vom Fahrerplatz)
        if (lv >= 3 || last) field.lids.push({ front: true, lift: last ? 0.05 : 0.035, xMax: 0.6 });
      } else if (z === 'rear') {
        plateR = lv;
        if (lv >= 3) {
          field.sags.push({ front: false, side: -1, yTop: 0.6, drop: 0.075 });
          field.lids.push({ front: false, lift: 0.035, xMax: 0.56 });
        }
      } else mirror[z] = lv;
    }
    this.field = field;
    // Karosserie, Lufteinlass und Aufkleber verformen
    const p = this.v;
    const n = new THREE.Vector3();
    const any = field.dents.length || field.sags.length || field.lids.length;
    for (const D of this.deformables) {
      const pos = D.g.attributes.position;
      const nrm = D.g.attributes.normal;
      pos.array.set(D.pos0);
      if (nrm && D.nrm0) nrm.array.set(D.nrm0);
      if (any) {
        for (let i = 0; i < pos.count; i++) {
          p.fromBufferAttribute(pos, i);
          if (nrm) n.fromBufferAttribute(nrm, i);
          else n.set(0, 1, 0);
          this.deform(p, n);
          pos.setXYZ(i, p.x, p.y, p.z);
          if (nrm) nrm.setXYZ(i, n.x, n.y, n.z);
        }
      }
      pos.needsUpdate = true;
      if (nrm) nrm.needsUpdate = true;
      D.g.computeBoundingSphere();
    }
    this.bendMirrors(mirror);
    // Kennzeichen: Stufe 2 verbogen, Stufe 3 hängt schief
    const bend = (P, lv, sgn) => {
      P.m.position.copy(P.p0);
      P.m.rotation.copy(P.r0);
      if (lv >= 2) {
        P.m.rotation.x += 0.2 * sgn;
        P.m.rotation.z += lv >= 3 ? 0.3 : 0.1;
        P.m.position.y -= lv >= 3 ? 0.035 : 0.006;
        P.m.position.z += (lv >= 3 ? 0.02 : 0.008) * -sgn;
      }
    };
    if (this.plates[0]) bend(this.plates[0], plateF, 1);
    if (this.plates[1]) bend(this.plates[1], plateR, -1);
    // Schrammen von der Leitplanke
    for (const side of ['left', 'right']) {
      const k = Math.min(3, d.scratches[side]);
      for (let i = 0; i < k; i++) {
        const [u, Y, w, h] = RAIL_SPOTS[i];
        decals.push([u, Y, side === 'left' ? -1 : 1, w, h, 0, 'rail']);
      }
    }
    // Pflaster (Stufe 3 repariert: Klebeband-Kreuz), neueste obenauf
    const count = { front: 0, rear: 0, left: 0, right: 0 };
    for (const pa of d.patches) {
      const spots = PATCH_SPOTS[pa.zone];
      const [u, Y, s, rot] = spots[count[pa.zone]++ % spots.length];
      const cellName = pa.step >= 3 ? 'tapeX' : pa.n % 3 === 0 ? 'heart' : 'plaster';
      const size = (pa.step >= 3 ? 0.34 : 0.28) * (s === 'back' ? 0.92 : 1);
      decals.push([u, Y, s, size, size, rot, cellName]);
    }
    this.buildDecals(decals);
    this.buildLamps(this.outMesh, lampsOut);
    this.buildLamps(this.flickMesh, lampsFlick);
    this.last = last;
  }

  /** Spiegel: schiefe Kappe (Stufe 2) bzw. herunterhängend (Stufe 3), um den Fuß an der Tür gedreht. */
  bendMirrors(lv) {
    const p = this.v;
    const n = new THREE.Vector3();
    for (const D of this.mirrors) {
      const pos = D.g.attributes.position;
      const nrm = D.g.attributes.normal;
      pos.array.set(D.pos0);
      if (nrm && D.nrm0) nrm.array.set(D.nrm0);
      for (const [side, s] of [['left', -1], ['right', 1]]) {
        const m = MIRROR[lv[side]];
        if (!m) continue;
        const cd = Math.cos(m.droop);
        const sd = Math.sin(m.droop);
        const cf = Math.cos(m.fold);
        const sf = Math.sin(m.fold);
        // Drehpunkt: das innere Ende des Spiegelfußes
        const px = s * 0.83;
        const py = 0.965;
        const pz = this.h.mirrorZ - 0.045;
        const rot = (v, isDir) => {
          let x = v.x - (isDir ? 0 : px);
          let y = v.y - (isDir ? 0 : py);
          let z = v.z - (isDir ? 0 : pz);
          // nach unten (das äußere Ende sinkt) …
          const x1 = x * cd + s * y * sd;
          const y1 = y * cd - s * x * sd;
          // … und nach hinten geklappt
          x = x1 * cf - s * z * sf;
          z = z * cf + s * x1 * sf;
          y = y1;
          v.set(x + (isDir ? 0 : px), y + (isDir ? 0 : py), z + (isDir ? 0 : pz));
        };
        for (let i = 0; i < pos.count; i++) {
          if (pos.getX(i) * s < 0.7) continue;
          p.fromBufferAttribute(pos, i);
          rot(p, false);
          pos.setXYZ(i, p.x, p.y, p.z);
          if (nrm) {
            n.fromBufferAttribute(nrm, i);
            rot(n, true);
            nrm.setXYZ(i, n.x, n.y, n.z);
          }
        }
      }
      pos.needsUpdate = true;
      if (nrm) nrm.needsUpdate = true;
      D.g.computeBoundingSphere();
    }
  }

  /**
   * Aufkleber als Flächenstücke auf der (verformten) Karosserie. Jedes Stück bekommt ein eigenes Bildkreuz (rechts,
   * oben) aus den Tangenten der Fläche, so erscheint nichts gespiegelt oder auf dem Kopf.
   */
  buildDecals(list) {
    const pos = [];
    const nrm = [];
    const uv = [];
    const idx = [];
    const NS = 10;
    const NT = 8;
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    const n0 = new THREE.Vector3();
    const Tu = new THREE.Vector3();
    const Ta = new THREE.Vector3();
    const R = new THREE.Vector3();
    const U = new THREE.Vector3();
    const dv = new THREE.Vector3();
    for (const [u0, a0, s, w, h, rot, cellName] of list) {
      const cell = CELL[cellName];
      const cu = (cell % COLS) / COLS;
      const cv = 1 - (Math.floor(cell / COLS) + 1) / ROWS;
      const cs = Math.cos(rot);
      const sn = Math.sin(rot);
      const base = pos.length / 3;
      if (s === 'back') {
        // flache Heckwand: ein ebenes Stück knapp davor (rechts = +x, oben = +y, Normale nach hinten); der hängende
        // Stoßfänger nimmt es mit (deform), Dellen der Seiten nicht
        for (let j = 0; j <= NT; j++) {
          for (let i = 0; i <= NS; i++) {
            const x = (i / NS - 0.5) * w;
            const y = (j / NT - 0.5) * h;
            p.set(u0 + x * cs - y * sn, a0 + x * sn + y * cs, this.zR);
            n.set(0, 0, 1);
            this.deform(p, n, false);
            p.z += 0.0065;
            pos.push(p.x, p.y, p.z);
            nrm.push(0, 0, 1);
            uv.push(cu + (i / NS) / COLS, cv + (j / NT) / ROWS);
          }
        }
        for (let j = 0; j < NT; j++) {
          for (let i = 0; i < NS; i++) {
            const q0 = base + j * (NS + 1) + i;
            idx.push(q0, q0 + 1, q0 + NS + 1, q0 + 1, q0 + NS + 2, q0 + NS + 1);
          }
        }
        continue;
      }
      this.point(u0, a0, s, p, n0);
      this.tangents(u0, a0, s, p, Tu, Ta);
      // oben im Bild: auf den Seiten die Höhe, auf Haube und Klappe nach vorn; rechts = oben × Normale
      if (s === 'top') U.copy(Tu).negate();
      else U.copy(Ta);
      U.addScaledVector(n0, -U.dot(n0)).normalize();
      R.crossVectors(U, n0).normalize();
      // Längen im Bild (m) → Schritte in (u, a): kleinste Quadrate mit den Tangenten am Mittelpunkt
      const uu = Tu.dot(Tu);
      const ua = Tu.dot(Ta);
      const aa = Ta.dot(Ta);
      const det = uu * aa - ua * ua;
      for (let j = 0; j <= NT; j++) {
        for (let i = 0; i <= NS; i++) {
          const x = (i / NS - 0.5) * w;
          const y = (j / NT - 0.5) * h;
          dv.copy(R).multiplyScalar(x * cs - y * sn).addScaledVector(U, x * sn + y * cs);
          const bu = Tu.dot(dv);
          const ba = Ta.dot(dv);
          const du = (aa * bu - ua * ba) / det;
          const da = (uu * ba - ua * bu) / det;
          const uq = Math.max(0.004, Math.min(this.L - 0.004, u0 + du));
          this.point(uq, a0 + da, s, p, n);
          this.deform(p, n);
          p.addScaledVector(n, 0.0045);
          pos.push(p.x, p.y, p.z);
          nrm.push(n.x, n.y, n.z);
          uv.push(cu + (i / NS) / COLS, cv + (j / NT) / ROWS);
        }
      }
      // Dreiecke von außen gesehen gegen den Uhrzeigersinn (R × U = Normale), gespiegelte Aufkleber umgekehrt:
      // sonst dreht DoubleSide die Normale nach innen und die Schramme liegt im Schatten (rechte Seite war unsichtbar)
      const flip = w * h < 0;
      for (let j = 0; j < NT; j++) {
        for (let i = 0; i < NS; i++) {
          const q0 = base + j * (NS + 1) + i;
          const q1 = q0 + 1;
          const q2 = q0 + NS + 1;
          const q3 = q2 + 1;
          if (flip) idx.push(q0, q2, q1, q1, q2, q3);
          else idx.push(q0, q1, q2, q1, q3, q2);
        }
      }
    }
    this.decals.geometry.dispose();
    const ng = new THREE.BufferGeometry();
    if (pos.length) {
      ng.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      ng.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
      ng.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      ng.setIndex(idx);
      ng.computeBoundingSphere();
    }
    this.decals.geometry = ng;
    this.decals.visible = pos.length > 0;
  }

  /** Staubwölkchen an der getroffenen Zone (lokal am Wagen, fliegen nach außen und oben). */
  burst(zone) {
    const P = {
      front: [[0, 0.62, this.zF - 0.02], [0, 0.9, -1]],
      rear: [[0, 0.72, this.zR + 0.03], [0, 0.55, 1]],
      left: [[-0.96, 0.72, 0.1], [-1, 0.55, 0]],
      right: [[0.96, 0.72, 0.1], [1, 0.55, 0]],
    }[zone] || [[0, 0.62, this.zF], [0, 0.9, -1]];
    this.puff.burst(P[0], P[1], zone === 'front' || zone === 'rear' ? 0.75 : 0.4);
  }

  /** Abdeckungen über Leuchten (aus oder flackernd). */
  buildLamps(mesh, list) {
    const parts = [];
    for (const [kind, s] of list) {
      const uvFn = this.h.lampUV[kind](s);
      parts.push(surfacePatch(this.h.bodyPoint, uvFn, { ns: kind === 'drl' ? 2 : 8, nt: 22, lift: 0.011 }));
    }
    mesh.geometry.dispose();
    mesh.geometry = parts.length ? mergeSimple(parts) : new THREE.BufferGeometry();
    mesh.visible = parts.length > 0;
  }

  /**
   * Jedes Bild: Schaden übernehmen (baut nur bei Änderung neu), Flackern und Dampf.
   * @param {import('../game/damage.js').Damage} d
   */
  update(dt, t, d, speed = 0) {
    if (d && (d !== this.d || d.version !== this.version)) {
      // ein neuer Rempler (nicht beim Wechsel des Zustands, nicht nach dem Zurücksetzen): Wölkchen an seiner Zone
      if (d === this.d && d.hits > this.hitsSeen) this.burst(d.log[d.log.length - 1]);
      this.hitsSeen = d.hits;
      this.d = d;
      this.version = d.version;
      this.rebuild(d);
    }
    this.puff.update(dt);
    // Wackelkontakt: meist an, ab und zu kurz aus (gleichmäßig zufällig wirkend, aber ohne Math.random)
    if (this.flickMesh.visible) {
      const k = Math.floor(t * 14);
      const hsh = Math.abs(Math.sin(k * 12.9898 + 78.233) * 43758.5453) % 1;
      const k2 = Math.floor(t * 2.1);
      const burst = Math.abs(Math.sin(k2 * 4.1 + 1.3) * 9631.7) % 1 > 0.55;
      this.flickMesh.material.opacity = burst && hsh > 0.45 ? 0.92 : 0;
    }
    this.steam.update(dt, t, this.last ? 1 : 0, speed);
    this.confetti.update(dt, t, !!this.d && this.d.zones.rear >= 3, speed);
  }
}

/** Mehrere einfache Geometrien (Position, Normale, Index) zusammenfügen. */
function mergeSimple(list) {
  let nv = 0;
  let ni = 0;
  for (const g of list) {
    nv += g.attributes.position.count;
    ni += g.index ? g.index.count : g.attributes.position.count;
  }
  const pos = new Float32Array(nv * 3);
  const nrm = new Float32Array(nv * 3);
  const idx = new Uint32Array(ni);
  let ov = 0;
  let oi = 0;
  for (const g of list) {
    pos.set(g.attributes.position.array, ov * 3);
    if (g.attributes.normal) nrm.set(g.attributes.normal.array, ov * 3);
    const src = g.index ? g.index.array : null;
    const cnt = src ? src.length : g.attributes.position.count;
    for (let i = 0; i < cnt; i++) idx[oi + i] = (src ? src[i] : i) + ov;
    ov += g.attributes.position.count;
    oi += cnt;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}

// --- Dampf: ein paar weiche, freundliche Wölkchen (ein Zeichenaufruf) ------------------------------------------
let puffTex = null;
function puffTexture() {
  if (puffTex) return puffTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 2, 32, 32, 31);
  grd.addColorStop(0, 'rgba(255,255,255,0.9)');
  grd.addColorStop(0.45, 'rgba(250,252,255,0.45)');
  grd.addColorStop(1, 'rgba(250,252,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  puffTex = new THREE.CanvasTexture(c);
  puffTex.colorSpace = THREE.SRGBColorSpace;
  return puffTex;
}

/** Ein kurzer Stoß weicher Wölkchen, jedes vierte gelb wie ein Funkeln (Comic-Rempler), ein Zeichenaufruf. */
export class ImpactPuff {
  /** curved: Weltmaterial (false im Cockpit, das nicht gekrümmt wird); size: Flockengröße (m);
   *  tint: Farbe der Flocken (jede vierte bleibt ein gelbes Fünkchen) */
  constructor(n = 14, life = 0.75, curved = true, size = 0.46, tint = [0.93, 0.94, 0.96]) {
    this.n = n;
    this.life = life;
    this.age = new Float32Array(n).fill(life);
    this.p0 = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.rnd = mulberry32(31337);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const col = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) col.set(i % 4 === 1 ? [1, 0.85, 0.32, 0] : [...tint, 0], i * 4);
    geo.setAttribute('color', new THREE.BufferAttribute(col, 4));
    const mat = new THREE.PointsMaterial({ size, map: puffTexture(), transparent: true, depthWrite: false, sizeAttenuation: true, vertexColors: true });
    this.points = new THREE.Points(geo, curved ? curve(mat) : mat);
    this.points.frustumCulled = false;
    this.points.visible = false;
    this.points.renderOrder = 3;
  }

  /** at, out: Ort und Richtung (lokal am Wagen) als [x, y, z]; spread: Breite quer zur Richtung (m). */
  burst(at, out, spread = 0.6) {
    const r = this.rnd;
    // quer zur Richtung (waagerecht)
    const qx = -out[2];
    const qz = out[0];
    for (let i = 0; i < this.n; i++) {
      const q = (r() - 0.5) * 2;
      this.age[i] = -r() * 0.06;
      this.p0[i * 3] = at[0] + qx * q * spread;
      this.p0[i * 3 + 1] = at[1] + (r() - 0.5) * 0.25;
      this.p0[i * 3 + 2] = at[2] + qz * q * spread;
      const sp = 1.4 + r() * 1.8;
      this.vel[i * 3] = out[0] * sp + qx * q * 1.2;
      this.vel[i * 3 + 1] = out[1] * sp * 0.8 + 0.5 + r() * 1.1;
      this.vel[i * 3 + 2] = out[2] * sp + qz * q * 1.2;
    }
    this.points.visible = true;
  }

  update(dt) {
    if (!this.points.visible) return;
    const pos = this.points.geometry.attributes.position;
    const col = this.points.geometry.attributes.color;
    let alive = false;
    for (let i = 0; i < this.n; i++) {
      const a = (this.age[i] += dt);
      const k = Math.min(1, Math.max(0, a / this.life));
      // bremst ab (Luft), blendet schnell ein und weich aus
      const go = a * (1 - 0.5 * k);
      pos.setXYZ(i, this.p0[i * 3] + this.vel[i * 3] * go, this.p0[i * 3 + 1] + this.vel[i * 3 + 1] * go, this.p0[i * 3 + 2] + this.vel[i * 3 + 2] * go);
      col.setW(i, a < 0 || k >= 1 ? 0 : smooth(0, 0.08, a) * (1 - k) * (1 - k));
      if (k < 1) alive = true;
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    if (!alive) this.points.visible = false;
  }
}

/** Konfetti aus dem Spalt der Kofferraumklappe: kleine bunte Schnipsel, flattern hoch und wehen nach hinten weg. */
export class ConfettiTrail {
  constructor(origin, n = 28) {
    this.origin = origin;
    this.n = n;
    this.life = 1.5;
    this.age = new Float32Array(n).fill(9);
    this.p0 = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.ph = new Float32Array(n);
    this.next = 0;
    this.k = 0;
    this.rnd = mulberry32(2207);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const col = new Float32Array(n * 4);
    const pal = [[1, 0.42, 0.62], [1, 0.84, 0.25], [0.3, 0.86, 1], [0.45, 0.92, 0.45], [0.75, 0.55, 1], [1, 1, 1]];
    for (let i = 0; i < n; i++) col.set([...pal[i % pal.length], 0], i * 4);
    geo.setAttribute('color', new THREE.BufferAttribute(col, 4));
    // kleines Rechteck statt Punkt (Schnipsel)
    const c = document.createElement('canvas');
    c.width = c.height = 16;
    const g = c.getContext('2d');
    g.fillStyle = '#fff';
    g.translate(8, 8);
    g.rotate(0.5);
    g.fillRect(-6, -3, 12, 6);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.PointsMaterial({ size: 0.13, map: tex, transparent: true, depthWrite: false, sizeAttenuation: true, vertexColors: true, alphaTest: 0.05 });
    this.points = new THREE.Points(geo, curve(mat));
    this.points.frustumCulled = false;
    this.points.visible = false;
    this.points.renderOrder = 3;
  }

  /** on: Klappe klemmt; speed (m/s): der Fahrtwind nimmt die Schnipsel nach hinten mit. */
  update(dt, t, on, speed = 0) {
    const r = this.rnd;
    if (on && t >= this.next) {
      // ein kleines Häufchen auf einmal, dann wieder eine Weile nichts
      const burst = 3 + Math.floor(r() * 4);
      for (let b = 0; b < burst; b++) {
        const i = this.k++ % this.n;
        this.age[i] = -b * 0.05;
        this.p0[i * 3] = this.origin.x + (r() - 0.5) * 0.9;
        this.p0[i * 3 + 1] = this.origin.y;
        this.p0[i * 3 + 2] = this.origin.z;
        this.vel[i * 3] = (r() - 0.5) * 0.8;
        this.vel[i * 3 + 1] = 0.7 + r() * 0.9;
        this.vel[i * 3 + 2] = 0.4 + r() * 0.5 + Math.min(1, speed / 30) * (1.8 + r() * 1.4);
        this.ph[i] = r() * 6.28;
      }
      this.next = t + 0.7 + r() * 1.6;
      this.points.visible = true;
    }
    if (!this.points.visible) return;
    const pos = this.points.geometry.attributes.position;
    const col = this.points.geometry.attributes.color;
    let alive = false;
    for (let i = 0; i < this.n; i++) {
      const a = (this.age[i] += dt);
      const k = a / this.life;
      if (a < 0 || k >= 1) {
        col.setW(i, 0);
        continue;
      }
      alive = true;
      // steigt kurz, sinkt dann flatternd (Luftwiderstand), weht nach hinten
      const x = this.p0[i * 3] + this.vel[i * 3] * a + Math.sin(this.ph[i] + a * 9) * 0.06;
      const y = this.p0[i * 3 + 1] + this.vel[i * 3 + 1] * a - 1.1 * a * a;
      const z = this.p0[i * 3 + 2] + this.vel[i * 3 + 2] * a;
      pos.setXYZ(i, x, Math.max(0.05, y), z);
      col.setW(i, smooth(0, 0.05, a) * (1 - smooth(0.7, 1, k)));
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    if (!alive && !on) this.points.visible = false;
  }
}

export class SteamWisps {
  /**
   * @param {{count?:number, size?:number, origin:THREE.Vector3, spread?:number, rise?:number, opacity?:number,
   *   drift?:number, curved?:boolean}} o origin: Austrittsstelle (lokal), spread: Breite (m), rise: Steiggeschwindigkeit
   *   (m/s), drift: so weit (m) weht der Fahrtwind ihn nach hinten, curved: Weltmaterial (false im Cockpit)
   */
  constructor({ count = 12, size = 0.5, origin, spread = 0.4, rise = 0.8, opacity = 0.55, drift = 1.6, curved = true }) {
    this.n = count;
    this.origin = origin;
    this.spread = spread;
    this.rise = rise;
    this.drift = drift;
    this.life = new Float32Array(count);
    this.seed = new Float32Array(count);
    const rnd = mulberry32(4711);
    for (let i = 0; i < count; i++) {
      this.seed[i] = rnd();
      this.life[i] = (i / count) * 1.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    // Deckkraft je Wölkchen (vierte Farbkomponente): blendet beim Entstehen ein und vergeht, statt zu springen
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 4).fill(1), 4));
    const mat = new THREE.PointsMaterial({
      size, map: puffTexture(), transparent: true, depthWrite: false, opacity, sizeAttenuation: true, color: 0xf4f7fb, vertexColors: true,
    });
    this.mat = curved ? curve(mat) : mat;
    this.points = new THREE.Points(geo, this.mat);
    this.points.frustumCulled = false;
    this.points.visible = false;
    this.points.renderOrder = 3;
    this.level = 0;
    this.baseOpacity = opacity;
  }

  /** on: 0 … 1 (blendet weich ein und aus), speed (m/s): bei Fahrt weht der Dampf nach hinten. */
  update(dt, t, on, speed = 0) {
    this.level += (on - this.level) * Math.min(1, dt * 1.5);
    if (this.level < 0.01) {
      this.points.visible = false;
      return;
    }
    this.points.visible = true;
    this.mat.opacity = this.baseOpacity * this.level;
    const pos = this.points.geometry.attributes.position;
    const col = this.points.geometry.attributes.color;
    const back = Math.min(1, speed / 30);
    for (let i = 0; i < this.n; i++) {
      let L = this.life[i] + dt;
      if (L > 1.6) L -= 1.6;
      this.life[i] = L;
      const s = this.seed[i];
      const k = L / 1.6;
      const x = this.origin.x + (s - 0.5) * this.spread + Math.sin(t * 1.3 + s * 9) * 0.05 * k;
      const y = this.origin.y + k * this.rise * 1.6 * (1 - 0.4 * back);
      const z = this.origin.z + k * (0.15 + back * this.drift);
      pos.setXYZ(i, x, y, z);
      col.setW(i, smooth(0, 0.2, k) * (1 - smooth(0.5, 1, k)));
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }
}
