// Stadt-Baukasten, Teil Wahrzeichen im Ausland und weitere Sammelsätze. Dieselben Regeln wie in landmarks.js:
// liebevoll vereinfachte Spielzeugfassungen, die man aus dem Auto in einer Sekunde erkennt (Umriss, zwei, drei
// Merkmale, Farben), Ursprung in der Mitte der Vorderkante, Schauseite nach +z, höchstens vier Draw Calls je Stück,
// jedes mit Fernfassung. Sakralbauten und Denkmäler erscheinen neutral als Architektur; keine Marken, keine Logos.
// landmarks.js reicht seine Werkzeuge herein (registerAbroad), damit beide Dateien dieselben Bausteine teilen.
import { PAL, CITY, mix, textPanel, fitFont } from './citycore.js';
import { arch } from './town.js';
import { ballTree } from './parts.js';

const TAU = Math.PI * 2;

/** Weicher Übergang 0 … 1 zwischen a und c. */
const ss = (a, c, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (c - a)));
  return t * t * (3 - 2 * t);
};

/** fn(Breite, Seite) auf den vier Seiten eines Körpers w × d um die Mitte (cx, cz); Wandebene z = 0 schaut nach außen. */
function around(b, cx, cz, w, d, fn, which = 'frkl') {
  b.at(cx, 0, cz + d / 2, 0, () => b.sides(w, d, fn, which));
}

export function registerAbroad(T) {
  const { landmark, loft, prism, spire, bands, slots, chamfer, rrect, ngon, circle, terrain, gridLines, mottle, dial, galleryMill, millSails, gothicSpire, pinnacle, lancet, merlons, castleHouse, roundTower, antenna } = T;

  // ===========================================================================================================
  // Gittertürme: Eiffelturm und Tokio-Turm teilen sich die Beine
  // ===========================================================================================================
  /**
   * Vier Beine, die nach der Kurve hw(y) (halbe Außenbreite) zusammenlaufen, Beinstärke sw(y), Ringe bei ys.
   * col: Farbe oder Funktion (y0, y1) → Farbe je Band. o.braces: Andreaskreuze vor den Außenseiten (Farbe), o.top:
   * Beine oben schließen.
   */
  function latticeLegs(b, ys, hw, sw, col, o = {}) {
    const { F } = b;
    const near = !b.lod;
    const cols = ys.slice(1).map((y, i) => (typeof col === 'function' ? col(ys[i], y) : col));
    for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
      const rings = ys.map((y) => {
        const h = hw(y);
        const s = sw(y);
        return [[[sx * h, sz * h], [sx * (h - s), sz * h], [sx * (h - s), sz * (h - s)], [sx * h, sz * (h - s)]], y];
      });
      loft(F, rings, cols, { smooth: 0.95, top: o.top !== false });
      if (!near || !o.braces) continue;
      // Andreaskreuze auf beiden Außenseiten: lesen sich als Gitterwerk, ohne es Stab für Stab zu bauen
      const e = o.braceOut ?? 0.22;
      for (let i = 0; i + 1 < ys.length; i++) {
        const y0 = ys[i];
        const y1 = ys[i + 1];
        if (o.braceFrom !== undefined && y0 < o.braceFrom) continue;
        if (o.braceTo !== undefined && y1 > o.braceTo + 1e-6) continue;
        const h0 = hw(y0);
        const h1 = hw(y1);
        const s0 = sw(y0);
        const s1 = sw(y1);
        const r = Math.max(0.16, Math.min(0.45, (s0 + s1) * 0.035));
        F.rod([sx * (h0 + e), y0, sz * (h0 - s0)], [sx * (h1 + e), y1, sz * h1], r, o.braces, { seg: 4 });
        F.rod([sx * (h0 + e), y0, sz * h0], [sx * (h1 + e), y1, sz * (h1 - s1)], r, o.braces, { seg: 4 });
        F.rod([sx * (h0 - s0), y0, sz * (h0 + e)], [sx * h1, y1, sz * (h1 + e)], r, o.braces, { seg: 4 });
        F.rod([sx * h0, y0, sz * (h0 + e)], [sx * (h1 - s1), y1, sz * (h1 + e)], r, o.braces, { seg: 4 });
      }
    }
  }

  /** Waagrechter Rahmen aus vier Stäben zwischen den Beinen in Höhe y (Gitterturm). */
  function legFrame(b, y, h, r, col) {
    const c = [[h, h], [-h, h], [-h, -h], [h, -h]];
    for (let i = 0; i < 4; i++) {
      const [x0, z0] = c[i];
      const [x1, z1] = c[(i + 1) % 4];
      b.F.rod([x0, y, z0], [x1, y, z1], r, col, { seg: 4 });
    }
  }

  // --- Paris: Eiffelturm (324 m) im Maßstab 0,8, Marsfeld davor ---------------------------------------------------
  const EIF = { iron: 0x93715a, rib: 0xb08d70, deck: 0x7d604c, glass: 0x9bb8c8, sand: 0xdccaa6, lawn: 0x92c066, path: 0xe9dcbe, gold: 0xe6c25a };
  landmark('eiffelturm', { places: ['Paris'], slot: 'skyline', far: true, title: 'Eiffelturm' }, (b) => {
    const { F, G, L } = b;
    const near = !b.lod;
    const C = EIF;
    const cz = -72;
    // Platz unter dem Turm, Marsfeld mit Wegen nach vorn
    F.box(0, 0, cz, 118, 0.1, 118, C.sand, { skip: 'b' });
    for (const s of [-1, 1]) F.box(s * 30, 0, -6.5, 52, 0.12, 13, C.lawn, { skip: 'b' });
    F.box(0, 0, -6.5, 8, 0.11, 13, C.path, { skip: 'b' });
    if (near) for (const s of [-1, 1]) for (let i = 0; i < 4; i++) ballTree(b, s * (8 + i * 14), 0.1, -1.2, 1.6, 5.2, PAL.crown[i % 2]);
    b.at(0, 0, cz, 0, () => {
      const hw = (y) => 3.5 + 46.5 * Math.exp(-y / 70);
      const swLow = (y) => 4 + 16 * Math.exp(-y / 45);
      const s2 = swLow(92.6);
      const sw = (y) => (y <= 92.6 ? swLow(y) : s2 * Math.pow(hw(y) / hw(92.6), 0.8));
      const low = near ? [0, 9, 18, 27, 36, 46, 58, 70, 81, 92.6] : [0, 23, 46, 70, 92.6];
      const up = near ? [92.6, 112, 132, 152, 172, 196, 221] : [92.6, 132, 172, 221];
      latticeLegs(b, low, hw, sw, (y0) => mix(C.iron, C.rib, y0 / 300), { braces: C.rib, braceTo: 92.6 });
      latticeLegs(b, up, hw, sw, (y0) => mix(C.iron, C.rib, y0 / 300), { braces: C.rib, braceOut: 0.14 });
      if (near) for (const y of [132, 172, 196]) legFrame(b, y, hw(y) - sw(y) / 2, 0.35, C.rib);
      // Bögen zwischen den Beinen unter der ersten Etage: Doppelbogen mit Streben, folgt der Neigung der Seite
      for (let k = 0; k < 4; k++) {
        b.at(0, 0, 0, (k * Math.PI) / 2, () => {
          const n = near ? 18 : 10;
          const xs = hw(8) - swLow(8) * 0.75;
          let p0 = null;
          let q0 = null;
          for (let i = 0; i <= n; i++) {
            const a = (i / n) * Math.PI;
            const y = 8 + Math.sin(a) * 34;
            const x = -Math.cos(a) * xs * (1 - 0.18 * Math.sin(a));
            const z = hw(y) - swLow(y) * 0.45;
            const p = [x, y, z];
            const yi = 8 + Math.sin(a) * 30.5;
            const q = [x * 0.93, yi, hw(yi) - swLow(yi) * 0.45];
            if (p0) F.rod(p0, p, near ? 0.75 : 1.0, C.rib, { seg: near ? 5 : 4 });
            if (near && q0) F.rod(q0, q, 0.45, C.rib, { seg: 4 });
            if (near && i % 3 === 0 && i > 0 && i < n) F.rod(p, q, 0.3, C.rib, { seg: 4 });
            p0 = p;
            q0 = q;
          }
        });
      }
      // Erste Etage: Rahmen um den offenen Schacht (vorn/hinten ganz, Seiten dazwischen), Brüstung, Glaspavillons
      const f1 = 30;
      const in1 = 17;
      for (const s of [-1, 1]) {
        F.box(0, 42.5, s * (f1 + in1) / 2, 2 * f1, 4.5, f1 - in1, C.deck, { g: [0.85, 1] });
        F.box(s * (f1 + in1) / 2, 42.5, 0, f1 - in1, 4.5, 2 * in1, C.deck, { g: [0.85, 1] });
      }
      if (near) {
        for (let k = 0; k < 4; k++) {
          b.at(0, 0, 0, (k * Math.PI) / 2, () => {
            F.box(0, 47, f1 - 0.2, 2 * f1 - 0.9, 1.0, 0.4, C.rib);
            for (let i = 0; i < 4; i++) G.box(-15 + i * 10, 47, f1 - 6, 6, 2.6, 4, C.glass, { skip: 'b' });
          });
        }
      }
      // Zweite Etage: geschlossene Plattform mit Brüstung und Pavillon
      F.box(0, 89.5, 0, 36, 3.6, 36, C.deck, { g: [0.85, 1] });
      if (near) {
        for (let k = 0; k < 4; k++) b.at(0, 0, 0, (k * Math.PI) / 2, () => F.box(0, 93.1, 17.8, 35.1, 0.9, 0.4, C.rib));
        G.box(0, 93.1, 0, 14, 3.2, 14, C.glass);
        F.box(0, 96.3, 0, 15, 0.5, 15, C.deck);
      }
      // Dritte Etage mit Fensterband, darüber Laterne, Kuppel und Mast
      F.box(0, 218, 0, 14, 1.2, 14, C.deck);
      G.box(0, 219.2, 0, 11.6, 3.6, 11.6, C.glass);
      F.box(0, 222.8, 0, 13, 1.0, 13, C.deck);
      F.box(0, 223.8, 0, 7, 7, 7, C.iron, { g: [0.9, 1.05] });
      F.lathe(0, 230.8, 0, [[4.4, 0], [3.6, 2.2], [1.6, 4.4], [0.9, 5.4]], C.deck, { seg: near ? 12 : 8 });
      F.cyl(0, 236.2, 0, 0.8, 0.45, 20, C.rib, { seg: 6 });
      if (L) L.ball(0, 256.6, 0, 0.7, 0xff6a50, { ws: 6, hs: 3 });
    });
    return { w: 118, d: 132, h: 257 };
  });

  // --- Tokio: rot-weißer Gitterturm (333 m, Maßstab 0,72) und eine Pagode mit fünf Dächern ---------------------------
  const TOK = { orange: 0xe2582e, white: 0xf2efe9, base: 0xeee9df, glass: 0x8fb2c6, roof: 0x575f63, wood: 0xc6533b, stone: 0xcfc6b6, bronze: 0xb48a4a, lawn: 0x9cc46c, plaza: 0xd8d2c6 };
  /** Pagode (fünf Geschosse) um (x, z): schlichte Holzgeschosse mit weiten, an den Ecken leicht gehobenen Dächern. */
  function pagoda(b, x, z, s = 1) {
    const { F, G } = b;
    const near = !b.lod;
    const C = TOK;
    b.xf([x, 0, z], [0, 0, 0], s, () => {
      F.box(0, 0, 0, 13, 1.2, 13, C.stone, { g: [0.85, 1] });
      let y = 1.2;
      for (let i = 0; i < 5; i++) {
        const w = 8.4 - i * 0.9;
        F.box(0, y, 0, w, 3.0, w, C.wood, { g: [0.86, 1.02] });
        if (near) for (let k = 0; k < 4; k++) b.at(0, 0, 0, (k * Math.PI) / 2, () => G.rect(0, y + 0.5, w / 2 + 0.02, w * 0.36, 2.0, 0x6a3b2c));
        y += 3.0;
        // Dach: weite flache Pyramide mit dicker Traufe, Ecken etwas gehoben; Untersicht folgt der Traufe
        const e = w / 2 + 2.4;
        const t = 0.35;
        const lift = near ? 0.55 : 0.35;
        const ye = y + 0.3;
        const yt = y + 1.6;
        const r1 = w / 2 - 0.6;
        const cs = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
        const eave = cs.map(([px, pz]) => [px * e, ye + lift, pz * e]);
        const ridge = cs.map(([px, pz]) => [px * r1, yt, pz * r1]);
        const low = (p) => [p[0], p[1] - t, p[2]];
        const under = mix(0xe8dccb, C.wood, 0.2);
        for (let k = 0; k < 4; k++) {
          const a = eave[k];
          const c2 = eave[(k + 1) % 4];
          const mid = [(a[0] + c2[0]) / 2, ye, (a[2] + c2[2]) / 2];
          const h2 = ridge[k];
          const d2 = ridge[(k + 1) % 4];
          const hm = [(h2[0] + d2[0]) / 2, yt, (h2[2] + d2[2]) / 2];
          F.quad(mid, a, h2, hm, C.roof, { g: [0.85, 1.05] });
          F.quad(c2, mid, hm, d2, C.roof, { g: [0.85, 1.05] });
          F.quad(low(mid), low(a), a, mid, mix(C.roof, 0x000000, 0.15));
          F.quad(low(c2), low(mid), mid, c2, mix(C.roof, 0x000000, 0.15));
          // Untersicht: von der Wandkrone zur Unterkante der Traufe, schaut nach unten
          const wc = [0, y, 0];
          F.tri(wc, low(a), low(mid), under);
          F.tri(wc, low(mid), low(c2), under);
        }
        y = yt;
      }
      F.box(0, y - 0.05, 0, 4.0, 0.8, 4.0, C.roof);
      F.cyl(0, y + 0.7, 0, 0.32, 0.22, 9, C.bronze, { seg: 6 });
      if (near) for (let i = 0; i < 9; i++) F.cyl(0, y + 1.8 + i * 0.75, 0, 0.75 - i * 0.03, 0.75 - i * 0.03, 0.18, C.bronze, { seg: 8 });
      F.ball(0, y + 9.9, 0, 0.45, C.bronze, { ws: 6, hs: 4 });
    });
  }
  landmark('tokioTurm', { places: ['Tokio', 'Osaka'], slot: 'skyline', far: true, title: 'Tokio-Turm' }, (b) => {
    const { F, G, L } = b;
    const near = !b.lod;
    const C = TOK;
    const cz = -48;
    F.box(0, 0, cz, 96, 0.1, 96, C.plaza, { skip: 'b' });
    F.box(-30, 0, -12, 36, 0.12, 24, C.lawn, { skip: 'b' });
    pagoda(b, -30, -12, 0.95);
    if (near) for (const [x, z] of [[-44, -4], [-16, -4], [-44, -20]]) ballTree(b, x, 0.12, z, 2.0, 5.6, PAL.crown[(x * z) & 1 ? 0 : 2]);
    b.at(0, 0, cz, 0, () => {
      const hw = (y) => 2.4 + 26.6 * Math.exp(-y / 68);
      const sw = (y) => 1.9 + 9.5 * Math.exp(-y / 38);
      // rot-weiß: unten Rot, über der Hauptplattform abwechselnd, die Spitze wieder rot
      const band = (y0) => (y0 < 100 ? (y0 >= 60 && y0 < 76 ? C.white : C.orange) : Math.floor((y0 - 100) / 13) % 2 ? C.white : C.orange);
      const ys = near ? [0, 10, 20, 30, 40, 50, 60, 76, 88, 100, 113, 126, 139, 152, 165, 178] : [0, 20, 40, 60, 76, 100, 126, 152, 178];
      latticeLegs(b, ys, hw, sw, band, { braces: C.white, braceOut: 0.16 });
      if (near) for (const y of [30, 50, 88, 139, 165]) legFrame(b, y, hw(y) - sw(y) / 2, 0.3, C.white);
      // Fuß: flaches Gebäude unter den Beinen
      F.box(0, 0, 0, 36, 12, 30, C.base, { g: [0.86, 1.02] });
      if (near) for (let k = 0; k < 4; k++) b.at(0, 0, 0, (k * Math.PI) / 2, () => { for (let r = 0; r < 3; r++) G.rect(0, 1.4 + r * 3.6, k % 2 ? 18.03 : 15.03, k % 2 ? 26 : 32, 1.4, C.glass); });
      // Hauptplattform (zwei Geschosse) und obere Plattform, Antenne
      F.box(0, 104, 0, 19, 2, 19, C.white);
      G.box(0, 106, 0, 18, 3.2, 18, C.glass);
      F.box(0, 109.2, 0, 19, 1.4, 19, C.white);
      G.box(0, 110.6, 0, 16, 2.8, 16, C.glass);
      F.box(0, 113.4, 0, 17, 1.2, 17, C.white);
      F.box(0, 176, 0, 9, 1.2, 9, C.white);
      G.box(0, 177.2, 0, 8, 3.0, 8, C.glass);
      F.box(0, 180.2, 0, 9, 1.0, 9, C.white);
      antenna(b, 181.2, 238, 1.4, 0.4, 6, [C.orange, C.white]);
      if (L) L.ball(0, 114.8, 0, 0.5, 0xffe2a0, { ws: 5, hs: 3 });
    });
    return { w: 96, d: 96, h: 239 };
  });

  // ===========================================================================================================
  // London: Uhrturm am Parlament, rote Telefonzelle, roter Doppeldecker
  // ===========================================================================================================
  const LON = { stone: 0xdcc69a, stoneDark: 0xc2aa7c, stoneLight: 0xeadbb8, slate: 0x5f6a7d, gold: 0xe2b84e, pane: 0x4b5767, dial: 0xf6f1e2, ink: 0x2f3338, red: 0xd2382e, redDark: 0xa82c25, asphalt: 0x7c8086, tyre: 0x34363b, glass: 0x8fb0c4 };
  /** Roter Doppeldecker, Mitte (x, z), Längsachse x, Front nach +x. */
  function busDD(b, x, z) {
    const { F, G } = b;
    const near = !b.lod;
    const C = LON;
    b.at(x, 0, z, Math.PI / 2, () => {
      F.rbox(0, 0.55, 0, 2.5, 4.0, 10.6, 0.45, C.red, { prof: [[0.08, 0], [0, 0.2], [0, 3.7], [0.12, 4.0]], ks: [0.8, 0.9, 1, 1.05], seg: 3 });
      for (const s of [-1, 1]) {
        b.at(s * 1.26, 0, 0, (s * Math.PI) / 2, () => {
          G.rect(0.6, 1.75, 0.02, 8.4, 0.95, C.glass);
          G.rect(0, 3.15, 0.02, 9.6, 0.95, C.glass);
          G.rect(0, 2.95, 0.02, 10.2, 0.08, C.stoneLight);
        });
      }
      b.at(0, 0, 5.3, 0, () => { G.rect(0, 1.7, 0.02, 2.0, 1.1, C.glass); G.rect(0, 3.15, 0.02, 2.0, 0.95, C.glass); G.rect(0, 1.0, 0.03, 1.2, 0.25, C.ink); });
      if (near) {
        for (const zz of [3.6, -3.4]) for (const s of [-1, 1]) {
          b.xf([s * 1.18, 0.55, zz], [0, 0, Math.PI / 2], 1, () => F.cyl(0, -0.15, 0, 0.55, 0.55, 0.3, C.tyre, { seg: 10 }));
        }
        for (const s of [-1, 1]) F.ball(s * 0.85, 1.05, 5.33, 0.17, 0xfff2c4, { ws: 6, hs: 3 });
      }
    });
  }
  /** Rote Telefonzelle mit Kuppeldach, Fuß bei (x, z). */
  function phoneBoxUK(b, x, z, ry = 0) {
    const { F, G } = b;
    const C = LON;
    b.at(x, 0, z, ry, () => {
      F.box(0, 0, 0, 1.1, 0.2, 1.1, C.redDark);
      F.box(0, 0.2, 0, 0.98, 2.3, 0.98, C.red, { g: [0.9, 1.05] });
      F.box(0, 2.5, 0, 1.06, 0.26, 1.06, C.red);
      F.ball(0, 2.76, 0, 0.53, C.red, { lat: [0, Math.PI / 2], sy: 0.45, ws: 8, hs: 3 });
      if (b.lod) return;
      for (let k = 0; k < 4; k++) {
        b.at(0, 0, 0, (k * Math.PI) / 2, () => {
          for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) G.rect(-0.18 + c * 0.36, 0.75 + r * 0.38, 0.5, 0.3, 0.32, C.glass);
          G.rect(0, 2.52, 0.54, 0.7, 0.16, 0xf4f0e6);
        });
      }
    });
  }
  landmark('bigBen', { places: ['London'], slot: 'square', title: 'Uhrturm' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = LON;
    // Straße vor dem Parlament mit dem Doppeldecker, Gehweg, dann Parlamentsflügel und Turm
    F.box(0, 0, -2.3, 50, 0.1, 4.6, C.asphalt, { skip: 'b' });
    F.box(0, 0, -6.3, 50, 0.14, 3.4, 0xd9d4c8, { skip: 'b' });
    busDD(b, -6, -2.3);
    phoneBoxUK(b, -21.5, -6.4, 0);
    // Parlamentsflügel: lange gotische Front mit Strebepfeilern, Spitzbogenfenstern, Brüstung mit Fialen
    const wx0 = -24;
    const wx1 = 10.5;
    const wz = -8;
    const wd = 15;
    const wh = 17;
    F.box((wx0 + wx1) / 2, 0, wz - wd / 2, wx1 - wx0, wh, wd, C.stone, { g: [0.86, 1.03] });
    F.box((wx0 + wx1) / 2, wh, wz - wd / 2 - 1.5, wx1 - wx0 - 2, 3.2, wd - 4, C.slate);
    b.at((wx0 + wx1) / 2, 0, wz, 0, () => {
      const n = 9;
      const step = (wx1 - wx0) / n;
      for (let i = 0; i <= n; i++) {
        const x = -(wx1 - wx0) / 2 + i * step;
        F.box(x, 0, 0.25, 0.9, wh + 0.4, 0.5, C.stoneLight, { skip: 'k' });
        if (near) pinnacle(b, x, 0.25, wh + 0.4, wh + 1.6, 0.8, 1.6, C.stoneLight);
      }
      for (let i = 0; i < n; i++) {
        const x = -(wx1 - wx0) / 2 + (i + 0.5) * step;
        for (const y of [2.2, 7.4, 12.4]) lancet(b, x, y, 1.5, 3.4, C.pane);
      }
      F.box(0, wh - 0.2, 0.12, wx1 - wx0, 0.8, 0.3, C.stoneLight);
    });
    // Uhrturm (96 m, Maßstab 0,85): Schaft mit Lisenen, Uhrgeschoss mit vier Zifferblättern, Glockenstube, Helm
    const tx = 15;
    const tz = -15;
    const s = 10;
    F.box(tx, 0, tz, s + 1.2, 2.6, s + 1.2, C.stoneDark);
    F.box(tx, 2.6, tz, s, 44, s, C.stone, { g: [0.86, 1.04] });
    F.box(tx, 46.6, tz, s + 1.4, 1.0, s + 1.4, C.stoneLight);
    F.box(tx, 47.6, tz, s + 1.0, 9.6, s + 1.0, C.stone, { g: [0.95, 1.05] });
    F.box(tx, 57.2, tz, s + 1.4, 0.9, s + 1.4, C.stoneLight);
    F.box(tx, 58.1, tz, s, 6.4, s, C.stone);
    F.box(tx, 64.5, tz, s + 0.8, 0.8, s + 0.8, C.gold);
    for (let k = 0; k < 4; k++) {
      b.at(tx, 0, tz, (k * Math.PI) / 2, () => {
        // Lisenen und schmale Fensterbahnen am Schaft
        for (const x of [-s / 2 + 0.45, -s / 6, s / 6, s / 2 - 0.45]) F.box(x, 2.6, s / 2 + 0.15, 0.7, 44, 0.3, C.stoneLight, { skip: 'kb' });
        for (const x of [-s / 3, 0, s / 3]) {
          G.rect(x, 5, s / 2 + 0.02, 1.0, 39, C.stoneDark);
          if (near) for (let y = 8; y < 44; y += 5.5) G.rect(x, y, s / 2 + 0.04, 0.8, 2.6, C.pane);
        }
        // Zifferblatt mit goldenem Rahmen
        b.at(0, 0, s / 2 + 0.5, 0, () => {
          G.rect(0, 47.9, 0.05, s, 9.0, C.gold);
          G.rect(0, 48.2, 0.08, s - 0.6, 8.4, C.stoneLight);
          dial(b, 0, 52.4, 3.6, C.dial);
        });
        // Glockenstube: drei Spitzbogenöffnungen
        b.at(0, 0, s / 2, 0, () => { for (const x of [-3, 0, 3]) lancet(b, x, 58.8, 2.1, 4.8, C.ink); });
        // Helm: steile Pyramide mit Gauben und vier Ecktürmchen
        if (near) pinnacle(b, s / 2 - 0.5, s / 2 - 0.5, 65.3, 67.4, 1.0, 3.6, C.gold);
      });
    }
    spire(F, chamfer(s + 0.2, s + 0.2, 1.2, tx, tz), 65.3, 79.5, C.slate, { ax: tx, az: tz, g: [0.88, 1.1] });
    F.cyl(tx, 79.3, tz, 0.35, 0.12, 3.6, C.gold, { seg: 6 });
    F.ball(tx, 83, tz, 0.4, C.gold, { ws: 6, hs: 4 });
    return { w: 50, d: 24, h: 83.5 };
  });

  // ===========================================================================================================
  // Amsterdam: Gracht mit Giebelhäusern, Brücke und Hausboot · Holländermühle für die Niederlande
  // ===========================================================================================================
  const AMS = { water: 0x6fa9c2, quay: 0x8e8478, cobble: 0xb7a996, street: 0xa29a90, bridge: 0x9b5b47, white: 0xf5f1e8, pane: 0x47525e, boat: 0x3f6b55, boatTop: 0xe9e2d2 };
  const GRACHT = [
    { w: 6.0, h: 16, col: 0x7c3d2f, gable: 'bell' },
    { w: 5.2, h: 18, col: 0x3b3937, gable: 'step' },
    { w: 6.6, h: 15, col: 0xece6da, gable: 'neck' },
    { w: 5.4, h: 17.5, col: 0xa4462f, gable: 'step' },
    { w: 6.2, h: 16.5, col: 0x2f4b40, gable: 'bell' },
    { w: 5.6, h: 15.5, col: 0x6e7f8f, gable: 'spout' },
    { w: 6.4, h: 17, col: 0x8a4a36, gable: 'neck' },
  ];
  /** Giebelumriss (Breite w, Fuß y0, Höhe gh) nach Art: Glocke, Treppe, Hals, Tüte. */
  function gableOutline(kind, w, y0, gh) {
    const r = w / 2;
    if (kind === 'step') {
      const pts = [[-r, y0]];
      const n = 4;
      for (let i = 0; i < n; i++) {
        const x = -r + (i * r * 0.78) / n;
        pts.push([x, y0 + (i * gh) / n], [x, y0 + ((i + 1) * gh) / n]);
      }
      pts.push([-r * 0.22, y0 + gh], [r * 0.22, y0 + gh]);
      for (let i = n - 1; i >= 0; i--) {
        const x = r - (i * r * 0.78) / n;
        pts.push([x, y0 + ((i + 1) * gh) / n], [x, y0 + (i * gh) / n]);
      }
      pts.push([r, y0]);
      return pts.filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1e-6);
    }
    if (kind === 'bell' || kind === 'neck') {
      const pts = [[-r, y0]];
      const n = 7;
      const neck = kind === 'neck' ? 0.36 : 0.42;
      // Schultern: geschwungen (Glocke) bzw. Viertelkreis mit geradem Hals
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        const q = (t * Math.PI) / 2;
        const x = -r + (r - r * neck) * (kind === 'bell' ? 1 - Math.cos(q) : Math.sin(q));
        const y = y0 + gh * 0.55 * (kind === 'bell' ? Math.sin(q) : 1 - Math.cos(q));
        pts.push([x, y]);
      }
      for (let i = 0; i <= 6; i++) {
        const a = Math.PI - (i / 6) * Math.PI;
        pts.push([Math.cos(a) * r * neck, y0 + gh * 0.84 + Math.sin(a) * gh * 0.16]);
      }
      for (let i = n; i >= 1; i--) {
        const p = pts[i];
        pts.push([-p[0], p[1]]);
      }
      pts.push([r, y0]);
      return pts;
    }
    // Tütengiebel: einfache Spitze mit kleinem Knick
    return [[-r, y0], [-r * 0.72, y0 + gh * 0.4], [0, y0 + gh], [r * 0.72, y0 + gh * 0.4], [r, y0]];
  }
  /** Grachtenhaus: Front bei z = 0 (um x), schmal und hoch, Giebel, Fensterraster in Weiß, Hissbalken. */
  function canalHouse(b, x, z, o, y0 = 0) {
    const { F, G } = b;
    const near = !b.lod;
    const C = AMS;
    const { w, h, col, gable } = o;
    const d = 11;
    const gh = Math.min(5.2, w * 0.85);
    b.at(x, y0, z, 0, () => {
      F.box(0, 0, -d / 2, w, h, d, col, { g: [0.82, 1.04] });
      F.extrude(gableOutline(gable, w, h, gh), -2.4, 0, col, { g: [0.95, 1.06] });
      b.gable(0, h, -d / 2 - 1.2, w - 0.4, d - 2.4, gh * 0.75, 0x5c5652, { axis: 'z', oe: 0.1, og: 0.1, ridge: false });
      // weiße Gesimsleisten unter dem Giebel und am Giebelrand
      F.box(0, h - 0.25, 0.08, w + 0.2, 0.32, 0.25, C.white);
      const storeys = Math.floor((h - 1.0) / 3.4);
      const cols = w > 5.8 ? 3 : 2;
      for (let r = 0; r < storeys; r++) {
        const y = 1.0 + r * 3.4 + (r === 0 ? 0.2 : 0.6);
        for (let c = 0; c < cols; c++) {
          const wx = -w / 2 + (w / cols) * (c + 0.5);
          if (r === 0 && c === Math.floor(cols / 2)) {
            G.rect(wx, 0.6, 0.03, 1.1, 2.4, 0x3d4a3f);
            G.rect(wx, 3.05, 0.03, 1.1, 0.5, C.pane);
            if (near) F.box(wx, 0, 0.5, 1.6, 0.6, 1.0, C.cobble);
            continue;
          }
          G.rect(wx, y - 0.1, 0.02, 1.25, 2.3, C.white);
          G.rect(wx, y, 0.04, 1.05, 2.1, C.pane);
          if (near) G.rect(wx, y + 1.25, 0.05, 1.05, 0.08, C.white);
        }
      }
      // Fenster im Giebel und Hissbalken
      G.rect(0, h + gh * 0.28, 0.03, 0.9, 1.4, C.white);
      G.rect(0, h + gh * 0.28 + 0.1, 0.05, 0.7, 1.2, C.pane);
      if (near) F.box(0, h + gh * 0.62, 0.45, 0.22, 0.22, 0.9, 0x4a3a30);
    });
  }
  landmark('grachten', { places: ['Amsterdam'], slot: 'square', title: 'Grachten' }, (b) => {
    const { F, G, W } = b;
    const near = !b.lod;
    const C = AMS;
    // Kai vorn (mit Bäumen und Fahrrädern), Gracht, Grachtstraße hinten mit der Häuserzeile; Wasser 0,6 m unter dem Kai
    const QY = 0.75;
    const WY = 0.15;
    const z1 = -3.4;
    const z2 = -9.0;
    F.box(0, 0, z1 / 2, 46, QY, -z1, C.cobble, { g: [0.85, 1] });
    F.box(0, 0, (z2 - 12.6) / 2, 46, QY, 12.6 - z2, C.street, { g: [0.85, 1] });
    W.poolRect(0, WY, (z1 + z2) / 2, 46, z1 - z2, C.water, { rings: 0.08 });
    for (const zq of [z1 + 0.2, z2 - 0.2]) F.box(0, QY, zq, 46, 0.18, 0.4, C.quay);
    // Bogenbrücke aus Backstein über die Gracht, weiße Geländer
    b.at(-12, 0, (z1 + z2) / 2, Math.PI / 2, () => {
      const hl = (z1 - z2) / 2 + 1.4;
      F.extrude([[-hl, 0], [hl, 0], [hl, QY + 0.2], [2, QY + 0.75], [-2, QY + 0.75], [-hl, QY + 0.2]], -2.4, 2.4, C.bridge, { g: [0.85, 1] });
      F.extrude(arch(0, 3.4, 0, QY - 0.05, near ? 8 : 5), -2.43, 2.43, mix(C.bridge, 0x000000, 0.4), { caps: 'fb', sides: false });
      if (near) {
        for (const sz of [-1, 1]) {
          const rail = [[-hl + 0.3, QY + 0.95, QY + 0.22], [-2, QY + 1.5, QY + 0.75], [2, QY + 1.5, QY + 0.75], [hl - 0.3, QY + 0.95, QY + 0.22]];
          for (let i = 0; i + 1 < rail.length; i++) F.rod([rail[i][0], rail[i][1], sz * 2.25], [rail[i + 1][0], rail[i + 1][1], sz * 2.25], 0.07, C.white, { seg: 4 });
          for (const [px, py, pd] of rail) F.rod([px, pd, sz * 2.25], [px, py, sz * 2.25], 0.07, C.white, { seg: 4 });
        }
      }
    });
    // Hausboot auf der Gracht
    b.at(9, 0, (z1 + z2) / 2 - 0.2, 0, () => {
      F.rbox(0, WY - 0.3, 0, 10, 0.9, 3.0, 0.6, C.boat, { seg: 2 });
      F.box(-0.6, WY + 0.6, 0, 6.5, 1.8, 2.4, C.boatTop, { g: [0.9, 1.05] });
      F.box(-0.6, WY + 2.4, 0, 7.0, 0.22, 2.8, C.boat);
      if (near) for (let i = 0; i < 4; i++) G.rect(-3.3 + i * 1.8, WY + 1.1, 1.22, 1.0, 0.75, C.pane);
      if (near) for (let i = 0; i < 3; i++) F.ball(-2.5 + i * 1.9, WY + 2.85, 1.15, 0.28, [PAL.red, PAL.signYellow, 0xf4a6c0][i], { ws: 6, hs: 3 });
    });
    // Häuserzeile auf der Grachtstraße
    let x = -23;
    for (const o of GRACHT) {
      canalHouse(b, x + o.w / 2, -12.6, o, QY);
      x += o.w + 0.02;
    }
    // Bäume am Kai, Fahrräder davor
    if (near) {
      for (const tx of [-19, 2, 19]) ballTree(b, tx, QY, -1.9, 1.7, 6.2, PAL.crown[1]);
      [0x3a5f8f, 0x8f3a3a, 0x3a3a3a, 0xe0c060].forEach((c2, i) => {
        b.at(-6 + i * 1.1, QY, -2.6, 0.25, () => {
          for (const sx of [-0.5, 0.5]) b.xf([sx, 0.34, 0], [0, Math.PI / 2, 0], 1, () => F.torus(0, 0, 0, 0.32, 0.035, 0x2f3236, { seg: 10, tube: 3 }));
          F.rod([-0.5, 0.34, 0], [0.05, 0.75, 0], 0.03, c2, { seg: 4 });
          F.rod([0.5, 0.34, 0], [0.05, 0.75, 0], 0.03, c2, { seg: 4 });
          F.rod([0.05, 0.75, 0], [0.45, 0.95, 0], 0.03, c2, { seg: 4 });
        });
      });
    }
    return { w: 46, d: 23.6, h: 23.5 };
  });

  landmark('hollaenderMuehle', {
    places: ['Enschede', 'Rotterdam', 'Arnhem', 'Dinxperlo'], slot: 'skyline', title: 'Windmühle',
    spins: [{ at: [0, 15.9, -16 + 3.4], speed: 0.3, make: (b) => millSails(b, 10) }],
  }, (b) => {
    const { F, W } = b;
    const near = !b.lod;
    // Deich mit Wiese, Graben mit Wasser davor, Mühle obenauf, Kopfweiden
    F.box(0, 0, -16, 40, 0.1, 32, mix(PAL.grass[0], PAL.grass[1], 0.4), { skip: 'b' });
    W.poolRect(0, 0.14, -4, 40, 3.2, 0x7cb6cf, { rings: 0.1 });
    F.box(0, 0, -2.25, 40, 0.18, 0.3, 0x8a9a6a);
    F.box(0, 0, -5.75, 40, 0.18, 0.3, 0x8a9a6a);
    galleryMill(b, 0, -16);
    if (near) for (const [x, z] of [[-14, -10], [-9, -24], [13, -12], [16, -24]]) ballTree(b, x, 0.1, z, 1.7, 4.8, PAL.crown[(x > 0) | 0]);
    return { w: 40, d: 32, h: 26 };
  });

  // ===========================================================================================================
  // Wien: Riesenrad im Prater, Stephansdom mit dem Zickzack-Dach
  // ===========================================================================================================
  const WIEN = { steel: 0x9aa0a6, steelDark: 0x6e747b, red: 0xc8392e, redDark: 0xa02e26, cream: 0xf3ebdc, ground: 0xcfc6b2, green: 0x8fbf63, stone: 0xbfb2a0, stoneDark: 0x9c8f7e, roofY: 0xe8c04a, roofG: 0x5f9a6a, roofK: 0x3c3f45, roofW: 0xf1ede2, pane: 0x4c5562, copper: 0x7fae98, gold: 0xe2b84e };
  landmark('riesenradWien', {
    places: ['Wien'], slot: 'skyline', far: true, title: 'Riesenrad',
    spins: [{
      at: [0, 33, -18], speed: TAU / 120, make: (b) => {
        const { F, G } = b;
        const near = !b.lod;
        const C = WIEN;
        const R = 28;
        const hw = 1.6;
        for (const z of [-hw, hw]) {
          b.xf([0, 0, z], [Math.PI / 2, 0, 0], 1, () => F.torus(0, 0, 0, R, near ? 0.35 : 0.55, C.steel, { seg: near ? 40 : 20, tube: near ? 4 : 3 }));
          b.xf([0, 0, z], [Math.PI / 2, 0, 0], 1, () => F.torus(0, 0, 0, R - 2.2, near ? 0.22 : 0.4, C.steel, { seg: near ? 40 : 20, tube: 3 }));
          const sp = near ? 30 : 15;
          for (let i = 0; i < sp; i++) {
            const a = (i / sp) * TAU;
            const a2 = a + (TAU / sp) * 3;
            F.rod([Math.cos(a) * 1.6, Math.sin(a) * 1.6, z], [Math.cos(a2) * (R - 2.2), Math.sin(a2) * (R - 2.2), z], near ? 0.08 : 0.15, C.steelDark, { seg: 3 });
          }
        }
        b.xf([0, 0, -3.6], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, 0, 0, 1.4, 1.4, 7.2, C.steelDark, { seg: 10, bottom: true }));
        // 15 rote Waggons (Kastenform), hängen an der Felge
        const n = 15;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * TAU;
          const x = Math.cos(a) * (R + 1.9);
          const y = Math.sin(a) * (R + 1.9);
          // Waggon als rote Trommel zwischen den Kränzen: sieht in jeder Lage des Rads gleich aus
          b.xf([x, y, -1.35], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, 0, 0, 1.45, 1.45, 2.7, C.red, { seg: near ? 12 : 8, bottom: true, g: [0.9, 1.05] }));
          // Fenster auf beiden Stirnseiten
          if (near) for (const s of [-1, 1]) b.xf([x, y, s * 1.37], [0, s > 0 ? 0 : Math.PI, 0], 1, () => G.disc(0, 0, 0, 1.0, C.cream, { seg: 10 }));
        }
      },
    }],
  }, (b) => {
    const { F } = b;
    const near = !b.lod;
    const C = WIEN;
    F.box(0, 0, -18, 80, 0.1, 40, C.ground, { skip: 'b' });
    F.box(-26, 0, -6, 24, 0.12, 10, C.green, { skip: 'b' });
    // Gestell: zwei hohe Böcke aus Stahl bis zur Achse (33 m), Querverbände
    for (const s of [-1, 1]) {
      const z = -18 + s * 3.4;
      for (const k of [-1, 1]) F.rod([k * 15, 0, z + s * 1.2], [0, 33, z], 0.55, C.steel, { seg: 6 });
      if (near) for (const y of [8, 17, 25]) F.rod([-15 * (1 - y / 33), y, z + s * 1.2 * (1 - y / 33)], [15 * (1 - y / 33), y, z + s * 1.2 * (1 - y / 33)], 0.22, C.steelDark, { seg: 4 });
    }
    // Kassenhäuschen am Fuß
    F.box(0, 0, -8, 9, 3.2, 4, C.cream, { g: [0.88, 1.03] });
    b.gable(0, 3.2, -8, 9, 4, 1.4, C.red, { axis: 'x', oe: 0.3, og: 0.3, ridge: near });
    if (near) for (const [x, z] of [[-34, -32], [30, -30], [-20, -34]]) ballTree(b, x, 0.1, z, 2.6, 7.4, PAL.crown[(x > 0) | 0]);
    return { w: 80, d: 40, h: 64 };
  });

  /** Dachfläche mit Zickzackband (Stephansdom): Rechteck a–b–c–d (a, b Traufe; d, c First) in nu × nv Feldern. */
  function chevronRoof(b, a, bq, c, d, nu, nv, cols, o = {}) {
    const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
    for (let j = 0; j < nv; j++) {
      for (let i = 0; i < nu; i++) {
        const u0 = i / nu;
        const u1 = (i + 1) / nu;
        const v0 = j / nv;
        const v1 = (j + 1) / nv;
        const p = (u, v) => lerp(lerp(a, bq, u), lerp(d, c, u), v);
        // Zickzack: Band nach der Höhe, quer verschoben um den Abstand zur nächsten Zacke
        const um = (u0 + u1) / 2;
        const zig = Math.abs(((um * (o.teeth ?? 6)) % 1) - 0.5) * 2;
        const band = Math.floor(((v0 + v1) / 2) * (o.bands ?? 5) + zig * 0.9);
        b.F.quad(p(u0, v0), p(u1, v0), p(u1, v1), p(u0, v1), cols[((band % cols.length) + cols.length) % cols.length], { g: [0.9, 1.04] });
      }
    }
  }
  landmark('stephansdom', { places: ['Wien'], slot: 'skyline', title: 'Stephansdom' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = WIEN;
    b.xf([0, 0, 0], [0, 0, 0], 0.62, () => {
      F.box(0, 0, -40, 120, 0.12, 80, 0xd4ccbe, { skip: 'b' });
      // Langhaus (quer zur Straße gesehen als lange Seite): Wände mit Strebepfeilern und Maßwerkfenstern
      const L0 = -48;
      const L1 = 40;
      const zc = -40;
      const wd = 34;
      const eh = 24;
      F.box((L0 + L1) / 2, 0, zc, L1 - L0, eh, wd, C.stone, { g: [0.82, 1.03] });
      for (const s of [-1, 1]) {
        b.at((L0 + L1) / 2, 0, zc + (s * wd) / 2, s > 0 ? 0 : Math.PI, () => {
          const n = 8;
          for (let i = 0; i <= n; i++) {
            const x = -(L1 - L0) / 2 + 2 + (i * (L1 - L0 - 4)) / n;
            F.box(x, 0, 0.8, 1.6, eh + 1.5, 1.6, C.stoneDark, { skip: 'k' });
            if (near) pinnacle(b, x, 0.8, eh + 1.5, eh + 3.5, 1.2, 3.2, C.stoneDark);
          }
          for (let i = 0; i < n; i++) lancet(b, -(L1 - L0) / 2 + 2 + ((i + 0.5) * (L1 - L0 - 4)) / n, 4, 3.4, 15, C.pane);
        });
      }
      // das steile Dach mit dem Zickzackband auf beiden Seiten
      const rh = 34;
      const cols = [C.roofY, C.roofG, C.roofK, C.roofW, C.roofG];
      const nu = near ? 22 : 11;
      const nv = near ? 10 : 5;
      chevronRoof(b, [L0, eh, zc + wd / 2 + 0.6], [L1, eh, zc + wd / 2 + 0.6], [L1, eh + rh, zc], [L0, eh + rh, zc], nu, nv, cols);
      chevronRoof(b, [L1, eh, zc - wd / 2 - 0.6], [L0, eh, zc - wd / 2 - 0.6], [L0, eh + rh, zc], [L1, eh + rh, zc], nu, nv, cols);
      for (const [x, sgn] of [[L0, -1], [L1, 1]]) {
        b.at(x, 0, zc, (sgn * Math.PI) / 2, () => F.extrude([[-wd / 2 - 0.6, eh], [wd / 2 + 0.6, eh], [0, eh + rh]], -0.4, 0, C.stone));
      }
      // Südturm (136 m): quadratisch, verjüngt sich in Stufen, schlanke Spitze mit Fialen
      const tx = -8;
      const tz = zc + wd / 2 + 6.5;
      prism(F, chamfer(16, 16, 1.2, tx, tz), 0, 46, C.stone, { g: [0.85, 1.02] });
      prism(F, chamfer(13, 13, 1.5, tx, tz), 46, 74, C.stone, { g: [0.95, 1.04] });
      prism(F, ngon(8, 6.6, Math.PI / 8, 0, 0, tx, tz), 74, 92, C.stone, { g: [1, 1.05] });
      spire(F, ngon(8, 6.6, Math.PI / 8, 0, 0, tx, tz), 92, 137, C.stone, { ax: tx, az: tz, g: [0.98, 1.08] });
      if (near) {
        for (const [px, pz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          pinnacle(b, tx + px * 7.2, tz + pz * 7.2, 46, 50, 1.4, 5, C.stoneDark);
          pinnacle(b, tx + px * 5.8, tz + pz * 5.8, 74, 78, 1.2, 6, C.stoneDark);
        }
        for (let k = 0; k < 4; k++) b.at(tx, 0, tz, (k * Math.PI) / 2, () => { lancet(b, 0, 26, 3.2, 14, C.pane); lancet(b, 0, 56, 2.6, 13, C.pane); });
      }
      F.ball(tx, 137.6, tz, 0.9, C.gold, { ws: 6, hs: 4 });
      // Nordturm, unvollendet, mit kleiner Kupferhaube
      const nx = -8;
      const nz = zc - wd / 2 - 5.5;
      prism(F, chamfer(14, 14, 1.2, nx, nz), 0, 60, C.stone, { g: [0.85, 1.02] });
      F.lathe(nx, 60, nz, [[6.5, 0], [6.5, 2], [4.2, 6], [1.2, 9], [0.2, 11]], C.copper, { seg: near ? 12 : 8 });
      // Westfront mit Riesentor und zwei Heidentürmchen
      b.at(L0, 0, zc, -Math.PI / 2, () => {
        F.box(0, 0, 1.5, 20, 30, 3, C.stone, { g: [0.85, 1.02] });
        G.extrude(arch(0, 6, 0, 10, near ? 8 : 5, true), 3.0, 3.05, C.pane, { caps: 'f', sides: false });
        for (const s of [-1, 1]) {
          prism(F, ngon(8, 2.6, Math.PI / 8, 0, 0, s * 7.5, 1.5), 30, 44, C.stone);
          spire(F, ngon(8, 2.6, Math.PI / 8, 0, 0, s * 7.5, 1.5), 44, 52, C.stoneDark, { ax: s * 7.5, az: 1.5 });
        }
      });
    });
    return { w: 75, d: 50, h: 86 };
  });

  // ===========================================================================================================
  // Rom: Kolosseum · Vatikan: Kuppel mit Säulenfront · Italien: Campanile
  // ===========================================================================================================
  const ROM = { trav: 0xe3cfa6, travDark: 0xc4ab82, travLight: 0xf0e2c2, hole: 0x6d5a48, sand: 0xe6d3a6, grass: 0x9cc46c, plaza: 0xd9cdb6, dome: 0x9aa6ad, domeDark: 0x7d8a92, pane: 0x4f5864, brick: 0xb8644a, brickDark: 0x9a5240, white: 0xf3eee3, green: 0x6fa58c, gold: 0xe3bb52, pine: 0x4f8a50 };
  /** Arkade: Bogenöffnungen gleichmäßig auf dem Ring pts (Seiten), Fuß y, Öffnungshöhe h, Breite w (G, dunkel). */
  function arcadeRing(b, pts, y, w, h, col, keep = () => true) {
    const n = pts.length;
    const cx = pts.reduce((v, p) => v + p[0], 0) / n;
    const cz = pts.reduce((v, p) => v + p[1], 0) / n;
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const q = pts[(i + 1) % n];
      const mx = (a[0] + q[0]) / 2;
      const mz = (a[1] + q[1]) / 2;
      if (!keep(mx, mz, y)) continue;
      // Normale der Seite, nach außen (weg von der Mitte des Rings)
      let nx = q[1] - a[1];
      let nz = -(q[0] - a[0]);
      if (nx * (mx - cx) + nz * (mz - cz) < 0) {
        nx = -nx;
        nz = -nz;
      }
      b.at(mx, 0, mz, Math.atan2(nx, nz), () => b.G.extrude(arch(0, w, y, h, b.lod ? 4 : 6), 0.06, 0.08, col, { caps: 'f', sides: false }));
    }
  }
  landmark('kolosseum', { places: ['Rom'], slot: 'skyline', far: true, title: 'Kolosseum' }, (b) => {
    const { F } = b;
    const near = !b.lod;
    const C = ROM;
    const cz = -50;
    const n = near ? 40 : 24;
    const ell = (rx, rz) => Array.from({ length: n }, (_, i) => {
      const a = (i / n) * TAU;
      return [Math.cos(a) * rx, cz + Math.sin(a) * rz];
    });
    const RX = 56;
    const RZ = 46;
    F.box(0, 0, cz - 4, 132, 0.1, 108, C.plaza, { skip: 'b' });
    // Die äußere Mauer ist auf der Nordseite (hinten links) voll erhalten, vorn rechts auf die zweite Arkade abgebrochen
    const intact = (x, z) => ss(-0.2, 0.45, (-(z - cz) / RZ) * 0.8 - (x / RX) * 0.6);
    const top = (x, z) => 22 + 10 * intact(x, z);
    const out = ell(RX, RZ);
    loft(F, [[out, 0], [out, 7.4], [out, 14.6], [out, 22], [out, top]], [C.trav, C.travLight, C.trav, C.travLight], { smooth: 0.9, top: false, g: [0.86, 1.04] });
    // Gesimse zwischen den Geschossen
    for (const y of [7.4, 14.6, 22]) loft(F, [[ell(RX + 0.6, RZ + 0.6), y - 0.45], [ell(RX + 0.6, RZ + 0.6), y + 0.15]], C.travDark, { smooth: 0.9, top: false, bottom: true });
    // Mauerkrone (schräg, wo sie abgebrochen ist) und Innenseite der Außenmauer
    const inner = ell(RX - 3, RZ - 3);
    loft(F, [[inner, top], [inner, 0]], C.travDark, { smooth: 0.9, top: false });
    for (let i = 0; i < n; i++) {
      const a = out[i];
      const q = out[(i + 1) % n];
      const ai = inner[i];
      const qi = inner[(i + 1) % n];
      F.quad([a[0], top(a[0], a[1]), a[1]], [ai[0], top(ai[0], ai[1]), ai[1]], [qi[0], top(qi[0], qi[1]), qi[1]], [q[0], top(q[0], q[1]), q[1]], C.travLight);
    }
    // drei Arkadengeschosse, darüber das Attikageschoss mit kleinen Fenstern (nur, wo die Mauer noch steht)
    for (const [y, h] of [[0.6, 5.6], [8.0, 5.6], [15.2, 5.6]]) arcadeRing(b, out, y, 3.4, h, C.hole);
    arcadeRing(b, out, 25.5, 1.4, 2.2, C.hole, (x, z) => top(x, z) > 30);
    // Zuschauerränge innen (Stufen als Kegelringe), Arena aus Sand mit freigelegten Gängen
    const tiers = [[RX - 3, RZ - 3, 20], [RX - 12, RZ - 12, 13], [RX - 20, RZ - 20, 7], [RX - 26, RZ - 26, 3.4]];
    for (let i = 0; i + 1 < tiers.length; i++) {
      const [ax, az, ay] = tiers[i];
      const [bx2, bz2, by] = tiers[i + 1];
      loft(F, [[ell(ax, az), ay], [ell(bx2, bz2), by]], i % 2 ? C.trav : C.travDark, { smooth: 0.9, top: false });
    }
    loft(F, [[ell(RX - 26, RZ - 26), 3.4], [ell(RX - 26, RZ - 26), 1.2]], C.travDark, { smooth: 0.9, top: false });
    loft(F, [[ell(RX - 26, RZ - 26), 1.2]], C.sand, { top: true });
    if (near) for (let i = -2; i <= 2; i++) F.box(i * 5, 1.2, cz, 1.4, 0.06, 2 * (RZ - 30), C.travDark, { skip: 'b' });
    // Pinien und Rasen vorn
    if (near) for (const [x, z] of [[-58, -4], [-46, -6], [52, -5], [60, -10]]) {
      F.cyl(x, 0, z, 0.35, 0.25, 7, PAL.trunk, { seg: 5, top: false });
      F.ball(x, 7.8, z, 3.4, C.pine, { sy: 0.45, ws: 9, hs: 4 });
    }
    return { w: 132, d: 108, h: 33 };
  });

  landmark('petersdom', { places: ['Vatikanstadt'], slot: 'skyline', far: true, title: 'Kuppel' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = ROM;
    b.xf([0, 0, 0], [0, 0, 0], 0.7, () => {
      // Platz mit den zwei geschwungenen Säulenarmen (je zwei Reihen), Obelisk in der Mitte
      F.box(0, 0, -80, 150, 0.12, 160, C.plaza, { skip: 'b' });
      const cx = 0;
      const pz = -40;
      const N = near ? 12 : 6;
      for (const s of [-1, 1]) {
        const ang = (i) => (s > 0 ? 0 : Math.PI) - 1.0 + (i / N) * 2.0;
        for (const k of [1, 0.9]) {
          for (let i = 0; i <= N; i++) F.cyl(cx + Math.cos(ang(i)) * 38 * k, 0, pz + Math.sin(ang(i)) * 27 * k, 0.9, 0.8, 10, C.white, { seg: near ? 8 : 5, top: false });
        }
        for (let i = 0; i < N; i++) {
          const x0 = cx + Math.cos(ang(i)) * 36.1;
          const z0 = pz + Math.sin(ang(i)) * 25.6;
          const x1 = cx + Math.cos(ang(i + 1)) * 36.1;
          const z1 = pz + Math.sin(ang(i + 1)) * 25.6;
          const l = Math.hypot(x1 - x0, z1 - z0);
          b.at((x0 + x1) / 2, 10, (z0 + z1) / 2, Math.atan2(x1 - x0, z1 - z0), () => F.box(0, 0, 0, 5.4, 2.0, l + 0.35, C.travLight));
        }
      }
      F.box(cx, 0, pz, 2.4, 1.6, 2.4, C.trav);
      spire(F, chamfer(1.6, 1.6, 0, cx, pz), 1.6, 22, C.travLight, { ax: cx, az: pz });
      // Fassade mit Säulen und Attika, dahinter Trommel, Kuppel mit Rippen, Laterne
      const fz = -76;
      F.box(cx, 0, fz - 9, 84, 30, 18, C.trav, { g: [0.86, 1.03] });
      F.box(cx, 30, fz - 9, 86, 2.2, 19, C.travLight);
      F.box(cx, 32.2, fz - 9, 84, 4.6, 18, C.trav);
      b.at(cx, 0, fz, 0, () => {
        for (let i = 0; i < 8; i++) {
          const x = -24 + i * (48 / 7);
          F.cyl(x, 0, 1.2, 1.3, 1.15, 30, C.travLight, { seg: near ? 10 : 6, top: false });
        }
        F.extrude([[-28, 30], [28, 30], [0, 37]], 0, 1.8, C.travLight);
        for (let i = 0; i < 5; i++) G.extrude(arch(-20 + i * 10, 3.4, 4, 8, near ? 6 : 4), 0.02, 0.05, C.pane, { caps: 'f', sides: false });
      });
      const dz = fz - 52;
      // Langhaus und Querschiff zwischen Fassade und Kuppel: darauf steht die Trommel
      F.box(cx, 0, (fz - 18 + dz - 30) / 2, 56, 34, fz - 18 - (dz - 30), C.trav, { g: [0.86, 1.03] });
      F.box(cx, 0, dz, 96, 32, 40, C.trav, { g: [0.86, 1.03] });
      F.box(cx, 32, dz, 97, 1.6, 41, C.travLight);
      F.box(cx, 34, (fz - 18 + dz - 30) / 2, 57, 1.6, fz - 18 - (dz - 30) + 1, C.travLight);
      F.cyl(cx, 30, dz, 23, 23, 16, C.trav, { seg: near ? 28 : 14, top: false, g: [0.9, 1.04] });
      if (near) {
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * TAU;
          F.box(cx + Math.sin(a) * 23.6, 30, dz + Math.cos(a) * 23.6, 2.2, 16, 2.2, C.travLight);
        }
      }
      F.cyl(cx, 46, dz, 24, 24, 2, C.travLight, { seg: near ? 28 : 14 });
      F.lathe(cx, 48, dz, [[23, 0], [22.6, 6], [20.5, 14], [16.5, 22], [10.5, 28.5], [5, 31.5]], C.dome, { seg: near ? 28 : 14, g: [0.92, 1.1] });
      if (near) for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TAU;
        const rib = [[23, 0], [22.6, 6], [20.5, 14], [16.5, 22], [10.5, 28.5], [5, 31.5]];
        for (let k = 0; k + 1 < rib.length; k++) {
          const [r0, y0] = rib[k];
          const [r1, y1] = rib[k + 1];
          F.rod([cx + Math.sin(a) * (r0 + 0.25), 48 + y0, dz + Math.cos(a) * (r0 + 0.25)], [cx + Math.sin(a) * (r1 + 0.25), 48 + y1, dz + Math.cos(a) * (r1 + 0.25)], 0.35, C.travLight, { seg: 4 });
        }
      }
      F.cyl(cx, 79.5, dz, 4.2, 4.2, 7, C.travLight, { seg: near ? 12 : 8, top: false });
      F.lathe(cx, 86.5, dz, [[4.6, 0], [3.6, 2.2], [1.2, 4.6], [0.4, 6.4]], C.dome, { seg: near ? 12 : 8 });
      F.ball(cx, 93.2, dz, 0.9, C.gold, { ws: 8, hs: 4 });
      // seitliche kleine Kuppeln
      for (const s of [-1, 1]) {
        F.cyl(cx + s * 34, 33.6, dz + 12, 6, 6, 5, C.trav, { seg: 10, top: false });
        F.lathe(cx + s * 34, 38.6, dz + 12, [[6.4, 0], [5.4, 3], [2.4, 6], [0.4, 7.4]], C.dome, { seg: 10 });
      }
    });
    return { w: 105, d: 112, h: 66 };
  });

  landmark('campanile', { places: ['Caorle', 'Corte Belluno', 'Sirmione', 'Mazara del Vallo'], slot: 'square', title: 'Campanile' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = ROM;
    // Piazza mit Brunnenplatz davor (vom Ort), schmale Loggia am Fuß, Ziegelschaft, weiße Glockenstube, grüne Spitze
    F.box(0, 0, -10, 30, 0.1, 20, C.plaza, { skip: 'b' });
    const tz = -12;
    const s = 8.4;
    F.box(0, 0, tz, s + 1.2, 1.4, s + 1.2, C.travDark);
    F.box(0, 1.4, tz, s, 33, s, C.brick, { g: [0.86, 1.04] });
    for (let k = 0; k < 4; k++) {
      b.at(0, 0, tz, (k * Math.PI) / 2, () => {
        // Lisenen: fünf flache Pfeiler je Seite, oben Bögen
        for (let i = 0; i < 5; i++) F.box(-s / 2 + 0.5 + i * ((s - 1) / 4), 1.4, s / 2 + 0.12, 0.7, 31, 0.25, C.brickDark, { skip: 'kb' });
        F.box(0, 34.4, s / 2 + 0.15, s + 0.4, 0.8, 0.3, C.white);
        // Glockenstube: weiße Bögen, dunkle Öffnungen
        F.box(0, 35.2, s / 2 - 0.5, s, 7, 1.0, C.white, { skip: 'k' });
        for (const x of [-2.6, 0, 2.6]) G.extrude(arch(x, 1.8, 35.8, 5.2, near ? 6 : 4), 0.52, 0.55, C.pane, { caps: 'f', sides: false });
        F.box(0, 42.2, s / 2 - 0.3, s + 0.6, 0.7, 0.6, C.white, { skip: 'k' });
        if (near) G.rect(0, 43.6, s / 2 + 0.02, s - 2, 2.6, mix(C.white, C.trav, 0.4));
      });
    }
    F.box(0, 35.2, tz, s - 1.8, 7, s - 1.8, C.white);
    F.box(0, 42.9, tz, s, 4, s, C.white, { g: [0.95, 1.04] });
    spire(F, chamfer(s - 0.4, s - 0.4, 0, 0, tz), 46.9, 58, C.green, { ax: 0, az: tz, g: [0.9, 1.1] });
    F.ball(0, 58.4, tz, 0.55, C.gold, { ws: 8, hs: 4 });
    // Loggia: drei Bögen auf Säulen vor dem Turm
    F.box(0, 0, -2.6, 12, 0.5, 4.4, C.travLight);
    for (let i = 0; i < 4; i++) F.cyl(-5.4 + i * 3.6, 0.5, -1.0, 0.3, 0.28, 4.2, C.white, { seg: 8, top: false });
    F.box(0, 4.7, -2.6, 12, 1.4, 4.4, C.trav);
    F.box(0, 6.1, -2.6, 12.4, 0.5, 4.8, C.white);
    if (near) for (let i = 0; i < 3; i++) G.extrude(arch(-3.6 + i * 3.6, 3.2, 3.4, 1.4, 6), -0.37, -0.35, mix(C.trav, 0x000000, 0.25), { caps: 'f', sides: false });
    return { w: 30, d: 20, h: 59 };
  });

  // ===========================================================================================================
  // Amerika: New York, San Francisco, Los Angeles, Chicago, Miami/Key West, Texas
  // ===========================================================================================================
  const USA = { lime: 0xdcd4c2, limeDark: 0xc4bba7, steel: 0xc9cfd6, steelDark: 0x9aa3ad, glass: 0x8fb4cf, glassDark: 0x5f7f99, band: 0x56687a, copper: 0x7fb8a4, copperDark: 0x5f9a86, granite: 0xcbbfa9, lawn: 0x8fbf63, water: 0x6fb2cf, orange: 0xcf4f36, orangeDark: 0xa83f2c, hill: 0xc9b47a, scrub: 0x8f9c5c, gold: 0xe9c25a, black: 0x3d4148 };

  /** Hochhaus aus Stufen: steps = [[w, d, bis y], …] um (x, z), Fensterbänder (G) alle step Meter. */
  function setbacks(b, x, z, steps, col, band, o = {}) {
    let y = o.y0 ?? 0;
    for (const [w, d, y1] of steps) {
      const pts = chamfer(w, d, o.c ?? 0, x, z);
      prism(b.F, pts, y, y1, col, { g: [0.88, 1.04] });
      if (o.slots) slots(b, pts, y + 1.5, y1 - 1.5, b.lod ? 6 : 3, b.lod ? 2 : 1.1, band, { margin: 1.6, min: 6 });
      else bands(b, pts, y + 2, y1 - 1, b.lod ? 8 : 4, b.lod ? 2.4 : 1.5, band);
      y = y1;
    }
    return y;
  }

  /** Freiheitsstatue als freundliche Spielzeugfigur (Höhe h, Fuß bei y): Gewand, erhobene Fackel, Tafel, Strahlenkrone. */
  function libertyFigure(b, x, y, z, h) {
    const { F, L } = b;
    const k = h / 10;
    const C = USA;
    const seg = b.lod ? 7 : 12;
    b.xf([x, y, z], [0, 0, 0], k, () => {
      F.lathe(0, 0, 0, [[1.9, 0], [1.75, 1.0], [1.45, 3.6], [1.2, 5.6], [1.05, 6.6], [0.75, 7.1], [0.5, 7.25]], C.copper, { seg, g: [0.86, 1.06] });
      F.ball(0, 7.75, 0.05, 0.6, C.copper, { ws: seg, hs: 6 });
      // Strahlenkrone: sieben Zacken nach oben und zur Seite
      F.lathe(0, 8.05, 0, [[0.62, 0], [0.66, 0.22], [0.6, 0.3]], C.copperDark, { seg, top: false });
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI / 2 + ((i - 3) / 6) * 2.1;
        F.rod([Math.cos(a) * 0.55, 8.25, Math.sin(-a) * 0.0 + 0.1], [Math.cos(a) * 1.35, 8.25 + Math.sin(-a) * 0.5 + 0.55, 0.1 + Math.abs(Math.cos(a)) * 0.1], 0.08, C.copper, { seg: 4, r1: 0.02 });
      }
      // erhobener rechter Arm mit Fackel, linker Arm hält die Tafel vor der Brust
      F.rod([0.85, 6.6, 0], [1.15, 9.6, 0.1], 0.32, C.copper, { seg: 6, r1: 0.26 });
      F.lathe(1.17, 9.6, 0.1, [[0.18, 0], [0.42, 0.55], [0.46, 0.75]], C.copperDark, { seg: 8 });
      if (L) L.ball(1.17, 10.55, 0.1, 0.32, 0xffcf5a, { ws: 6, hs: 4, sy: 1.4 });
      else F.ball(1.17, 10.55, 0.1, 0.32, C.gold, { ws: 6, hs: 4, sy: 1.4 });
      F.rod([-0.9, 6.4, 0], [-0.75, 5.2, 0.9], 0.28, C.copper, { seg: 6 });
      b.xf([-0.65, 5.0, 0.95], [0.2, 0, 0.35], 1, () => F.box(0, 0, 0, 0.7, 1.5, 0.22, C.copperDark));
    });
  }

  landmark('nycSkyline', { places: ['New York City'], slot: 'skyline', far: true, title: 'Skyline mit Freiheitsstatue' }, (b) => {
    const { F, G, W } = b;
    const near = !b.lod;
    const C = USA;
    // Hafen vorn, Insel mit Sternfort, Sockel und Statue; dahinter die Türme von Manhattan auf einem Kai
    W.poolRect(0, 0.12, -45, 300, 90, C.water, { rings: 0.06 });
    F.box(0, 0, -150, 300, 1.2, 120, C.granite, { g: [0.85, 1] });
    const ix = -90;
    const iz = -38;
    F.lathe(ix, 0, iz, [[22, 0], [21, 1.4], [19, 1.8]], C.lawn, { seg: near ? 24 : 12 });
    const star = [];
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * TAU;
      const r = i % 2 ? 9.5 : 13;
      star.push([ix + Math.cos(a) * r, iz + Math.sin(a) * r]);
    }
    prism(F, star, 1.6, 5.0, C.granite, { g: [0.85, 1] });
    prism(F, chamfer(10, 10, 1.2, ix, iz), 5.0, 9.5, C.granite);
    prism(F, chamfer(8.4, 8.4, 0.8, ix, iz), 9.5, 24, mix(C.granite, 0xffffff, 0.1), { g: [0.9, 1.04] });
    prism(F, chamfer(9.2, 9.2, 0.8, ix, iz), 24, 25.4, C.granite);
    if (near) for (let k = 0; k < 4; k++) b.at(ix, 0, iz, (k * Math.PI) / 2, () => G.rect(0, 13, 4.22, 2.4, 6, mix(C.granite, 0x000000, 0.2)));
    libertyFigure(b, ix, 25.4, iz, 32);
    // Manhattan: Turm mit Stufen und Mast, Turm mit Bogenkrone, schlanker Glasturm, dazu Füller
    setbacks(b, 0, -140, [[34, 26, 30], [28, 20, 95], [22, 16, 150], [14, 14, 178]], C.lime, C.band, { slots: true, y0: 1.2 });
    F.cyl(0, 178, -140, 4, 3.2, 14, C.lime, { seg: 10 });
    F.cyl(0, 192, -140, 1.2, 0.3, 22, C.steel, { seg: 6 });
    const cx2 = 50;
    const cz2 = -128;
    setbacks(b, cx2, cz2, [[22, 22, 20], [17, 17, 128]], C.steelDark, C.band, { slots: true, y0: 1.2 });
    // Bogenkrone: sieben Stufen aus Bögen, silbern, mit dreieckigen Fenstern
    for (let i = 0; i < 6; i++) {
      const w = 15 - i * 2.2;
      const y0 = 128 + i * 4.2;
      F.box(cx2, y0, cz2, w, 4.2, w, C.steel, { g: [0.95, 1.08] });
      for (let k = 0; k < 4; k++) {
        b.at(cx2, 0, cz2, (k * Math.PI) / 2, () => {
          F.extrude(arch(0, w, y0 + 4.2 - w / 2, w / 2 + 1.4, near ? 8 : 5).map(([px, py]) => [px, Math.max(py, y0 + 4.2)]), w / 2 - 0.3, w / 2, C.steel);
          if (near) for (let j = -1; j <= 1; j++) G.tri([j * w * 0.28 - 0.5, y0 + 4.4, w / 2 + 0.02], [j * w * 0.28 + 0.5, y0 + 4.4, w / 2 + 0.02], [j * w * 0.28, y0 + 5.6, w / 2 + 0.02], C.glassDark);
        });
      }
    }
    F.cyl(cx2, 153, cz2, 1.0, 0.1, 26, C.steel, { seg: 6 });
    // schlanker Glasturm mit abgeschrägten Kanten und Spitze
    const cx3 = -40;
    const cz3 = -150;
    const ring = (s, a) => ngon(4, s, a, 0, 0, cx3, cz3);
    loft(F, [[ring(20, 0), 1.2], [ring(20, 0), 40], [ring(15, Math.PI / 4), 140], [ring(10, 0), 210]], C.glass, { smooth: 0.9, g: [0.85, 1.1] });
    bands(b, ring(20, 0), 44, 52, 4, 1.6, C.glassDark);
    F.cyl(cx3, 210, cz3, 1.4, 0.3, 50, C.steel, { seg: 6 });
    // Füller in zwei Reihen
    const fill = [[-110, -118, 18, 16, 70], [-70, -112, 16, 18, 95], [-15, -110, 18, 14, 60], [25, -100, 14, 14, 85], [85, -112, 20, 16, 110], [118, -120, 16, 16, 75],
      [-125, -165, 20, 18, 120], [-85, -170, 18, 18, 140], [20, -175, 16, 16, 115], [80, -165, 22, 18, 150], [125, -168, 18, 18, 100], [-5, -185, 18, 16, 90]];
    fill.forEach(([x, z, w, d, h], i) => setbacks(b, x, z, [[w, d, h]], [C.lime, C.steel, C.glass, C.limeDark][i % 4], [C.band, C.steelDark, C.glassDark, C.band][i % 4], { y0: 1.2 }));
    return { w: 300, d: 210, h: 260 };
  });

  /** Kabelkurve: Punkte von (x0, y0) nach (x1, y1) mit Durchhang sag in der Mitte, bei z. */
  function cable(b, x0, y0, x1, y1, sag, z, r, col, n) {
    let prev = null;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const p = [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - sag * 4 * t * (1 - t), z];
      if (prev) b.F.rod(prev, p, r, col, { seg: 5 });
      pts.push(p);
      prev = p;
    }
    return pts;
  }
  landmark('goldenGate', { places: ['San Francisco'], slot: 'skyline', far: true, title: 'Rote Hängebrücke' }, (b) => {
    const { F, G, W } = b;
    const near = !b.lod;
    const C = USA;
    const zc = -70;
    const half = 205;
    const tx = 125;
    const deck = 24;
    const top = 82;
    // Meerenge mit Hügeln an beiden Enden
    W.poolRect(0, 0.12, zc, 2 * half - 40, 120, C.water, { rings: 0.05 });
    // Hügel als Rücken quer zur Bucht, die zu allen Rändern hin auslaufen (keine offenen Schnittkanten)
    const hf = (x, z) => 0.05 + 46 * ss(160, 240, Math.abs(x)) * (1 - ss(222, 260, Math.abs(x))) * ss(0, 45, -z) * ss(0, 45, 140 + z) * (0.8 + 0.2 * Math.sin(z * 0.05 + x * 0.02));
    terrain(b, gridLines(-260, 260, near ? 52 : 26, [-170, 170]), gridLines(0, -140, near ? 14 : 7), hf, (x, z, y) => (y > 18 ? C.scrub : y > 3 ? C.hill : 0xd8c9a0), mottle);
    // Fahrbahn mit Fachwerkträger an den Seiten
    F.box(0, deck, zc, 2 * half, 1.6, 15, C.orangeDark, { g: [0.85, 1] });
    for (const s of [-1, 1]) F.box(0, deck + 1.6, zc + s * 7.3, 2 * half, 1.4, 0.5, C.orange);
    if (near) for (const s of [-1, 1]) b.at(0, 0, zc + s * 7.55, s > 0 ? 0 : Math.PI, () => G.rect(0, deck - 2.4, 0.02, 2 * half, 2.4, mix(C.orangeDark, 0x000000, 0.25)));
    F.box(0, deck - 2.4, zc, 2 * half, 2.4, 13.5, C.orangeDark);
    // Pylone: zwei Beine mit Stufen, Querriegel, Sockel im Wasser
    for (const sx of [-1, 1]) {
      const x = sx * tx;
      F.box(x, 0, zc, 18, 6, 30, C.granite, { g: [0.85, 1] });
      for (const s of [-1, 1]) {
        const z = zc + s * 8.5;
        prism(F, chamfer(6, 7, 0.6, x, z), 6, 40, C.orange, { g: [0.85, 1.02] });
        prism(F, chamfer(5.2, 6.2, 0.6, x, z), 40, 64, C.orange, { g: [0.95, 1.04] });
        prism(F, chamfer(4.4, 5.4, 0.5, x, z), 64, top, C.orange, { g: [1, 1.06] });
        if (near) for (const yy of [20, 50, 72]) b.at(x, 0, z, Math.PI / 2 * (s > 0 ? 0 : 2), () => G.rect(0, yy, 3.52, 1.4, 6, C.orangeDark));
      }
      for (const [y0, h] of [[deck + 2, 3], [44, 3], [62, 2.6], [top - 3, 3]]) F.box(x, y0, zc, 4.4, h, 13, C.orange);
    }
    // Tragseile: von den Ankern auf die Pylone und in der Mitte durchhängend, Hänger zur Fahrbahn
    for (const s of [-1, 1]) {
      const z = zc + s * 8.0;
      const n = near ? 24 : 10;
      const mid = cable(b, -tx, top, tx, top, top - deck - 4, z, 0.7, C.orange, n);
      cable(b, -half, deck + 2, -tx, top, -6, z, 0.7, C.orange, near ? 8 : 4);
      cable(b, tx, top, half, deck + 2, -6, z, 0.7, C.orange, near ? 8 : 4);
      if (near) for (const p of mid.slice(1, -1)) F.rod([p[0], deck + 3, z], [p[0], p[1], z], 0.12, C.orangeDark, { seg: 3 });
    }
    return { w: 520, d: 140, h: top + 2 };
  });

  // Buchstaben aus einem Stück (Umriss in Einheiten: Höhe 7, Strich 1,4), damit sich nichts überlagert
  const LETTERS = {
    S: [[0, 0], [5, 0], [5, 4.2], [1.4, 4.2], [1.4, 5.6], [5, 5.6], [5, 7], [0, 7], [0, 2.8], [3.6, 2.8], [3.6, 1.4], [0, 1.4]],
    K: [[0, 0], [1.4, 0], [1.4, 2.6], [2.2, 3.4], [3.6, 0], [5.1, 0], [3.1, 4.4], [5, 7], [3.4, 7], [1.4, 4.4], [1.4, 7], [0, 7]],
    Y: [[1.8, 0], [3.2, 0], [3.2, 3.2], [5.2, 7], [3.6, 7], [2.5, 4.6], [1.4, 7], [-0.2, 7], [1.8, 3.2]],
    L: [[0, 0], [5, 0], [5, 1.4], [1.4, 1.4], [1.4, 7], [0, 7]],
    I: [[0, 0], [1.6, 0], [1.6, 7], [0, 7]],
    N: [[0, 0], [1.4, 0], [1.4, 4.6], [3.6, 0], [5, 0], [5, 7], [3.6, 7], [3.6, 2.4], [1.4, 7], [0, 7]],
    E: [[0, 0], [5, 0], [5, 1.4], [1.4, 1.4], [1.4, 2.8], [4, 2.8], [4, 4.2], [1.4, 4.2], [1.4, 5.6], [5, 5.6], [5, 7], [0, 7]],
  };
  /** Palme: leicht gebogener Stamm, Wedel als flache, hängende Blätter, ein paar Nüsse. */
  function palm(b, x, y, z, h, lean = 0.3, ry = 0) {
    const { F } = b;
    const near = !b.lod;
    b.at(x, y, z, ry, () => {
      const pts = [[0, 0], [lean * 0.35, h * 0.5], [lean, h]];
      for (let i = 0; i + 1 < pts.length; i++) F.rod([pts[i][0], pts[i][1], 0], [pts[i + 1][0], pts[i + 1][1], 0], 0.28 - i * 0.06, 0xa08362, { seg: 6, r1: 0.22 - i * 0.05 });
      const n = near ? 8 : 5;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + 0.3;
        b.xf([lean, h, 0], [0, a, 0], 1, () => b.xf([0, 0, 0], [-0.35 - (i % 2) * 0.25, 0, 0], 1, () => {
          F.quad([-0.05, 0, 0], [0.05, 0, 0], [0.55, -0.35, 2.0], [-0.55, -0.35, 2.0], 0x5f9a4a, { flat: false });
          F.quad([-0.55, -0.35, 2.0], [0.55, -0.35, 2.0], [0.05, 0, 0], [-0.05, 0, 0], 0x4f8a3e);
          F.quad([-0.55, -0.35, 2.0], [0.55, -0.35, 2.0], [0.12, -1.2, 3.4], [-0.12, -1.2, 3.4], 0x5f9a4a);
          F.quad([0.12, -1.2, 3.4], [0.55, -0.35, 2.0], [-0.55, -0.35, 2.0], [-0.12, -1.2, 3.4], 0x4f8a3e);
        }));
      }
      if (near) for (let i = 0; i < 3; i++) F.ball(lean + Math.cos(i * 2.1) * 0.3, h - 0.35, Math.sin(i * 2.1) * 0.3, 0.2, 0x7a5a3a, { ws: 6, hs: 3 });
    });
  }
  landmark('skylineLetters', { places: ['Los Angeles', 'Santa Monica', 'Inglewood', 'Anaheim', 'Newport Beach'], slot: 'skyline', far: true, title: 'Hügel mit Buchstaben' }, (b) => {
    const { F } = b;
    const near = !b.lod;
    const C = USA;
    const hf = (x, z) => 0.05 + (82 * Math.exp(-((x / 125) ** 2) - (((z + 135) / 78) ** 2)) + 26 * Math.exp(-(((x + 95) / 60) ** 2) - (((z + 120) / 50) ** 2)) * ss(-170, -20, -x)) * ss(0, 40, -z) * ss(0, 50, 230 + z) * (1 - ss(165, 200, Math.abs(x)));
    // trockenes Gras als eine Farbe mit weichen Flecken (keine Zellmuster), dazu Buschballen am Hang
    const kf = (x, z) => 0.94 + 0.08 * Math.sin(x * 0.045 + z * 0.06) + 0.05 * Math.sin(x * 0.13 - z * 0.05);
    terrain(b, gridLines(-200, 200, near ? 40 : 20), gridLines(0, -230, near ? 23 : 12), hf, () => C.hill, kf);
    if (near) for (let i = 0; i < 44; i++) {
      const x = -150 + ((i * 67) % 300);
      const z = -20 - ((i * 37) % 170);
      if (Math.abs(z + 72) < 9 && Math.abs(x) < 70) continue;
      F.ball(x, hf(x, z) + 0.6, z, 2.2 + (i % 3) * 0.6, C.scrub, { ws: 6, hs: 4, sy: 0.6, g: [0.85, 1.05] });
    }
    // SKYLINE am Hang, jeder Buchstabe 12 m hoch, auf Stelzen
    const word = 'SKYLINE';
    const u = 12 / 7;
    const widths = [...word].map((c) => Math.max(...LETTERS[c].map((p) => p[0])) - Math.min(...LETTERS[c].map((p) => p[0])));
    const total = widths.reduce((a, w) => a + w * u, 0) + (word.length - 1) * 2.6;
    let x = -total / 2;
    const zl = -72;
    [...word].forEach((c, i) => {
      const w = widths[i] * u;
      const xm = x + w / 2;
      const yb = Math.max(hf(x, zl), hf(x + w, zl), hf(xm, zl - 3)) + 0.6;
      const minX = Math.min(...LETTERS[c].map((p) => p[0]));
      b.at(x, yb, zl, 0, () => F.extrude(LETTERS[c].map(([px, py]) => [(px - minX) * u, py * u]), -0.7, 0, 0xf6f4ee, { crease: 0.3 }));
      for (const fx of [0.2, 0.8]) F.rod([x + w * fx, hf(x + w * fx, zl - 2.4) - 0.5, zl - 2.4], [x + w * fx, yb + 6, zl - 0.7], 0.22, 0x9aa1a8, { seg: 4 });
      F.rod([x + w * 0.2, yb + 0.4, zl - 0.75], [x + w * 0.8, yb + 0.4, zl - 0.75], 0.16, 0x9aa1a8, { seg: 4 });
      x += w + 2.6;
    });
    if (near) for (let i = 0; i < 7; i++) palm(b, -66 + i * 22, hf(-66 + i * 22, -8), -8 - (i % 2) * 5, 13 + (i % 3) * 2, 0.4 + (i % 2) * 0.3, i * 0.9);
    return { w: 400, d: 230, h: 84 };
  });

  landmark('chicagoSkyline', { places: ['Chicago', 'Detroit', 'Seattle', 'Portland', 'Monterrey', 'Vancouver'], slot: 'skyline', far: true, title: 'Skyline' }, (b) => {
    const { F, G, W } = b;
    const near = !b.lod;
    const C = USA;
    W.poolRect(0, 0.12, -22, 260, 44, C.water, { rings: 0.05 });
    F.box(0, 0, -105, 260, 1.0, 122, C.granite, { g: [0.85, 1] });
    // Bündelturm: neun schwarze Röhren, die unterschiedlich hoch enden, zwei Antennen
    const bx = 0;
    const bz = -110;
    const tube = 9;
    const hs = [[150, 200, 150], [200, 260, 200], [110, 200, 150]];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const x = bx + (i - 1) * tube;
      const z = bz + (j - 1) * tube;
      prism(F, chamfer(tube, tube, 0, x, z), 1, hs[i][j], C.black, { g: [0.85, 1.12] });
      bands(b, chamfer(tube, tube, 0, x, z), 4, hs[i][j] - 3, near ? 4 : 8, near ? 1.2 : 2.2, 0x5f6670);
    }
    for (const s of [-1, 1]) F.cyl(bx + s * 4, 260, bz, 0.9, 0.25, 30, 0xe9e9e9, { seg: 6 });
    // spitz zulaufender schwarzer Turm mit X-Streben, runde Maistürme, weißer Pfeiler, Füller
    const hx = 70;
    const hz = -95;
    loft(F, [[chamfer(26, 20, 0, hx, hz), 1], [chamfer(16, 12, 0, hx, hz), 215]], C.black, { smooth: 0.9, g: [0.85, 1.12] });
    if (near) for (let k = 0; k < 5; k++) {
      const y0 = 1 + k * 42.8;
      const y1 = y0 + 42.8;
      const w0 = 26 - (10 * (y0 - 1)) / 214;
      const w1 = 26 - (10 * (y1 - 1)) / 214;
      const d0 = 20 - (8 * (y0 - 1)) / 214;
      F.rod([hx - w0 / 2, y0, hz + d0 / 2 + 0.3], [hx + w1 / 2, y1, hz + d0 / 2 + 0.3 - 0.8], 0.45, 0x8a9099, { seg: 4 });
      F.rod([hx + w0 / 2, y0, hz + d0 / 2 + 0.3], [hx - w1 / 2, y1, hz + d0 / 2 + 0.3 - 0.8], 0.45, 0x8a9099, { seg: 4 });
    }
    for (const s of [-1, 1]) F.cyl(hx + s * 4, 215, hz, 0.7, 0.2, 28, 0xe9e9e9, { seg: 6 });
    for (const x of [-72, -56]) {
      const n = near ? 16 : 10;
      F.cyl(x, 1, -60, 7, 7, 60, 0xe9e6de, { seg: n, g: [0.88, 1.04] });
      if (near) for (let y = 4; y < 60; y += 3) F.cyl(x, y, -60, 7.6, 7.6, 0.4, 0xf4f1ea, { seg: n, bottom: true });
    }
    setbacks(b, -30, -140, [[24, 24, 230]], 0xf2f0ea, 0xb9bfc7, { slots: true, y0: 1 });
    const fill = [[-110, -100, 18, 16, 90], [-95, -150, 22, 18, 140], [-50, -100, 16, 16, 70], [30, -150, 20, 18, 160], [100, -140, 22, 18, 120], [115, -95, 16, 16, 80], [35, -82, 16, 14, 60]];
    fill.forEach(([x, z, w, d, h], i) => setbacks(b, x, z, [[w, d, h]], [C.lime, C.glass, C.steelDark, 0xb7a58f][i % 4], [C.band, C.glassDark, 0x5f6670, 0x6b5a4a][i % 4], { y0: 1 }));
    return { w: 260, d: 170, h: 290 };
  });

  const MIA = { mint: 0xa8e0cf, pink: 0xf6b8c4, lemon: 0xf6e3a0, lilac: 0xcdb8e6, white: 0xfbf8f1, aqua: 0x66c1c9, sand: 0xf0dfb4, pane: 0x5c8aa3, red: 0xd2453a, black: 0x3d4148, yellow: 0xf2c94a };
  /** Art-déco-Hotel: Front w breit, n Geschosse, runde Ecke rechts, Augenbrauen über den Fenstern, Mittelfinne. */
  function decoHotel(b, x, w, n, col, trim) {
    const { F, G } = b;
    const near = !b.lod;
    const d = 12;
    const h = 1.2 + n * 3.4;
    b.at(x, 0, 0, 0, () => {
      F.rbox(0, 0, -d / 2, w, h, d, 2.2, col, { prof: [[0, 0], [0, h]], seg: 4, g: [0.88, 1.04] });
      F.box(0, h, -d / 2, w - 0.6, 0.6, d - 0.6, trim);
      for (let r = 0; r < n; r++) {
        const y = 1.6 + r * 3.4;
        const m = Math.max(2, Math.floor((w - 4) / 2.6));
        for (let i = 0; i < m; i++) {
          const wx = -w / 2 + 2 + ((w - 4) / m) * (i + 0.5);
          G.rect(wx, y, 0.03, 1.5, 1.7, MIA.pane);
          if (near) F.box(wx, y + 1.85, 0.25, 1.9, 0.12, 0.5, trim);
        }
      }
      // Mittelfinne über das Dach hinaus, quergestreift
      F.box(0, 1.2, 0.35, 1.6, h + 4.5, 0.7, trim);
      if (near) for (let i = 0; i < 5; i++) G.rect(0, h + 0.3 + i * 0.85, 0.71, 1.62, 0.32, i % 2 ? MIA.aqua : col);
      // Eingang mit Vordach
      G.rect(-w / 4, 0.12, 0.03, 2.2, 2.4, MIA.pane);
      F.box(-w / 4, 2.7, 0.9, 3.6, 0.22, 1.8, trim);
    });
  }
  landmark('miamiDeco', { places: ['Miami', 'Key West', 'Orlando', 'Kissimmee', 'Bay Lake', 'Lake Buena Vista'], slot: 'square', title: 'Art-déco-Hotels' }, (b) => {
    const { F } = b;
    const near = !b.lod;
    const C = MIA;
    F.box(0, 0, -2.4, 52, 0.12, 4.8, C.sand, { skip: 'b' });
    b.at(0, 0, -5, 0, () => {
      decoHotel(b, -17, 16, 3, C.mint, C.white);
      decoHotel(b, 0, 16, 4, C.pink, C.white);
      decoHotel(b, 17, 16, 3, C.lemon, C.white);
    });
    for (const [x, z, h] of [[-24, -1.6, 12], [-9, -2.2, 14], [8.5, -1.4, 13], [24, -2.4, 11.5]]) palm(b, x, 0.12, z, h, 0.5, x * 0.3);
    // Boje am Südzipfel: dicker Betonkegel, rot-schwarz-gelb geringelt (ohne Schrift)
    if (near) F.lathe(-20, 0.12, -3.6, [[1.3, 0], [1.25, 1.2], [1.1, 2.4], [0.8, 3.0], [0.3, 3.3]], [C.red, C.black, C.yellow, C.red], { seg: 12 });
    return { w: 52, d: 17, h: 22 };
  });

  const TEX = { steel: 0xd9dde2, steelDark: 0x9aa1a8, red: 0xb3463a, barn: 0xb5443a, white: 0xf4f1ea, field: 0xd6c48a, grass: 0xa9b86e, wood: 0x8a6448, cactus: 0x5f9a5a, hay: 0xe6c768, blue: 0x3f6fa8 };
  /** Windrad einer Farmpumpe: viele schmale Blätter auf einem Ring (Nabe im Ursprung, Ebene z = 0). */
  function pumpWheel(b) {
    const { F } = b;
    const n = b.lod ? 10 : 18;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      b.xf([0, 0, 0], [0, 0, a], 1, () => b.xf([0, 1.7, 0], [0, 0.45, 0], 1, () => F.box(0, 0, 0, 0.55, 1.5, 0.05, TEX.steel)));
    }
    b.xf([0, 0, 0], [Math.PI / 2, 0, 0], 1, () => F.torus(0, 0, 0, 2.5, 0.06, TEX.steelDark, { seg: 18, tube: 3 }));
    F.ball(0, 0, 0, 0.3, TEX.steelDark, { ws: 6, hs: 3 });
  }
  landmark('texasFarm', {
    places: ['Houston', 'Fort Worth', 'Fredericksburg (Texas)', 'Volente (Texas)', 'The Colony', 'Branham'], slot: 'skyline', title: 'Wasserturm und Windpumpe',
    spins: [{ at: [14, 13.4, -18 + 1.2], speed: 1.6, make: (b) => pumpWheel(b) }],
  }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = TEX;
    F.box(0, 0, -20, 64, 0.08, 40, C.grass, { skip: 'b' });
    // Wasserturm: Kugeltank auf sechs Beinen mit Laufgang
    const wx = -12;
    const wz = -22;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      F.rod([wx + Math.cos(a) * 6.5, 0, wz + Math.sin(a) * 6.5], [wx + Math.cos(a) * 4.8, 22, wz + Math.sin(a) * 4.8], 0.35, C.steelDark, { seg: 5 });
    }
    if (near) for (const y of [8, 15]) {
      const r = 6.5 - (1.7 * y) / 22;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU;
        const a2 = ((i + 1) / 6) * TAU;
        F.rod([wx + Math.cos(a) * r, y, wz + Math.sin(a) * r], [wx + Math.cos(a2) * r, y, wz + Math.sin(a2) * r], 0.14, C.steelDark, { seg: 3 });
      }
    }
    F.cyl(wx, 0, wz, 0.6, 0.6, 22, C.steelDark, { seg: 6, top: false });
    F.lathe(wx, 21.5, wz, [[0.6, 0], [4.6, 0.6], [6.8, 2.8], [7.2, 5.2], [6.8, 7.4], [4.2, 9.6], [0.4, 10.6]], C.steel, { seg: near ? 20 : 12, g: [0.86, 1.06] });
    F.torus(wx, 26.7, wz, 7.35, 0.18, C.steelDark, { seg: near ? 20 : 12, tube: 3 });
    G.lathe(wx, 25.1, wz, [[7.18, 0], [7.25, 1.4]], C.blue, { seg: near ? 20 : 12, top: false });
    F.ball(wx, 32.3, wz, 0.5, C.red, { ws: 6, hs: 3 });
    // Windpumpe: Gittermast mit Plattform und Windfahne, das Rad dreht sich
    const px = 14;
    const pz = -18;
    for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) F.rod([px + sx * 2.4, 0, pz + sz * 2.4], [px + sx * 0.5, 12.6, pz + sz * 0.5], 0.13, C.steelDark, { seg: 4 });
    if (near) for (const y of [3, 6.5, 10]) legFrameAt(b, px, pz, y, 2.4 - (1.9 * y) / 12.6, 0.07, C.steelDark);
    F.box(px, 12.6, pz, 1.8, 0.2, 1.8, C.wood);
    F.rod([px, 13.4, pz + 1.0], [px, 13.4, pz - 3.6], 0.12, C.steelDark, { seg: 4 });
    b.xf([px, 13.4, pz - 3.6], [0, 0, 0], 1, () => F.box(0, -0.9, 0, 0.06, 1.8, 2.4, C.red));
    F.rod([px, 13.4, pz], [px, 0.2, pz], 0.06, C.steelDark, { seg: 3 });
    // rote Scheune, Zaun, Heuballen, zwei Kakteen
    F.box(-2, 0, -36, 12, 6, 8, C.barn, { g: [0.85, 1.03] });
    b.gable(-2, 6, -36, 12, 8, 3.4, mix(C.barn, 0x000000, 0.25), { axis: 'z', oe: 0.3, og: 0.3, ridge: near });
    for (const s of [-1, 1]) b.at(-2, 0, -36 + (s * 8) / 2, s > 0 ? 0 : Math.PI, () => {
      F.extrude([[-6, 6], [6, 6], [0, 9.4]], -0.3, 0, C.barn);
      if (s > 0) { G.rect(0, 0.1, 0.03, 4, 4.4, C.white); G.rect(0, 0.3, 0.05, 3.4, 4.0, mix(C.barn, 0x000000, 0.15)); }
    });
    if (near) {
      for (let i = 0; i < 16; i++) F.box(-30 + i * 4, 0, -2, 0.2, 1.2, 0.2, C.wood);
      for (const y of [0.45, 0.95]) F.box(0, y, -2, 60, 0.12, 0.08, C.wood);
      for (const [x, z] of [[20, -32], [23, -30], [6, -34]]) b.xf([x, 0.6, z], [0, 0, Math.PI / 2], 1, () => F.cyl(0, -0.7, 0, 0.6, 0.6, 1.4, C.hay, { seg: 10, bottom: true }));
      for (const [x, z, h] of [[26, -10, 4.2], [-26, -12, 3.6]]) {
        F.cyl(x, 0, z, 0.45, 0.4, h, C.cactus, { seg: 8 });
        F.ball(x, h, z, 0.4, C.cactus, { ws: 8, hs: 4 });
        for (const s of [-1, 1]) {
          F.rod([x, h * 0.45, z], [x + s * 0.9, h * 0.45, z], 0.26, C.cactus, { seg: 6 });
          F.cyl(x + s * 0.9, h * 0.45, z, 0.26, 0.24, h * 0.3, C.cactus, { seg: 6 });
          F.ball(x + s * 0.9, h * 0.75, z, 0.24, C.cactus, { ws: 6, hs: 3 });
        }
      }
    }
    return { w: 64, d: 40, h: 33 };
  });
  /** Waagrechter Rahmen eines vierbeinigen Mastes um (x, z) in Höhe y, halbe Breite h. */
  function legFrameAt(b, x, z, y, h, r, col) {
    const c = [[h, h], [-h, h], [-h, -h], [h, -h]];
    for (let i = 0; i < 4; i++) b.F.rod([x + c[i][0], y, z + c[i][1]], [x + c[(i + 1) % 4][0], y, z + c[(i + 1) % 4][1]], r, col, { seg: 3 });
  }


  // ===========================================================================================================
  // Bunte Häuserzeilen (Innsbruck, Zürich, Nyhavn, Lissabon …) teilen sich houseRow
  // ===========================================================================================================
  const ROW = { trim: 0xfbf6ec, pane: 0x4f6272, door: 0x6b4a36, roof: 0xb8573f };

  /**
   * Häuserzeile ab x0 nach rechts, Front bei z (schaut nach +z), Fuß bei o.y: list = [[Breite, Traufhöhe, Farbe, Dach,
   * Dachfarbe], …] mit Dach 'x' (First längs der Zeile), 'z' (Giebel nach vorn) oder 'flat' (Gesims). o.d Tiefe,
   * o.fh Geschosshöhe, o.trim / o.pane / o.door Farben, o.roof Dachfarbe. Gibt das rechte Ende zurück.
   */
  function houseRow(b, x0, z, list, o = {}) {
    const { F, G } = b;
    const near = !b.lod;
    const d = o.d ?? 10;
    const fh = o.fh ?? 3.2;
    const trim = o.trim ?? ROW.trim;
    const pane = o.pane ?? ROW.pane;
    let x = x0;
    for (const [w, h, col, roof = 'x', rc = o.roof ?? ROW.roof] of list) {
      b.at(x + w / 2, o.y ?? 0, z, 0, () => {
        F.box(0, 0, -d / 2, w, h, d, col, { g: [0.84, 1.04], skip: roof === 'flat' ? 'b' : 'tb' });
        if (roof === 'flat') F.box(0, h - 0.05, -d / 2, w, 0.55, d + 0.3, trim, { g: [0.95, 1.04] });
        else {
          // Dachraum als Prisma (schließt die Giebel), darüber die Dachplatten
          const rh = roof === 'z' ? Math.min(w * 0.6, 4.6) : Math.min(d * 0.32, 3.4);
          if (roof === 'z') F.extrude([[-w / 2, h], [w / 2, h], [0, h + rh]], -d, 0, col, { g: [0.96, 1.06] });
          else b.at(0, 0, -d / 2, Math.PI / 2, () => F.extrude([[-d / 2, h], [d / 2, h], [0, h + rh]], -w / 2, w / 2, col, { g: [0.96, 1.06] }));
          b.gable(0, h, -d / 2, w, d, rh, rc, { axis: roof, oe: 0.3, og: roof === 'z' ? 0.35 : 0.1, ridge: near });
          if (roof === 'z' && rh > 2.6) {
            if (near) G.rect(0, h + 0.55, 0.02, 1.12, 1.44, trim);
            G.rect(0, h + 0.67, 0.04, 0.88, 1.2, pane);
          }
        }
        // Fensterraster, unten die Tür
        const rows = Math.max(1, Math.floor((h - 0.6) / fh));
        const n = w >= 7.5 ? 3 : w >= 4.6 ? 2 : 1;
        const dc = n === 3 ? 1 : 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < n; c++) {
            const wx = -w / 2 + (w / n) * (c + 0.5);
            if (r === 0 && c === dc) {
              G.rect(wx, 0, 0.02, 1.5, 2.62, trim);
              G.rect(wx, 0, 0.04, 1.2, 2.45, o.door ?? ROW.door);
              continue;
            }
            const wy = r * fh + (r === 0 ? 1.0 : 0.9);
            if (near) G.rect(wx, wy - 0.12, 0.02, 1.34, 1.94, trim);
            G.rect(wx, wy, 0.04, 1.1, 1.7, pane, { g: [1.12, 0.7] });
          }
        }
      });
      x += w;
    }
    return x;
  }

  /**
   * Fluss oder Hafenbecken quer über die ganze Breite w: Ufer vorn (z 0 … −4, Oberkante o.top, Standard 1 m), Wasser
   * bis zEnd in 0,3 m Höhe, Bett darunter.
   */
  function waterFront(b, w, zEnd, C, o = {}) {
    const { F, W } = b;
    const d = -zEnd - 4;
    F.box(0, -1.2, -2, w, (o.top ?? 1.0) + 1.2, 4, C.quay, { skip: 'b' });
    F.box(0, -1.2, -4 - d / 2, w, 0.8, d, C.bed, { skip: 'b' });
    W.poolRect(0, 0.3, -4 - d / 2, w, d, C.water, { rings: o.rings ?? 0.03 });
  }

  /** Dunkler Bogen (Tor, Loggia, Schallöffnung) in der Wandebene z = 0: Mitte x, Fuß y, Breite w, Höhe h. */
  function darkArch(b, x, y, w, h, col = 0x5a5048, pointed = false) {
    b.G.extrude(arch(x, w, y, h, b.lod ? 4 : 8, pointed), 0, 0.03, col, { caps: 'f', sides: false });
  }

  /** Teich w × d um (x, z) auf Bodenhöhe y: Rand aus vier Steinbalken, Wasser 13 cm unter der Kante. */
  function pond(b, x, z, w, d, y, water, rim) {
    const { F, W } = b;
    const t = 0.35;
    for (const s of [-1, 1]) {
      F.box(x, y, z + s * (d / 2 + t / 2), w + 2 * t, 0.35, t, rim, { skip: 'b' });
      F.box(x + s * (w / 2 + t / 2), y, z, t, 0.35, d, rim, { skip: 'b' });
    }
    W.poolRect(x, y + 0.22, z, w, d, water, { rings: 0.04 });
  }

  // ===========================================================================================================
  // Innsbruck: bunte Häuser am Inn vor der Nordkette, Goldenes Dachl
  // ===========================================================================================================
  const INN = { water: 0x79bdb0, bed: 0x5d9c94, quay: 0xcfc4b0, meadow: 0x93bf66, forest: 0x557e4c, forest2: 0x648f55, rock: 0x9c978f, rock2: 0xb3ada4, snow: 0xf3f6f8, gold: 0xe8bf4a, goldDark: 0xd2a63a, cream: 0xf3e6c8, ochre: 0xe9c98c, stone: 0xd8ccb4, copper: 0x7fae98, plaza: 0xd9cfbe, relief: 0xe9dcc0, red: 0xc8473a, blue: 0x5b7fb0, dark: 0x5a4e44 };
  const INN_ROW = [
    [7, 14, 0xf2d27a, 'x'], [6, 16.5, 0xf1b3a6, 'z'], [8, 13, 0xa8d8c0, 'x'], [6.5, 17, 0x9cc4e4, 'z'], [7.5, 15, 0xf0b070, 'x'],
    [6, 18, 0xf4ead2, 'z'], [8, 14.5, 0xd8766a, 'x'], [6.5, 16, 0xb8d890, 'z'], [7, 13.5, 0xc8b4e0, 'x'], [6, 15.5, 0xf2d27a, 'z'],
    [7.5, 17.5, 0xf1b3a6, 'x'], [6.5, 14, 0x9cc4e4, 'z'],
  ];
  landmark('innsbruck', { places: ['Innsbruck'], slot: 'skyline', far: true, title: 'Häuser am Inn und Nordkette' }, (b) => {
    const { F } = b;
    const near = !b.lod;
    const C = INN;
    // vorn der Uferweg, dann der grüne Inn, drüben auf der Kaimauer die bunte Häuserzeile, dahinter die Nordkette
    waterFront(b, 260, -24, C);
    F.box(0, -1.2, -27, 260, 2.6, 6, C.quay, { skip: 'b' });
    houseRow(b, -41.25, -30, INN_ROW, { y: 1.4, d: 11 });
    const ridge = (x) => 116 + 13 * Math.sin(x * 0.045 + 0.6) + 8 * Math.sin(x * 0.11 + 2.1) + 5 * Math.cos(x * 0.23);
    const hf = (x, z) => 0.05 + (1.35 + (ridge(x) - 1.4) * Math.pow(ss(-46, -235, z), 1.3) * (1 - 0.3 * ss(-240, -300, z)) * (1 - ss(60, 130, Math.abs(x)))) * (1 - ss(116, 130, Math.abs(x)));
    const cf = (x, z, y) => {
      const v = y + 7 * Math.sin(x * 0.07 + z * 0.031);
      if (v > 98) return C.snow;
      if (v > 58) return Math.sin(x * 0.05 - z * 0.02) > -0.2 ? C.rock : C.rock2;
      if (v > 9) return Math.sin(x * 0.09 + z * 0.05) > 0 ? C.forest : C.forest2;
      return C.meadow;
    };
    // der vordere Rand (Höhe 1,4 m) liegt auf der Oberkante der Kaimauer
    terrain(b, gridLines(-130, 130, near ? 34 : 14), gridLines(-30, -300, near ? 26 : 11, [-46]), hf, cf, mottle, { closed: ['front'] });
    if (near) for (const x of [-96, -80, -62, -50, 50, 64, 82, 100]) ballTree(b, x, 1.4, -38 - (Math.abs(x) % 5), 2.4, 7, PAL.crown[(x > 0) | 0]);
    return { w: 260, d: 300, h: 136 };
  });

  /** Dachfläche aus Schindelbändern (abwechselnd hell und dunkel): Traufe a–b, First d–c, n Bänder. */
  function shingles(part, a, bq, c, d, n, cols) {
    const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
    for (let i = 0; i < n; i++) {
      const t0 = i / n;
      const t1 = (i + 1) / n;
      part.quad(lerp(a, d, t0), lerp(bq, c, t0), lerp(bq, c, t1), lerp(a, d, t1), cols[i % cols.length]);
    }
  }
  landmark('goldenesDachl', { places: ['Innsbruck'], slot: 'square', title: 'Goldenes Dachl' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = INN;
    F.box(0, 0, -8, 34, 0.1, 16, C.plaza, { skip: 'b' });
    // Neuhof: breites Altstadthaus (Front bei z = −2,8), in der Mitte der zweigeschossige Prunkerker
    const fz = -2.8;
    const hh = 15;
    F.box(0, 0, fz - 6, 16, hh, 12, C.cream, { g: [0.84, 1.04], skip: 'tb' });
    b.at(0, 0, fz - 6, Math.PI / 2, () => F.extrude([[-6, hh], [6, hh], [0, hh + 4.4]], -8, 8, C.cream));
    b.gable(0, hh, fz - 6, 16, 12, 4.4, ROW.roof, { axis: 'x', oe: 0.4, og: 0.3, ridge: near });
    b.at(0, 0, fz, 0, () => {
      for (let r = 0; r < 4; r++) {
        for (const x of [-6.4, -4.4, 4.4, 6.4]) {
          const y = 1.2 + r * 3.4;
          if (near) G.rect(x, y - 0.12, 0.02, 1.24, 2.04, ROW.trim);
          G.rect(x, y, 0.04, 1.0, 1.8, ROW.pane, { g: [1.12, 0.7] });
        }
      }
      darkArch(b, 0, 0, 2.4, 3.0, C.dark);
    });
    // Erker auf Kragsteinen: unten Wappenreliefs und Loggia, oben Reliefbrüstung und offene Loggia
    F.frust(0, 2.6, fz / 2, 4.4, -fz, 6.4, -fz, 1.0, C.stone, { skip: 'k' });
    F.box(0, 3.6, fz / 2, 6.4, 8.8, -fz, C.relief, { g: [0.9, 1.04], skip: 'kt' });
    const loggia = (y0, h, w) => darkArch(b, 0, y0, w, h, C.dark);
    {
      for (const [y0, cols] of [[3.95, [C.red, C.blue, C.gold, C.red]], [7.95, [C.gold, C.cream, C.gold, C.cream]]]) {
        cols.forEach((c, i) => {
          const x = -2.4 + i * 1.6;
          if (near) G.rect(x, y0 - 0.08, 0.02, 1.42, 1.24, C.goldDark);
          G.rect(x, y0, 0.04, 1.26, 1.08, c);
        });
      }
      for (const x of [-2.1, 0, 2.1]) {
        b.at(x, 0, 0, 0, () => {
          loggia(5.4, 2.0, 1.5);
          loggia(9.5, 2.5, 1.5);
        });
      }
    }
    for (const s of [-1, 1]) b.at(s * 3.2, 0, fz / 2, (s * Math.PI) / 2, () => { loggia(5.4, 2.0, 1.4); loggia(9.5, 2.5, 1.4); });
    // goldenes Schindeldach: vorn abgewalmt, hinten in die Wand
    const ye = 12.4;
    const yr = 15.2;
    const FL = [-3.5, ye, 0.3];
    const FR = [3.5, ye, 0.3];
    const BL = [-3.5, ye, fz];
    const BR = [3.5, ye, fz];
    const R0 = [0, yr, fz];
    const R1 = [0, yr, -1.2];
    const gold = [C.gold, C.goldDark];
    shingles(G, BL, FL, R1, R0, near ? 6 : 2, gold);
    shingles(G, FR, BR, R0, R1, near ? 6 : 2, gold);
    shingles(G, FL, FR, R1, R1, near ? 6 : 2, gold);
    F.quad(FL, BL, BR, FR, C.stone);
    // Stadtturm links: Steinschaft, Uhr, Galerie, grüner Zwiebelhelm
    const tx = -14;
    const tz = fz - 3;
    F.box(tx, 0, tz, 6, 26, 6, C.stone, { g: [0.86, 1.04], skip: 'b' });
    b.at(tx, 0, tz + 3, 0, () => {
      dial(b, 0, 21, 1.5);
      for (const y of [4, 9, 14]) G.rect(0, y, 0.03, 0.9, 1.6, ROW.pane);
    });
    F.box(tx, 26, tz, 7.2, 0.6, 7.2, C.cream);
    F.box(tx, 26.6, tz, 5.4, 4, 5.4, C.stone);
    if (near) for (let k = 0; k < 4; k++) b.at(tx, 0, tz, (k * Math.PI) / 2, () => G.extrude(arch(0, 1.4, 27.2, 2.6, 6), 2.7, 2.73, C.dark, { caps: 'f', sides: false }));
    F.lathe(tx, 30.6, tz, [[3.3, 0], [3.5, 1.0], [2.9, 2.6], [1.2, 4.4], [0.8, 5.6], [1.3, 6.4], [0.7, 8.0], [0.12, 9.6]], C.copper, { seg: near ? 12 : 8, g: [0.88, 1.08], bottom: true });
    F.ball(tx, 40.4, tz, 0.4, C.gold, { ws: 6, hs: 4 });
    // schmale Nachbarhäuser
    houseRow(b, -11, fz, [[3, 13, C.ochre, 'x']], { d: 12 });
    houseRow(b, 8, fz, [[9, 14, 0xf6e1dc, 'z']], { d: 12 });
    return { w: 34, d: 16, h: 41 };
  });

  // ===========================================================================================================
  // Schweiz: Zeitglockenturm (Bern), Münster mit zwei Türmen (Zürich, Basel)
  // ===========================================================================================================
  const BERN = { sand: 0xd2c19a, sandDark: 0xb7a47c, sandLight: 0xe3d5b4, roof: 0x9a5c44, roofDark: 0x7b4836, dial: 0x2f3d4f, red: 0xd2453a, arcade: 0x6d6150, dark: 0x564b40, plaza: 0xd9d0bf };
  /** Laubenhaus: Erdgeschoss als Bogengang (zurückgesetzt), oben Fenster mit Geranien, großes Satteldach. */
  function laubenHaus(b, x0, x1, z, h, col) {
    const { F, G } = b;
    const near = !b.lod;
    const C = BERN;
    const w = x1 - x0;
    const cx = (x0 + x1) / 2;
    const d = 12;
    F.box(cx, 3.4, z - d / 2, w, h - 3.4, d, col, { g: [0.88, 1.04], skip: 't' });
    F.box(cx, 0, z - d / 2 - 1.25, w, 3.4, d - 2.5, C.arcade, { skip: 'tb' });
    b.at(cx, 0, z - d / 2, Math.PI / 2, () => F.extrude([[-d / 2, h], [d / 2, h], [0, h + 4.6]], -w / 2, w / 2, col));
    b.gable(cx, h, z - d / 2, w, d, 4.6, C.roof, { axis: 'x', oe: 0.6, og: 0.1, ridge: near });
    // Pfeiler bündig mit den Hauskanten, dazwischen flache Bögen
    const n = Math.round(w / 3.8);
    const bw = (w - 0.9) / n;
    b.at(cx, 0, z, 0, () => {
      for (let i = 0; i <= n; i++) F.box(-w / 2 + 0.45 + i * bw, 0, -0.45, 0.9, 3.4, 0.9, C.sandLight, { skip: 'tb' });
      if (near) {
        for (let i = 0; i < n; i++) {
          const xa = -w / 2 + 0.9 + i * bw;
          const xb = xa + bw - 0.9;
          const pts = [[xa, 2.0]];
          for (let k = 1; k < 8; k++) {
            const t = k / 8;
            pts.push([xa + (xb - xa) * t, 2.0 + 1.1 * Math.sin(t * Math.PI)]);
          }
          pts.push([xb, 2.0], [xb, 3.4], [xa, 3.4]);
          F.extrude(pts, -0.3, 0, C.sandLight, { caps: 'f' });
        }
      }
      const rows = Math.floor((h - 3.6) / 3.2);
      for (let r = 0; r < rows; r++) {
        for (let i = 0; i < n; i++) {
          const x = -w / 2 + 0.45 + (i + 0.5) * bw;
          const y = 4.3 + r * 3.2;
          if (near) G.rect(x, y - 0.12, 0.02, 1.34, 2.04, ROW.trim);
          G.rect(x, y, 0.04, 1.1, 1.8, ROW.pane, { g: [1.12, 0.7] });
          if (near) b.flowerBox(x, y - 0.12, 1.3, C.red, i * 7 + r);
        }
      }
    });
  }
  landmark('zytglogge', { places: ['Bern', 'Thun'], slot: 'square', title: 'Zeitglockenturm' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = BERN;
    F.box(0, 0, -8, 44, 0.1, 16, C.plaza, { skip: 'b' });
    // Turm über dem Stadttor: Tordurchgang, großes Zifferblatt, steiles Zeltdach mit Dachreiter
    const s = 10;
    const tz = -s / 2;
    F.box(0, 0, tz, s, 24, s, C.sand, { g: [0.86, 1.04], skip: 'b' });
    b.at(0, 0, 0, 0, () => {
      darkArch(b, 0, 0, 4.4, 6.4, C.dark);
      dial(b, 0, 15.2, 2.9, C.dial);
      if (near) for (const x of [-3, 3]) G.rect(x, 9.2, 0.03, 0.9, 1.6, ROW.pane);
    });
    F.box(0, 23.6, tz, s + 0.6, 0.6, s + 0.6, C.sandLight);
    F.box(0, 24.2, tz, s - 0.4, 4, s - 0.4, C.sand, { skip: 'b' });
    if (near) for (let k = 0; k < 4; k++) b.at(0, 0, tz, (k * Math.PI) / 2, () => { for (const x of [-2.4, 0, 2.4]) G.rect(x, 25.2, s / 2 - 0.17, 0.9, 1.5, ROW.pane); });
    F.box(0, 28.0, tz, s + 0.6, 0.25, s + 0.6, C.sandLight);
    spire(F, chamfer(s + 0.6, s + 0.6, 0, 0, tz), 28.25, 37, C.roof, { ax: 0, az: tz, g: [0.86, 1.06] });
    F.box(0, 35.4, tz, 1.8, 3.4, 1.8, C.sandLight);
    if (near) for (let k = 0; k < 4; k++) b.at(0, 0, tz, (k * Math.PI) / 2, () => G.extrude(arch(0, 0.9, 37.0, 1.4, 5), 0.9, 0.93, C.dark, { caps: 'f', sides: false }));
    spire(F, chamfer(2.2, 2.2, 0, 0, tz), 38.8, 42.5, C.roofDark, { ax: 0, az: tz });
    F.ball(0, 42.8, tz, 0.35, CITY.gold, { ws: 6, hs: 4 });
    // Laubenhäuser links und rechts (Front 1,5 m hinter dem Turm)
    laubenHaus(b, -22, -5, -1.5, 13.4, C.sand);
    laubenHaus(b, 5, 22, -1.5, 12.6, mix(C.sand, 0xffffff, 0.12));
    return { w: 44, d: 16, h: 43 };
  });

  const ZH = { wall: 0xeee3cc, wallDark: 0xd8cbb0, cap: 0x5d646e, roof: 0x9a5a44, dark: 0x5a5048, water: 0x6fb0c4, bed: 0x4f8fa8, quay: 0xcdc2ae, gold: 0xe6c25a };
  const BS = { wall: 0xc06a54, wallDark: 0xa2533f, cap: 0x8c4636, roof: 0x9a5a44, dark: 0x4f3a34, water: 0x6fb0c4, bed: 0x4f8fa8, quay: 0xcdbfa8, gold: 0xe6c25a, tiles: [0x5f9a6a, 0xe8c04a, 0xb5503c, 0x4c5058] };
  /** Münster mit zwei Westtürmen über dem Fluss: o.helm 'dome' (Zürich) oder 'spire' (Basel), o.tiles buntes Dach. */
  function muenster(b, C, o) {
    const { F, G } = b;
    const near = !b.lod;
    waterFront(b, 100, -26, C);
    F.box(0, -1.2, -58, 100, 3.0, 64, C.quay, { skip: 'b' });
    const y0 = 1.8;
    // Häuser am Ufer links und rechts der Kirche
    houseRow(b, -49, -28, [[7, 12, 0xf1e3c4, 'x'], [6, 14.5, 0xe9c9a0, 'z'], [8, 13, 0xf6efe0, 'x'], [7, 15, 0xd9b8a0, 'z'], [7, 12.5, 0xe8dcc0, 'x']], { y: y0, d: 11 });
    houseRow(b, 14, -28, [[7, 13.5, 0xf6efe0, 'x'], [7, 15.5, 0xe9c9a0, 'z'], [8, 12, 0xf1e3c4, 'x'], [6, 14, 0xd9b8a0, 'z'], [7, 13, 0xe8dcc0, 'x']], { y: y0, d: 11 });
    // Westbau mit Portal, Langhaus, Dach
    F.box(0, y0, -43, 22, 22, 10, C.wall, { g: [0.86, 1.04], skip: 'b' });
    F.box(0, y0, -66, 20, 18, 36, C.wall, { g: [0.86, 1.04], skip: 'tb' });
    const ye = y0 + 18;
    const yr = ye + 9;
    if (o.tiles) {
      F.extrude([[-10, ye], [10, ye], [0, yr]], -84, -48, C.wallDark, { sides: false });
      chevronRoof(b, [-10.6, ye - 0.3, -84.3], [-10.6, ye - 0.3, -47.8], [0, yr + 0.1, -47.8], [0, yr + 0.1, -84.3], near ? 12 : 4, near ? 8 : 3, o.tiles, { teeth: 4, bands: 4 });
      chevronRoof(b, [10.6, ye - 0.3, -47.8], [10.6, ye - 0.3, -84.3], [0, yr + 0.1, -84.3], [0, yr + 0.1, -47.8], near ? 12 : 4, near ? 8 : 3, o.tiles, { teeth: 4, bands: 4 });
      F.quad([-10.6, ye - 0.3, -47.8], [-10.6, ye - 0.3, -84.3], [10.6, ye - 0.3, -84.3], [10.6, ye - 0.3, -47.8], C.wallDark);
    } else {
      b.at(0, 0, -66, 0, () => F.extrude([[-10, ye], [10, ye], [0, yr]], -18, 18, C.wall));
      b.gable(0, ye, -66, 20, 36, 9, C.roof, { axis: 'z', oe: 0.5, og: 0.4, ridge: near });
    }
    b.at(0, 0, -38, 0, () => {
      darkArch(b, 0, y0, 4.2, 7, C.dark);
      if (near) for (const x of [-6.5, 6.5]) darkArch(b, x, y0 + 9, 1.6, 3.6, C.dark, o.helm === 'spire');
    });
    for (const s of [-1, 1]) {
      b.at(s * 10, 0, -66, (s * Math.PI) / 2, () => {
        for (let i = 0; i < 5; i++) darkArch(b, -14 + i * 7, y0 + 8, 2.2, 6, C.dark, o.helm === 'spire');
      });
    }
    // Türme
    for (const s of [-1, 1]) {
      const tx = s * 6.5;
      const tz = -43;
      F.box(tx, y0 + 22, tz, 9, 12, 9, C.wall, { g: [0.9, 1.04] });
      F.box(tx, y0 + 33.8, tz, 9.6, 0.5, 9.6, C.wallDark);
      b.at(tx, 0, tz + 4.5, 0, () => {
        dial(b, 0, y0 + 30.5, 1.6);
        if (near) darkArch(b, 0, y0 + 24, 1.4, 3.2, C.dark, o.helm === 'spire');
      });
      const oct = ngon(8, 4.7, Math.PI / 8, 0, 0, tx, tz);
      prism(F, oct, y0 + 34.3, y0 + 42, C.wall, { g: [0.92, 1.04] });
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * TAU;
        b.at(tx + Math.sin(a) * 4.32, 0, tz + Math.cos(a) * 4.32, a, () => G.extrude(arch(0, 1.3, y0 + 35.6, 4.0, near ? 6 : 3, o.helm === 'spire'), 0.02, 0.05, C.dark, { caps: 'f', sides: false }));
      }
      if (o.helm === 'spire') {
        spire(F, ngon(8, 5.0, Math.PI / 8, 0, 0, tx, tz), y0 + 42, y0 + 62, C.cap, { ax: tx, az: tz, g: [0.86, 1.08], bottom: true });
        F.ball(tx, y0 + 62.3, tz, 0.4, C.gold, { ws: 6, hs: 4 });
        if (near) for (let k = 0; k < 4; k++) {
          const a = (k / 4) * TAU + Math.PI / 4;
          pinnacle(b, tx + Math.sin(a) * 5.3, tz + Math.cos(a) * 5.3, y0 + 40, y0 + 43, 0.8, 2.6, C.wallDark);
        }
      } else {
        F.lathe(tx, y0 + 42, tz, [[5.0, 0], [5.1, 0.6], [4.7, 2.6], [3.5, 4.6], [1.7, 6.0], [0.3, 6.7]], C.cap, { seg: near ? 16 : 8, g: [0.86, 1.08], bottom: true });
        F.ball(tx, y0 + 48.9, tz, 0.5, C.gold, { ws: 6, hs: 4 });
      }
    }
    return { w: 100, d: 90, h: o.helm === 'spire' ? 65 : 51 };
  }
  landmark('grossmuenster', { places: ['Zürich'], slot: 'skyline', title: 'Münster mit Doppelturm' }, (b) => muenster(b, ZH, { helm: 'dome' }));
  landmark('baslerMuenster', { places: ['Basel'], slot: 'skyline', title: 'Münster am Rhein' }, (b) => muenster(b, BS, { helm: 'spire', tiles: BS.tiles }));

  // ===========================================================================================================
  // Spanien und Portugal: Palma (Kathedrale am Meer), Barcelona (Basilika mit Turmspitzen), Lissabon/Funchal (Tram)
  // ===========================================================================================================
  const PALMA = { stone: 0xe3c896, stoneDark: 0xc9ab78, stoneLight: 0xf0dcb0, roof: 0xc7a777, water: 0x6fb6d0, bed: 0x4f97b3, wall: 0xd9bd8a, quay: 0xeadcc0, lawn: 0x9cc46c, dark: 0x6a5a48 };
  landmark('laSeu', { places: ['Palma'], slot: 'skyline', far: true, title: 'Kathedrale am Meer' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = PALMA;
    // vorn der Teich des Parks am Meer mit Palmenweg, dahinter die geböschte Stadtmauer, oben die Kathedrale
    waterFront(b, 140, -26, C);
    F.frust(0, -1.2, -31, 140, 10, 140, 8, 10.2, C.wall, { g: [0.88, 1.04], skip: 'b' });
    F.box(0, -1.2, -62.5, 140, 10.2, 55, C.quay, { skip: 'bf' });
    if (near) merlons(b, -69, 69, 9, -27.4, 0.8, C.wall);
    for (let x = -60; x <= 60; x += 15) palm(b, x, 1.0, -2.2, 8.5, 0.5, x);
    const y0 = 9;
    // Kapellenkranz vorn (niedrig), Hochschiff dahinter, flaches Dach
    F.box(0, y0, -44, 90, 17, 8, C.stone, { g: [0.86, 1.04], skip: 'b' });
    F.box(0, y0, -59, 90, 34, 22, C.stone, { g: [0.86, 1.04], skip: 'tb' });
    b.at(0, 0, -59, Math.PI / 2, () => F.extrude([[-11, y0 + 34], [11, y0 + 34], [0, y0 + 38]], -45, 45, C.stoneDark));
    b.gable(0, y0 + 34, -59, 90, 22, 4, C.roof, { axis: 'x', oe: 0.4, og: 0.4, ridge: near });
    // Strebepfeiler mit Fialen, Strebebögen zum Hochschiff, hohe Spitzbogenfenster
    for (let k = 0; k <= 9; k++) {
      const x = -45 + k * 10;
      pinnacle(b, x, -39.2, y0, y0 + 38, 2.2, 5, C.stoneLight);
      F.rod([x, y0 + 30, -39.2], [x, y0 + 33, -48], 0.6, C.stoneDark, { seg: 5 });
      if (near && k > 0 && k < 9) F.rod([x, y0 + 17, -40.3], [x, y0 + 21, -48], 0.5, C.stoneDark, { seg: 5 });
    }
    b.at(0, 0, -48, 0, () => {
      for (let k = 0; k < 9; k++) lancet(b, -40 + k * 10, y0 + 19.5, 3.0, 11, C.dark);
    });
    b.at(0, 0, -40, 0, () => {
      for (let k = 0; k < 9; k++) lancet(b, -40 + k * 10, y0 + 5, 2.4, 8, C.dark);
    });
    // Ostseite (links) mit Fensterrose, Westseite (rechts) mit zwei Ecktürmchen
    b.at(-45, 0, -59, -Math.PI / 2, () => {
      G.disc(0, y0 + 25, 0.05, 4.2, C.stoneLight, { seg: near ? 20 : 10 });
      G.disc(0, y0 + 25, 0.08, 3.4, 0x5c6a86, { seg: near ? 20 : 10 });
    });
    for (const z of [-48.5, -69.5]) pinnacle(b, 45.5, z, y0, y0 + 44, 3.0, 6, C.stoneLight);
    // Glockenturm hinten rechts
    F.box(36, y0, -78, 9, 40, 9, C.stone, { g: [0.86, 1.04], skip: 'b' });
    F.box(36, y0 + 40, -78, 10, 1, 10, C.stoneLight);
    if (near) {
      merlons(b, 31.6, 40.4, y0 + 41, -73.2, 0.6, C.stoneLight);
      b.at(36, 0, -73.5, 0, () => darkArch(b, 0, y0 + 33, 2.2, 4.2, C.dark));
    }
    return { w: 140, d: 90, h: 58 };
  });

  const SAG = { stone: 0xd9bf94, stoneDark: 0xbfa274, stoneLight: 0xe8d4ae, red: 0xd2453a, yellow: 0xf2c94a, white: 0xf6f2e8, green: 0x6aa35a, crane: 0xf0c03a, craneDark: 0xb98f2a, plaza: 0xd9cdb6, lawn: 0x9cc46c, water: 0x7cc0d8, dark: 0x5f5244 };
  /** Schlanker Turm im Bienenkorb-Profil (Radius r, Höhe h) mit Schallschlitzen vorn und bunter Spitze (cols). */
  function gaudiTower(b, x, z, r, h, cols, o = {}) {
    const { F, G } = b;
    const near = !b.lod;
    const seg = near ? 12 : 7;
    const prof = o.prof ?? [[r, 0], [r * 0.97, h * 0.3], [r * 0.88, h * 0.55], [r * 0.7, h * 0.75], [r * 0.45, h * 0.88], [r * 0.2, h * 0.95]];
    F.lathe(x, 0, z, prof, SAG.stone, { seg, g: [0.86, 1.06], top: false });
    // Spitze: weißer Hals aus der Öffnung, bunte Kugel mit Kranz (vereinfachte Mosaikspitze)
    const [rt, yt] = prof[prof.length - 1];
    const yb = yt + 0.04 * h + rt * 1.2;
    F.cyl(x, yt - 0.2, z, rt, rt * 1.5, 0.04 * h + 0.2, SAG.white, { seg: 6 });
    F.ball(x, yb, z, rt * 1.8, cols[0], { ws: near ? 10 : 6, hs: near ? 6 : 4 });
    if (near) for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      F.ball(x + Math.sin(a) * rt * 1.8, yb, z + Math.cos(a) * rt * 1.8, rt * 0.65, cols[1], { ws: 5, hs: 3 });
    }
    if (!near) return;
    // Schallschlitze auf den Flächenmitten der Vorderseite, versetzt wie eine Spirale
    const rAt = (y) => {
      for (let i = 0; i + 1 < prof.length; i++) {
        if (y <= prof[i + 1][1]) return prof[i][0] + ((prof[i + 1][0] - prof[i][0]) * (y - prof[i][1])) / (prof[i + 1][1] - prof[i][1]);
      }
      return prof[prof.length - 1][0];
    };
    for (let y = h * 0.18, i = 0; y < h * 0.72; y += h * 0.06, i++) {
      const a = ((i % 4) - 1.5) * (TAU / seg);
      const rr = rAt(y + 1) * Math.cos(Math.PI / seg) + 0.04;
      b.at(x + Math.sin(a) * rr, 0, z + Math.cos(a) * rr, a, () => G.rect(0, y, 0, r * 0.22, 2.0, SAG.dark));
    }
  }
  /** Turmdrehkran (gelb): Gittermast bis h, Ausleger nach ry, Gegengewicht. */
  function towerCrane(b, x, z, h, ry, len) {
    const { F } = b;
    const near = !b.lod;
    b.at(x, 0, z, ry, () => {
      for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) F.box(sx * 0.8, 0, sz * 0.8, 0.28, h, 0.28, SAG.crane);
      if (near) for (let y = 3; y < h - 2; y += 3) legFrameAt(b, 0, 0, y, 0.8, 0.08, SAG.craneDark);
      F.box(0, h, 0, 2.2, 2.2, 2.2, SAG.crane);
      F.box(len / 2 - 2, h + 1.2, 0, len, 1.0, 1.0, SAG.crane);
      F.box(-6, h + 1.2, 0, 12, 1.0, 1.4, SAG.crane);
      F.box(-10, h - 0.6, 0, 3, 2.2, 2.2, SAG.stoneDark);
      F.box(0, h + 2.2, 0, 1.0, 4, 1.0, SAG.crane);
      F.rod([0, h + 6.2, 0], [len * 0.8, h + 1.7, 0], 0.07, SAG.craneDark, { seg: 3 });
      F.rod([0, h + 6.2, 0], [-10, h + 1.7, 0], 0.07, SAG.craneDark, { seg: 3 });
      F.box(1.6, h - 1.6, 0.9, 1.4, 1.6, 1.4, 0xf6f2e8);
      F.rod([len * 0.6, h + 0.7, 0], [len * 0.6, h * 0.55, 0], 0.05, SAG.dark, { seg: 3 });
      F.box(len * 0.6, h * 0.55 - 0.6, 0, 0.6, 0.6, 0.6, SAG.red);
    });
  }
  landmark('sagrada', { places: ['Barcelona'], slot: 'skyline', far: true, title: 'Basilika mit Turmspitzen' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = SAG;
    F.box(0, 0, -40, 100, 0.12, 80, C.plaza, { skip: 'b' });
    // Teich mit Rasen vorn links (spiegelt die Geburtsfassade), Bäume
    F.box(-30, 0.12, -7, 30, 0.08, 12, C.lawn, { skip: 'b' });
    pond(b, -30, -7, 22, 7, 0.2, C.water, C.stoneLight);
    if (near) for (const [x, z] of [[-44, -3], [-16, -3], [-44, -11], [30, -4], [42, -6]]) ballTree(b, x, 0.12, z, 2.2, 6.2, PAL.crown[(x > 0) | 0]);
    // Kirchenschiff und Querhaus, Dach mit Laternen
    F.box(0, 0, -40, 32, 34, 50, C.stone, { g: [0.84, 1.04], skip: 'tb' });
    b.at(0, 0, -40, 0, () => F.extrude([[-16, 34], [16, 34], [0, 44]], -25, 25, C.stoneDark));
    b.gable(0, 34, -40, 32, 50, 10, C.stoneLight, { axis: 'z', oe: 0.4, og: 0.4, ridge: near });
    F.box(0, 0, -40, 66, 28, 16, C.stone, { g: [0.84, 1.04], skip: 'b' });
    b.at(0, 0, -15, 0, () => {
      for (let k = 0; k < 3; k++) darkArch(b, -8 + k * 8, 0.12, 4.2, 9, C.dark, true);
      if (near) for (let k = 0; k < 7; k++) lancet(b, -12 + k * 4, 16, 1.4, 6, C.dark);
    });
    // Zypresse auf der Fassade mit weißen Tauben
    F.lathe(0, 34, -14.6, [[2.6, 0], [2.4, 3], [1.4, 7], [0.2, 10]], C.green, { seg: near ? 10 : 6, g: [0.9, 1.1] });
    if (near) for (let i = 0; i < 6; i++) F.ball(Math.sin(i * 2.2) * 1.8, 35.5 + (i % 3) * 2.2, -12.8 - (i % 2) * 0.4, 0.3, C.white, { ws: 5, hs: 3 });
    // vier Türme vorn, vier hinten, vier Evangelistentürme, Mittelturm und Marienturm
    for (const [x, h] of [[-13.5, 74], [-4.5, 84], [4.5, 84], [13.5, 74]]) gaudiTower(b, x, -16, 3.6, h, [C.red, C.yellow]);
    for (const [x, h] of [[-13.5, 70], [-4.5, 80], [4.5, 80], [13.5, 70]]) gaudiTower(b, x, -64, 3.3, h, [C.yellow, C.white]);
    for (const [x, z] of [[-10, -30], [10, -30], [-10, -50], [10, -50]]) gaudiTower(b, x, z, 4.4, 102, [C.white, C.yellow]);
    gaudiTower(b, 0, -55, 5.0, 104, [C.white, C.white]);
    gaudiTower(b, 0, -40, 7.4, 128, [C.white, C.white], { prof: [[7.4, 0], [7.2, 50], [6.6, 85], [5.0, 108], [2.6, 120], [1.2, 125]] });
    towerCrane(b, 34, -60, 88, 2.6, 42);
    towerCrane(b, -36, -24, 70, -0.4, 34);
    return { w: 100, d: 80, h: 134 };
  });

  const LIS = { tram: 0xf2c43a, roofW: 0xf3efe4, rail: 0x8a8f96, chassis: 0x55585e, cobble: 0xdcd4c6, wall: 0xf1e8d6, roof: 0xc8664a, church: 0xf6f2ea, green: 0x7fb069, pane: 0x4f5a66, pole: 0x6d7278 };
  const LIS_COLS = [0xf6d27a, 0xf2a7a0, 0x9fc8e8, 0xf6efe2, 0xb9dcb0, 0xf3b97c, 0xe9b8d8, 0xf9e7b0];
  /** Gelbe Straßenbahn (Länge 8,4 m) längs x um (x, z): runde Ecken, Fensterband, Stromabnehmer. */
  function tramCar(b, x, z) {
    const { F, G } = b;
    const near = !b.lod;
    const C = LIS;
    F.box(x, 0.15, z, 6.4, 0.45, 2.0, C.chassis, { skip: 'b' });
    if (near) for (const dx of [-2.2, 2.2]) for (const s of [-1, 1]) b.xf([x + dx, 0.55, z + s * 0.95], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, -0.12, 0, 0.42, 0.42, 0.24, C.chassis, { seg: 8, bottom: true }));
    F.rbox(x, 0.6, z, 8.4, 1.45, 2.5, 0.45, C.tram, { seg: near ? 3 : 1, prof: [[0.05, 0], [0, 0.25], [0, 1.45]] });
    F.rbox(x, 2.05, z, 8.3, 1.15, 2.42, 0.42, C.tram, { seg: near ? 3 : 1 });
    F.rbox(x, 3.2, z, 8.4, 0.35, 2.5, 0.45, C.roofW, { seg: near ? 3 : 1, prof: [[0, 0], [0.25, 0.35]] });
    // Fensterband auf dem Oberteil (halbe Tiefe 1,21), heller Streifen und Lampen auf dem Unterteil (1,25)
    for (const s of [-1, 1]) b.at(x, 0, z, s > 0 ? 0 : Math.PI, () => {
      for (let i = 0; i < 6; i++) G.rect(-3.0 + i * 1.2, 2.12, 1.23, 0.96, 0.92, C.pane, { g: [1.12, 0.75] });
      if (near) G.rect(0, 1.2, 1.27, 7.4, 0.12, C.roofW);
    });
    for (const s of [-1, 1]) b.at(x, 0, z, (s * Math.PI) / 2, () => {
      G.rect(0, 2.12, 4.17, 1.4, 0.92, C.pane, { g: [1.12, 0.75] });
      if (near) G.disc(0, 1.2, 4.22, 0.16, 0xfff1b8, { seg: 8 });
    });
    F.rod([x - 1.4, 3.5, z], [x + 2.2, 6.15, z], 0.05, C.pole, { seg: 4 });
  }
  landmark('tramHuegel', { places: ['Lissabon', 'Funchal'], slot: 'skyline', title: 'Gelbe Tram am Hang' }, (b) => {
    const { F } = b;
    const near = !b.lod;
    const C = LIS;
    // Kopfsteinpflaster mit Gleisen, darauf die Tram; dahinter vier Häuserreihen, jede 6,5 m höher; oben die Kirche
    F.box(0, 0, -6, 100, 0.12, 12, C.cobble, { skip: 'b' });
    for (const dz of [-0.72, 0.72]) F.box(0, 0.12, -6 + dz, 100, 0.04, 0.14, C.rail, { skip: 'b' });
    tramCar(b, 6, -6);
    F.rod([-50, 6.2, -6], [50, 6.2, -6], 0.04, C.pole, { seg: 3 });
    for (const x of [-30, 30]) {
      F.cyl(x, 0.12, -11.2, 0.16, 0.12, 7.0, C.pole, { seg: 6 });
      F.rod([x, 6.6, -11.2], [x, 6.6, -6], 0.06, C.pole, { seg: 3 });
      F.rod([x, 6.6, -6], [x, 6.2, -6], 0.04, C.pole, { seg: 3 });
    }
    for (let k = 0; k < 4; k++) {
      const y = k * 6.5;
      const z = -12 - k * 11;
      // Terrasse: Stützmauer (hell), oben ein Pflasterweg vor der Zeile
      if (k > 0) {
        F.box(0, 0, z - 4.5, 100, y, 13, C.wall, { skip: 'tb' });
        F.quad([-50, y, z + 2], [50, y, z + 2], [50, y, z - 11], [-50, y, z - 11], C.cobble);
      }
      const list = [];
      let w = 0;
      for (let i = 0; w < 92; i++) {
        const hw = 6 + ((i * 7 + k * 3) % 4);
        list.push([hw, 9 + ((i * 5 + k * 2) % 4) * 1.3, LIS_COLS[(i + k * 3) % LIS_COLS.length], (i + k) % 3 === 0 ? 'z' : 'x']);
        w += hw;
      }
      houseRow(b, -w / 2, z, list, { y, d: 9, fh: 3.0 });
    }
    // oben: helle Kirche mit zwei Glockentürmen, Hang mit Bäumen
    const cy = 26;
    const cz = -56;
    F.box(0, 0, cz - 15, 100, cy, 34, C.wall, { skip: 'tbf' });
    F.quad([-50, cy, cz + 2], [50, cy, cz + 2], [50, cy, cz - 32], [-50, cy, cz - 32], C.green);
    F.box(10, cy, cz - 9, 18, 13, 18, C.church, { g: [0.88, 1.04], skip: 'tb' });
    b.at(10, 0, cz - 9, 0, () => F.extrude([[-9, cy + 13], [9, cy + 13], [0, cy + 17.5]], -9, 9, C.church));
    b.gable(10, cy + 13, cz - 9, 18, 18, 4.5, C.roof, { axis: 'z', oe: 0.4, og: 0.4, ridge: near });
    for (const s of [-1, 1]) {
      F.box(10 + s * 11.5, cy, cz - 2.5, 5, 21, 5, C.church, { g: [0.88, 1.04], skip: 'b' });
      F.lathe(10 + s * 11.5, cy + 21, cz - 2.5, [[3.0, 0], [2.6, 1.6], [1.4, 3.2], [0.15, 4.0]], C.roof, { seg: near ? 10 : 6, bottom: true });
      b.at(10 + s * 11.5, 0, cz, 0, () => darkArch(b, 0, cy + 15, 1.6, 3.0));
    }
    b.at(10, 0, cz, 0, () => darkArch(b, 0, cy, 2.6, 4.4));
    if (near) for (const [x, z] of [[-34, -60], [-20, -66], [-44, -70], [36, -64], [44, -72], [-8, -76]]) ballTree(b, x, cy, z, 2.4, 6.8, PAL.crown[(x > 0) | 0]);
    return { w: 100, d: 90, h: 52 };
  });

  // ===========================================================================================================
  // Kopenhagen: bunte Hafenhäuser am Kanal mit alten Holzschiffen
  // ===========================================================================================================
  const NYH = { water: 0x6fa9c2, bed: 0x4f8aa8, quay: 0xc2b8a8, wood: 0x9a7350, deck: 0xc49a6c, mast: 0xb08a5c, sail: 0xf2ece0, trim: 0xf4efe4, hulls: [0x3f6fa8, 0xb5443a, 0x3f7a5a, 0x4c5058] };
  const NYH_ROW = [[7, 13, 0xf2c94a, 'x'], [6, 15.5, 0xe9894a, 'z'], [8, 12.5, 0x6f9fd0, 'x'], [5.5, 14, 0xd8574a, 'z'], [7.5, 16, 0xf6e7c8, 'x'], [6, 13.5, 0xf2b8a0, 'z'], [7, 15, 0x7fbfa0, 'x'], [6.5, 12, 0xf2c94a, 'z'], [8, 14.5, 0xb0b8c8, 'x']];
  /** Altes Holzschiff längs x um (x, z), Wasserlinie bei y: runder Rumpf, Deck, ein oder zwei Masten mit gerefften Segeln. */
  function woodBoat(b, x, y, z, len, hull, masts = 1) {
    const { F } = b;
    const near = !b.lod;
    const C = NYH;
    const sx = len / 2.6;
    F.lathe(x, y - 0.5, z, [[0.25, 0], [1.0, 0.5], [1.3, 1.35], [1.14, 1.45], [1.1, 1.25]], [hull, hull, C.trim, C.wood, C.deck], { seg: near ? 14 : 8, sx });
    if (near) F.box(x - len * 0.18, y + 0.75, z, len * 0.22, 0.7, 1.2, C.wood);
    for (let m = 0; m < masts; m++) {
      const mx = x + (masts === 1 ? 0.1 : (m - 0.5) * len * 0.38);
      const mh = 8.5 - m * 1.5;
      F.cyl(mx, y + 0.75, z, 0.13, 0.07, mh, C.mast, { seg: 5 });
      F.rod([mx, y + 2.4, z], [mx + len * 0.3, y + 2.0, z], 0.07, C.mast, { seg: 4 });
      F.rod([mx, y + 2.6, z], [mx + len * 0.28, y + 2.25, z], 0.18, C.sail, { seg: 5 });
      if (near) F.rod([mx, y + 0.75 + mh, z], [x + len * 0.48, y + 1.0, z], 0.035, C.mast, { seg: 3 });
    }
  }
  landmark('nyhavn', { places: ['Kopenhagen', 'Hirtshals', 'Halsskov'], slot: 'square', title: 'Bunte Hafenhäuser' }, (b) => {
    const { F } = b;
    const C = NYH;
    waterFront(b, 64, -20, C);
    F.box(0, -1.2, -27, 64, 2.4, 14, C.quay, { skip: 'b' });
    houseRow(b, -30.75, -24, NYH_ROW, { y: 1.2, d: 10, fh: 3.1 });
    woodBoat(b, -18, 0.3, -9, 11, C.hulls[0], 2);
    woodBoat(b, 2, 0.3, -15.5, 9, C.hulls[1], 1);
    woodBoat(b, 19, 0.3, -9.5, 10, C.hulls[2], 1);
    return { w: 64, d: 34, h: 23 };
  });
  // ===========================================================================================================
  // Norden: Stockholm (Rathaus mit drei Kronen), Oslo (Oper), Helsinki (weiße Kathedrale), Polarkreis
  // ===========================================================================================================
  const STO = { brick: 0xb05a40, brickDark: 0x93492f, brickLight: 0xc77a5c, copper: 0x7fb39c, copperDark: 0x5f9a86, gold: 0xe6c25a, water: 0x6fa9c2, bed: 0x4f8aa8, quay: 0xc9bfae, pane: 0x4c5562, dark: 0x5a4038, lawn: 0x8fbf63 };
  /** Krone aus Gold (Reif mit fünf Zacken) um (x, y, z), Radius r. */
  function crown(b, x, y, z, r) {
    const { G } = b;
    G.lathe(x, y, z, [[r, 0], [r * 1.12, r * 0.55]], STO.gold, { seg: 8, top: false, bottom: true });
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU;
      G.cyl(x + Math.sin(a) * r * 1.05, y + r * 0.5, z + Math.cos(a) * r * 1.05, r * 0.16, 0.02, r * 0.55, STO.gold, { seg: 4 });
    }
  }
  landmark('stadshuset', { places: ['Stockholm'], slot: 'skyline', title: 'Rathaus mit drei Kronen' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = STO;
    waterFront(b, 100, -24, C);
    F.box(0, -1.2, -55, 100, 2.6, 62, C.quay, { skip: 'b' });
    const y0 = 1.4;
    // langer Ziegelbau mit Kupferdach, unten zum Wasser eine Bogenhalle
    F.box(-10, y0, -52, 60, 20, 34, C.brick, { g: [0.86, 1.04], skip: 'tb' });
    b.hip(-10, y0 + 20, -52, 60, 34, 7, C.copper, { oe: 0.5 });
    b.at(-10, 0, -35, 0, () => {
      for (let i = 0; i < 9; i++) darkArch(b, -26 + i * 6.5, y0, 3.4, 5.2, C.dark);
      for (let r = 0; r < 2; r++) for (let i = 0; i < 14; i++) {
        const x = -27.3 + i * 4.2;
        if (near) G.rect(x, y0 + 8.2 + r * 5.6, 0.02, 1.5, 3.3, C.brickLight);
        darkArch(b, x, y0 + 8.4 + r * 5.6, 1.1, 2.9, C.pane);
      }
    });
    // Turm an der Ecke: Ziegelschaft, Glockenstube, Kupferhaube, Spitze mit drei goldenen Kronen
    const tx = 28;
    const tz = -42;
    loft(F, [[chamfer(13, 13, 0, tx, tz), y0], [chamfer(12, 12, 0, tx, tz), y0 + 62]], C.brick, { g: [0.84, 1.04], top: false });
    F.box(tx, y0 + 62, tz, 13, 1.2, 13, C.brickLight);
    F.box(tx, y0 + 63.2, tz, 11, 7, 11, C.brick, { skip: 'b' });
    around(b, tx, tz, 11, 11, () => {
      for (const x of [-3, 0, 3]) darkArch(b, x, y0 + 63.6, 1.8, 5.6, C.dark);
    });
    F.box(tx, y0 + 70.2, tz, 12.4, 0.8, 12.4, C.copperDark);
    F.lathe(tx, y0 + 71, tz, [[5.8, 0], [5.0, 2.4], [3.0, 4.4], [1.6, 5.4], [1.0, 6.4], [0.5, 9.8]], C.copper, { seg: near ? 12 : 8, g: [0.88, 1.06] });
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU + 0.4;
      F.rod([tx, y0 + 80.4, tz], [tx + Math.sin(a) * 1.0, y0 + 81.4, tz + Math.cos(a) * 1.0], 0.12, C.gold, { seg: 4 });
      crown(b, tx + Math.sin(a) * 1.0, y0 + 81.4, tz + Math.cos(a) * 1.0, 0.75);
    }
    // Schaft verjüngt sich von 6,5 auf 6 m halbe Breite: Fenster und Uhr folgen der Wand
    const face = (y) => tz + 6.5 - (0.5 * (y - y0)) / 62;
    b.at(tx, 0, face(y0 + 56), 0, () => dial(b, 0, y0 + 56, 2.0));
    for (let k = 0; k < 6; k++) b.at(tx, 0, face(y0 + 9.7 + k * 7.6), 0, () => G.rect(0, y0 + 8 + k * 7.6, 0.03, 1.2, 3.4, C.pane));
    // Garten mit Bäumchen zwischen Bau und Wasser
    F.box(-10, y0, -30, 60, 0.08, 9, C.lawn, { skip: 'b' });
    if (near) for (let i = 0; i < 6; i++) ballTree(b, -36 + i * 10, y0 + 0.08, -29.5, 1.6, 4.6, PAL.crown[i % 2]);
    return { w: 100, d: 86, h: 84 };
  });

  const OSL = { marble: 0xf2f1ec, marbleDark: 0xdcdad3, glass: 0x8fb0c4, alu: 0xe0e2e2, aluDark: 0xc4c8cb, water: 0x6fa9c2, bed: 0x4f8aa8, quay: 0xd6d3cb, coat: [0xd2453a, 0xf2c94a, 0x3f7ab8, 0x3f8f5a, 0xf08a3a] };
  landmark('operaOslo', { places: ['Oslo'], slot: 'skyline', title: 'Weißes Opernhaus' }, (b) => {
    const { F, G, W } = b;
    const near = !b.lod;
    const C = OSL;
    // Fjord vorn; das weiße Dach steigt aus dem Wasser bis 16 m, links fällt es seitlich ab, rechts das Glasfoyer
    F.box(0, -1.2, -13, 120, 0.8, 26, C.bed, { skip: 'b' });
    W.poolRect(0, 0.3, -13, 120, 26, C.water, { rings: 0.03 });
    F.box(0, -1.2, -56, 120, 1.6, 60, C.quay, { skip: 'b' });
    b.at(-10, 0, 0, Math.PI / 2, () => F.extrude([[10, 0], [42, 16], [70, 16], [70, 0]], -30, 30, C.marble, { g: [0.94, 1.04] }));
    F.extrude([[-58, 0.1], [-40, 0.1], [-40, 16]], -70, -42, C.marbleDark, { g: [0.94, 1.04] });
    F.box(30, 15.4, -48, 20, 0.6, 44, C.marble);
    F.box(30, 0.4, -50, 20, 15, 40, C.marbleDark, { skip: 'fbt' });
    b.at(30, 0, -30, 0, () => {
      G.rect(0, 0.4, 0, 20, 15, C.glass, { g: [1.12, 0.78] });
      if (near) for (let i = 1; i < 8; i++) G.rect(-10 + i * 2.5, 0.4, 0.02, 0.16, 15, C.aluDark);
    });
    // Bühnenturm mit senkrechten Lamellen
    F.box(0, 16, -58, 24, 16, 18, C.alu, { g: [0.9, 1.04], skip: 'b' });
    b.at(0, 0, -49, 0, () => { for (let i = 0; i < 11; i++) G.rect(-10 + i * 2, 17, 0.02, 0.5, 14, C.aluDark); });
    // Leute auf dem Dach (Spaziergänger in bunten Jacken)
    if (near) for (let i = 0; i < 9; i++) {
      const x = -34 + i * 6.4 + (i % 2) * 1.5;
      const z = -16 - ((i * 7) % 24);
      const y = Math.min(16, (-z - 10) * 0.5);
      F.cyl(x, y, z, 0.28, 0.24, 1.2, C.coat[i % C.coat.length], { seg: 6 });
      F.ball(x, y + 1.45, z, 0.24, 0xf0c8a8, { ws: 6, hs: 4 });
    }
    return { w: 120, d: 86, h: 32 };
  });

  const HEL = { white: 0xf6f4ee, whiteDark: 0xe2ded4, green: 0x6fae8f, gold: 0xe6c25a, step: 0xd9d2c4, plaza: 0xcfc6b6, pane: 0x5c6a78, dark: 0x6a7480 };
  /** Säulenvorhalle mit Giebel vor einer Wand (Ebene z = 0): n Säulen über die Breite w, Höhe h ab y. */
  function portico(b, y, w, h, n, d, col) {
    const { F } = b;
    const near = !b.lod;
    for (let i = 0; i < n; i++) F.cyl(-w / 2 + 0.8 + (i * (w - 1.6)) / (n - 1), y, d - 0.9, 0.6, 0.52, h, col, { seg: near ? 10 : 6, top: false });
    F.box(0, y + h, d / 2, w + 0.6, 1.6, d + 0.2, col);
    F.extrude([[-w / 2 - 0.3, y + h + 1.6], [w / 2 + 0.3, y + h + 1.6], [0, y + h + 1.6 + w * 0.18]], 0, d + 0.1, col, { g: [0.95, 1.05] });
    F.box(0, y - 0.6, d / 2, w + 1.2, 0.6, d + 1.4, HEL.step);
  }
  landmark('helsinkiDom', { places: ['Helsinki'], slot: 'skyline', far: true, title: 'Weiße Kathedrale' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = HEL;
    F.box(0, 0, -45, 80, 0.12, 90, C.plaza, { skip: 'b' });
    // breite Freitreppe hinauf zur Terrasse (8,4 m)
    for (let i = 0; i < 14; i++) F.box(0, 0, -4 - i * 1.2 - 0.6, 50, (i + 1) * 0.6, 1.2, C.step, { skip: 'b' });
    F.box(0, 0, -50.4, 70, 8.4, 59.2, C.step, { skip: 'bf' });
    const y0 = 8.4;
    // Kreuzbau: Querarm, vorn und hinten kurze Arme mit Säulenvorhallen
    F.box(0, y0, -50, 34, 18, 22, C.white, { g: [0.88, 1.04], skip: 'b' });
    for (const s of [-1, 1]) F.box(0, y0, -50 + s * 14, 22, 18, 6, C.white, { g: [0.88, 1.04], skip: 'b' });
    b.at(0, 0, -33, 0, () => {
      portico(b, y0 + 0.6, 16, 11, 6, 4.2, C.white);
      darkArch(b, 0, y0, 3, 6, C.dark);
      for (const x of [-9.8, 9.8]) darkArch(b, x, y0 + 5, 1.6, 4, C.pane);
    });
    for (const s of [-1, 1]) b.at(s * 17, 0, -50, (s * Math.PI) / 2, () => {
      portico(b, y0 + 0.6, 12, 11, 4, 3.4, C.white);
      darkArch(b, 0, y0, 2.6, 5.4, C.dark);
    });
    // Tambour mit Säulen und Fenstern, grüne Hauptkuppel, Laterne
    const dz = -50;
    F.cyl(0, y0 + 18, dz, 8.6, 8.6, 12, C.white, { seg: near ? 16 : 10, top: false, g: [0.92, 1.04] });
    if (near) for (let i = 0; i < 16; i++) {
      // Säulen auf den Ecken des 16-Ecks, Fenster auf den Flächenmitten dazwischen
      const a = (i / 16) * TAU;
      F.cyl(Math.sin(a) * 9.0, y0 + 18, dz + Math.cos(a) * 9.0, 0.4, 0.36, 11.6, C.white, { seg: 6 });
      const am = a + TAU / 32;
      const rm = 8.6 * Math.cos(Math.PI / 16) + 0.03;
      if (i % 2 === 0) b.at(Math.sin(am) * rm, 0, dz + Math.cos(am) * rm, am, () => darkArch(b, 0, y0 + 22, 1.4, 4.2, C.pane));
    }
    F.cyl(0, y0 + 29.6, dz, 9.4, 9.4, 0.4, C.whiteDark, { seg: near ? 16 : 10 });
    F.lathe(0, y0 + 30, dz, [[9.4, 0], [9.2, 2.4], [8.0, 6], [6.0, 9], [3.2, 11.2], [1.5, 11.8]], C.green, { seg: near ? 20 : 12, g: [0.9, 1.06], bottom: true });
    F.cyl(0, y0 + 41.6, dz, 1.5, 1.4, 3.2, C.white, { seg: 10 });
    F.lathe(0, y0 + 44.8, dz, [[1.9, 0], [1.4, 1.2], [0.3, 2.2]], C.green, { seg: 10, bottom: true });
    F.ball(0, y0 + 47.3, dz, 0.45, C.gold, { ws: 6, hs: 4 });
    // vier kleine Eckkuppeln
    for (const [x, z] of [[-13.5, -42.5], [13.5, -42.5], [-13.5, -57.5], [13.5, -57.5]]) {
      F.cyl(x, y0 + 18, z, 2.4, 2.4, 4.2, C.white, { seg: near ? 12 : 8, top: false });
      F.lathe(x, y0 + 22.2, z, [[2.7, 0], [2.4, 1.4], [1.4, 2.6], [0.4, 3.2]], C.green, { seg: near ? 12 : 8, bottom: true });
      F.ball(x, y0 + 25.6, z, 0.3, C.gold, { ws: 6, hs: 3 });
    }
    return { w: 80, d: 90, h: 57 };
  });

  const ARC = { snow: 0xeef3f7, snowShade: 0xdfe7ee, line: 0x3f6fa8, log: 0xb5443a, logDark: 0x93382f, white: 0xf6f2ea, roof: 0x5a4a44, pine: 0x3f6f4f, pine2: 0x4f7f5a, fur: 0x8a6448, furLight: 0xd9c4a6, antler: 0xcab79a, nose: 0x5a4038, post: 0x8a6448, lamp: 0xffd98a, boards: [0xd2453a, 0xf2c94a, 0x3f7ab8, 0x3f8f5a] };
  /** Rentier, schaut nach +x (Mitte unter dem Bauch bei x, z), Schulterhöhe etwa 1,2 m. */
  function reindeer(b, x, z, ry) {
    const { F } = b;
    const near = !b.lod;
    const C = ARC;
    b.at(x, 0.15, z, ry, () => {
      F.ball(0, 1.15, 0, 0.62, C.fur, { ws: near ? 10 : 6, hs: near ? 6 : 4, sx: 1.45, sz: 0.85, g: [0.85, 1.05] });
      for (const [lx, lz] of [[0.55, 0.25], [0.55, -0.25], [-0.55, 0.25], [-0.55, -0.25]]) F.rod([lx, 0.95, lz], [lx, 0, lz], 0.1, C.fur, { seg: 5, r1: 0.08 });
      F.rod([0.7, 1.35, 0], [1.05, 1.9, 0], 0.22, C.fur, { seg: 6, r1: 0.18 });
      F.ball(1.15, 2.0, 0, 0.28, C.fur, { ws: 8, hs: 5, sx: 1.25 });
      F.ball(1.0, 1.55, 0, 0.26, C.furLight, { ws: 6, hs: 4 });
      F.ball(1.48, 1.96, 0, 0.09, C.nose, { ws: 5, hs: 3 });
      F.ball(-0.95, 1.35, 0, 0.16, C.white, { ws: 5, hs: 3 });
      if (near) for (const s of [-1, 1]) {
        F.rod([1.05, 2.2, s * 0.12], [0.95, 2.75, s * 0.42], 0.05, C.antler, { seg: 4 });
        F.rod([0.98, 2.5, s * 0.3], [1.25, 2.75, s * 0.36], 0.04, C.antler, { seg: 3 });
        F.rod([0.95, 2.75, s * 0.42], [0.75, 3.0, s * 0.5], 0.04, C.antler, { seg: 3 });
        F.ball(1.3, 2.12, s * 0.17, 0.05, C.nose, { ws: 4, hs: 2 });
      }
    });
  }
  /** Fichte mit Schnee: drei Kegel, jeder mit weißer Kappe. */
  function snowSpruce(b, x, z, h) {
    const { F } = b;
    const seg = b.lod ? 6 : 9;
    F.cyl(x, 0.1, z, 0.22, 0.18, h * 0.2, ARC.fur, { seg: 5, top: false });
    for (let i = 0; i < 3; i++) {
      const y = h * (0.15 + i * 0.25);
      const r = h * (0.3 - i * 0.075);
      F.lathe(x, y, z, [[r, 0], [r * 0.45, h * 0.24], [0.05, h * 0.36]], [i % 2 ? ARC.pine : ARC.pine2, ARC.snow], { seg, bottom: true });
    }
  }
  landmark('polarkreis', {
    places: ['Rovaniemi', 'Lappland'], slot: 'square', title: 'Polarkreis',
    extras: (kit) => {
      const m = textPanel(kit.core, 'sign:polarkreis', 3.6, 1.2, 512, (ctx, cw, ch) => {
        ctx.fillStyle = '#fdfbf5';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#2f5f9e';
        ctx.fillRect(8, 8, cw - 16, ch - 16);
        ctx.fillStyle = '#fdfbf5';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        fitFont(ctx, 'Polarkreis', Math.round(ch * 0.4), cw - 60);
        ctx.fillText('Polarkreis', cw / 2, ch * 0.38);
        fitFont(ctx, '66° 33′ N', Math.round(ch * 0.26), cw - 60);
        ctx.fillText('66° 33′ N', cw / 2, ch * 0.74);
      });
      m.position.set(-9, 3.05, -5.9);
      return [m];
    },
  }, (b) => {
    const { F, G, L } = b;
    const near = !b.lod;
    const C = ARC;
    F.box(0, 0, -12, 40, 0.15, 24, C.snow, { skip: 'b', g: [0.96, 1.02] });
    // die Linie quer über den Platz, darüber das Schild auf zwei Pfosten
    F.box(0, 0.15, -6, 40, 0.03, 0.5, C.line, { skip: 'b' });
    for (const x of [-10.9, -7.1]) F.cyl(x, 0.15, -6.25, 0.13, 0.12, 3.5, C.post, { seg: 6 });
    F.box(-9, 2.32, -6, 3.9, 1.46, 0.16, C.white);
    F.box(-9, 3.78, -6, 4.2, 0.12, 0.4, C.snow);
    // rote Blockhütte mit Schneedach, warmen Fenstern, Kranz und Laternen
    const hx = 7;
    const hz = -16;
    F.box(hx, 0.15, hz, 10, 3.6, 7, C.log, { g: [0.86, 1.04], skip: 'tb' });
    b.at(hx, 0, hz, Math.PI / 2, () => F.extrude([[-3.5, 3.75], [3.5, 3.75], [0, 6.3]], -5, 5, C.log));
    b.gable(hx, 3.75, hz, 10, 7, 2.55, C.snow, { axis: 'x', oe: 0.5, og: 0.4, t: 0.4, ridge: false, soffit: C.roof });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) F.box(hx + sx * 4.92, 0.15, hz + sz * 3.42, 0.3, 3.6, 0.3, C.white);
    F.box(hx + 2.6, 5.2, hz - 1, 0.8, 1.8, 0.8, C.logDark);
    F.box(hx + 2.6, 7.0, hz - 1, 1.0, 0.25, 1.0, C.snow);
    b.at(hx, 0, hz + 3.5, 0, () => {
      if (near) for (let i = 1; i < 9; i++) G.rect(0, 0.15 + i * 0.42, 0.015, 9.6, 0.05, C.logDark);
      G.rect(0, 0.15, 0.03, 1.3, 2.3, C.white);
      G.rect(0, 0.15, 0.05, 1.05, 2.15, C.roof);
      for (const x of [-3, 3]) {
        G.rect(x, 1.35, 0.03, 1.5, 1.3, C.white);
        (L ?? G).rect(x, 1.45, 0.05, 1.3, 1.1, C.lamp);
      }
      if (near) {
        b.xf([0, 2.0, 0.12], [Math.PI / 2, 0, 0], 1, () => F.torus(0, 0, 0, 0.32, 0.09, C.pine, { seg: 10, tube: 4 }));
        F.ball(0, 1.72, 0.2, 0.08, C.log, { ws: 5, hs: 3 });
        for (const x of [-1.0, 1.0]) (L ?? F).ball(x, 2.4, 0.25, 0.14, C.lamp, { ws: 6, hs: 4 });
      }
    });
    reindeer(b, -3.5, -14, 0.3);
    reindeer(b, -1, -19.5, 2.6);
    for (const [x, z, h] of [[-17, -19, 7], [-14, -21.2, 8.5], [15, -21, 7.5], [17.5, -17, 6], [-18, -11, 5.5], [1.5, -21.8, 6.5]]) snowSpruce(b, x, z, h);
    // Wegweiser mit bunten Pfeilen (ohne Schrift)
    F.cyl(-15, 0.15, -6.5, 0.12, 0.1, 3.2, C.post, { seg: 6 });
    if (near) C.boards.forEach((c, i) => b.at(-15, 0, -6.5, i * 1.3 + 0.4, () => F.extrude([[0, 0], [1.3, 0], [1.6, 0.18], [1.3, 0.36], [0, 0.36]].map(([px, py]) => [px, 1.6 + i * 0.42 + py]), -0.04, 0.04, c)));
    return { w: 40, d: 24, h: 9 };
  });

  // ===========================================================================================================
  // Valletta (Bastionen am Hafen), Dublin (bunte Türen), Krakau, Prag, Brüssel (Atomium)
  // ===========================================================================================================
  const MAL = { stone: 0xe2c992, stoneDark: 0xc9ac72, stoneLight: 0xf0deb2, dome: 0xa7b0b3, water: 0x5fa8c8, bed: 0x3f88a8, quay: 0xd9c49a, pane: 0x5a5f66, dark: 0x6a5a48, balcony: [0x3f7a5a, 0x2f5f8a, 0xb5443a, 0x4c8f8a, 0xe2a63a], luzzu: [0x3f6fa8, 0xf2c94a, 0xd2453a, 0x5f9a5a] };
  landmark('valletta', { places: ['Valletta', 'Mdina', 'Mellieha'], slot: 'skyline', far: true, title: 'Bastionen am Hafen' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = MAL;
    waterFront(b, 130, -28, C);
    // geböschte Mauer aus dem Hafen bis 22 m, zwei spitze Bastionen mit Wachhäuschen, oben die Stadt
    F.frust(0, -1.2, -36, 130, 16, 130, 10, 23.2, C.stone, { g: [0.84, 1.04], skip: 'b' });
    F.box(0, -1.2, -66, 130, 23.2, 50, C.stoneDark, { skip: 'bf' });
    const top = 22;
    for (const bx of [-38, 30]) {
      const ring = (k) => [[bx - 12 + k, -36], [bx + 12 - k, -36], [bx + 12 - k, -26 - k * 0.6], [bx, -18 - k * 1.4], [bx - 12 + k, -26 - k * 0.6]];
      loft(F, [[ring(0), -1.2], [ring(2.2), top + 0.6]], C.stone, { g: [0.84, 1.04], capCol: C.stoneLight });
      const tipZ = -18 - 2.2 * 1.4 - 0.9;
      F.cyl(bx, top + 0.6, tipZ, 1.1, 1.1, 2.6, C.stoneLight, { seg: near ? 10 : 6, top: false });
      F.lathe(bx, top + 3.2, tipZ, [[1.3, 0], [1.0, 0.8], [0.2, 1.4]], C.stone, { seg: near ? 10 : 6, bottom: true });
      if (near) b.at(bx, 0, tipZ + 1.1, 0, () => G.rect(0, top + 1.6, 0.02, 0.4, 0.8, C.dark));
    }
    // Häuserzeile oben mit bunten geschlossenen Holzbalkonen
    const list = [];
    for (let i = 0, w = 0; w < 104; i++) {
      const hw = 6 + ((i * 5) % 3) * 1.5;
      list.push([hw, 9 + ((i * 7) % 4) * 1.6, mix(C.stoneLight, 0xffffff, ((i * 3) % 4) * 0.08), 'flat']);
      w += hw;
    }
    const total = list.reduce((a, l) => a + l[0], 0);
    let x = -total / 2;
    houseRow(b, x, -33, list, { y: top, d: 10, trim: C.stoneLight, pane: C.pane, door: C.balcony[1] });
    let nb = 0;
    for (const [w] of list) {
      const n = w >= 7.5 ? 2 : 1;
      for (let k = 0; k < n; k++) {
        const bx = x + (w / (n + 1)) * (k + 1);
        const col = C.balcony[(nb++ * 3) % C.balcony.length];
        F.box(bx, top + 3.6, -32.4, 2.2, 2.6, 1.2, col, { g: [0.86, 1.05] });
        G.rect(bx, top + 4.4, -31.78, 1.7, 1.3, C.pane, { g: [1.1, 0.8] });
      }
      x += w;
    }
    // Kuppelkirche links, schlanker Turm rechts
    F.box(-14, top, -64, 18, 14, 24, C.stone, { g: [0.86, 1.04], skip: 'b' });
    F.cyl(-14, top + 14, -62, 6.4, 6.4, 6, C.stoneLight, { seg: near ? 16 : 10, top: false });
    F.lathe(-14, top + 20, -62, [[7.0, 0], [6.6, 2.6], [5.0, 5.6], [2.6, 7.6], [1.0, 8.2]], C.dome, { seg: near ? 16 : 10, g: [0.86, 1.08], bottom: true });
    F.cyl(-14, top + 28.2, -62, 1.0, 0.9, 2.4, C.stoneLight, { seg: 8 });
    F.lathe(-14, top + 30.6, -62, [[1.2, 0], [0.2, 1.6]], C.dome, { seg: 8, bottom: true });
    F.box(16, top, -58, 5, 22, 5, C.stoneLight, { g: [0.88, 1.04], skip: 'b' });
    spire(F, ngon(8, 2.9, Math.PI / 8, 0, 0, 16, -58), top + 22, top + 40, C.stoneLight, { ax: 16, az: -58, bottom: true });
    // zwei bunte Fischerboote
    for (const [bx, bz, k] of [[-10, -12, 0], [14, -18, 1]]) {
      woodBoat(b, bx, 0.3, bz, 7.5, C.luzzu[k * 2], 0);
      if (near) for (const s of [-1, 1]) F.box(bx + s * 3.6, 0.9, bz, 0.25, 1.4, 0.25, C.luzzu[k * 2 + 1]);
    }
    return { w: 130, d: 91, h: 63 };
  });

  const DUB = { brick: 0xa85a44, white: 0xf4efe6, rail: 0x45494f, stone: 0xd6cdbd, step: 0xc9bfae, fan: 0xf3e6b8, pane: 0x4c5562, doors: [0xd2453a, 0xf2c94a, 0x3f7ab8, 0x3f8f5a, 0x8a5aa8, 0xf08a3a] };
  landmark('georgianDoors', { places: ['Dublin'], slot: 'square', title: 'Bunte Haustüren' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = DUB;
    F.box(0, 0, -7, 46, 0.12, 14, C.stone, { skip: 'b' });
    // sechs Reihenhäuser aus Ziegel, je mit anders gestrichener Tür unter einem Fächerfenster
    const hw = 7.4;
    const fz = -3.2;
    for (let i = 0; i < 6; i++) {
      const x = -hw * 2.5 + i * hw;
      const brick = mix(C.brick, i % 2 ? 0xffffff : 0x000000, 0.06 + (i % 3) * 0.03);
      F.box(x, 0, fz - 5, hw, 13.4, 10, brick, { g: [0.86, 1.04], skip: 'b' });
      F.box(x, 12.4, fz + 0.1, hw, 0.35, 0.3, C.white);
      if (i > 0) {
        F.box(x - hw / 2, 13.4, fz - 3, 1.2, 2.2, 1.6, brick);
        if (near) for (const dx of [-0.3, 0.3]) F.cyl(x - hw / 2 + dx, 15.6, fz - 3, 0.18, 0.16, 0.6, 0xc8664a, { seg: 6 });
      }
      b.at(x, 0, fz, 0, () => {
        // Tür mit Stufen, Säulchen und Fächerfenster
        const dx = i % 2 ? 1.9 : -1.9;
        G.rect(dx, 1.0, 0.03, 1.9, 3.5, C.white);
        G.rect(dx, 1.0, 0.05, 1.3, 2.5, C.doors[i]);
        G.extrude(arch(dx, 1.3, 3.5, 0.9, near ? 8 : 4), 0.04, 0.05, C.fan, { caps: 'f', sides: false });
        if (near) {
          for (let k = 0; k < 4; k++) G.rect(dx - 0.42 + k * 0.28, 3.5, 0.06, 0.04, 0.5, C.white);
          G.disc(dx + 0.4, 2.15, 0.07, 0.07, CITY.gold, { seg: 6 });
          for (const s of [-1, 1]) F.box(dx + s * 0.92, 1.0, 0.15, 0.22, 2.6, 0.2, C.white);
        }
        for (let k = 0; k < 3; k++) F.box(dx, 0.12, (3 - k) * 0.175, 2.2, (k + 1) * 0.293, (3 - k) * 0.35, C.step, { skip: 'bk' });
        // Fenster: Hochparterre, Beletage (hoch), zweiter Stock, Mansarde
        const wx = i % 2 ? [-2.1, 0] : [0, 2.1];
        for (const x0 of wx) {
          G.rect(x0, 1.5, 0.03, 1.2, 2.0, C.white);
          G.rect(x0, 1.6, 0.05, 1.0, 1.8, C.pane, { g: [1.1, 0.75] });
        }
        for (const [y, h] of [[4.8, 3.0], [8.5, 2.2], [11.2, 0.9]]) {
          for (const x0 of [-2.4, 0, 2.4]) {
            if (near) G.rect(x0, y - 0.1, 0.03, 1.32, h + 0.2, C.white);
            G.rect(x0, y, 0.05, 1.12, h, C.pane, { g: [1.1, 0.75] });
            if (near && h > 2.5) G.rect(x0, y + h * 0.5, 0.06, 1.12, 0.06, C.white);
          }
        }
      });
    }
    // dunkle Gitter vor den Kellerschächten, mit Lücken an den Treppen
    const doors = [...Array(6).keys()].map((i) => -hw * 2.5 + i * hw + (i % 2 ? 1.9 : -1.9));
    const cuts = [-23, ...doors.flatMap((d) => [d - 1.25, d + 1.25]), 23].filter((v, i, a) => i === 0 || i === a.length - 1 || Math.abs(v) < 23);
    for (let i = 0; i + 1 < cuts.length; i += 2) {
      const [x0, x1] = [Math.max(-22.9, cuts[i]), Math.min(22.9, cuts[i + 1])];
      if (x1 - x0 < 0.5) continue;
      F.rod([x0, 1.15, -1.9], [x1, 1.15, -1.9], 0.045, C.rail, { seg: 4 });
      if (near) for (let x = x0; x <= x1 + 1e-6; x += (x1 - x0) / Math.max(1, Math.round((x1 - x0) / 0.5))) F.rod([x, 0.12, -1.9], [x, 1.2, -1.9], 0.03, C.rail, { seg: 3 });
    }
    return { w: 46, d: 14, h: 16.2 };
  });

  const KRK = { brick: 0xb0563e, brickDark: 0x8f4532, brickLight: 0xc66e52, copper: 0x7fae98, gold: 0xe6c25a, attic: 0xf1e6cf, atticDark: 0xd9cbb0, roof: 0xb5503c, pane: 0x4c5562, plaza: 0xd9cdb6, dark: 0x4f3e36 };
  landmark('marienkirche', { places: ['Krakau'], slot: 'square', title: 'Marienkirche und Tuchhallen' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = KRK;
    F.box(0, 0, -20, 70, 0.1, 40, C.plaza, { skip: 'b' });
    // Kirche links: zwei ungleiche Türme, dazwischen der Giebel, dahinter das hohe Schiff
    const cx = -14;
    F.box(cx, 0, -24, 14, 24, 32, C.brick, { g: [0.86, 1.04], skip: 'tb' });
    b.at(cx, 0, -24, 0, () => F.extrude([[-7, 24], [7, 24], [0, 34]], -16, 16, C.brick));
    b.gable(cx, 24, -24, 14, 32, 10, C.roof, { axis: 'z', oe: 0.4, og: 0.4, ridge: near });
    b.at(cx, 0, -8, 0, () => {
      darkArch(b, 0, 0, 3.2, 6, C.dark, true);
      lancet(b, 0, 10, 3.6, 10, C.pane);
    });
    for (const [s, h] of [[-1, 46], [1, 38]]) {
      const tx = cx + s * 10;
      F.box(tx, 0, -12, 8, h, 8, C.brick, { g: [0.84, 1.04], skip: 'b' });
      b.at(tx, 0, -8, 0, () => { for (let k = 0; k < (h > 40 ? 4 : 3); k++) lancet(b, 0, 6 + k * 9, 1.4, 5, C.dark); });
      if (s < 0) {
        // hoher Turm: Spitzhelm mit acht Ecktürmchen, auf halber Höhe eine goldene Krone
        F.box(tx, h, -12, 8.6, 0.6, 8.6, C.brickLight);
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * TAU + Math.PI / 8;
          pinnacle(b, tx + Math.sin(a) * 4.2, -12 + Math.cos(a) * 4.2, h + 0.6, h + 3, 0.7, 3.4, C.copper);
        }
        spire(F, ngon(8, 3.8, Math.PI / 8, 0, 0, tx, -12), h + 0.6, h + 18, C.copper, { ax: tx, az: -12, g: [0.86, 1.08], bottom: true });
        b.xf([tx, h + 9.5, -12], [0, 0, 0], 1, () => {
          G.lathe(0, 0, 0, [[1.95, 0], [2.1, 0.5]], C.gold, { seg: 10, top: false, bottom: true });
          if (near) for (let i = 0; i < 6; i++) G.cyl(Math.sin((i / 6) * TAU) * 2.0, 0.45, Math.cos((i / 6) * TAU) * 2.0, 0.22, 0.02, 0.6, C.gold, { seg: 4 });
        });
        F.ball(tx, h + 18.3, -12, 0.35, C.gold, { ws: 6, hs: 4 });
      } else {
        // niedriger Turm: Renaissancehaube mit Laterne
        F.box(tx, h, -12, 8.6, 0.6, 8.6, C.brickLight);
        F.lathe(tx, h + 0.6, -12, [[4.6, 0], [4.2, 2.2], [2.4, 4.0], [1.2, 4.6], [1.2, 6.4], [1.8, 7.0], [0.9, 8.4], [0.15, 10]], C.copper, { seg: near ? 12 : 8, g: [0.88, 1.06], bottom: true });
        F.ball(tx, h + 10.3, -12, 0.3, C.gold, { ws: 6, hs: 3 });
      }
    }
    // Tuchhallen rechts: Arkaden, darüber die Attika mit runden Zinnen, rote Dächer dahinter
    const hx = 19;
    F.box(hx, 0, -12, 30, 11, 14, C.attic, { g: [0.88, 1.04], skip: 'b' });
    b.at(hx, 0, -5, 0, () => {
      for (let k = 0; k < 7; k++) darkArch(b, -12 + k * 4, 0, 2.6, 4.6, C.dark);
      for (let k = 0; k < 7; k++) G.rect(-12 + k * 4, 6.4, 0.03, 1.4, 2.4, C.pane);
      // Attika: zwölf runde Zinnen über der ganzen Front
      const crest = [[-15, 11], [15, 11], [15, 12.6]];
      for (let k = 0; k < 12; k++) {
        const x = 15 - k * 2.5;
        crest.push([x - 0.5, 13.6], [x - 1.25, 14.1], [x - 2.0, 13.6], [x - 2.5, 12.6]);
      }
      F.extrude(crest, -0.8, 0, C.attic, { g: [0.95, 1.05] });
    });
    b.gable(hx, 11, -13.5, 29, 10, 4, C.roof, { axis: 'x', oe: 0.2, og: 0.2, ridge: near });
    b.at(hx, 0, -13.5, Math.PI / 2, () => F.extrude([[-5, 11], [5, 11], [0, 15]], -14.5, 14.5, C.attic));
    return { w: 70, d: 40, h: 65 };
  });

  const PRG = { wall: 0xf1ead8, wallDark: 0xdcd2bc, roofG: 0x6fa58c, roofR: 0xb5503c, stone: 0x9e978c, stoneDark: 0x857e74, spire: 0x5f6a66, forest: 0x5e8f4e, forest2: 0x6f9f58, gold: 0xe6c25a, pane: 0x5a6068, dark: 0x4f4a46 };
  landmark('pragerBurg', { places: ['Prag'], slot: 'skyline', far: true, title: 'Burg über der Moldau' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = PRG;
    // Burgberg mit Wald, oben die lange Schlossfront, dahinter der Dom mit Hauptturm und zwei Westspitzen
    const hf = (x, z) => 0.05 + 32 * ss(-12, -56, z) * (1 - ss(95, 125, Math.abs(x)));
    terrain(b, gridLines(-125, 125, near ? 26 : 12), gridLines(0, -130, near ? 14 : 7, [-56]), hf, (x, z, y) => (y > 31 ? C.wallDark : Math.sin(x * 0.11 + z * 0.07) > 0 ? C.forest : C.forest2), mottle);
    const y0 = 32;
    const front = (x0, x1, h, rc) => {
      const w = x1 - x0;
      const cx = (x0 + x1) / 2;
      F.box(cx, y0, -66, w, h, 16, C.wall, { g: [0.88, 1.04], skip: 'tb' });
      b.at(cx, 0, -66, Math.PI / 2, () => F.extrude([[-8, y0 + h], [8, y0 + h], [0, y0 + h + 5]], -w / 2, w / 2, C.wall));
      b.gable(cx, y0 + h, -66, w, 16, 5, rc, { axis: 'x', oe: 0.4, og: 0.3, ridge: near });
      b.at(cx, 0, -58, 0, () => {
        const n = Math.floor(w / 3.2);
        for (let r = 0; r < Math.floor((h - 1) / 3.4); r++) for (let i = 0; i < n; i++) G.rect(-w / 2 + (i + 0.5) * (w / n), y0 + 1.4 + r * 3.4, 0.03, 1.1, 1.9, C.pane);
      });
    };
    front(-90, -40, 14, C.roofG);
    front(-40, 10, 17, C.roofG);
    front(10, 44, 15, C.roofR);
    // Dom: hohes Schiff mit Strebepfeilern, Hauptturm mit grüner Haube, zwei schlanke Westspitzen
    F.box(-2, y0, -92, 60, 30, 18, C.stone, { g: [0.84, 1.04], skip: 'tb' });
    b.at(-2, 0, -92, Math.PI / 2, () => F.extrude([[-9, y0 + 30], [9, y0 + 30], [0, y0 + 42]], -30, 30, C.stone));
    b.gable(-2, y0 + 30, -92, 60, 18, 12, C.spire, { axis: 'x', oe: 0.4, og: 0.4, ridge: near });
    for (let k = 0; k < 7; k++) pinnacle(b, -29 + k * 9, -82, y0, y0 + 32, 1.8, 4, C.stoneDark);
    const tx = -8;
    const tz = -80;
    F.box(tx, y0, tz, 12, 52, 12, C.stone, { g: [0.84, 1.04], skip: 'b' });
    b.at(tx, 0, tz + 6, 0, () => {
      dial(b, 0, y0 + 40, 2.2);
      lancet(b, 0, y0 + 24, 2.4, 9, C.dark);
    });
    F.lathe(tx, y0 + 52, tz, [[7.0, 0], [6.4, 3], [4.0, 6], [2.4, 7.4], [2.4, 9.4], [3.0, 10.4], [1.6, 13], [0.3, 17]], C.roofG, { seg: near ? 12 : 8, g: [0.88, 1.08], bottom: true });
    F.ball(tx, y0 + 17.3 + 52, tz, 0.6, C.gold, { ws: 6, hs: 4 });
    for (const sz of [-86, -98]) {
      F.box(31, y0, sz, 6, 30, 6, C.stone, { g: [0.84, 1.04], skip: 'b' });
      gothicSpire(b, 31, sz, 6, y0 + 30, 24, C.spire);
    }
    return { w: 250, d: 130, h: 102 };
  });

  const ATO = { steel: 0xd6dce2, steelDark: 0xaab3bc, pane: 0x4f6a86, lawn: 0x8fbf63, path: 0xe2dccd, pavilion: 0xf2efe8 };
  landmark('atomium', { places: ['Brüssel'], slot: 'skyline', far: true, title: 'Atomium' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = ATO;
    F.box(0, 0, -40, 90, 0.1, 80, C.lawn, { skip: 'b' });
    F.box(0, 0.1, -20, 8, 0.05, 40, C.path, { skip: 'b' });
    // Würfel auf der Spitze: Raumdiagonale senkrecht (Drehung um (−1, 0, 1)/√2 um arccos(1/√3))
    const a = 37.6;
    const r = 7.2;
    const cy = r + 2.4 + (a * Math.sqrt(3)) / 2;
    const cz = -42;
    const ct = 1 / Math.sqrt(3);
    const st = Math.sqrt(2 / 3);
    const k = [-Math.SQRT1_2, 0, Math.SQRT1_2];
    const rot = ([x, y, z]) => {
      const kv = [k[1] * z - k[2] * y, k[2] * x - k[0] * z, k[0] * y - k[1] * x];
      const kd = k[0] * x + k[1] * y + k[2] * z;
      return [0, 1, 2].map((i) => [x, y, z][i] * ct + kv[i] * st + k[i] * kd * (1 - ct));
    };
    const pts = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
      const p = rot([(sx * a) / 2, (sy * a) / 2, (sz * a) / 2]);
      pts.push([p[0], p[1] + cy, p[2] + cz]);
    }
    const mid = [0, cy, cz];
    const ws = near ? 18 : 10;
    const hs = near ? 12 : 6;
    for (const p of [...pts, mid]) G.ball(p[0], p[1], p[2], r, C.steel, { ws, hs, g: [0.86, 1.06] });
    // Röhren: zwölf Kanten und acht Speichen zur Mitte
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) if ([1, 2, 4].includes(i ^ j)) F.rod(pts[i], pts[j], 1.4, C.steelDark, { seg: near ? 8 : 5 });
      F.rod(pts[i], mid, 1.4, C.steelDark, { seg: near ? 8 : 5 });
    }
    // oberste Kugel mit Fensterband, Stützen: Mittelrohr und drei Doppelbeine zu den unteren Kugeln
    const topP = pts.reduce((p, q) => (q[1] > p[1] ? q : p));
    const lowP = pts.reduce((p, q) => (q[1] < p[1] ? q : p));
    G.lathe(topP[0], topP[1] - 0.6, topP[2], [[r + 0.04, 0], [r - 0.15, 1.6]], C.pane, { seg: ws, top: false });
    F.cyl(lowP[0], 0.1, lowP[2], 1.8, 1.8, lowP[1] - r * 0.8, C.steelDark, { seg: near ? 10 : 6 });
    const lower = pts.filter((p) => p !== lowP && p[1] < cy - 1).sort((p, q) => p[1] - q[1]).slice(0, 3);
    for (const p of lower) {
      const d = Math.hypot(p[0], p[2] - cz) || 1;
      const ox = (p[0] / d) * 26;
      const oz = ((p[2] - cz) / d) * 26;
      for (const s of [-1, 1]) F.rod([ox + (s * oz) / 8, 0.1, cz + oz - (s * ox) / 8], [p[0], p[1] - r * 0.7, p[2]], 0.9, C.steelDark, { seg: near ? 6 : 4 });
    }
    F.box(26, 0.1, -10, 14, 4, 8, C.pavilion, { skip: 'b' });
    return { w: 90, d: 80, h: Math.round(topP[1] + r + 1) };
  });

  // ===========================================================================================================
  // Amman/Petra (Säulen auf dem Burgberg), Jerewan und Teneriffa (Vulkane), Kapstadt (Tafelberg)
  // ===========================================================================================================
  const AMM = { lime: 0xe8dcc0, limeDark: 0xcfc0a0, rock: 0xd6b88e, rock2: 0xc9a77a, olive: 0x8c9a5a, dome: 0xd9cdb6, white: 0xf3efe6, pane: 0x6a6258, tank: 0xe6e8ea };
  landmark('zitadelle', { places: ['Amman', 'Petra'], slot: 'skyline', far: true, title: 'Säulen auf dem Burgberg' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = AMM;
    const hf = (x, z) => 0.05 + 28 * ss(-14, -58, z) * (1 - ss(48, 100, Math.abs(x))) * (1 - 0.25 * ss(-118, -140, z));
    terrain(b, gridLines(-110, 110, near ? 26 : 12), gridLines(0, -140, near ? 16 : 8, [-58]), hf, (x, z, y) => (Math.sin(x * 0.09 + z * 0.13) > 0.4 && y < 26 ? C.rock2 : C.rock), mottle);
    // weiße Würfelhäuser am Hang (mit Wassertanks auf dem Dach)
    for (let i = 0; i < (near ? 46 : 22); i++) {
      const x = -96 + ((i * 53) % 192);
      const z = -6 - ((i * 29) % 46);
      if (Math.abs(x) < 34 && z < -30) continue;
      const w = 5 + (i % 3);
      const h = 4 + (i % 4) * 1.4;
      const y = Math.min(hf(x - w / 2, z - w / 2), hf(x + w / 2, z + w / 2), hf(x, z)) - 0.3;
      F.box(x, y, z, w, h + 0.3, w, i % 4 ? C.white : C.lime, { g: [0.86, 1.04], skip: 'b' });
      b.at(x, 0, z + w / 2, 0, () => G.rect(0, y + h * 0.45, 0.03, 1.0, 1.2, C.pane));
      if (near && i % 3 === 0) F.cyl(x + 1, y + h + 0.3, z - 1, 0.5, 0.5, 0.9, C.tank, { seg: 6 });
    }
    // Tempelpodium mit drei hohen Säulen und Gebälk, zwei Stümpfe, liegende Trommeln
    const y0 = 28;
    F.box(0, y0 - 0.5, -76, 30, 2.1, 26, C.limeDark, { g: [0.9, 1.04], skip: 'b' });
    const col = (x, z, h) => {
      F.cyl(x, y0 + 1.6, z, 1.15, 1.0, h, C.lime, { seg: near ? 12 : 7, g: [0.88, 1.04] });
      if (h > 10) F.lathe(x, y0 + 1.6 + h, z, [[1.0, 0], [1.5, 1.2], [1.7, 1.6]], C.limeDark, { seg: near ? 10 : 6 });
    };
    for (const x of [-9, -3.2, 2.6]) col(x, -66, 14);
    F.box(-3.2, y0 + 17.2, -66, 15.6, 1.6, 3.2, C.limeDark);
    col(8.4, -66, 5.2);
    col(13.6, -70, 2.8);
    if (near) for (const [x, z, ry] of [[6, -74, 0.4], [-12, -78, 1.2]]) b.xf([x, y0 + 2.6, z], [0, ry, Math.PI / 2], 1, () => F.cyl(0, -1.4, 0, 1.0, 1.0, 2.8, C.lime, { seg: 10, bottom: true }));
    // Kuppelbau des Palastes
    F.box(-34, y0, -96, 12, 9, 12, C.lime, { g: [0.88, 1.04], skip: 'b' });
    F.ball(-34, y0 + 9, -96, 5.8, C.dome, { ws: near ? 14 : 8, hs: near ? 7 : 4, lat: [0, Math.PI / 2] });
    b.at(-34, 0, -90, 0, () => darkArch(b, 0, y0, 3, 5, C.pane));
    if (near) for (const [x, z] of [[20, -88], [26, -96], [-20, -64], [-46, -84]]) ballTree(b, x, hf(x, z), z, 2.0, 5.2, C.olive);
    return { w: 220, d: 140, h: 48 };
  });

  /** Gelände mit Vulkankegeln: peaks = [[x, z, Höhe, Radius], …]; cf färbt nach Höhe; o.town: Häuserzeile vorn. */
  function volcanoes(b, peaks, cf, w, d) {
    const hf = (x, z) => {
      let y = 0.05;
      for (const [px, pz, h, r] of peaks) {
        const t = Math.hypot(x - px, (z - pz) * 1.1) / r;
        if (t < 1) y = Math.max(y, h * (1 - t) ** 1.25 * (1 + 0.04 * Math.sin(x * 0.2 + z * 0.13)));
      }
      return y * (1 - ss(w / 2 - 40, w / 2, Math.abs(x)));
    };
    // die Gipfel liegen auf Gitterlinien: nah und fern treffen die Spitze genau (sonst wäre der ferne Gipfel bis 10 m niedriger)
    terrain(b, gridLines(-w / 2, w / 2, b.lod ? 16 : 36, peaks.map((p) => p[0])), gridLines(-30, -d, b.lod ? 12 : 26, peaks.map((p) => p[1])), hf, cf, mottle);
    return hf;
  }
  const VUL = { steppe: 0xb9b07a, steppe2: 0xa8a46a, rock: 0x8f8579, rock2: 0x7d746a, snow: 0xf3f6f8, tuff: 0xe3a58f, tuff2: 0xd99a85, tuff3: 0xeab8a0, lava: 0x9a6a50, ash: 0xb08a6a, pine: 0x5f8a50, white: 0xf6f2ea, lawn: 0x9cc46c, ground: 0xd8ccb2 };
  landmark('ararat', { places: ['Jerewan'], slot: 'skyline', far: true, title: 'Doppelgipfel' }, (b) => {
    const { F } = b;
    const near = !b.lod;
    const C = VUL;
    F.box(0, 0, -15, 360, 0.08, 30, C.ground, { skip: 'b' });
    volcanoes(b, [[-30, -250, 150, 175], [115, -225, 92, 95]], (x, z, y) => {
      const v = y + 6 * Math.sin(x * 0.09 + z * 0.05);
      return v > 100 ? C.snow : v > 58 ? (Math.sin(x * 0.05) > 0 ? C.rock : C.rock2) : Math.sin(x * 0.07 + z * 0.04) > 0 ? C.steppe : C.steppe2;
    }, 360, 330);
    // Stadt aus rosa Tuffstein vorn
    houseRow(b, -63, -12, [[8, 10, C.tuff, 'flat'], [7, 13, C.tuff3, 'flat'], [9, 11.5, C.tuff2, 'flat'], [8, 14, C.tuff, 'flat'], [7, 10.5, C.tuff3, 'flat'], [9, 12.5, C.tuff2, 'flat'], [8, 11, C.tuff, 'flat'], [7, 13.5, C.tuff3, 'flat'], [8, 10, C.tuff2, 'flat'], [8, 12, C.tuff, 'flat'], [8, 11, C.tuff3, 'flat'], [7, 13, C.tuff2, 'flat'], [8, 10.5, C.tuff, 'flat'], [7, 12, C.tuff3, 'flat'], [8, 11.5, C.tuff2, 'flat'], [7, 10, C.tuff, 'flat']], { d: 12, trim: 0xf3e3d6 });
    if (near) for (let i = 0; i < 8; i++) ballTree(b, -80 + i * 22 + (i % 2) * 6, 0.08, -4, 1.8, 4.4, i % 3 ? PAL.crown[0] : 0x9cb85a);
    return { w: 360, d: 330, h: 146 };
  });
  landmark('teide', { places: ['Adeje', 'Arona', 'São Vicente'], slot: 'skyline', far: true, title: 'Vulkan' }, (b) => {
    const C = VUL;
    const near = !b.lod;
    b.F.box(0, 0, -15, 360, 0.08, 30, C.ground, { skip: 'b' });
    volcanoes(b, [[0, -230, 70, 210], [-10, -235, 140, 72]], (x, z, y) => {
      const v = y + 5 * Math.sin(x * 0.11 + z * 0.06);
      return v > 128 ? C.white : v > 70 ? (Math.sin(x * 0.07 - z * 0.03) > 0 ? C.lava : C.ash) : v > 26 ? C.ash : C.pine;
    }, 360, 330);
    // weiße Häuser mit Palmen vorn
    houseRow(b, -56, -12, [[8, 7, C.white, 'flat'], [7, 9.5, 0xf6e7c8, 'flat'], [9, 8, C.white, 'flat'], [8, 10, 0xf2d6c8, 'flat'], [7, 7.5, C.white, 'flat'], [9, 9, 0xf6e7c8, 'flat'], [8, 8, C.white, 'flat'], [7, 10.5, 0xdfeaf0, 'flat'], [9, 7, C.white, 'flat'], [8, 9, 0xf6e7c8, 'flat'], [8, 8.5, C.white, 'flat'], [8, 10, 0xf2d6c8, 'flat'], [8, 7.5, C.white, 'flat'], [8, 9.5, 0xdfeaf0, 'flat']], { d: 11 });
    for (let i = 0; i < 7; i++) palm(b, -66 + i * 22, 0.08, -5, 8 + (i % 3), 0.5, i);
    if (near) b.F.box(0, 0.08, -2, 360, 0.04, 4, 0xe9dcc0, { skip: 'b' });
    return { w: 360, d: 330, h: 135 };
  });

  const KAP = { rock: 0x9a9184, rock2: 0xaaa092, fynbos: 0x7f9a5a, fynbos2: 0x8fa866, top: 0xa8a493, cloud: 0xf7f9fb, ground: 0xd8ccb2, cols: [0xf28fb0, 0xc6e05a, 0x5ec8c0, 0xf6d04a, 0xa98ad8, 0xf6a04a, 0x6aa8f0, 0xf06a5a] };
  landmark('tafelberg', { places: ['Kapstadt'], slot: 'skyline', far: true, title: 'Tafelberg' }, (b) => {
    const { F } = b;
    const near = !b.lod;
    const C = KAP;
    F.box(0, 0, -16, 380, 0.08, 32, C.ground, { skip: 'b' });
    // Tafelberg mit steilen Wänden und flacher Kuppe, links Devil's Peak, rechts der Löwenkopf
    const cone = (x, z, px, pz, h, r) => h * Math.max(0, 1 - Math.hypot(x - px, z - pz) / r) ** 1.2;
    const hf = (x, z) => {
      const d = (Math.abs(x + 10) / 115) ** 6 + (Math.abs(z + 210) / 55) ** 6;
      const table = 128 * (1 - ss(0.75, 1.6, d ** (1 / 6))) + 34 * Math.max(0, 1 - Math.hypot(x / 170, (z + 190) / 120));
      const y = Math.max(table, cone(x, z, -160, -205, 108, 70), cone(x, z, 165, -175, 86, 58), 0.05);
      return y * (1 - ss(150, 190, Math.abs(x)));
    };
    const cf = (x, z, y) => (y > 124 ? C.top : y > 52 ? (Math.sin(x * 0.12 + y * 0.2) > 0.2 ? C.rock2 : C.rock) : Math.sin(x * 0.08 + z * 0.06) > 0 ? C.fynbos : C.fynbos2);
    terrain(b, gridLines(-190, 190, near ? 40 : 18), gridLines(-32, -300, near ? 26 : 12, [-150, -265]), hf, cf, mottle);
    // Tischtuch: flache Wolkenballen auf der Kuppe, vorn etwas über die Kante hängend
    for (let i = 0; i < 13; i++) {
      const x = -112 + i * 17.5;
      F.ball(x, 130 + (i % 2) * 2, -196 - (i % 3) * 8, 13 + (i % 3) * 2, C.cloud, { ws: near ? 10 : 6, hs: near ? 6 : 4, sy: 0.38 });
      if (near && i % 2 === 0) F.ball(x + 6, 124, -159, 8, C.cloud, { ws: 8, hs: 4, sy: 0.5 });
    }
    // bunte Häuser vorn (zwei Reihen)
    const row = (x0, z, n, seed) => houseRow(b, x0, z, Array.from({ length: n }, (_, i) => [6 + ((i + seed) % 3), 6 + ((i * 3 + seed) % 4) * 0.8, C.cols[(i * 3 + seed) % C.cols.length], 'flat']), { d: 9, fh: 3.0 });
    row(-70, -12, 20, 1);
    if (near) row(-60, -24, 17, 2);
    return { w: 380, d: 300, h: 162 };
  });

  // ===========================================================================================================
  // Sammelstücke für Länder ohne eigenes Wahrzeichen: Bryggen (Norwegen), Dorf am Mittelmeer, Sauna am See (Finnland)
  // ===========================================================================================================
  const BRY = { water: 0x5f9fba, bed: 0x3f7f9a, quay: 0x8a7a68, plank: 0xb08a62, pile: 0x6b5442, white: 0xf4efe4, pane: 0x4c5562, roofDark: 0x5a4a44, roofRed: 0xa8473a };
  const BRY_ROW = [[7, 9, 0xb5443a, 'z', BRY.roofDark], [6.5, 10.5, 0xe9c46a, 'z', BRY.roofRed], [7.5, 9.5, 0xf4efe4, 'z', BRY.roofDark], [6, 11, 0xc96a3a, 'z', BRY.roofRed], [7, 10, 0x9a3a32, 'z', BRY.roofDark], [6.5, 9, 0xe9c46a, 'z', BRY.roofRed], [7, 10.8, 0xf4efe4, 'z', BRY.roofDark], [6.5, 9.6, 0xb5443a, 'z', BRY.roofRed]];
  landmark('bryggen', { places: ['Bergen', 'Trondheim', 'Stavanger', 'Molde', 'Hellesylt', 'Halhjem'], slot: 'square', title: 'Holzhäuser am Kai' }, (b) => {
    const { F } = b;
    const near = !b.lod;
    const C = BRY;
    waterFront(b, 60, -16, C);
    // Kai mit Holzdeck auf Pfählen, dahinter die Giebelzeile mit Windenbalken unter dem First
    F.box(0, -1.2, -24, 60, 2.4, 16, C.quay, { skip: 'b' });
    F.box(0, 1.2, -17.25, 60, 0.15, 3.5, C.plank, { skip: 'b' });
    if (near) for (let x = -28; x <= 28; x += 4) F.cyl(x, -0.6, -15.8, 0.22, 0.22, 1.8, C.pile, { seg: 6 });
    houseRow(b, -27, -19, BRY_ROW, { y: 1.35, d: 12, fh: 2.9, trim: C.white, pane: C.pane });
    if (near) {
      let x = -27;
      for (const [w, h] of BRY_ROW) {
        F.box(x + w / 2, 1.35 + h + Math.min(w * 0.6, 4.6) * 0.62, -18.5, 0.25, 0.25, 1.0, C.pile);
        x += w;
      }
    }
    woodBoat(b, -12, 0.3, -9, 8, 0x3f6fa8, 1);
    return { w: 60, d: 32, h: 17.5 };
  });

  const MED = { grass: 0xb5b07a, grass2: 0xa4a86e, white: 0xf7f3ea, cream: 0xf3e6c8, ochre: 0xecd3a2, roof: 0xc8664a, shutter: [0x3f7ab8, 0x3f8f6a, 0x5aa8b0], cypress: 0x3f6f4a, olive: 0x8c9a5a, dark: 0x6a5a4c };
  /** Zypresse: schlanker dunkler Kegel. */
  function cypress(b, x, y, z, h) {
    b.F.lathe(x, y, z, [[0.5, 0], [0.9, h * 0.2], [0.75, h * 0.6], [0.1, h]], MED.cypress, { seg: b.lod ? 5 : 8, bottom: true, g: [0.85, 1.08] });
  }
  landmark('mittelmeerDorf', { places: ['Monaco', 'Èze', 'Céret', 'Calella', 'Caldes de Malavella', 'Celrà', 'Borrassà'], slot: 'skyline', far: true, title: 'Weißes Dorf am Hang' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = MED;
    // Hügel, vorn, hinten und seitlich auf null; oben eine ebene Terrasse für Kirche und Turm (P)
    const P = 33;
    const KX = [-6, 10.5];
    const KZ = [-91, -73];
    const hill = (x, z) => 34 * Math.exp(-((x / 70) ** 2) - (((z + 82) / 46) ** 2)) * (1 - ss(60, 80, Math.abs(x))) * ss(2, 26, -z) * (1 - ss(100, 128, -z));
    const hf = (x, z) => {
      const out = Math.hypot(Math.max(KX[0] - x, 0, x - KX[1]), Math.max(KZ[0] - z, 0, z - KZ[1]));
      const m = 1 - ss(0, 5, out);
      return 0.05 + hill(x, z) * (1 - m) + P * m;
    };
    terrain(b, gridLines(-80, 80, near ? 24 : 12, [...KX, KX[0] - 5, KX[1] + 5]), gridLines(0, -130, near ? 20 : 10, [...KZ, KZ[0] - 5, KZ[1] + 5]), hf, (x, z) => (Math.sin(x * 0.09 + z * 0.07) > 0.3 ? C.grass2 : C.grass), mottle);
    // Häuser am Hang: weiße Würfel mit flachen Ziegeldächern und bunten Läden
    const lots = [];
    let n = 0;
    for (let i = 0; i < (near ? 44 : 26); i++) {
      const x = -58 + ((i * 41) % 116);
      const z = -14 - ((i * 23) % 92);
      const w = 6 + (i % 3);
      const d = 6 + ((i + 1) % 3);
      if (x + w / 2 > KX[0] - 7 && x - w / 2 < KX[1] + 7 && z + d / 2 > KZ[0] - 7 && z - d / 2 < KZ[1] + 7) continue;
      if (lots.some((l) => Math.abs(l[0] - x) < (l[2] + w) / 2 + 0.6 && Math.abs(l[1] - z) < (l[3] + d) / 2 + 0.6)) continue;
      lots.push([x, z, w, d]);
      const corners = [hf(x - w / 2, z - d / 2), hf(x + w / 2, z - d / 2), hf(x - w / 2, z + d / 2), hf(x + w / 2, z + d / 2)];
      const y = Math.min(...corners) - 0.4;
      const top = Math.max(...corners, hf(x, z)) + 4.2 + (i % 2) * 2.4;
      const col = [C.white, C.cream, C.white, C.ochre][i % 4];
      F.box(x, y, z, w, top - y, d, col, { g: [0.84, 1.04], skip: 'tb' });
      b.gable(x, top, z, w, d, 1.5, C.roof, { axis: i % 2 ? 'x' : 'z', oe: 0.35, og: 0.3, ridge: false });
      if (i % 2) b.at(x, 0, z, Math.PI / 2, () => F.extrude([[-d / 2, top], [d / 2, top], [0, top + 1.5]], -w / 2, w / 2, col));
      else F.extrude([[-w / 2 + x, top], [w / 2 + x, top], [x, top + 1.5]], z - d / 2, z + d / 2, col);
      // Fenster mit Läden oben links, Tür unten rechts (nur wo das Gelände sie frei lässt)
      const sc = C.shutter[n++ % C.shutter.length];
      const gl = hf(x - w / 4, z + d / 2);
      const gr = hf(x + w / 4, z + d / 2);
      b.at(x, 0, z + d / 2, 0, () => {
        if (gl < top - 3.0) {
          G.rect(-w / 4, top - 2.6, 0.03, 1.0, 1.4, C.dark);
          if (near) for (const s of [-1, 1]) G.rect(-w / 4 + s * 0.8, top - 2.7, 0.04, 0.5, 1.6, sc);
        }
        if (gr + 2.6 < top - 0.4) G.rect(w / 4, gr + 0.02, 0.03, 1.1, 2.2, sc);
      });
    }
    // Kirche mit Glockenturm auf der Terrasse
    F.box(0, P, -82, 10, 9, 16, C.white, { g: [0.86, 1.04], skip: 'tb' });
    F.extrude([[-5, P + 9], [5, P + 9], [0, P + 11.4]], -90, -74, C.white);
    b.gable(0, P + 9, -82, 10, 16, 2.4, C.roof, { axis: 'z', oe: 0.3, og: 0.3, ridge: near });
    b.at(0, 0, -74, 0, () => {
      darkArch(b, 0, P, 2, 3.2, C.dark);
      darkArch(b, 0, P + 5, 1.1, 2.2, C.dark);
    });
    const tx = 7.2;
    const tz = -77.5;
    F.box(tx, P, tz, 4.4, 17, 4.4, C.white, { g: [0.86, 1.04], skip: 'b' });
    around(b, tx, tz, 4.4, 4.4, () => darkArch(b, 0, P + 13, 1.8, 2.8, C.dark));
    F.box(tx, P + 17, tz, 5, 0.5, 5, C.cream);
    spire(F, chamfer(4.6, 4.6, 0, tx, tz), P + 17.5, P + 20.5, C.roof, { ax: tx, az: tz, bottom: true });
    // Zypressen und Ölbäume zwischen den Häusern, Palmen an der Straße
    const free = (x, z, r) => !lots.some((l) => Math.abs(l[0] - x) < l[2] / 2 + r && Math.abs(l[1] - z) < l[3] / 2 + r);
    for (const [x, z, h] of [[-30, -40, 9], [-24, -44, 11], [28, -30, 10], [34, -36, 8], [-14, -100, 10], [24, -98, 9], [-18, -62, 9], [40, -64, 10]]) if (free(x, z, 1.2)) cypress(b, x, hf(x, z) - 0.2, z, h);
    if (near) for (const [x, z] of [[-44, -18], [40, -20], [-12, -24], [52, -48], [-48, -52]]) if (free(x, z, 2)) ballTree(b, x, hf(x, z), z, 1.8, 4.2, C.olive);
    for (const x of [-60, -36, 30, 58]) palm(b, x, hf(x, -5), -5, 8 + (Math.abs(x) % 3), 0.5, x);
    return { w: 160, d: 130, h: 54 };
  });

  const FIN = { grass: 0x8fbf63, shore: 0xd9c9a0, water: 0x6aa9c8, bed: 0x4a89a8, plank: 0xb08a62, red: 0xb5443a, white: 0xf4efe4, roof: 0x4f5458, birch: 0xf2efe8, birchMark: 0x6a6660, leaf: 0xa8cf6a, leaf2: 0x8fbf5a, spruce: 0x3f6f4f, spruce2: 0x4f7f5a, boat: 0xd2453a };
  /** Birke: weißer Stamm mit dunklen Strichen, lockere hellgrüne Krone. */
  function birch(b, x, y, z, h) {
    const { F, G } = b;
    const near = !b.lod;
    F.cyl(x, y, z, 0.2, 0.13, h * 0.75, FIN.birch, { seg: 6, top: false });
    if (near) for (let i = 0; i < 4; i++) {
      const yy = 0.6 + i * h * 0.15;
      b.at(x, 0, z + 0.2 - (0.07 * yy) / (h * 0.75) + 0.01, 0, () => G.rect((i % 2) * 0.06 - 0.03, y + yy, 0, 0.14, 0.07, FIN.birchMark));
    }
    F.ball(x, y + h * 0.72, z, h * 0.22, FIN.leaf, { ws: near ? 8 : 6, hs: near ? 5 : 3, sy: 1.25, g: [0.85, 1.1] });
    if (near) F.ball(x + h * 0.12, y + h * 0.62, z + 0.3, h * 0.15, FIN.leaf2, { ws: 6, hs: 4 });
  }
  landmark('saunaSee', { places: ['Jämsä', 'Kajaani', 'Kuopio', 'Lahti', 'Suonenjoki', 'Turku'], slot: 'skyline', title: 'Sauna am See' }, (b) => {
    const { F, G, L } = b;
    const near = !b.lod;
    const C = FIN;
    // Sandufer vorn, See, flaches Ufer, Wiese mit Sauna, Birken, Fichtenwald
    waterFront(b, 80, -26, { quay: C.shore, bed: C.bed, water: C.water }, { top: 0.4 });
    F.box(0, -1.2, -27, 80, 1.65, 2, C.shore, { skip: 'b' });
    F.box(0, -1.2, -41, 80, 1.8, 26, C.grass, { skip: 'b' });
    F.box(-6, 0.5, -17.5, 2.4, 0.15, 19, C.plank, { skip: 'b' });
    if (near) for (let z = -10; z >= -24; z -= 3.5) for (const s of [-1, 1]) F.cyl(-6 + s * 1.0, -0.5, z, 0.12, 0.12, 1.05, C.plank, { seg: 5 });
    const sx = -6;
    const sz = -32;
    F.box(sx, 0.6, sz, 6, 2.8, 5, C.red, { g: [0.86, 1.04], skip: 'tb' });
    F.extrude([[sx - 3, 3.4], [sx + 3, 3.4], [sx, 5.0]], sz - 2.5, sz + 2.5, C.red);
    b.gable(sx, 3.4, sz, 6, 5, 1.6, C.roof, { axis: 'z', oe: 0.3, og: 0.9, ridge: near });
    for (const s of [-1, 1]) for (const t of [-1, 1]) F.box(sx + s * 2.92, 0.6, sz + t * 2.42, 0.22, 2.8, 0.22, C.white);
    F.box(sx + 1.6, 4.0, sz - 1.4, 0.6, 2.0, 0.6, 0x7a7470);
    b.at(sx, 0, sz + 2.5, 0, () => {
      G.rect(-1.2, 0.8, 0.03, 1.0, 2.0, C.white);
      G.rect(-1.2, 0.85, 0.05, 0.8, 1.9, 0x8a5a3c);
      G.rect(1.2, 1.7, 0.03, 1.1, 0.9, C.white);
      (L ?? G).rect(1.2, 1.78, 0.05, 0.92, 0.74, 0xffd98a);
    });
    F.box(sx, 0.6, sz + 3.15, 6, 0.2, 1.3, C.plank);
    woodBoat(b, 6, 0.25, -12, 4.2, C.boat, 0);
    for (const [x, z, h] of [[-16, -30, 9], [-20, -33, 10.5], [4, -31, 8.5], [10, -34, 10], [22, -30, 9], [-30, -31, 8]]) birch(b, x, 0.6, z, h);
    for (let i = 0; i < (near ? 16 : 8); i++) {
      const x = -36 + ((i * 29) % 72);
      const z = -41 - ((i * 13) % 11);
      const h = 9 + (i % 4) * 1.8;
      for (let k = 0; k < 3; k++) F.lathe(x, 0.6 + h * k * 0.24, z, [[h * (0.3 - k * 0.07), 0], [0.1, h * 0.42]], k % 2 ? C.spruce : C.spruce2, { seg: near ? 8 : 5, bottom: true });
    }
    return { w: 80, d: 54, h: 15 };
  });

  // ===========================================================================================================
  // Sammelsätze: Schloss mit Garten, Stadion, Autozug-Verladung, Grenzposten, Passhütte, Zoo-Eingang
  // ===========================================================================================================
  const SCH = { wall: 0xf2d27a, wallLight: 0xf8e6b0, white: 0xf6f2e8, roof: 0x6f7c8a, roofDark: 0x5c6876, hedge: 0x5f9a4a, hedge2: 0x6faa56, gravel: 0xe6dcc4, lawn: 0x92c066, water: 0x7cc8ec, pane: 0x56677a, gold: 0xe6c25a, dark: 0x5a5048 };
  /** Mansarddach über w × d um (x, z) ab y: steiler unterer Teil, flacher oberer. */
  function mansard(b, x, y, z, w, d, col) {
    loft(b.F, [[chamfer(w + 0.6, d + 0.6, 0, x, z), y], [chamfer(w - 2.4, d - 2.4, 0, x, z), y + 3.2], [chamfer(w - 6, d - 6, 0, x, z), y + 4.4]], [col, mix(col, 0x000000, 0.12)], { g: [0.9, 1.06], bottom: true });
  }
  landmark('schloss', { places: ['Mannheim', 'Hanau', 'Darmstadt'], slot: 'skyline', far: true, title: 'Schloss mit Garten' }, (b) => {
    const { F, G, W } = b;
    const near = !b.lod;
    const C = SCH;
    F.box(0, 0, -36, 130, 0.1, 72, C.gravel, { skip: 'b' });
    // Garten: Rasenparterre mit Hecken und Kugelbäumchen, Wasserbecken mit Fontäne in der Mitte
    for (const s of [-1, 1]) {
      F.box(s * 24, 0.1, -12, 34, 0.06, 16, C.lawn, { skip: 'b' });
      if (near) for (const [dx, dz, w, d] of [[0, -7.6, 34, 0.8], [0, 7.6, 34, 0.8], [-16.6, 0, 0.8, 14.4], [16.6, 0, 0.8, 14.4]]) F.rbox(s * 24 + dx, 0.16, -12 + dz, w, 0.9, d, 0.3, C.hedge, { seg: 2 });
      for (const dx of [-10, 0, 10]) F.ball(s * 24 + dx, 1.3, -12, 1.2, C.hedge2, { ws: 8, hs: 5, sy: 1.1 });
    }
    pond(b, 0, -12, 8, 8, 0.1, C.water, C.white);
    W.jet([0, 0.3, -12], [0, 7, 0], 0.32, 0.14, 0xe2f3ff, { apex: true, n: near ? 8 : 3, seg: near ? 7 : 4, r1: 0.08, ph: 1.3, pulse: 0.35 });
    // Mittelbau mit Säulenvorbau und Giebel, zwei lange Flügel, vortretende Eckpavillons
    const fz = -26;
    const secs = [[-15, 15, 18, 18, 0, C.wall, C.roof], [15, 49, 14, 14, 0, C.wall, C.roof], [-49, -15, 14, 14, 0, C.wall, C.roof], [49, 59, 16, 16, 0.6, C.wallLight, C.roofDark], [-59, -49, 16, 16, 0.6, C.wallLight, C.roofDark]];
    for (const [x0, x1, h, d, dz, wall, roof] of secs) {
      const w = x1 - x0;
      const cx = (x0 + x1) / 2;
      const cz = fz + dz - d / 2;
      F.box(cx, 0, cz, w, h, d, wall, { g: [0.86, 1.04], skip: 'tb' });
      mansard(b, cx, h, cz, w, d, roof);
      F.box(cx, h - 0.5, cz, w + 0.4, 0.5, d + 0.4, C.white);
      // Fensterachsen, auf dem Dach Gauben über jeder Achse
      const nw = Math.max(1, Math.round(w / 4.9));
      const rows = Math.floor((h - 1.0) / 4.2);
      b.at(0, 0, fz + dz, 0, () => {
        for (let i = 0; i < nw; i++) {
          const x = x0 + (w * (i + 0.5)) / nw;
          if (Math.abs(x) < 7) continue;
          for (let r = 0; r < rows; r++) {
            const y = 1.4 + r * 4.2;
            if (near) G.rect(x, y - 0.12, 0.02, 1.64, 2.84, C.white);
            G.rect(x, y, 0.04, 1.4, 2.6, C.pane, { g: [1.12, 0.72] });
          }
          if (near) {
            F.box(x, h + 0.5, -0.7, 1.3, 1.7, 1.5, C.white);
            F.box(x, h + 2.2, -0.75, 1.7, 0.25, 1.7, roof);
            G.rect(x, h + 0.75, 0.07, 0.9, 1.2, C.pane);
          }
        }
      });
    }
    b.at(0, 0, fz, 0, () => {
      portico(b, 0.6, 14, 12, 6, 3.2, C.white);
      darkArch(b, 0, 0.6, 2.6, 4.2, C.dark);
    });
    // Laterne mit Kuppel auf dem Mittelbau
    const lz = fz - 9;
    F.cyl(0, 22.4, lz, 1.7, 1.7, 1.6, C.white, { seg: near ? 12 : 8, top: false });
    F.lathe(0, 24.0, lz, [[1.9, 0], [1.9, 0.25], [1.6, 0.6], [1.0, 1.4], [0.3, 1.9], [0.08, 2.1]], C.roof, { seg: near ? 12 : 8, bottom: true });
    F.ball(0, 26.3, lz, 0.25, C.gold, { ws: 6, hs: 4 });
    return { w: 130, d: 72, h: 27 };
  });

  const STA = { shell: 0xf2f1ec, shellDark: 0xc9cbce, rib: 0xdcdee2, roof: 0xe6e8ea, roofEdge: 0xb9bec4, under: 0x9aa0a8, seatA: 0xd2453a, seatB: 0x3f7ab8, walk: 0xe9e6de, wall: 0x6a7078, pitch: 0x6fb04f, pitch2: 0x7fbf5a, apron: 0x5f9a4a, line: 0xf6f6f2, mast: 0xb9bec4, lamp: 0xfff1c8, ground: 0xc9c2b4, dark: 0x4a4f58, flag: [0xd2453a, 0xf2c94a, 0x3f7ab8, 0x3f8f5a] };
  landmark('stadion', { places: [], slot: 'skyline', far: true, title: 'Stadion' }, (b) => {
    const { F, G, L } = b;
    const near = !b.lod;
    const C = STA;
    const cz = -70;
    const k = near ? 8 : 4;
    const R = (w, d, r) => rrect(w, d, r, k, 0, cz);
    F.box(0, 0, cz, 190, 0.1, 140, C.ground, { skip: 'b' });
    // Außenhaut mit Sockel (Normalen nach außen); Dach als Keil: oben, Innenkante, Unterseite; Ränge mit Rückwand.
    // Ränge und Innenkante laufen von oben nach unten, damit ihre Normalen nach innen zeigen.
    const ring = [[R(150, 116, 36), 0], [R(150, 116, 36), 4.4], [R(148, 114, 35), 21], [R(146, 112, 34), 25]];
    const top = ring[3][0];
    loft(F, ring, [C.shellDark, C.shell, C.shell], { top: false, smooth: 0.9, g: [0.86, 1.04] });
    loft(F, [[top, 25], [R(110, 76, 18), 27.4], [R(110, 76, 18), 26.7], [top, 25]], [C.roof, C.roofEdge, C.under], { top: false, smooth: 0.9 });
    loft(F, [[top, 25], [top, 20], [R(126, 94, 26), 11], [R(123, 91, 25), 10.4], [R(102, 72, 14), 1.6], [R(102, 72, 14), 0.1]], [C.under, C.seatA, C.walk, C.seatB, C.wall], { top: false, smooth: 0.9 });
    // Spielfeld in Streifen, Linien, Tore
    F.box(0, 0.1, cz, 101, 0.04, 71, C.apron, { skip: 'b' });
    for (let i = 0; i < 8; i++) F.box(-42 + i * 12, 0.14, cz, 12, 0.04, 66, i % 2 ? C.pitch2 : C.pitch, { skip: 'b' });
    if (near) {
      b.xf([0, 0.185, cz], [-Math.PI / 2, 0, 0], 1, () => {
        for (const y of [-33.15, 32.85]) G.rect(0, y, 0, 96.3, 0.3, C.line);
        for (const x of [-48, 0, 48]) G.rect(x, -33, 0, 0.3, 66, C.line);
        for (const s of [-1, 1]) {
          G.rect(s * 31.5, -20, 0, 0.3, 40, C.line);
          for (const y of [-20.15, 19.85]) G.rect(s * 39.75, y, 0, 16.5, 0.3, C.line);
        }
        G.extrude(circle(9.3, 40), 0, 0.01, C.line, { caps: 'f', sides: false, holes: [circle(9.0, 40)] });
      });
      for (const s of [-1, 1]) {
        for (const t of [-1, 1]) F.box(s * 48, 0.18, cz + t * 3.65, 0.15, 2.4, 0.15, C.line);
        F.box(s * 48, 2.58, cz, 0.15, 0.15, 7.45, C.line);
      }
    }
    // Rippen auf der Außenhaut (Ecken: Ringpunkte, Geraden: gleiche Abstände), Eingänge zur Straße, Fahnen
    const rib = (p) => {
      for (let j = 1; j < 3; j++) F.rod([p[j][0], ring[j][1], p[j][1]], [p[j + 1][0], ring[j + 1][1], p[j + 1][1]], 0.45, C.rib, { seg: 4 });
    };
    const st = near ? 1 : 2;
    for (let i = 0; i < top.length; i += st) rib(ring.map(([pts]) => pts[i]));
    const half = ring.map(([pts]) => [Math.max(...pts.map((q) => q[0])), Math.max(...pts.map((q) => q[1] - cz))]);
    for (let j = 1; j < 10; j += st) for (const s of [-1, 1]) rib(half.map(([, hz]) => [-39 + 7.8 * j, cz + s * hz]));
    for (let j = 1; j < 6; j += st) for (const s of [-1, 1]) rib(half.map(([hx]) => [s * hx, cz - 22 + (44 * j) / 6]));
    b.at(0, 0, cz + 58, 0, () => {
      for (const x of [-35.1, -19.5, -3.9, 3.9, 19.5, 35.1]) darkArch(b, x, 0.1, 3.6, 3.8, C.dark);
    });
    if (near) {
      for (const s of [-1, 1]) for (let i = 0; i < 7; i++) {
        const x = -36 + i * 12;
        const z = cz + s * 56;
        F.cyl(x, 25, z, 0.12, 0.1, 5, C.mast, { seg: 4 });
        F.box(x + 0.9, 28.6, z, 1.8, 1.2, 0.06, C.flag[(i + (s > 0 ? 0 : 2)) % 4]);
      }
    }
    // vier Flutlichtmasten an den Ecken, Lampen zur Mitte
    for (const [x, z] of [[-72, cz + 56], [72, cz + 56], [-72, cz - 56], [72, cz - 56]]) {
      F.cyl(x, 0.1, z, 0.9, 0.6, 40, C.mast, { seg: 8 });
      b.at(x, 0, z, Math.atan2(-x, cz - z), () => {
        F.box(0, 39, 0, 7, 4, 0.6, C.mast);
        (L ?? G).rect(0, 39.4, 0.32, 6.4, 3.2, C.lamp);
      });
    }
    return { w: 190, d: 140, h: 43 };
  });

  const AZ = { concrete: 0xcfcac0, concreteDark: 0xb3ada2, rail: 0x8a8f96, sleeper: 0x7a6a5a, wagon: 0x3f6fa8, wagonDark: 0x2f5a8e, white: 0xf4f1ea, deck: 0x9aa1a8, red: 0xd2453a, yellow: 0xf2c94a, pane: 0x56677a, gravel: 0xb9b2a6, tyre: 0x55585e };
  /** Autotransportwagen (Länge 26 m) längs x um (x, z): zwei Ebenen, offene Seiten mit Streben. */
  function carWagon(b, x, z) {
    const { F } = b;
    const near = !b.lod;
    const C = AZ;
    for (const dx of [-9, 9]) for (const s of [-1, 1]) b.xf([x + dx, 0.71, z + s * 0.75], [Math.PI / 2, 0, 0], 1, () => F.cyl(0, -0.08, 0, 0.45, 0.45, 0.16, C.tyre, { seg: 8, bottom: true }));
    F.box(x, 1.0, z, 26, 0.35, 3.0, C.wagonDark);
    F.box(x, 3.7, z, 26, 0.3, 3.0, C.deck);
    F.box(x, 6.2, z, 26, 0.35, 3.1, C.wagon);
    for (let i = 0; i <= 8; i++) for (const s of [-1, 1]) F.box(x - 12.8 + i * 3.2, 1.35, z + s * 1.42, 0.22, 4.85, 0.16, C.wagon);
    if (near) for (const s of [-1, 1]) F.box(x, 2.6, z + s * 1.45, 26, 0.12, 0.08, C.white);
  }
  /** Spielzeugauto (Länge 4 m) mit der Mitte auf (x, y, z), längs x. */
  function toyCar(b, x, y, z, col) {
    b.F.rbox(x, y, z, 4.0, 0.9, 1.8, 0.4, col, { seg: 2 });
    b.F.rbox(x - 0.3, y + 0.9, z, 2.2, 0.7, 1.6, 0.35, mix(col, 0xffffff, 0.2), { seg: 2 });
  }
  landmark('autozug', { places: [], slot: 'open', title: 'Autozug-Verladung' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = AZ;
    F.box(0, 0, -8, 80, 0.1, 16, C.gravel, { skip: 'b' });
    // Auffahrrampe von links, Bühne, Gleis mit zwei Autotransportwagen, Wärterhäuschen mit Schranke
    F.extrude([[-40, 0.1], [-30, 1.35], [-27, 1.35], [-27, 0.1]], -11.6, -8.4, C.concreteDark, { g: [0.88, 1.04] });
    for (const s of [-1, 1]) F.box(6.5, 0.1, -10 + s * 0.75, 67, 0.16, 0.12, C.rail, { skip: 'b' });
    if (near) for (let x = -26.4; x <= 39.6; x += 1.2) F.box(x, 0.1, -10, 0.3, 0.08, 2.6, C.sleeper, { skip: 'b' });
    F.box(39.6, 0.1, -10, 0.6, 1.2, 2.4, C.red);
    carWagon(b, -14, -10);
    carWagon(b, 13, -10);
    const tints = [C.red, C.yellow, 0x5ec8c0, 0xf4f1ea, 0x8a5aa8, 0xf08a3a, 0x7fbf5a];
    for (let i = 0; i < 4; i++) toyCar(b, -23 + i * 5.2, 1.35, -10, tints[i]);
    for (let i = 0; i < 3; i++) toyCar(b, 5 + i * 5.4, 4.0, -10, tints[4 + i]);
    b.xf([-34, 0.1 + 1.25 * 0.6, -10], [0, 0, Math.atan2(1.25, 10)], 1, () => toyCar(b, 0, 0, 0, 0x3f7ab8));
    F.box(30, 0.1, -3, 3.4, 2.8, 3.0, C.white, { g: [0.88, 1.04], skip: 'b' });
    F.box(30, 2.9, -3, 4.0, 0.3, 3.6, C.red);
    b.at(30, 0, -1.5, 0, () => G.rect(0, 1.2, 0.03, 2.2, 1.0, C.pane));
    F.cyl(26, 0.1, -2.5, 0.2, 0.2, 1.0, C.white, { seg: 6 });
    for (let i = 0; i < 6; i++) F.box(26 - 0.6 - i * 0.9, 0.95, -2.5, 0.9, 0.16, 0.16, i % 2 ? C.white : C.red);
    return { w: 80, d: 16, h: 6.6 };
  });

  const GP = { white: 0xf6f2e8, roof: 0x5c6876, red: 0xd2453a, pole: 0xb9bec4, glass: 0x8fb0c4, flower: 0xe5483a, kerb: 0xd6d0c4, green: 0x8fbf63 };
  landmark('grenzposten', {
    places: [], slot: 'open', title: 'Grenzposten',
    extras: (kit) => {
      const m = textPanel(kit.core, 'sign:grenze', 4.0, 1.0, 512, (ctx, cw, ch) => {
        ctx.fillStyle = '#2f5f9e';
        ctx.fillRect(0, 0, cw, ch);
        ctx.strokeStyle = '#fdfbf5';
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, cw - 20, ch - 20);
        ctx.fillStyle = '#fdfbf5';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        fitFont(ctx, 'Gute Fahrt!', Math.round(ch * 0.5), cw - 60);
        ctx.fillText('Gute Fahrt!', cw / 2, ch * 0.54);
      });
      m.position.set(0, 6.3, -1.66);
      return [m];
    },
  }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = GP;
    F.box(0, 0, -6, 22, 0.15, 12, C.kerb, { skip: 'b' });
    // Dach auf vier Stützen, darunter das Häuschen mit Fenstern rundum, Schranke, Blumenkübel
    for (const x of [-9, 9]) for (const z of [-1.5, -10.5]) F.cyl(x, 0.15, z, 0.25, 0.25, 4.6, C.pole, { seg: 8 });
    F.rbox(0, 4.75, -6, 20, 0.9, 10, 0.4, C.white, { seg: 2 });
    F.box(0, 4.7, -6, 20.2, 0.12, 10.2, C.roof);
    F.box(0, 5.65, -1.85, 4.4, 1.3, 0.3, C.white);
    F.box(0, 0.15, -6, 4, 3, 3.4, C.white, { g: [0.88, 1.04], skip: 'b' });
    around(b, 0, -6, 4, 3.4, (w) => G.rect(0, 1.2, 0.03, w - 1.0, 1.3, C.glass, { g: [1.12, 0.78] }));
    F.cyl(3.4, 0.15, -1.2, 0.25, 0.25, 1.1, C.white, { seg: 8 });
    for (let i = 0; i < 7; i++) F.box(3.4 + 0.4 + i * 0.8, 1.0, -1.2, 0.8, 0.18, 0.16, i % 2 ? C.white : C.red);
    if (near) for (const x of [-6, 6]) {
      F.cyl(x, 0.15, -11, 0.6, 0.5, 0.7, C.kerb, { seg: 8 });
      F.ball(x, 0.95, -11, 0.55, C.green, { ws: 8, hs: 5 });
      for (let i = 0; i < 5; i++) F.ball(x + Math.sin(i * 1.3) * 0.4, 1.2, -11 + Math.cos(i * 1.3) * 0.4, 0.12, C.flower, { ws: 4, hs: 2 });
    }
    return { w: 22, d: 12, h: 7 };
  });

  const PH = { stone: 0xb8b0a2, stoneDark: 0x9c9486, wood: 0x9a6a44, woodDark: 0x7a5236, roof: 0x7a7470, shutterR: 0xd2453a, white: 0xf4efe4, meadow: 0x8fbf63, rock: 0xa49d92, red: 0xd2453a, pane: 0x4c5562 };
  landmark('passhuette', {
    places: [], slot: 'skyline', title: 'Passhütte',
    extras: (kit) => {
      const m = textPanel(kit.core, 'sign:passhoehe', 3.2, 0.8, 512, (ctx, cw, ch) => {
        ctx.fillStyle = '#8a5a3c';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = '#fdf3dc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        fitFont(ctx, 'Passhöhe', Math.round(ch * 0.55), cw - 50);
        ctx.fillText('Passhöhe', cw / 2, ch * 0.55);
      });
      m.position.set(-9, 2.3, -3.37);
      return [m];
    },
  }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = PH;
    // Almwiese mit Felsen, Hütte: Steinsockel, Holz darüber, flaches Dach mit Steinen, Läden, Blumen
    F.box(0, 0, -11, 34, 0.1, 22, C.meadow, { skip: 'b' });
    const hx = 4;
    const hz = -12;
    F.box(hx, 0.1, hz, 12, 3.2, 9, C.stone, { g: [0.86, 1.02], skip: 'b' });
    F.box(hx, 3.3, hz, 12, 3.0, 9, C.wood, { g: [0.88, 1.04], skip: 'tb' });
    b.at(hx, 0, hz, Math.PI / 2, () => F.extrude([[-4.5, 6.3], [4.5, 6.3], [0, 8.5]], -6, 6, C.wood));
    b.gable(hx, 6.3, hz, 12, 9, 2.2, C.roof, { axis: 'x', oe: 1.0, og: 0.9, ridge: near });
    if (near) for (const dz of [1.3, 3.0]) for (let i = 0; i < 6; i++) {
      const x = hx - 4.6 + i * 1.84 + (dz > 2 ? 0.5 : 0);
      F.ball(x, 6.3 + 2.2 * (1 - dz / 4.5) + 0.17, hz + dz, 0.35, C.stoneDark, { ws: 5, hs: 3, sy: 0.6 });
    }
    b.at(hx, 0, hz + 4.5, 0, () => {
      G.rect(0, 0.1, 0.03, 1.4, 2.4, C.woodDark);
      for (const [x, y] of [[-4, 1.0], [4, 1.0], [-3, 4.0], [0, 4.0], [3, 4.0]]) {
        G.rect(x, y, 0.03, 1.1, 1.2, C.pane);
        if (near) for (const s of [-1, 1]) {
          G.rect(x + s * 0.9, y - 0.05, 0.05, 0.55, 1.3, C.shutterR);
          G.rect(x + s * 0.9, y + 0.5, 0.06, 0.18, 0.18, C.white);
        }
        if (near && y > 3) b.flowerBox(x, y - 0.1, 1.3, C.red, Math.round(x * 3 + 9));
      }
    });
    F.box(hx, 0.1, hz + 5.0, 3, 0.3, 1.0, C.woodDark);
    // Felsen, Bank, Wegweiser
    for (const [x, z, r] of [[-12, -18, 2.4], [-14, -14, 1.6], [14, -19, 2.0], [-4, -19.5, 1.4]]) F.ball(x, 0.1, z, r, C.rock, { ws: 7, hs: 4, sy: 0.7, g: [0.85, 1.06] });
    F.box(-3, 0.1, -6, 2.6, 0.45, 0.6, C.woodDark);
    F.box(-3, 0.55, -6.2, 2.6, 0.12, 0.25, C.wood);
    F.cyl(-10.5, 0.1, -3.6, 0.12, 0.1, 2.8, C.woodDark, { seg: 6 });
    F.cyl(-7.5, 0.1, -3.6, 0.12, 0.1, 2.8, C.woodDark, { seg: 6 });
    F.box(-9, 1.85, -3.5, 3.4, 0.9, 0.12, C.woodDark);
    return { w: 34, d: 22, h: 9 };
  });

  const ZOO = { wood: 0xb98a5a, woodDark: 0x8a6448, green: 0x6faa56, giraffe: 0xf2c25a, spot: 0xb8763a, elephant: 0xa9b1bb, elephantDark: 0x8e97a2, white: 0xf6f2e8, red: 0xd2453a, pane: 0x56677a, path: 0xe2d4b4, eye: 0x4a3a30, pennant: [0xd2453a, 0xf2c94a, 0x3f7ab8, 0x3f8f5a, 0xf08a3a] };
  landmark('zooEingang', {
    places: [], slot: 'square', title: 'Zoo-Eingang',
    extras: (kit) => {
      const m = textPanel(kit.core, 'sign:tierpark', 9.0, 1.8, 1024, (ctx, cw, ch) => {
        ctx.fillStyle = '#f2c25a';
        ctx.fillRect(0, 0, cw, ch);
        ctx.strokeStyle = '#8a5a3c';
        ctx.lineWidth = 12;
        ctx.strokeRect(12, 12, cw - 24, ch - 24);
        ctx.fillStyle = '#6b3f2a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        fitFont(ctx, 'Tierpark', Math.round(ch * 0.62), cw - 120);
        ctx.fillText('Tierpark', cw / 2, ch * 0.55);
      });
      m.position.set(0, 7.9, -2.66);
      return [m];
    },
  }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = ZOO;
    F.box(0, 0, -7, 32, 0.1, 14, C.path, { skip: 'b' });
    // Tor: zwei Pfeiler aus Stämmen, Querbalken mit Schild, Wimpelkette, Kassenhäuschen, Zaun mit Hecke
    for (const s of [-1, 1]) {
      F.cyl(s * 5.5, 0.1, -3, 0.6, 0.5, 9.2, C.wood, { seg: 10 });
      F.ball(s * 5.5, 9.4, -3, 0.7, C.green, { ws: 8, hs: 5 });
    }
    F.box(0, 6.8, -3, 12.4, 2.2, 0.6, C.woodDark);
    if (near) {
      const tips = Array.from({ length: 9 }, (_, i) => [-4.8 + i * 1.2, 6.4 - 0.5 * Math.sin((i / 8) * Math.PI)]);
      tips.forEach(([x, y], i) => b.at(x, 0, -2.5, 0, () => F.extrude([[-0.4, y], [0.4, y], [0, y - 0.9]], -0.03, 0.03, C.pennant[i % C.pennant.length])));
      const line = [[-4.95, 6.6], ...tips, [4.95, 6.6]];
      for (let i = 0; i + 1 < line.length; i++) F.rod([line[i][0], line[i][1], -2.5], [line[i + 1][0], line[i + 1][1], -2.5], 0.025, C.white, { seg: 3 });
    }
    for (const s of [-1, 1]) {
      F.box(s * 11.5, 0.1, -3, 8, 1.6, 0.4, C.woodDark);
      F.rbox(s * 11.5, 1.7, -3.5, 8, 1.4, 1.2, 0.5, C.green, { seg: 2 });
    }
    F.box(-11, 0.1, -9, 5, 3, 4, C.white, { g: [0.88, 1.04], skip: 'b' });
    F.box(-11, 3.1, -9, 5.6, 0.4, 4.6, C.red);
    b.at(-11, 0, -7, 0, () => G.rect(0, 1.2, 0.03, 3, 1.1, C.pane));
    // Giraffe schaut über den Zaun, Elefant als großes Plüschtier hinter dem Tor
    const gx = 9;
    const gz = -8;
    F.ball(gx, 3.0, gz, 1.0, C.giraffe, { ws: 10, hs: 6, sx: 1.4 });
    for (const [lx, lz] of [[0.8, 0.4], [0.8, -0.4], [-0.8, 0.4], [-0.8, -0.4]]) F.rod([gx + lx, 2.6, gz + lz], [gx + lx, 0.1, gz + lz], 0.13, C.giraffe, { seg: 5 });
    F.rod([gx + 0.8, 3.4, gz], [gx + 1.8, 7.2, gz + 0.6], 0.3, C.giraffe, { seg: 6, r1: 0.22 });
    F.ball(gx + 1.95, 7.5, gz + 0.7, 0.45, C.giraffe, { ws: 8, hs: 5, sx: 1.4 });
    if (near) {
      for (const s of [-1, 1]) F.cyl(gx + 1.85, 7.85, gz + 0.7 + s * 0.2, 0.06, 0.05, 0.35, C.spot, { seg: 4 });
      for (let i = 0; i < 8; i++) F.ball(gx + Math.sin(i * 2.1) * 1.1, 3.0 + Math.cos(i * 1.7) * 0.5, gz + Math.cos(i * 2.1) * 0.62, 0.22, C.spot, { ws: 5, hs: 3, sy: 0.4 });
      F.ball(gx + 2.35, 7.45, gz + 0.75, 0.08, C.eye, { ws: 4, hs: 2 });
    }
    const ex = 2;
    const ez = -10;
    F.ball(ex, 2.0, ez, 1.6, C.elephant, { ws: 10, hs: 7, sx: 1.25, g: [0.85, 1.05] });
    for (const [lx, lz] of [[1.0, 0.7], [1.0, -0.7], [-1.0, 0.7], [-1.0, -0.7]]) F.cyl(ex + lx, 0.1, ez + lz, 0.42, 0.42, 1.2, C.elephant, { seg: 8 });
    F.ball(ex + 2.0, 2.6, ez, 1.0, C.elephant, { ws: 10, hs: 6 });
    for (const s of [-1, 1]) F.ball(ex + 1.8, 2.7, ez + s * 0.95, 0.75, C.elephantDark, { ws: 8, hs: 5, sx: 0.35 });
    F.rod([ex + 2.8, 2.4, ez], [ex + 3.2, 1.0, ez], 0.28, C.elephant, { seg: 6, r1: 0.18 });
    if (near) for (const s of [-1, 1]) F.ball(ex + 2.75, 2.95, ez + s * 0.38, 0.1, C.eye, { ws: 4, hs: 2 });
    return { w: 32, d: 14, h: 10 };
  });
}
