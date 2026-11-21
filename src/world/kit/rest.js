// Stadt-Baukasten, Teil Autobahn-Tanke (Rastanlage): blaue Hinweistafeln, Mast mit leerem Schild, parkende Lkw,
// Tankdach, Raststätte mit Bananensaft im Fenster, Ladesäule, Ladedach, Ladepark, Picknickgruppe und ein Popcorn-Eimer
// für die Ladepause. Markenfrei, in unseren eigenen Farben; Maße und Farben nach
// research/landmarks/stil-raststaette (Abschnitte 1, 3, 4, 6). Rahmen wie überall: Ursprung am Boden in der Mitte der
// Vorderkante (zur Fahrbahn), der Körper reicht nach −z, +x rechts. Mast, Lkw, Säule, Picknick und Eimer stehen mit der
// Mitte ihrer Grundfläche im Ursprung (centre). Alles hält eine Nahaufnahme aus 2–4 m in 1,2 m Höhe aus.
import { PAL, CITY, mix, makeKit, textPanel, fitFont, FONT, Bau, compose } from './citycore.js';

const TAU = Math.PI * 2;
const C = {
  blue: PAL.signBlue, white: PAL.marking, steel: PAL.steel, steelLight: mix(PAL.steel, 0xffffff, 0.3), footing: PAL.concrete,
  cream: 0xe8e4da, under: 0xcfc8b8, column: 0xaab3bb, terracotta: 0xe39a72, wall: 0xf0e0c4, glass: PAL.glass,
  fascia: 0xb8b2a6, yard: 0x9a968c, teal: 0x5fbfa0, screen: 0x3d4a55, body: 0xcfd4d6, cable: 0x4a4543,
  cabinet: 0xa9b3a8, cap: 0x7f9b86, mustard: 0xe8b13a, ev: 0x9ccf8f, timber: 0xb98e5e, timberDark: 0x8f6a46,
  lawn: PAL.grass[2], warm: 0xfff1c9, cab: 0xeef0ee, tyre: 0x4a4f57, frame: PAL.frame, door: 0x7d93a6, red: 0xd9604a,
  // Unterseiten der Dächer leuchten (wie echte Tank- und Ladedächer): unbeleuchtet lägen sie im olivgrünen Bodenlicht
  // des Himmels und sähen schmutzig aus
  soffit: 0xc9c2b2, soffitShade: 0xb3ab9a, plug: 0x5a5552,
  // Solarmodule auf den Ladedächern, Dachhaut des Tankdachs, Bananensaft-Glas auf der Raststätte
  pump: 0xf4efe6, pv: 0x2c4a73, pvFrame: 0xc3c8cc, membrane: 0xc9c6bd, juice: 0xf3cf3f, glassRim: 0xe4eef0, straw: 0xe5483a,
};
C.postCap = mix(C.body, C.screen, 0.25);
const defs = {};
// Grundfläche einer ganzen Rastanlage (layout.js REST: 86 × 180 m)
const REST_W = 86;
const REST_D = 180;

/** Waagerechtes Rechteck x0..x1 × z0..z1 in Höhe y; down = true schaut nach unten (Unterseite eines Dachs). */
function flat(part, x0, z0, x1, z1, y, col, down = false) {
  const p = [[x0, y, z0], [x0, y, z1], [x1, y, z1], [x1, y, z0]];
  part.poly(down ? p.reverse() : p, col, { flat: true });
}

/**
 * Solarmodule auf einem flachen Dach (Oberkante y, Mitte x, z, Fläche w × d): ein heller Rahmen 6 cm hoch, darauf
 * nx × nz glänzende Module mit schmalen Fugen. Fern nur der Rahmen in Modulfarbe.
 */
function solar(b, x, y, z, w, d, nx, nz, near) {
  const { F, G } = b;
  if (!near) {
    F.box(x, y, z, w, 0.06, d, mix(C.pv, C.pvFrame, 0.25), { skip: 'b' });
    return;
  }
  F.box(x, y, z, w, 0.06, d, C.pvFrame, { skip: 'b' });
  const gap = 0.08;
  const mw = (w - gap * (nx + 1)) / nx;
  const md = (d - gap * (nz + 1)) / nz;
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const x0 = x - w / 2 + gap + i * (mw + gap);
    const z0 = z - d / 2 + gap + j * (md + gap);
    flat(G, x0, z0, x0 + mw, z0 + md, y + 0.061, C.pv);
  }
}

/**
 * Leuchtende Unterseite eines Dachs (Grundriss w × d um x, z mit Eckradius r, nach unten in Höhe y): ein hauchdünner
 * Deckel im Leucht-Eimer L. Die Platte darüber wird ohne Boden gebaut, damit nichts in derselben Ebene liegt.
 */
function soffit(L, x, y, z, w, d, r, seg, col = C.soffit) {
  L.rbox(x, y, z, w, 0.002, d, r, col, { seg, top: false, bottom: true, flat: true });
}

// --- Bildzeichen für die blauen Tafeln (weiß, im Quadrat s um cx, cy) ---------------------------------------------
const BOARD_BLUE = '#1f5fae';
const BOARD_WHITE = '#f7f5ee';
const PICTO = {
  fuel(c, cx, cy, s) {
    c.fillRect(cx - s * 0.34, cy - s * 0.38, s * 0.42, s * 0.76);
    c.fillRect(cx - s * 0.4, cy + s * 0.32, s * 0.54, s * 0.1);
    c.save();
    c.fillStyle = BOARD_BLUE;
    c.fillRect(cx - s * 0.27, cy - s * 0.3, s * 0.28, s * 0.2);
    c.restore();
    c.lineWidth = s * 0.07;
    c.beginPath();
    c.moveTo(cx + s * 0.08, cy - s * 0.12);
    c.lineTo(cx + s * 0.26, cy - s * 0.12);
    c.lineTo(cx + s * 0.3, cy + s * 0.22);
    c.lineTo(cx + s * 0.38, cy + s * 0.2);
    c.lineTo(cx + s * 0.38, cy - s * 0.26);
    c.stroke();
  },
  food(c, cx, cy, s) {
    c.fillRect(cx - s * 0.2, cy - s * 0.4, s * 0.07, s * 0.8);
    for (const dx of [-0.32, -0.08]) c.fillRect(cx + s * dx, cy - s * 0.4, s * 0.05, s * 0.26);
    c.fillRect(cx - s * 0.32, cy - s * 0.16, s * 0.29, s * 0.07);
    c.beginPath();
    c.ellipse(cx + s * 0.22, cy - s * 0.18, s * 0.09, s * 0.22, 0, 0, TAU);
    c.fill();
    c.fillRect(cx + s * 0.19, cy - s * 0.04, s * 0.07, s * 0.44);
  },
  bed(c, cx, cy, s) {
    c.fillRect(cx - s * 0.42, cy - s * 0.3, s * 0.08, s * 0.66);
    c.fillRect(cx - s * 0.42, cy + s * 0.1, s * 0.84, s * 0.12);
    c.fillRect(cx + s * 0.34, cy + s * 0.1, s * 0.08, s * 0.26);
    c.beginPath();
    c.arc(cx - s * 0.18, cy - s * 0.06, s * 0.11, 0, TAU);
    c.fill();
    c.fillRect(cx - s * 0.02, cy - s * 0.12, s * 0.4, s * 0.2);
  },
  P(c, cx, cy, s) {
    c.font = `bold ${Math.round(s * 0.92)}px ${FONT}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('P', cx, cy + s * 0.04);
  },
  WC(c, cx, cy, s) {
    c.font = `bold ${Math.round(s * 0.52)}px ${FONT}`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('WC', cx, cy + s * 0.03);
  },
  plug(c, cx, cy, s) {
    c.beginPath();
    c.moveTo(cx - s * 0.24, cy - s * 0.14);
    c.lineTo(cx + s * 0.24, cy - s * 0.14);
    c.lineTo(cx + s * 0.24, cy + s * 0.02);
    c.quadraticCurveTo(cx + s * 0.22, cy + s * 0.22, cx, cy + s * 0.24);
    c.quadraticCurveTo(cx - s * 0.22, cy + s * 0.22, cx - s * 0.24, cy + s * 0.02);
    c.closePath();
    c.fill();
    for (const dx of [-0.12, 0.08]) c.fillRect(cx + s * dx, cy - s * 0.4, s * 0.06, s * 0.26);
    c.fillRect(cx - s * 0.04, cy + s * 0.22, s * 0.08, s * 0.2);
  },
  cup(c, cx, cy, s) {
    c.beginPath();
    c.moveTo(cx - s * 0.3, cy - s * 0.18);
    c.lineTo(cx + s * 0.2, cy - s * 0.18);
    c.lineTo(cx + s * 0.14, cy + s * 0.28);
    c.lineTo(cx - s * 0.24, cy + s * 0.28);
    c.closePath();
    c.fill();
    c.lineWidth = s * 0.07;
    c.beginPath();
    c.arc(cx + s * 0.24, cy, s * 0.11, -Math.PI / 2, Math.PI / 2);
    c.stroke();
    for (const dx of [-0.14, 0.02]) {
      c.beginPath();
      c.moveTo(cx + s * dx, cy - s * 0.26);
      c.quadraticCurveTo(cx + s * (dx + 0.06), cy - s * 0.34, cx + s * dx, cy - s * 0.42);
      c.stroke();
    }
  },
  church(c, cx, cy, s) {
    c.beginPath();
    c.moveTo(cx - s * 0.36, cy + s * 0.4);
    c.lineTo(cx - s * 0.36, cy - s * 0.02);
    c.lineTo(cx - s * 0.08, cy - s * 0.2);
    c.lineTo(cx - s * 0.08, cy - s * 0.4);
    c.lineTo(cx + s * 0.08, cy - s * 0.4);
    c.lineTo(cx + s * 0.08, cy - s * 0.2);
    c.lineTo(cx + s * 0.36, cy - s * 0.02);
    c.lineTo(cx + s * 0.36, cy + s * 0.4);
    c.closePath();
    c.fill();
  },
};

/** Blaue Tafel: Rahmen, oben der Name, darunter Bildzeichen, unten rechts die Entfernung (ohne Name: ein großes Zeichen). */
function drawBoard(c, w, h, t) {
  const r = Math.round(h * 0.06);
  c.fillStyle = BOARD_WHITE;
  c.beginPath();
  c.roundRect(0, 0, w, h, r);
  c.fill();
  const m = Math.round(h * 0.045);
  c.fillStyle = BOARD_BLUE;
  c.beginPath();
  c.roundRect(m, m, w - 2 * m, h - 2 * m, r * 0.7);
  c.fill();
  c.fillStyle = BOARD_WHITE;
  c.strokeStyle = BOARD_WHITE;
  const icons = t.icons ?? [];
  if (!t.title && icons.length === 1) {
    PICTO[icons[0]]?.(c, w / 2, h / 2, Math.min(w, h) * 0.62);
    return;
  }
  let y = m * 2;
  if (t.title) {
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    fitFont(c, t.title, Math.round(h * 0.17), w - 6 * m);
    c.fillText(t.title, w / 2, y + h * 0.1);
    y += h * 0.22;
    c.fillRect(m * 2.2, y, w - 4.4 * m, Math.max(3, h * 0.012));
    y += h * 0.05;
  }
  const n = Math.max(1, icons.length);
  const s = Math.min((w - 6 * m) / n - m, h * (t.dist ? 0.36 : 0.5));
  const x0 = w / 2 - (n * (s + m) - m) / 2;
  icons.forEach((k, i) => {
    const cx = x0 + i * (s + m) + s / 2;
    const cy = y + s / 2 + m * 0.6;
    c.lineWidth = Math.max(3, s * 0.05);
    c.beginPath();
    c.roundRect(cx - s / 2, cy - s / 2, s, s, s * 0.14);
    c.stroke();
    PICTO[k]?.(c, cx, cy, s * 0.82);
  });
  if (t.dist) {
    c.textAlign = 'right';
    c.textBaseline = 'alphabetic';
    fitFont(c, t.dist, Math.round(h * 0.16), w * 0.5);
    c.fillText(t.dist, w - m * 2.6, h - m * 2.4);
  }
}

// =================================================================================================================
// 1. Blaue Hinweistafel: 3,0 × 2,2 m auf zwei Pfosten, Unterkante 2,2 m; Text und Zeichen aus einer gemerkten Tafel
// =================================================================================================================
defs.autobahn_schild = {
  kind: 'rest', far: true,
  make(b) {
    const { F } = b;
    const seg = b.lod ? 6 : 12;
    for (const s of [-1, 1]) {
      F.cyl(s * 1.05, 0, -0.14, 0.09, 0.09, 4.36, C.steel, { seg });
      F.cyl(s * 1.05, -0.06, -0.14, 0.2, 0.2, 0.16, C.footing, { seg });
      F.ball(s * 1.05, 4.36, -0.14, 0.095, C.steel, { ws: seg, hs: 3, lat: [0, Math.PI / 2] });
    }
    // Rückseite: helles Blech mit runder Kante, die Tafel selbst liegt 3 cm davor (extras)
    F.rbox(0, 2.18, -0.03, 3.04, 2.24, 0.06, 0.12, C.steelLight, { seg: 2 });
    for (const y of [2.6, 3.9]) F.box(0, y, -0.1, 2.3, 0.08, 0.05, C.steel);
    return { w: 3.1, d: 0.4, h: 4.45 };
  },
  /** opts: { title (Name, z. B. 'Rasthof Kirchheim'), icons: ['fuel', 'food', 'cup', 'bed', 'P', 'WC', 'plug', 'church'], dist ('1000 m') } */
  extras(kit, o = {}) {
    const t = { title: o.title ?? 'Rastanlage', icons: o.icons ?? ['fuel', 'food', 'P', 'WC', 'plug'], dist: o.dist ?? '' };
    const m = textPanel(kit.core, 'rast:' + JSON.stringify(t), 3.0, 2.2, 512, (c, w, h) => drawBoard(c, w, h, t));
    m.position.set(0, 3.3, 0.012);
    return [m];
  },
};

// =================================================================================================================
// 2. Mast mit leerem Schild (keine Preise, keine Marke): 18 m Rohr, rundes Schild 4 × 4 m, Rand in Terrakotta
// =================================================================================================================
defs.preis_pylon = {
  kind: 'rest', far: true,
  make(b) {
    const { F } = b;
    const near = !b.lod;
    F.lathe(0, 0, 0, [[0.75, 0], [0.75, 0.35], [0.5, 0.55], [0.5, 18.2]], C.column, { seg: near ? 16 : 8, top: false });
    // Tafel 4,2 × 4,2 × 0,7 m mit runden Ecken (in ihrer Ebene), cremefarbenes Feld steht vorn und hinten 3 cm vor
    b.xf([0, 20.1, 0], [Math.PI / 2, 0, 0], 1, () => {
      F.rbox(0, -0.35, 0, 4.2, 0.7, 4.2, 0.7, C.terracotta, { seg: near ? 4 : 2, bottom: true });
      F.rbox(0, -0.38, 0, 3.7, 0.76, 3.7, 0.5, C.cream, { seg: near ? 4 : 2, bottom: true });
    });
    return { w: 4.2, d: 1.5, h: 22.2, centre: true };
  },
};

// =================================================================================================================
// 3. Parkender Lkw: Fahrerhaus 2,5 m, Auflieger 13 m; Farbe nur am Auflieger (meist weiß, selten blau, senf, koralle)
// =================================================================================================================
defs.lkw_stehend = {
  kind: 'rest', far: true,
  tints: [0xf1ece2, 0xf1ece2, 0xf1ece2, 0xf1ece2, 0xf1ece2, 0xf1ece2, 0x3f6fa8, 0xe8b13a, 0xd9604a],
  make(b) {
    const { T, F, G } = b;
    const near = !b.lod;
    const seg = near ? 2 : 1;
    // Fahrerhaus vorn (+z), Auflieger dahinter, Fahrgestell, sechs Räder
    F.rbox(0, 0.7, 6.95, 2.5, 2.9, 2.4, 0.35, C.cab, { seg });
    F.rbox(0, 3.6, 6.75, 2.3, 0.34, 1.9, 0.3, C.cab, { seg });
    F.box(0, 0.45, -1.0, 1.4, 0.4, 14.0, C.tyre);
    F.box(0, 0.5, -8.0, 2.3, 0.16, 0.12, C.tyre);
    T.rbox(0, 1.15, -1.45, 2.55, 2.85, 13.3, 0.18, 0xffffff, { seg });
    if (near) {
      G.rect(0, 2.15, 8.16, 2.1, 1.1, PAL.glassDark, { g: [1.1, 0.8] });
      G.rect(0, 1.3, 8.16, 1.5, 0.66, mix(C.cab, CITY.ink, 0.3));
      G.rect(0, 0.95, 8.16, 2.3, 0.3, C.tyre);
      for (const s of [-1, 1]) {
        G.rect(s * 0.95, 1.3, 8.165, 0.34, 0.18, 0xfff4d6);
        b.at(s * 1.26, 0, 7.2, s * Math.PI / 2, () => G.rect(0, 2.2, 0, 1.0, 0.9, PAL.glassDark, { g: [1.1, 0.8] }));
        F.rod([s * 1.2, 2.75, 7.95], [s * 1.5, 2.75, 7.95], 0.03, C.tyre, { seg: 4 });
        F.rbox(s * 1.52, 2.15, 7.95, 0.1, 0.62, 0.2, 0.04, C.tyre, { seg: 1 });
      }
      b.at(0, 0, -8.11, Math.PI, () => {
        for (const s of [-1, 1]) G.rect(s * 0.95, 1.3, 0, 0.34, 0.16, C.red);
        G.rect(0, 1.3, 0, 0.5, 0.3, mix(C.white, CITY.ink, 0.1));
      });
    }
    // Räder: die flache Unterkante des Vielecks liegt auf dem Boden (Mitte in Höhe r · cos(π / seg))
    const ws = near ? 10 : 6;
    for (const z of [7.0, -5.0, -6.4]) for (const s of [-1, 1]) b.xf([s * 1.12, 0.52 * Math.cos(Math.PI / ws), z], [0, 0, Math.PI / 2], 1, () => F.cyl(0, -0.15, 0, 0.52, 0.52, 0.3, C.tyre, { seg: ws, bottom: true }));
    return { w: 2.6, d: 16.5, h: 4.0, centre: true };
  },
};

// =================================================================================================================
// 4. Tankdach: Platte 36 × 16 m in 5,0–5,9 m Höhe, Band in Terrakotta, warm leuchtende Unterseite, sechs Säulen auf
// zwei Inseln mit je vier Zapfsäulen (ohne Marke, ohne Preise). Die Fahrspuren laufen längs x unter dem Dach.
// =================================================================================================================
/**
 * Zapfsäule 0,8 × 1,55 × 0,56 m auf der Insel (Fuß in Höhe y0): warmweißer Kasten, leuchtendes Band unter dem
 * Terrakotta-Kopf, Bildschirm nach beiden Fahrspuren (±z), je Seite ein Zapfhahn im Halter an der Schmalseite mit dem
 * Schlauch in der Schlaufe. Unter dem Dach liegt sie im Schatten: Farben etwas heller angelegt (lift).
 */
function fuelPump(b, x, y0, z, near) {
  const { F, G, L } = b;
  const w = 0.8;
  const h = 1.55;
  const d = 0.56;
  const seg = near ? 2 : 1;
  const lift = 1.2;
  F.rbox(x, y0, z, w, h, d, 0.1, C.pump, { seg, k: lift, ks: [0.9, 1] });
  L.rbox(x, y0 + h - 0.13, z, w + 0.02, 0.12, d + 0.02, 0.11, C.warm, { seg, flat: true });
  F.rbox(x, y0 + h - 0.01, z, w + 0.06, 0.3, d + 0.06, 0.12, C.terracotta, { seg, k: lift });
  if (!near) return;
  b.at(x, y0, z, 0, () => {
    for (const s of [-1, 1]) {
      b.at(0, 0, s * d / 2, s > 0 ? 0 : Math.PI, () => {
        G.rect(-0.08, 0.78, 0.003, 0.44, 0.42, mix(C.screen, 0xffffff, 0.6), { k: lift });
        G.rect(-0.08, 0.815, 0.005, 0.37, 0.35, C.screen, { g: [1.18, 0.82] });
      });
      hose(b, s, s * w / 2, 1.02, s * 0.14, s, 0.18, 0.55);
    }
  });
}

// Zapfinseln 8 m auseinander: dazwischen passt die 6 m breite Schleife der Rastanlage mit 0,3 m Luft je Seite
const ISLANDS = [-4, -12];
defs.rasthof_canopy = {
  kind: 'rest', far: true,
  make(b) {
    const { F, G, L } = b;
    const near = !b.lod;
    F.rbox(0, 5.0, -8, 36, 0.9, 16, 0.3, C.cream, { seg: near ? 3 : 1, ks: [0.86, 1] });
    soffit(L, 0, 5.0, -8, 36, 16, 0.3, near ? 3 : 1);
    F.rbox(0, 5.22, -8, 36.08, 0.45, 16.08, 0.32, C.terracotta, { seg: near ? 3 : 1, top: false });
    // Dachhaut mit Rand, drei Lüfter: von der Drohne aus kein leerer Deckel
    F.rbox(0, 5.9, -8, 35.0, 0.04, 15.0, 0.2, C.membrane, { seg: 1 });
    if (near) for (const x of [-10, 0, 10]) F.rbox(x, 5.94, -8, 1.4, 0.45, 1.4, 0.12, C.under, { seg: 1, ks: [0.9, 1] });
    // Lichtfelder unter der Platte (leuchten warm, keine echten Lampen)
    for (const x of [-14, -7, 0, 7, 14]) for (const z of [-3, -8, -13]) flat(L, x - 1.2, z - 0.35, x + 1.2, z + 0.35, 4.98, C.warm, true);
    for (const z of ISLANDS) {
      F.rbox(0, 0, z, 26, 0.25, 1.4, 0.4, C.footing, { seg: near ? 2 : 1 });
      for (const x of [-12.4, 0, 12.4]) F.lathe(x, 0.25, z, [[0.45, 0], [0.45, 0.2], [0.3, 0.38], [0.3, 4.75]], C.column, { seg: near ? 12 : 6, top: false });
      for (const x of [-8.3, -4.1, 4.1, 8.3]) fuelPump(b, x, 0.25, z, near);
    }
    return { w: 36.1, d: 16.1, h: 6.4, islands: ISLANDS.map((z) => [z, 1.4, 26]) };
  },
};

// =================================================================================================================
// 5. Raststätte: eingeschossig 45 × 22 m mit Glasfront, Dachplatte 49 × 26 m (2 m Überstand), Vordach am Eingang,
// Terrasse mit Sonnenschirmen. Im Fenster ein Plakat für Bananensaft (Fantasie, keine Marke), über dem Glas der Name.
// =================================================================================================================
// Haus, Dach und Terrasse sind um (PAV.x, PAV.z) verschoben, damit der Ursprung wie überall in der Mitte der Vorderkante
// der ganzen Grundfläche liegt (Vordach vorn, Terrasse rechts eingeschlossen): 57 × 29 m.
const PAV = { w: 45, d: 22, h: 6.5, x: -4, z: -3 };
defs.rasthof_pavilion = {
  kind: 'rest', far: true,
  make(b) {
    b.at(PAV.x, 0, PAV.z, 0, () => pavilion(b));
    return { w: 57, d: 29, h: 10.7, door: [PAV.x, PAV.z - 2], name: 'Rasthaus Zur Ladepause' };
  },
};
function pavilion(b) {
  const { T, F, G, L } = b;
  const near = !b.lod;
  const z0 = -2;
  T.rbox(0, 0, z0 - PAV.d / 2, PAV.w, PAV.h, PAV.d, 0.3, C.wall, { seg: near ? 2 : 1, top: false });
  // Dachplatte in Creme mit Terrakotta-Band wie das Tankdach: die Anlage hat eine Hausfarbe
  F.rbox(0, PAV.h, -13, 49, 0.6, 26, 0.35, C.cream, { seg: near ? 2 : 1, ks: [0.86, 1] });
  F.rbox(0, PAV.h + 0.16, -13, 49.06, 0.28, 26.06, 0.37, C.terracotta, { seg: near ? 2 : 1, top: false });
  soffit(L, 0, PAV.h, -13, 49, 26, 0.35, near ? 2 : 1, C.soffitShade);
  // Schildwand auf dem Dach über dem Eingang (der Name steht als Text davor, siehe extras), hinten zwei Streben
  F.rbox(0, PAV.h + 0.6, -0.95, 16.6, 1.75, 0.24, 0.1, C.cream, { seg: near ? 2 : 1, ks: [0.9, 1] });
  if (near) for (const x of [-6, 6]) F.box(x, PAV.h + 0.6, -1.75, 0.14, 1.3, 1.36, C.steel);
  if (near) for (const x of [-12, 4, 15]) F.rbox(x, PAV.h + 0.6, -14, 2, 1.2, 2, 0.2, C.under, { seg: 1 });
  bananaGlass(b, 19.5, PAV.h + 0.6, -2.4, near);
  if (near) for (const x of [-16, -8, 0, 8, 16]) flat(L, x - 1.5, -0.95, x + 1.5, -0.75, PAV.h - 0.02, C.warm, true);
  // Glasfront: zwölf Scheiben 3 × 3,2 m, in der Mitte die Doppeltür; Rahmen hell
  b.at(0, 0, z0, 0, () => {
    for (let i = 0; i < 12; i++) {
      const x = -16.5 + i * 3;
      if (near) G.rect(x, 0.3, 0.02, 3, 3.5, C.frame);
      if (i === 5 || i === 6) {
        G.rect(x, 0.35, 0.04, 2.7, 2.7, PAV_DOOR, { g: [1.1, 0.8] });
        if (near) G.rect(x + (i === 5 ? 1.2 : -1.2), 1.1, 0.05, 0.08, 0.7, C.steel);
        G.rect(x, 3.1, 0.04, 2.7, 0.55, C.glass, { g: [1.1, 0.85] });
      } else G.rect(x, 0.45, 0.04, 2.7, 3.2, C.glass, { g: [1.12, 0.78] });
    }
    // Seitenwände: drei kleine Fenster je Seite
    for (const s of [-1, 1]) b.at(s * PAV.w / 2, 0, -PAV.d / 2, s * Math.PI / 2, () => {
      for (const x of [-6, 0, 6]) {
        if (near) G.rect(x, 1.1, 0.02, 2.2, 1.8, C.frame);
        G.rect(x, 1.2, 0.04, 1.9, 1.5, C.glass, { g: [1.12, 0.78] });
      }
    });
  });
  // Vordach über dem Eingang auf zwei Stützen
  F.rbox(0, 3.9, 1.2, 8, 0.3, 3.4, 0.2, C.terracotta, { seg: near ? 2 : 1, ks: [0.86, 1] });
  soffit(L, 0, 3.9, 1.2, 8, 3.4, 0.2, near ? 2 : 1);
  if (near) for (const x of [-2.4, 0, 2.4]) flat(L, x - 0.2, 1.0, x + 0.2, 1.4, 3.885, C.warm, true);
  for (const s of [-1, 1]) F.cyl(s * 3.6, 0, 2.6, 0.09, 0.09, 3.9, C.column, { seg: near ? 8 : 5 });
  // Terrasse rechts neben dem Haus mit Tischen und Sonnenschirmen
  F.box(28, 0, -9, 9, 0.15, 12, C.timber, { skip: 'b' });
  for (const [x, z] of [[26, -5], [30, -5], [26, -9.5], [30, -9.5], [26, -14], [30, -14]]) {
    F.cyl(x, 0.15, z, 0.05, 0.05, 2.35, C.column, { seg: 5 });
    F.lathe(x, 2.0, z, [[1.3, 0], [0.05, 0.55]], (x + z) % 2 ? C.terracotta : C.cream, { seg: near ? 10 : 6, bottom: true });
    if (near) F.cyl(x, 0.86, z, 0.5, 0.5, 0.05, C.white, { seg: 10, bottom: true });
  }
}
/**
 * Das Zeichen der Raststätte: ein Glas Bananensaft, 3 m hoch, auf dem Dach (Fantasie, keine Marke). Gelber Saft hinter
 * dem Glas, heller Rand mit Innenwand, rot-weißer Strohhalm, eine Banane auf dem Rand. Liest sich von der Zufahrt und
 * aus der Drohne, fern bleibt das Glas als Silhouette stehen.
 */
function bananaGlass(b, x, y, z, near) {
  const { F } = b;
  const seg = near ? 14 : 8;
  b.at(x, y, z, 0, () => {
    F.rbox(0, 0, 0, 2.3, 0.3, 2.3, 0.35, C.terracotta, { seg: near ? 2 : 1 });
    // Saft (Außenwand gelb, oben die Saftfläche), darüber der helle Glasrand, der innen wieder hinabläuft
    F.lathe(0, 0.3, 0, [[0.6, 0], [0.68, 0.1], [0.84, 1.75]], C.juice, { seg, ks: [0.85, 0.9, 1.05] });
    F.lathe(0, 2.05, 0, [[0.84, 0], [0.9, 0.55], [0.83, 0.58], [0.78, 0.05]], C.glassRim, { seg, top: false });
    if (!near) return;
    // Strohhalm in drei Stücken, rot-weiß
    const p0 = [0.18, 1.6, 0.05];
    const p3 = [0.62, 3.55, -0.32];
    const lerp3 = (t) => p0.map((v, i) => v + (p3[i] - v) * t);
    for (let i = 0; i < 3; i++) F.rod(lerp3(i / 3), lerp3((i + 1) / 3), 0.07, i % 2 ? 0xfaf6ee : C.straw, { seg: 8, caps: i === 2 });
    // Banane auf dem Rand: Bogen in der senkrechten Ebene, braune Spitzen
    b.xf([0.55, 2.98, 0.42], [Math.PI / 2, 0, -0.5], 1, () => {
      F.torus(0, 0, 0, 0.55, 0.15, 0xf6cf3a, { seg: 10, tube: 5, a0: -1.05, a1: 1.05 });
      for (const a of [-1.05, 1.05]) F.ball(Math.sin(a) * 0.55, 0, Math.cos(a) * 0.55, 0.075, 0x8a6a3a, { ws: 6, hs: 4 });
    });
  });
}
defs.rasthof_pavilion.extras = function extras(kit) {
  const name = textPanel(kit.core, 'rast:name:Rasthaus Zur Ladepause', 16, 1.45, 1024, (c, w, h) => {
    c.fillStyle = '#f1ebdf';
    c.fillRect(0, 0, w, h);
    c.fillStyle = '#c8603f';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    fitFont(c, 'Rasthaus Zur Ladepause', Math.round(h * 0.72), w - 60);
    c.fillText('Rasthaus Zur Ladepause', w / 2, h * 0.54);
  });
  name.position.set(PAV.x, PAV.h + 0.6 + 0.875, PAV.z - 0.95 + 0.125);
  const poster = textPanel(kit.core, 'rast:bananensaft', 2.3, 1.7, 512, drawBananaPoster);
  poster.position.set(PAV.x - 10.5, 1.95, PAV.z - 1.93);
  return [name, poster];
};
const PAV_DOOR = mix(PAL.glass, PAL.glassDark, 0.35);

/** Plakat im Fenster: Banane mit Glas, „Bananensaft“, darunter „frisch gemixt“ (Fantasie, keine Marke). */
function drawBananaPoster(c, w, h) {
  const g = c.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#fff2a8');
  g.addColorStop(1, '#ffd84a');
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = '#e0a83a';
  c.lineWidth = w * 0.02;
  c.strokeRect(w * 0.02, w * 0.02, w * 0.96, h - w * 0.04);
  // Glas mit Strohhalm
  const gx = w * 0.72;
  const gy = h * 0.52;
  c.fillStyle = '#fffbe6';
  c.beginPath();
  c.moveTo(gx - w * 0.1, gy - h * 0.22);
  c.lineTo(gx + w * 0.1, gy - h * 0.22);
  c.lineTo(gx + w * 0.08, gy + h * 0.2);
  c.lineTo(gx - w * 0.08, gy + h * 0.2);
  c.closePath();
  c.fill();
  c.fillStyle = '#f5d23a';
  c.fillRect(gx - w * 0.088, gy - h * 0.12, w * 0.176, h * 0.31);
  c.strokeStyle = '#e5483a';
  c.lineWidth = w * 0.018;
  c.beginPath();
  c.moveTo(gx + w * 0.02, gy - h * 0.1);
  c.lineTo(gx + w * 0.08, gy - h * 0.36);
  c.lineTo(gx + w * 0.14, gy - h * 0.38);
  c.stroke();
  // Banane
  c.fillStyle = '#f7c62f';
  c.strokeStyle = '#a8742a';
  c.lineWidth = w * 0.012;
  c.beginPath();
  c.moveTo(w * 0.12, h * 0.36);
  c.quadraticCurveTo(w * 0.3, h * 0.78, w * 0.56, h * 0.5);
  c.quadraticCurveTo(w * 0.32, h * 0.62, w * 0.17, h * 0.33);
  c.closePath();
  c.fill();
  c.stroke();
  c.fillStyle = '#7a5a2a';
  c.fillRect(w * 0.1, h * 0.31, w * 0.05, h * 0.05);
  // Schrift
  c.fillStyle = '#7a4a1a';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  fitFont(c, 'Bananensaft', Math.round(h * 0.2), w * 0.9);
  c.fillText('Bananensaft', w / 2, h * 0.14);
  fitFont(c, 'frisch gemixt', Math.round(h * 0.1), w * 0.6, 'normal');
  c.fillText('frisch gemixt', w * 0.36, h * 0.86);
}

// =================================================================================================================
// 6. Ladesäule: schlanker Kasten 0,45 × 1,86 × 0,4 m auf einem Sockel (Farbe je Säule), Bildschirm mit hellem Rahmen,
// türkises Band, Deckel; an jeder Seite ein Stecker im Halter, das Kabel hängt in einer Schlaufe längs der Seitenwand
// und läuft hinten zurück in die Säule (nie auf dem Boden). Von vorn sieht man vom Kabel nur die Kante: Bildschirm,
// Stecker und Kabelbogen dürfen nicht zu einem Gesicht werden. Die Vorderseite (+z) zeigt zur Parkbucht.
// =================================================================================================================
/**
 * Stecker (Zapfhahn) im Halter an einer Seitenwand x = xw (Außenseite s = ±1), Mitte des Halters in Höhe yp bei zp;
 * Kabel (Schlauch) hängt in einer Schlaufe (Radius R, Mitte in Höhe yc) in der Ebene der Wand und läuft auf der Seite
 * −dir (±z) hinauf in eine Tülle an der Wand. Von vorn sieht man davon nur die Kante.
 */
function hose(b, s, xw, yp, zp, dir, R, yc, col = C.cable, bare = false, port = null) {
  const { F } = b;
  const xs = xw + s * 0.045;
  F.rbox(xw + s * 0.018, yp - 0.13, zp, 0.036, 0.28, 0.17, 0.016, C.postCap, { seg: 1 });
  // bare: nur der Halter (Stecker und Kabel bringt die Startszene mit, xxl/chargerig.js)
  if (bare) return;
  // port: der Stecker steckt in einem geparkten Auto (pluggedCable), der Halter bleibt leer
  if (!port) F.rbox(xs, yp - 0.1, zp, 0.085, 0.21, 0.12, 0.035, C.plug, { seg: 1 });
  // Tülle an der Wand, aus der das Kabel kommt: ganz auf dem geraden Stück der Wand (bei der Ladesäule endet es 13 cm
  // hinter der Mitte, dahinter biegt die Kante rund ab – dort stünde die Tülle frei in der Luft)
  const zc = zp - dir * 0.07;
  const zg = zc - dir * 0.08;
  const yg = yc + 0.22;
  F.rbox(xw + s * 0.04, yg, zg, 0.09, 0.07, 0.09, 0.025, C.plug, { seg: 1 });
  if (port) {
    pluggedCable(b, s, xw + s * 0.04, yg, zg, port, col);
    return;
  }
  // Ein Schlauch ohne Naht: vom Stecker auf der Tangente an den Kreis der Schlaufe, unten herum und auf der zweiten
  // Tangente hinauf in die Tülle; die Enden stecken 3 cm tief im Stecker und in der flachen Tülle so tief, dass der
  // Rand des Schlauchs 4 mm unter ihrem Deckel bleibt: offen ist nichts. Mittellinie in der Wandebene als (u, y),
  // u = dir · (z − zc).
  const r = 0.032;
  const side = (pu, py, k) => {
    const d = Math.hypot(pu, py);
    return Math.atan2(py, pu) - k * Math.acos(Math.min(1, R / d));
  };
  const a0 = side(zp * dir - zc * dir, yp - 0.1 - yc, 1);
  const a1 = side(zg * dir - zc * dir, yg - yc, -1) - TAU;
  const n = 24;
  const pts = [];
  const tan = [];
  // Ende in Stecker oder Tülle (halbe Höhe hy): die Tangente läuft vom Berührpunkt am Kreis zu deren Mitte und darüber
  // hinaus, 3 cm oder so weit, dass der schräge Endring 4 mm unter dem Deckel bleibt
  const arm = (a, pu, py, inward, hy) => {
    const tu = pu - R * Math.cos(a);
    const ty = py - R * Math.sin(a);
    const l = Math.hypot(tu, ty);
    const ext = Math.min(0.03, (hy - 0.004 - (r * Math.abs(tu)) / l) / Math.max(0.3, Math.abs(ty) / l));
    pts.push([pu + (tu / l) * ext, py + (ty / l) * ext]);
    tan.push([(inward * tu) / l, (inward * ty) / l]);
  };
  arm(a0, (zp - zc) * dir, yp - 0.1 - yc, -1, 0.105);
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    pts.push([R * Math.cos(a), R * Math.sin(a)]);
    tan.push([Math.sin(a), -Math.cos(a)]);
  }
  arm(a1, (zg - zc) * dir, yg - yc, 1, 0.035);
  const rad = 10;
  const P = [];
  const N = [];
  const idx = [];
  pts.forEach(([u, y], i) => {
    // Rahmen des Rings: x (Wandnormale) und t × x in der Wandebene
    const tz = tan[i][0] * dir;
    const ty = tan[i][1];
    for (let j = 0; j <= rad; j++) {
      const v = (j / rad) * TAU;
      const nx = Math.cos(v);
      const ny = Math.sin(v) * tz;
      const nz = -Math.sin(v) * ty;
      P.push(xs + r * nx, yc + y + r * ny, zc + u * dir + r * nz);
      N.push(nx, ny, nz);
      if (i < pts.length - 1 && j < rad) {
        const p = i * (rad + 1) + j;
        idx.push(p, p + rad + 1, p + 1, p + rad + 1, p + rad + 2, p + 1);
      }
    }
  });
  F.mesh(P, N, idx, col);
}

/**
 * Kabel der Seite s einer Säule, das in einem geparkten Auto steckt (hose mit port): aus der Tülle (xg, yg, zg)
 * senkrecht nach unten, in flachem Bogen über dem Boden zur Flanke des Autos und schräg hinauf in seine Buchse port
 * (Mitte auf der Flanke, die zur Säule schaut); der Stecker sitzt mit der Spitze 3,5 cm tief darin.
 */
function pluggedCable(b, s, xg, yg, zg, port, col) {
  const { F } = b;
  const [px, py, pz] = port;
  const a = 0.6; // Neigung des Steckers gegen die Waagerechte
  // Punkt k Meter längs des Steckers (zur Spitze, in die Flanke hinein: +k)
  const at = (k) => [px + s * Math.cos(a) * k, py + Math.sin(a) * k, pz];
  b.xf(port, [0, 0, -s * (Math.PI / 2 - a)], 1, () => F.rbox(0, -0.175, 0, 0.085, 0.21, 0.12, 0.035, C.plug, { seg: 1 }));
  // Das Kabel fällt hinter dem Vorderrad zu Boden, liegt neben dem Rad auf der Bucht (13 cm vor der Flanke, außen am
  // Reifen vorbei, nie über ihm) und steigt vor dem Rad an der Säule in die Tülle; die Enden stecken in Stecker und Tülle
  const xr = px - s * 0.13;
  const gy = 0.04;
  const axle = pz - PORT_BEHIND;
  cord(F, [at(-0.14), at(-0.26), [xr, 0.22, pz - 0.04], [xr, gy, pz - 0.22], [xr, gy, axle], [xr, gy, 0.42], [xg + s * 0.09, 0.2, 0.22], [xg + s * 0.02, yg - 0.2, zg + 0.03], [xg, yg + 0.03, zg]], 0.032, col, 64, 10);
}

/**
 * Säule im eigenen Rahmen (Mitte der Grundfläche im Ursprung): kind 'dc' (groß, je Seite ein Kabel) oder 'ac' (klein,
 * ein Kabel auf der Seite ac). body(y, w, h, d, seg) baut den Kasten (eingefärbt oder fest); bare: diese Seite (−1 | 1)
 * bekommt nur den Halter; ports: Seite → Buchse eines geparkten Autos, in der das Kabel dieser Seite steckt.
 * Ergebnis: Oberkante.
 */
function chargePost(b, kind, near, body, bare = 0, ports = {}, ac = 1) {
  const { F, G, L } = b;
  const dc = kind === 'dc';
  const hh = dc ? 1.86 : 1.3;
  const ww = dc ? 0.45 : 0.32;
  const dd = 0.4;
  const y0 = 0.12;
  const seg = near ? 2 : 1;
  F.rbox(0, 0, 0, ww + 0.16, y0, dd + 0.14, 0.06, C.footing, { seg: 1 });
  body(y0, ww, hh, dd, seg);
  L.rbox(0, y0 + hh - 0.32, 0, ww + 0.02, 0.13, dd + 0.02, 0.075, C.teal, { seg });
  F.rbox(0, y0 + hh, 0, ww + 0.04, 0.07, dd + 0.04, 0.08, C.postCap, { seg });
  if (!near) return y0 + hh + 0.07;
  // Bildschirm im hellen Rahmen, darunter das Steckerzeichen
  const sw = ww * 0.74;
  const sh = dc ? 0.42 : 0.3;
  const sy = y0 + hh - 0.42 - sh;
  G.rect(0, sy, dd / 2 + 0.002, sw, sh, mix(C.screen, 0xffffff, 0.6));
  G.rect(0, sy + 0.035, dd / 2 + 0.004, sw - 0.07, sh - 0.07, C.screen, { g: [1.18, 0.82] });
  G.sign(0, y0 + 0.3, dd / 2 + 0.003, ww * 0.44, 'y:charge');
  // Stecker im Halter an der Seitenwand, Kabel in der Schlaufe längs der Seite
  for (const s of dc ? [-1, 1] : [ac]) hose(b, s, s * ww / 2, y0 + hh * (dc ? 0.56 : 0.6), 0.07, 1, dc ? 0.19 : 0.15, dc ? 0.8 : 0.64, C.cable, s === bare, ports[s] ?? null);
  return y0 + hh + 0.07;
}
defs.lade_saeule = {
  kind: 'rest', far: true, tints: [C.body, C.body, mix(C.body, 0xffffff, 0.35)],
  make(b) {
    const h = chargePost(b, 'dc', !b.lod, (y, w, hh, d, seg) => b.T.rbox(0, y, 0, w, hh, d, 0.07, 0xffffff, { seg }));
    return { w: 0.64, d: 0.56, h, centre: true };
  },
};

/** Popcorn-Eimer für die Ladepause: rot-weiß gestreift, oben voll Popcorn (0,3 m hoch, Mitte der Grundfläche). */
defs.popcorn_eimer = {
  kind: 'rest', far: true,
  make(b) {
    const { F } = b;
    const near = !b.lod;
    const n = near ? 12 : 6;
    const r0 = 0.09;
    const r1 = 0.13;
    const h = 0.26;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      const e = ((i + 1) / n) * TAU;
      const p = (r, t, y) => [Math.sin(t) * r, y, Math.cos(t) * r];
      F.quad(p(r0, a, 0), p(r0, e, 0), p(r1, e, h), p(r1, a, h), i % 2 ? C.white : 0xe5483a);
    }
    F.ball(0, h - 0.01, 0, r1 * 0.96, 0xfff3c2, { ws: n, hs: 3, sy: 0.5, lat: [0, Math.PI / 2] });
    if (near) for (let i = 0; i < 9; i++) {
      const a = i * 2.4;
      const rr = (i % 3) * 0.04;
      F.ball(Math.sin(a) * rr, h + 0.045 + (i % 2) * 0.02, Math.cos(a) * rr, 0.035, i % 4 ? 0xfff3c2 : 0xf7dc8a, { ws: 6, hs: 4 });
    }
    return { w: 0.27, d: 0.27, h: 0.34, centre: true };
  },
};

// Für die Ladepause an der Heldensäule: eine kleine Popcorn-Maschine im Kinostil oben auf der Säule, ihr Kabel steckt in
// einer Steckdose an der Rückwand der Säule (der Klassiker „Haushaltsgeräte an der E-Säule testen“); dazu eine Flasche
// Bananensaft und eine Popcorn-Tüte für Mini Adams Hand. Alles ohne Marke.
const POP = { kernel: 0xfff3c2, toasted: 0xf7dc8a, red: 0xe5483a, redDark: 0xb83a30, glass: 0xd3e8ee, shine: 0xf4fbfc, paper: 0xf6efe2 };

/**
 * Kabel als runder Schlauch durch die Punkte pts (Catmull-Rom, n Stücke, rad Kanten im Ring). Der Ring wird längs der
 * Kurve mitgeführt (ohne Verdrehen); die Enden bleiben offen und gehören darum in Stecker oder Tülle.
 */
function cord(part, pts, r, col, n = 28, rad = 8) {
  const last = pts.length - 1;
  const C3 = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * last;
    const k = Math.min(Math.floor(t), last - 1);
    const u = t - k;
    const a = pts[Math.max(k - 1, 0)];
    const b = pts[k];
    const c = pts[k + 1];
    const d = pts[Math.min(k + 2, last)];
    C3.push([0, 1, 2].map((j) => 0.5 * (2 * b[j] + (c[j] - a[j]) * u + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * u * u + (3 * b[j] - a[j] - 3 * c[j] + d[j]) * u * u * u)));
  }
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
  const unit = (v) => {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const crs = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const P = [];
  const N = [];
  const idx = [];
  let nrm = null;
  C3.forEach((p, i) => {
    const t = unit(sub(C3[Math.min(i + 1, n)], C3[Math.max(i - 1, 0)]));
    // Rahmen: Normale vom letzten Ring auf die neue Tangente gelegt; am Anfang irgendeine Senkrechte
    const seed = nrm ?? (Math.abs(t[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]);
    const dot = seed[0] * t[0] + seed[1] * t[1] + seed[2] * t[2];
    nrm = unit([seed[0] - dot * t[0], seed[1] - dot * t[1], seed[2] - dot * t[2]]);
    const bin = crs(nrm, t);
    for (let j = 0; j <= rad; j++) {
      const v = (j / rad) * TAU;
      const o = [0, 1, 2].map((q) => Math.cos(v) * nrm[q] + Math.sin(v) * bin[q]);
      P.push(p[0] + r * o[0], p[1] + r * o[1], p[2] + r * o[2]);
      N.push(o[0], o[1], o[2]);
      if (i < n && j < rad) {
        const a = i * (rad + 1) + j;
        const q = a + rad + 1;
        idx.push(a, q, q + 1, a, q + 1, a + 1);
      }
    }
  });
  part.mesh(P, N, idx, col);
}

/** Popcorn-Häufchen: count Körner in einer Kuppel (Radius rx × rz, Höhe h) um (x, y, z); fern nur die Kuppel. */
function popcornHeap(b, x, y, z, rx, rz, h, count, near, seed = 1) {
  const { F } = b;
  b.xf([x, y, z], [0, 0, 0], [rx, h, rz], () => F.ball(0, 0, 0, 1, POP.toasted, { ws: near ? 12 : 6, hs: near ? 4 : 2, lat: [0, Math.PI / 2] }));
  if (!near) return;
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < count; i++) {
    const a = rnd() * TAU;
    const q = Math.sqrt(rnd()) * 0.92;
    const px = Math.cos(a) * q * rx;
    const pz = Math.sin(a) * q * rz;
    // auf der Kuppel sitzend: Höhe der Kuppel an dieser Stelle, das Korn halb eingesunken
    const top = h * Math.sqrt(Math.max(0, 1 - q * q));
    const r = 0.011 + rnd() * 0.006;
    F.ball(x + px, y + top - r * 0.3, z + pz, r, rnd() < 0.7 ? POP.kernel : POP.toasted, { ws: 6, hs: 4 });
  }
}

/**
 * Popcorn-Maschine im Kinostil (0,34 × 0,26 m, 0,58 m hoch, Mitte der Grundfläche im Ursprung, vorn +z): roter Sockel
 * mit cremefarbener Klappe und zwei Knöpfen, darüber die Glaskabine mit vier roten Pfosten, Glas hinten und an den
 * Seiten, die Tür vorn steht offen (nach links geschwenkt); innen hängt der Kessel voll Popcorn am Dach, unten liegt
 * ein Haufen davon. Auf dem Dach eine kleine Kuppel. Die Kabeltülle sitzt links am Sockel (Punkt GLAND).
 */
export const MACHINE = { w: 0.34, d: 0.26, base: 0.16, cab: 0.3, gland: [-0.17, 0.08, -0.06] };
function popcornMachine(b, near) {
  const { F, G } = b;
  const { w, d } = MACHINE;
  const y1 = MACHINE.base;
  const y2 = y1 + MACHINE.cab;
  const seg = near ? 2 : 1;
  for (const x of [-1, 1]) for (const z of [-1, 1]) F.ball(x * (w / 2 - 0.03), 0.014, z * (d / 2 - 0.03), 0.016, POP.redDark, { ws: 6, hs: 4 });
  F.rbox(0, 0.02, 0, w, y1 - 0.02, d, 0.03, POP.red, { seg, ks: [0.85, 1], bottom: true });
  // Klappe vorn (6 mm stark, 2 mm im Sockel) mit zwei Knöpfen, Tülle links
  F.rbox(0, 0.045, d / 2 + 0.001, w - 0.08, 0.09, 0.006, 0.012, C.cream, { seg: 1 });
  if (near) for (const x of [-0.07, 0.07]) F.ball(x, 0.09, d / 2 + 0.006, 0.013, C.white, { ws: 8, hs: 4 });
  F.rbox(MACHINE.gland[0] - 0.006, MACHINE.gland[1] - 0.018, MACHINE.gland[2], 0.024, 0.036, 0.036, 0.008, C.plug, { seg: 1 });
  // Kabine: Boden, Pfosten, Glas (hinten, links, rechts), Dach mit Kuppel
  const px = w / 2 - 0.018;
  const pz = d / 2 - 0.018;
  for (const x of [-px, px]) for (const z of [-pz, pz]) F.rbox(x, y1, z, 0.03, MACHINE.cab, 0.03, 0.01, POP.red, { seg: 1 });
  F.rbox(0, y2, 0, w + 0.02, 0.05, d + 0.02, 0.035, POP.red, { seg, ks: [0.92, 1.05], bottom: true });
  F.ball(0, y2 + 0.05, 0, 0.075, C.cream, { ws: near ? 14 : 8, hs: near ? 5 : 3, sy: 0.6, lat: [0, Math.PI / 2] });
  F.ball(0, y2 + 0.05 + 0.045 + 0.012, 0, 0.02, POP.red, { ws: 8, hs: 5 });
  G.rbox(0, y1, -pz, 2 * px, MACHINE.cab, 0.006, 0.002, POP.glass, { seg: 1 });
  for (const x of [-px, px]) G.rbox(x, y1, 0, 0.006, MACHINE.cab, 2 * pz, 0.002, POP.glass, { seg: 1 });
  // Glanzstreifen schräg auf den Seitenscheiben (1 mm vor dem Glas)
  if (near) for (const s of [-1, 1]) {
    const x = s * (px + 0.0045);
    const q = [[x, y1 + 0.06, -pz + 0.05], [x, y1 + 0.2, -pz + 0.02], [x, y1 + 0.24, -pz + 0.07], [x, y1 + 0.1, -pz + 0.1]];
    G.quad(...(s > 0 ? q : q.slice().reverse()), POP.shine);
  }
  // niedrige Kante vorn, damit der Haufen nicht herausrollt
  F.rbox(0, y1, pz, 2 * px - 0.03, 0.035, 0.012, 0.004, POP.red, { seg: 1 });
  popcornHeap(b, 0, y1, -0.01, px - 0.03, pz - 0.035, 0.07, 46, near, 3);
  // Kessel am Dach: Stange, Topf aus Stahl, oben quillt Popcorn heraus
  F.cyl(0, y2 - 0.07, 0, 0.008, 0.008, 0.07, C.steel, { seg: 6, top: false });
  F.lathe(0, y2 - 0.155, 0, [[0.0, 0], [0.05, 0.004], [0.066, 0.03], [0.07, 0.085]], C.steelLight, { seg: near ? 16 : 8, top: false });
  // (die Kuppel deckt den Rand des Topfs: von oben ist seine Innenwand nirgends zu sehen)
  popcornHeap(b, 0, y2 - 0.071, 0, 0.073, 0.073, 0.035, 14, near, 7);
  // Tür (offen, um den linken vorderen Pfosten nach außen geschwenkt): Rahmen und Scheibe
  // (Scharnier vor dem Pfosten; geschlossen zeigte die Tür nach +x, offen 110° nach links außen)
  b.at(-px, y1, pz + 0.021, -1.92, () => {
    const dw = 2 * px - 0.01;
    F.rbox(dw / 2, 0, 0, dw, 0.018, 0.012, 0.004, POP.red, { seg: 1, bottom: true });
    F.rbox(dw / 2, MACHINE.cab - 0.018, 0, dw, 0.018, 0.012, 0.004, POP.red, { seg: 1, bottom: true });
    for (const x of [0.008, dw - 0.008]) F.rbox(x, 0.016, 0, 0.016, MACHINE.cab - 0.032, 0.012, 0.004, POP.red, { seg: 1 });
    G.rbox(dw / 2, 0.016, 0, dw - 0.024, MACHINE.cab - 0.032, 0.005, 0.001, POP.glass, { seg: 1 });
    if (near) F.ball(dw - 0.008, MACHINE.cab / 2, 0.009, 0.009, C.white, { ws: 6, hs: 4 });
  });
}

/** Flasche Bananensaft (0,22 m): gelber Saft im Glas, cremefarbenes Etikett mit grünem Rand, roter Deckel. */
function juiceBottle(b, x, y, z, near) {
  const { F, G } = b;
  const seg = near ? 14 : 8;
  b.at(x, y, z, 0, () => {
    // voll bis in die Schulter, nur der Hals ist leeres Glas
    G.lathe(0, 0, 0, [[0, 0], [0.03, 0.002], [0.034, 0.012], [0.034, 0.135], [0.026, 0.17]], C.juice, { seg, top: false });
    G.lathe(0, 0.17, 0, [[0.026, 0], [0.0135, 0.025], [0.0135, 0.04]], POP.glass, { seg, top: false });
    F.lathe(0, 0.205, 0, [[0.0155, 0], [0.0155, 0.018], [0, 0.02]], POP.red, { seg });
    if (!near) return;
    F.lathe(0, 0.045, 0, [[0.0352, 0], [0.0352, 0.06]], C.cream, { seg, top: false });
    for (const yy of [0.045, 0.1]) F.lathe(0, yy, 0, [[0.0356, 0], [0.0356, 0.005]], 0x7cb35b, { seg, top: false });
    // kleine Banane aufs Etikett: ein Bogen, der dem runden Etikett folgt (Rohr 2,6 mm, auch zwischen den Kanten des
    // Etiketts gut 0,7 mm darin versenkt); ihre Enden tauchen in die Flasche, kein offenes Rohrende bleibt zu sehen
    const banana = [-1.2, -1, -0.5, 0, 0.5, 1, 1.2].map((t) => {
      const rho = Math.abs(t) > 1 ? 0.029 : 0.0362;
      return [rho * Math.sin(0.4 * t), 0.068 + 0.009 * t * t, rho * Math.cos(0.4 * t)];
    });
    cord(F, banana, 0.0026, 0xf6cf3a, 16, 6);
  });
}

/**
 * Popcorn-Tüte aus Papier (Boden 0,09 × 0,06 m, oben 0,1 × 0,07 m, 0,15 m hoch): rot-weiß gestreift, oben offen und
 * voll Popcorn; die Wand hat innen eine eigene Fläche (von oben gesehen ist nichts durchsichtig).
 */
function popcornBag(b, x, y, z, near) {
  const { F } = b;
  b.at(x, y, z, 0, () => {
    const h = 0.15;
    const c0 = [[-0.045, -0.03], [0.045, -0.03], [0.045, 0.03], [-0.045, 0.03]];
    const c1 = [[-0.05, -0.035], [0.05, -0.035], [0.05, 0.035], [-0.05, 0.035]];
    const k = near ? 3 : 1;
    for (let s = 0; s < 4; s++) {
      const a0 = c0[s];
      const a1 = c0[(s + 1) % 4];
      const b0 = c1[s];
      const b1 = c1[(s + 1) % 4];
      for (let i = 0; i < k; i++) {
        const t0 = i / k;
        const t1 = (i + 1) / k;
        const L = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
        const p00 = L(a0, a1, t0);
        const p01 = L(a0, a1, t1);
        const p10 = L(b0, b1, t0);
        const p11 = L(b0, b1, t1);
        const col = near ? ((s * k + i) % 2 ? C.white : POP.red) : POP.red;
        F.quad([p00[0], 0, p00[1]], [p10[0], h, p10[1]], [p11[0], h, p11[1]], [p01[0], 0, p01[1]], col);
        // Innenseite 1,5 mm weiter innen, in Papierfarbe
        const ins = (p) => [p[0] * 0.97, p[1] * 0.95];
        const [q00, q01, q10, q11] = [ins(p00), ins(p01), ins(p10), ins(p11)];
        F.quad([q01[0], 0.004, q01[1]], [q11[0], h, q11[1]], [q10[0], h, q10[1]], [q00[0], 0.004, q00[1]], POP.paper);
      }
    }
    F.quad([-0.045, 0.001, 0.03], [0.045, 0.001, 0.03], [0.045, 0.001, -0.03], [-0.045, 0.001, -0.03], POP.paper);
    // Oberkante: ein schmaler Falz rundum, damit die Wand oben eine Dicke hat
    F.rbox(0, h - 0.004, 0, 0.102, 0.008, 0.072, 0.004, C.white, { seg: 1, top: false });
    popcornHeap(b, 0, h - 0.015, 0, 0.047, 0.032, 0.04, 16, near, 11);
  });
}

// Die Maschine auf dem Deckel der Heldensäule (Rahmen der Säule: Mitte ihres Fußes, +z ihre Vorderseite; top: Höhe
// des Deckels, chargePost DC): um yaw gedreht, so dass die offene Tür schräg nach vorn zur Heldenbucht zeigt – zum
// Fahrerfenster des Autos, das dort rückwärts eingeparkt lädt (dorthin fliegt beim Ladestopp das Popcorn,
// xxl/popping.js). socket: Steckdose an der Rückwand (x, y), in der das Kabel der Maschine steckt.
export const POST_POP = { top: 0.12 + 1.86 + 0.07, yaw: -0.33, socket: [-0.12, 1.62] };
defs.popcorn_post = {
  kind: 'rest', far: true,
  make(b) {
    const { F } = b;
    const near = !b.lod;
    const { top, yaw } = POST_POP;
    b.at(0, top, 0, yaw, () => popcornMachine(b, near));
    // Steckdose an der Rückwand der Säule (0,4 m tief, Rückwand bei z −0,2), Stecker darin; das Kabel läuft an der
    // Rückwand hinauf, über die hintere Kante des Deckels und auf ihm entlang von links in die Tülle der Maschine
    const [sx, sy] = POST_POP.socket;
    const back = -0.2;
    F.rbox(sx, sy, back - 0.015, 0.11, 0.13, 0.04, 0.015, C.cream, { seg: 1 });
    if (near) F.rbox(sx, sy + 0.09, back - 0.036, 0.07, 0.012, 0.006, 0.003, C.teal, { seg: 1 });
    F.rbox(sx, sy + 0.03, back - 0.06, 0.05, 0.06, 0.06, 0.012, C.plug, { seg: 1 });
    // Tülle (links am Sockel der Maschine) und die Richtung, aus der das Kabel in sie hineinführt (−x der Maschine)
    const c = Math.cos(yaw);
    const sn = Math.sin(yaw);
    const rot = (x, z) => [x * c + z * sn, -x * sn + z * c];
    const [gx, gz] = rot(MACHINE.gland[0], MACHINE.gland[2]);
    const [ox, oz] = rot(-1, 0);
    const gy = top + MACHINE.gland[1];
    const lie = top + 0.0085;
    const cable = [
      [sx, sy + 0.06, back - 0.09],
      [sx, sy + 0.1, back - 0.105],
      [sx, sy + 0.2, back - 0.05],
      [sx, top - 0.12, back - 0.04],
      [sx + 0.005, top - 0.01, back - 0.035],
      [sx + 0.01, lie + 0.004, back + 0.01],
      [gx + ox * 0.09, lie, gz + oz * 0.09 - 0.02],
      [gx + ox * 0.045, gy - 0.035, gz + oz * 0.045],
      [gx + ox * 0.022, gy - 0.006, gz + oz * 0.022],
      [gx + ox * 0.006, gy, gz + oz * 0.006],
    ];
    cord(F, cable, 0.0075, C.cable, near ? 36 : 14, near ? 8 : 5);
    // (Maße: der Deckel der Säule; h: Kugel auf dem Dach der Maschine)
    return { w: 0.5, d: 0.45, h: top + 0.6, centre: true };
  },
};
defs.bananensaft_flasche = {
  kind: 'rest', far: true,
  make(b) {
    juiceBottle(b, 0, 0, 0, !b.lod);
    return { w: 0.07, d: 0.07, h: 0.23, centre: true };
  },
};
defs.popcorn_tuete = {
  kind: 'rest', far: true,
  make(b) {
    popcornBag(b, 0, 0, 0, !b.lod);
    return { w: 0.1, d: 0.07, h: 0.2, centre: true };
  },
};

// =================================================================================================================
// 7. Ladedach für drei Buchten: Platte 8,2 × 6,5 m in 4,15–4,5 m Höhe auf zwei Säulen hinten, türkise Kante vorn,
// warm leuchtende Unterseite
// =================================================================================================================
defs.lade_dach_3 = {
  kind: 'rest', far: true,
  make(b) {
    const { F, L } = b;
    const near = !b.lod;
    F.rbox(0, 4.15, -3.25, 8.2, 0.35, 6.5, 0.15, C.cream, { seg: near ? 2 : 1, ks: [0.86, 1] });
    soffit(L, 0, 4.15, -3.25, 8.2, 6.5, 0.15, near ? 2 : 1);
    solar(b, 0, 4.5, -3.25, 7.6, 5.9, 4, 3, near);
    L.box(0, 4.22, 0.0, 7.9, 0.15, 0.04, C.teal);
    for (const z of [-1.9, -4.6]) flat(L, -3.6, z - 0.18, 3.6, z + 0.18, 4.13, C.warm, true);
    for (const x of [-2.9, 2.9]) F.lathe(x, 0, -5.9, [[0.4, 0], [0.4, 0.15], [0.25, 0.32], [0.25, 4.15]], C.column, { seg: near ? 12 : 6, top: false });
    return { w: 8.2, d: 6.5, h: 4.5 };
  },
};

// =================================================================================================================
// 8. Ladepark (24 × 11 m): acht Buchten 2,6 × 5 m, außen je eine ohne Dach, sechs unter zwei Ladedächern; eine Säule
// zwischen je zwei Buchten, Poller davor, Verteilerkasten hinten rechts, Rasenstreifen mit Bäumchen, Bank und Eimer,
// blaue Tafel mit Stecker vorn links. Startplatz des Spielers: dritte Bucht (BAYS[2]).
// =================================================================================================================
const BAY = 2.6;
const BAYS = Array.from({ length: 8 }, (_, i) => -9.1 + i * BAY);
const POSTS = [[-5.2, 'dc'], [0, 'dc'], [5.2, 'dc'], [-10.7, 'ac'], [10.7, 'ac']];
// Geparkte Autos (Bucht, Baustein aus kit/street.js), wie kit/layout.js sie hinstellt: vorwärts eingeparkt, 0,2 m
// tiefer als die Buchtmitte, ihr Kabel steckt schon an der nächsten Säule. L, W, wz: Länge, Breite und Vorderachse wie
// toyCar in street.js; die Buchse sitzt in der Flanke zur Säule hinter dem vorderen Radkasten, hoch oben auf dem
// geraden Stück der Flanke (y, unter der Rundung zur Gürtellinie), 0,55 m hinter der Achse.
const PARKED = [[0, 'carCompact'], [6, 'carSmall'], [7, 'carCompact']];
const PARKED_CAR = { carCompact: { L: 3.9, W: 1.72, wz: 1.21, y: 0.6 }, carSmall: { L: 3.2, W: 1.62, wz: 1.0, y: 0.56 } };
const PORT_BEHIND = 0.55;
/** Buchsen der geparkten Autos an der Säule bei x (Rahmen der Säule): Seite → [x, y, z]. */
export function parkedPorts(x) {
  const ports = {};
  for (const [i, name] of PARKED) {
    const d = BAYS[i] - x;
    if (Math.abs(d) > BAY) continue;
    const c = PARKED_CAR[name];
    const s = Math.sign(d);
    // Wagenmitte bei z −3,3 − 0,2, Bug zur Säule (−z); Säule bei z −5,3
    ports[s] = [d - (s * c.W) / 2, c.y, -3.5 - (c.wz - PORT_BEHIND) + 5.3];
  }
  return ports;
}
defs.ladepark = {
  kind: 'rest', far: true,
  // heroFree: an der Säule der Heldenbucht hängt auf deren Seite nur der Halter (ladepark_start, siehe unten)
  make(b, lod, heroFree = false) {
    const { F, G, L } = b;
    const near = !b.lod;
    F.box(0, 0, -4, 24, 0.05, 8, C.yard, { skip: 'b' });
    // Buchten: weiße Linien, grüne Felder unter den Dächern
    for (let i = 0; i <= 8; i++) flat(G, -10.46 + i * BAY, -5.8, -10.34 + i * BAY, -0.8, 0.052, C.white);
    flat(G, -10.46, -0.92, 10.46, -0.8, 0.052, C.white);
    for (let i = 1; i <= 6; i++) flat(G, BAYS[i] - 0.95, -5.4, BAYS[i] + 0.95, -1.4, 0.053, C.ev);
    // Dächer (wie lade_dach_3)
    for (const cx of [-4.15, 4.15]) {
      F.rbox(cx, 4.15, -3.75, 8.2, 0.35, 6.5, 0.15, C.cream, { seg: near ? 2 : 1, ks: [0.86, 1] });
      soffit(L, cx, 4.15, -3.75, 8.2, 6.5, 0.15, near ? 2 : 1);
      solar(b, cx, 4.5, -3.75, 7.6, 5.9, 4, 3, near);
      L.box(cx, 4.22, -0.5, 7.9, 0.15, 0.04, C.teal);
      for (const z of [-2.4, -5.1]) flat(L, cx - 3.6, z - 0.18, cx + 3.6, z + 0.18, 4.13, C.warm, true);
      for (const dx of [-2.9, 2.9]) F.lathe(cx + dx, 0.05, -6.4, [[0.4, 0], [0.4, 0.15], [0.25, 0.32], [0.25, 4.1]], C.column, { seg: near ? 12 : 6, top: false });
    }
    // Säulen (DC zwischen je zwei Buchten, AC an den Enden mit dem Kabel zur Bucht hin) mit Poller davor
    for (const [x, kind] of POSTS) {
      const bare = heroFree && x === POSTS[1][0] ? -1 : 0;
      const body = (y, w, hh, d, seg) => F.rbox(0, y, 0, w, hh, d, 0.07, C.body, { seg });
      b.at(x, 0.05, -5.3, 0, () => chargePost(b, kind, near, body, bare, parkedPorts(x), x < 0 ? 1 : -1));
      F.cyl(x, 0.05, -4.6, 0.14, 0.14, 0.85, C.mustard, { seg: near ? 10 : 5 });
      if (near) F.cyl(x, 0.75, -4.6, 0.142, 0.142, 0.06, C.white, { seg: 10, top: false });
    }
    // Verteilerkasten hinten rechts, Rasen mit Bäumchen, Bank und Eimer an der ersten Bucht
    F.rbox(6.5, 0, -9.75, 3.0, 2.5, 2.5, 0.12, C.cabinet, { seg: 1 });
    b.at(6.5, 0, -9.75, Math.PI / 2, () => F.extrude([[-1.35, 2.5], [1.35, 2.5], [0, 3.0]], -1.6, 1.6, C.cap));
    if (near) b.at(6.5, 0, -8.5, 0, () => {
      G.rect(-0.7, 0.2, 0.002, 1.1, 2.0, mix(C.cabinet, CITY.ink, 0.12));
      G.rect(0.7, 0.2, 0.002, 1.1, 2.0, mix(C.cabinet, CITY.ink, 0.12));
    });
    F.box(-3, 0, -9.5, 18, 0.12, 3, C.lawn, { skip: 'b' });
    for (const x of [-10, -3, 3.5]) {
      F.cyl(x, 0.12, -9.5, 0.1, 0.08, 1.6, PAL.trunk, { seg: 6 });
      F.ball(x, 2.3, -9.5, 1.1, PAL.crown[(x + 10) % 3 | 0], { ws: near ? 10 : 6, hs: near ? 6 : 4, sy: 1.1 });
    }
    F.box(-9.1, 0.05, -7.0, 1.8, 0.42, 0.5, C.timber);
    F.box(-9.1, 0.47, -7.22, 1.8, 0.4, 0.08, C.timber);
    F.cyl(-11.2, 0.05, -6.2, 0.3, 0.3, 0.95, C.cap, { seg: near ? 10 : 6 });
    // Pfosten der blauen Tafel vorn links
    F.cyl(-11.6, 0.05, -0.3, 0.06, 0.06, 3.65, C.steel, { seg: 8 });
    F.rbox(-11.6, 2.38, -0.36, 1.24, 1.24, 0.05, 0.08, C.steelLight, { seg: 1 });
    // posts: [x, z, Oberkante (ab Boden des Ladeparks), Art]. Heldenbucht 3: das Auto steht rückwärts eingeparkt (Bug zur
    // Zufahrt, wie an echten Schnellladern), die Säule 1 rechts neben der Bucht steht dann an seiner linken hinteren
    // Ecke, wo die Ladeklappe sitzt. Auf ihrem Poller hat der Popcorn-Eimer Platz (popcorn = Mitte seines Bodens).
    const posts = POSTS.map(([x, kind]) => [x, -5.3, 0.05 + 0.12 + (kind === 'dc' ? 1.86 : 1.3) + 0.07, kind]);
    // parked: wo kit/layout.js welche Autos hinstellt (ihre Kabel stecken), parkedCar: deren Maße
    return { w: 24, d: 11, h: 4.5, bays: BAYS.map((x) => [x, -3.3]), hero: 3, heroPost: 1, posts, popcorn: [POSTS[1][0], 0.9, -4.6], ground: 0.05, groundD: 8, parked: PARKED, parkedCar: PARKED_CAR };
  },
  extras(kit) {
    const m = textPanel(kit.core, 'rast:plug', 1.2, 1.2, 256, (c, w, h) => drawBoard(c, w, h, { icons: ['plug'] }));
    m.position.set(-11.6, 3.0, -0.31);
    return [m];
  },
};
// Der Ladepark in Erlensee, an dem jede Fahrt beginnt, und die Ladeparks der Reise: Stecker und Kabel der Heldenbucht
// gehören der Startszene und dem Ladestopp (xxl/chargerig.js)
defs.ladepark_start = { ...defs.ladepark, make: (b, lod) => defs.ladepark.make(b, lod, true) };

// =================================================================================================================
// 9. Picknickgruppe: Tisch 1,8 m mit zwei Bänken, alles mindestens 0,1 m dick, Holz in zwei Tönen
// =================================================================================================================
defs.picknick = {
  kind: 'rest', far: true, tints: [0xffffff, 0xf2e6d6, 0xe8dcc8],
  make(b) {
    const { T, F } = b;
    T.box(0, 0.68, 0, 1.8, 0.1, 0.8, C.timber);
    for (const s of [-1, 1]) {
      T.box(0, 0.4, s * 0.62, 1.8, 0.1, 0.3, C.timber);
      for (const x of [-0.65, 0.65]) {
        F.rod([x, 0, s * 0.72], [x, 0.7, 0], 0.05, C.timberDark, { seg: 4 });
        F.box(x, 0.3, 0, 0.1, 0.1, 1.5, C.timberDark);
      }
    }
    return { w: 1.8, d: 1.6, h: 0.78, centre: true };
  },
};

// =================================================================================================================
// 10. Boden einer Rastanlage (aus planRest in layout.js): Rasen in breiten Mähstreifen quer zur Fahrtrichtung, alle
// Fahr- und Gehflächen 2 cm darüber, Markierungen als Abziehbilder. Rasen liegt nur, wo keine Fläche liegt (keine
// zwei Böden übereinander, die in der Ferne flimmern könnten). g = { base: [x0, x1, z0, z1], lawn, pave, stripe, ramp,
// paved: [{ kind, x0, x1, z0, z1 }], holes: [{ x0, x1, z0, z1 }] (dort liegt ein eigener Boden), marks: [{ kind:
// 'line', x0, x1, z0, z1 } | { kind: 'arrow', x, z, ry }] }. Die Fläche 'road' (Zufahrt) sinkt an beiden Enden auf
// ramp Metern auf y = 0, wo die Straßen des Straßenbaus anschließen.
// =================================================================================================================
const GROUND_COL = { yard: C.yard, walk: mix(C.yard, 0xffffff, 0.3), road: PAL.asphalt, lawn: [mix(PAL.grass[1], PAL.grass[2], 0.3), mix(PAL.grass[1], PAL.grass[2], 0.55)] };
/** Zeichnet den Boden der Anlage in den Bau b (Eimer F für Flächen, G für Markierungen). */
export function restGround(b, g) {
  const { F, G } = b;
  const [x0, x1, z0, z1] = g.base;
  const solid = [...g.paved, ...g.holes];
  // Bänder entlang z: an jeder Streifengrenze und jeder Kante einer Fläche geschnitten
  const cuts = new Set([z0, z1]);
  for (let z = z1; z > z0; z -= g.stripe) cuts.add(z);
  for (const p of solid) for (const z of [p.z0, p.z1]) if (z > z0 && z < z1) cuts.add(z);
  const zs = [...cuts].sort((a, c) => c - a);
  for (let i = 0; i < zs.length - 1; i++) {
    const za = zs[i];
    const zb = zs[i + 1];
    const zm = (za + zb) / 2;
    const col = GROUND_COL.lawn[Math.floor((z1 - zm) / g.stripe) % 2];
    // freie Stücke des Bands zwischen den Flächen, die es ganz überdecken
    const cover = solid.filter((p) => p.z0 <= zb + 1e-6 && p.z1 >= za - 1e-6).map((p) => [Math.max(x0, p.x0), Math.min(x1, p.x1)]).sort((a, c) => a[0] - c[0]);
    let x = x0;
    for (const [a, c] of [...cover, [x1, x1]]) {
      if (a > x + 1e-6) flat(F, x, zb, a, za, g.lawn, col);
      x = Math.max(x, c);
    }
  }
  // Rand des Rasens bis zum Gelände
  const edge = mix(GROUND_COL.lawn[1], PAL.earth, 0.4);
  F.quad([x0, 0, z1], [x1, 0, z1], [x1, g.lawn, z1], [x0, g.lawn, z1], edge);
  F.quad([x1, 0, z0], [x0, 0, z0], [x0, g.lawn, z0], [x1, g.lawn, z0], edge);
  F.quad([x0, 0, z0], [x0, 0, z1], [x0, g.lawn, z1], [x0, g.lawn, z0], edge);
  F.quad([x1, 0, z1], [x1, 0, z0], [x1, g.lawn, z0], [x1, g.lawn, z1], edge);
  // Flächen: Platte mit Seiten bis zum Rasen; die Zufahrt mit Rampen an den Enden (dort ohne Stirnseite)
  for (const p of g.paved) {
    const col = GROUND_COL[p.kind] ?? C.yard;
    if (p.kind !== 'road') {
      F.box((p.x0 + p.x1) / 2, g.lawn, (p.z0 + p.z1) / 2, p.x1 - p.x0, g.pave - g.lawn, p.z1 - p.z0, col, { skip: 'b', k: 1 });
      continue;
    }
    const r = g.ramp;
    const ys = [[p.z1, 0], [p.z1 - r, g.pave], [p.z0 + r, g.pave], [p.z0, 0]];
    for (let i = 0; i < 3; i++) {
      const [za, ya] = ys[i];
      const [zb, yb] = ys[i + 1];
      F.quad([p.x0, ya, za], [p.x1, ya, za], [p.x1, yb, zb], [p.x0, yb, zb], col, { flat: true });
      // Seitenwände nur, wo die Fläche über dem Rasen liegt
      if (ya > g.lawn || yb > g.lawn) for (const [xa, sgn] of [[p.x0, -1], [p.x1, 1]]) {
        const q = [[xa, 0, za], [xa, 0, zb], [xa, yb, zb], [xa, ya, za]];
        F.poly(sgn > 0 ? q.reverse() : q, col, { k: 0.8 });
      }
    }
  }
  // Markierungen knapp über den Flächen (Abziehbilder mit polygonOffset)
  const y = g.pave + 0.004;
  for (const m of g.marks) {
    if (m.kind === 'line') flat(G, m.x0, m.z0, m.x1, m.z1, y, C.white);
    else if (m.kind === 'arrow') b.at(m.x, 0, m.z, m.ry ?? 0, () => {
      // Pfeil in −z (Fahrtrichtung): Schaft 0,3 × 3,2 m, Spitze 1,2 m breit
      flat(G, -0.15, -1.6, 0.15, 1.6, y, C.white);
      G.poly([[0, y, -3.0], [-0.6, y, -1.6], [0.6, y, -1.6]], C.white, { flat: true });
    });
  }
}
defs.rest_ground = {
  kind: 'ground', info: { w: REST_W, d: REST_D, h: 0.05 },
  build(kit, o = {}) {
    const b = new Bau({ fade: 0.2, low: 1 });
    restGround(b, o.ground);
    const [x0, x1, z0, z1] = o.ground.base;
    const group = compose(kit.core, [{ g: b.done({}) }]);
    group.userData.info = { w: x1 - x0, d: z1 - z0, h: o.ground.pave };
    return group;
  },
};

export function createRestKit(F) {
  return makeKit(F, defs);
}
