// Stadt-Baukasten, Teil Wahrzeichen, zweite Runde: Orte in Deutschland, die oft im Stream waren oder in der Heimat
// liegen und bisher nur ein Sammelstück (Schloss, Stadion, Burg) oder gar nichts hatten. Dieselben Regeln wie in
// landmarks.js: liebevoll vereinfachte Spielzeugfassungen, die man aus dem Auto in einer Sekunde erkennt (Umriss, zwei,
// drei Merkmale, die Farben), Ursprung in der Mitte der Vorderkante, Schauseite nach +z, höchstens vier Draw Calls je
// Stück, jedes mit Fernfassung (b.lod). Maße nach Wikipedia und Fotos, meist im Maßstab 0,85 wie die übrigen Stücke.
// Kirchen und Denkmäler erscheinen neutral und respektvoll als Architektur; keine Marken, keine Logos.
// landmarks.js reicht seine Werkzeuge herein (registerHeimat), damit alle Dateien dieselben Bausteine teilen.
import { PAL, mix } from './citycore.js';
import { arch, onion, dome } from './town.js';

const TAU = Math.PI * 2;

export function registerHeimat(T) {
  const { landmark, loft, prism, spire, chamfer, rrect, ngon, circle, lancet, flatArch, goldDial, baroqueHelm, voluteGable, roundTower, terrain, gridLines } = T;

  /** Rechteckfenster mit Steinrahmen (G) in der Wandebene z = 0: x Mitte, y Unterkante; o.ped: Dreiecksgiebel darüber. */
  function stoneWin(b, x, y, w, h, frame, pane, o = {}) {
    const { G } = b;
    const fw = o.fw ?? 0.32;
    G.rect(x, y, 0.03, w, h, pane, { g: [1.1, 0.78] });
    if (b.lod) return;
    G.rect(x, y - fw, 0.05, w + 2 * fw, fw, frame);
    G.rect(x, y + h, 0.05, w + 2 * fw, fw, frame);
    G.rect(x - w / 2 - fw / 2, y, 0.05, fw, h, frame);
    G.rect(x + w / 2 + fw / 2, y, 0.05, fw, h, frame);
    if (o.cross) {
      G.rect(x, y, 0.045, 0.12, h, frame);
      G.rect(x, y + h * 0.62, 0.045, w, 0.12, frame);
    }
    if (o.ped) G.extrude([[x - w / 2 - fw * 1.6, y + h + fw], [x + w / 2 + fw * 1.6, y + h + fw], [x, y + h + fw + w * 0.32]], 0.0, 0.14, frame, { caps: 'f', sides: false });
  }

  // ===========================================================================================================
  // Augsburg: Rathaus und Perlachturm am Rathausplatz – hier begann BrunnenTV (4. Mai 2017)
  // ===========================================================================================================
  // Elias Holls Rathaus (1615–1620): breiter heller Block mit Fensterreihen, die Mitte zwei Geschosse höher mit
  // Dreiecksgiebel, darin der Reichsadler, obenauf die Zirbelnuss (das Stadtzeichen); seitlich der Mitte zwei Türme mit
  // achteckigen Laternen und grünen Zwiebelhauben. Links daneben der schlanke Perlachturm (70 m) mit Kuppelhaube.
  const AUG = { wall: 0xefe6d4, shade: 0xe2d6c0, frame: 0xb7a58a, band: 0xd8c8aa, roof: 0xa4593f, copper: 0x79ab93, copperDark: 0x5d8e78, pane: 0x4f5b6b, door: 0x4d3b30, gold: 0xe2b84e, ink: 0x2b2522, tower: 0xe9e2d3 };

  /** Doppelköpfiger Adler als flache Silhouette (Mitte x, Fuß y, Spannweite s), schaut nach +z. */
  function eagle(b, x, y, s, col) {
    const { G } = b;
    const P = (pts) => pts.map(([px, py]) => [x + px * s, y + py * s]);
    // Rumpf und Schwanz
    G.extrude(P([[-0.09, 0.3], [0.09, 0.3], [0.12, 0.62], [0.06, 0.74], [-0.06, 0.74], [-0.12, 0.62]]), 0.08, 0.1, col, { caps: 'f', sides: false });
    G.extrude(P([[-0.16, 0.0], [0.16, 0.0], [0.09, 0.32], [-0.09, 0.32]]), 0.08, 0.1, col, { caps: 'f', sides: false });
    for (const sx of [-1, 1]) {
      // Flügel: drei gestufte Federn nach außen oben
      const W = [[0.08, 0.66], [0.5, 0.92], [0.46, 0.8], [0.52, 0.76], [0.44, 0.64], [0.5, 0.58], [0.4, 0.48], [0.12, 0.42]].map(([px, py]) => [sx * px, py]);
      G.extrude(P(sx > 0 ? W : W.reverse()), 0.08, 0.1, col, { caps: 'f', sides: false });
      // Hals und Kopf
      G.extrude(P([[sx * 0.03, 0.72], [sx * 0.1, 0.72], [sx * 0.2, 0.9], [sx * 0.24, 0.88], [sx * 0.2, 0.98], [sx * 0.12, 0.96]]), 0.08, 0.1, col, { caps: 'f', sides: false });
    }
  }

  /** Achteckige Turmlaterne mit Rundbogenöffnungen und grüner Zwiebel, Fuß bei y, Breite w. */
  function augTowerTop(b, x, y, z, w, c) {
    const { F } = b;
    const near = !b.lod;
    const R = w / 2 / Math.cos(Math.PI / 8);
    prism(F, ngon(8, R, Math.PI / 8, 0, 0, x, z), y, y + 6.2, c.tower, { g: [0.9, 1.03] });
    prism(F, ngon(8, R + 0.35, Math.PI / 8, 0, 0, x, z), y + 6.2, y + 6.8, c.band);
    prism(F, ngon(8, R + 0.25, Math.PI / 8, 0, 0, x, z), y, y + 0.5, c.band);
    if (near) {
      for (let k = 0; k < 8; k++) {
        const a = ((k + 0.5) / 8) * TAU;
        const r = R * Math.cos(Math.PI / 8) + 0.02;
        b.at(x + Math.sin(a) * r, 0, z + Math.cos(a) * r, a, () => flatArch(b, 0, y + 1.2, 1.5, 3.8, c.frame, c.pane, 0.2));
      }
    }
    F.lathe(x, y + 6.8, z, onion(R * 0.98, 9.5), c.copper, { seg: near ? 16 : 8, g: [0.88, 1.08] });
    F.cyl(x, y + 15.6, z, 0.55, 0.45, 1.6, c.copperDark, { seg: 6 });
    F.lathe(x, y + 17.2, z, onion(0.9, 2.2), c.copper, { seg: near ? 10 : 6 });
    F.ball(x, y + 19.6, z, 0.38, c.gold, { ws: 8, hs: 4 });
    F.box(x, y + 19.9, z, 0.14, 1.6, 0.14, c.gold);
  }

  landmark('augsburgerRathaus', { places: ['Augsburg'], slot: 'square', title: 'Rathaus und Perlachturm' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = AUG;
    b.xf([0, 0, 0], [0, 0, 0], 0.85, () => {
      const zf = -1.0; // Wandebene der Front (Sockel, Gesimse stehen bis z = 0 vor)
      const D = 30; // Tiefe des Blocks
      const WW = 38; // Breite des Rathauses
      const WC = 14; // Breite der höheren Mitte
      const eave = 25.5; // Traufe der Flügel
      const eaveC = 33.5; // Traufe der Mitte
      const xr = 7; // das Rathaus steht rechts der Mitte, links bleibt Platz für den Perlachturm
      b.at(xr, 0, 0, 0, () => {
        // --- Block, Sockel, Gesimse --------------------------------------------------------------------------------
        F.box(0, 0, zf - D / 2, WW, eave, D, C.wall, { g: [0.86, 1.02] });
        F.box(0, 0, zf - D / 2 + 0.3, WW + 0.6, 2.6, D + 0.6, C.band, { skip: 'b' });
        for (const y of [8.2, 14.2, 20.0]) F.box(0, y, zf - D / 2 + 0.25, WW + 0.5, 0.45, D + 0.5, C.band);
        F.box(0, eave - 0.9, zf - D / 2 + 0.3, WW + 0.8, 0.9, D + 0.8, C.band);
        // flaches Walmdach der Flügel (man sieht es nur von weitem)
        b.hip(0, eave, zf - D / 2, WW, D, 5.5, C.roof, { oe: 0.5 });
        // Mittelbau: zwei Geschosse höher, Giebel mit Adler, Zirbelnuss obenauf
        F.box(0, eave, zf - 7, WC, eaveC - eave, 14, C.wall, { g: [0.95, 1.02] });
        F.box(0, eaveC - 0.8, zf - 6.7, WC + 0.7, 0.8, 14.6, C.band);
        const ped = [[-WC / 2 - 0.4, eaveC], [WC / 2 + 0.4, eaveC], [0, eaveC + 7.6]];
        F.extrude(ped, zf - 0.8, zf + 0.1, C.wall, { crease: 2 });
        F.extrude(ped, zf - 14.4, zf - 13.6, C.wall, { crease: 2 });
        for (const sx of [-1, 1]) F.rod([sx * (WC / 2 + 0.6), eaveC - 0.05, zf + 0.25], [0, eaveC + 7.9, zf + 0.25], 0.36, C.band, { seg: 4 });
        F.box(0, eaveC + 7.6, zf - 0.6, 1.4, 0.7, 1.4, C.band);
        // Zirbelnuss: Zapfen auf Kapitell
        F.lathe(0, eaveC + 8.3, zf - 0.6, [[0.45, 0], [0.75, 0.6], [0.8, 1.3], [0.55, 2.1], [0.15, 2.6], [0, 2.7]], C.copper, { seg: near ? 10 : 6 });
        // hinter dem Giebel ein Satteldach der Mitte
        b.gable(0, eaveC, zf - 7.2, WC + 0.8, 12.8, 7.6, C.roof, { axis: 'z', oe: 0, og: 0, ridge: near });
        // --- Front: Fenster in Achsen ----------------------------------------------------------------------------
        b.at(0, 0, zf, 0, () => {
          // Flügel: je vier Achsen, Mitte: drei Achsen; Geschosse nach dem Gesims
          const axesW = [-16.2, -13.0, -9.8, 9.8, 13.0, 16.2];
          const axesC = [-4.2, 0, 4.2];
          const rows = [[3.6, 3.0], [9.4, 3.8, true], [15.2, 3.6], [21.0, 2.8]];
          for (const [y, h, ped] of rows) {
            for (const x of axesW) stoneWin(b, x, y, 1.7, h, C.frame, C.pane, { ped: ped && near, cross: true });
            for (const x of axesC) {
              if (y < 5) continue;
              stoneWin(b, x, y, 2.0, h, C.frame, C.pane, { ped: ped && near, cross: true });
            }
          }
          // Mitte oben: zwei Geschosse über den Flügeln, Adler im Giebelfeld
          for (const [y, h] of [[26.4, 2.6], [30.2, 2.2]]) for (const x of axesC) stoneWin(b, x, y, 1.9, h, C.frame, C.pane, { cross: true });
          if (near) eagle(b, 0, eaveC + 1.1, 5.4, C.ink);
          else G.extrude([[-1.6, eaveC + 1.4], [1.6, eaveC + 1.4], [0, eaveC + 5]], 0.08, 0.1, C.ink, { caps: 'f', sides: false });
          // Portal: drei Bogen auf einer Treppe, Lisenen am Mittelbau
          for (const x of [-3.6, 0, 3.6]) {
            G.extrude(arch(x, 2.6, 0.9, 4.6, near ? 8 : 5), 0.02, 0.03, C.door, { caps: 'f', sides: false });
            if (near) G.extrude(arch(x, 3.3, 0.6, 5.1, 8), 0.04, 0.05, C.frame, { caps: 'f', holes: [arch(x, 2.6, 0.9, 4.6, 8)], sides: false });
          }
          F.box(0, 0, 0.9, 12, 0.3, 1.8, C.band);
          F.box(0, 0.3, 0.6, 11, 0.3, 1.2, C.band);
          F.box(0, 0.6, 0.3, 10, 0.3, 0.6, C.band);
          for (const x of [-WC / 2, WC / 2]) F.box(x, 2.6, 0.15, 0.7, eaveC - 2.6, 0.3, C.shade);
          for (const x of [-WW / 2 + 0.35, WW / 2 - 0.35]) F.box(x, 2.6, 0.15, 0.7, eave - 3.5, 0.3, C.shade);
        });
        // Seiten- und Rückfenster der Flügel (nah)
        if (near) {
          b.at(0, 0, zf - D, Math.PI, () => {
            for (const [y, h] of [[3.6, 3.0], [9.4, 3.8], [15.2, 3.6], [21.0, 2.8]]) for (let x = -16; x <= 16; x += 4) stoneWin(b, x, y, 1.6, h, C.frame, C.pane, { cross: true });
          });
          for (const s of [-1, 1]) {
            b.at(s * (WW / 2), 0, zf - D / 2, (s * Math.PI) / 2, () => {
              for (const [y, h] of [[3.6, 3.0], [9.4, 3.8], [15.2, 3.6], [21.0, 2.8]]) for (const x of [-10, -5, 0, 5, 10]) stoneWin(b, x, y, 1.6, h, C.frame, C.pane, { cross: true });
            });
          }
        }
        // --- die beiden Türme seitlich der Mitte -------------------------------------------------------------------
        for (const sx of [-1, 1]) {
          const x = sx * (WC / 2 + 2.6);
          const z = zf - 14;
          F.box(x, eave, z, 5.2, 37 - eave, 5.2, C.tower, { g: [0.92, 1.02] });
          F.box(x, 36.5, z, 5.7, 0.6, 5.7, C.band);
          if (near) b.at(x, 0, z + 2.6, 0, () => stoneWin(b, 0, 30.5, 1.2, 3.2, C.frame, C.pane));
          augTowerTop(b, x, 37, z, 5.2, C);
        }
      });

      // --- Perlachturm mit Peterskirche, links ------------------------------------------------------------------
      const px = xr - WW / 2 - 6.4;
      const pz = zf - 7;
      // Kirchlein am Fuß: Satteldach quer, kleine Rundbogenfenster
      F.box(px - 1.6, 0, pz - 2, 11.5, 9, 12, C.shade, { g: [0.86, 1.02] });
      b.gable(px - 1.6, 9, pz - 2, 11.5, 12, 6, C.roof, { axis: 'x', oe: 0.4, og: 0.3, ridge: near });
      b.at(px - 1.6, 0, pz + 4, 0, () => {
        for (const x of [-3.2, 3.2]) flatArch(b, x, 3.4, 1.6, 3.6, C.frame, C.pane, 0.22);
        G.extrude(arch(0, 1.8, 0, 3.2, near ? 8 : 5), 0.02, 0.03, C.door, { caps: 'f', sides: false });
      });
      // Schaft: unten breiter, Gesimsbänder, oben das Achteck mit Rundbögen und der Kuppelhaube
      const T0 = 8.4;
      loft(F, [[chamfer(T0, T0, 0.2, px, pz), 0], [chamfer(T0 - 0.5, T0 - 0.5, 0.2, px, pz), 50]], C.tower, { g: [0.86, 1.03] });
      for (const y of [12, 24, 36, 49.4]) F.box(px, y, pz, T0 + 0.1 - y / 100, 0.55, T0 + 0.1 - y / 100, C.band);
      if (near) {
        for (const ry of [0, Math.PI / 2, -Math.PI / 2]) {
          b.at(px, 0, pz, ry, () => b.at(0, 0, T0 / 2 - 0.1, 0, () => {
            for (const y of [16, 28, 40]) flatArch(b, 0, y, 1.1, 2.6, C.frame, C.pane, 0.18);
            goldDial(b, 0, 45.6, 1.5, C.gold, C.ink);
          }));
        }
      }
      const R = 3.9 / Math.cos(Math.PI / 8);
      prism(F, ngon(8, R, Math.PI / 8, 0, 0, px, pz), 50, 58.5, C.tower, { g: [0.9, 1.03] });
      prism(F, ngon(8, R + 0.35, Math.PI / 8, 0, 0, px, pz), 58.5, 59.2, C.band);
      if (near) {
        for (let k = 0; k < 8; k++) {
          const a = ((k + 0.5) / 8) * TAU;
          const r = R * Math.cos(Math.PI / 8) + 0.02;
          b.at(px + Math.sin(a) * r, 0, pz + Math.cos(a) * r, a, () => flatArch(b, 0, 51.5, 1.4, 5, C.frame, C.pane, 0.2));
        }
      }
      // Kuppel mit Laterne und der Wetterfigur (schlank, golden)
      F.lathe(px, 59.2, pz, dome(R * 0.95, 5.6, near ? 6 : 4), C.copper, { seg: near ? 16 : 8, g: [0.9, 1.08] });
      F.cyl(px, 64.6, pz, 0.9, 0.8, 2.2, C.copperDark, { seg: near ? 8 : 6 });
      F.lathe(px, 66.8, pz, dome(1.05, 1.1, 3), C.copper, { seg: near ? 8 : 6 });
      F.cyl(px, 67.8, pz, 0.08, 0.08, 1.4, C.gold, { seg: 4 });
      F.lathe(px, 69.1, pz, [[0.22, 0], [0.3, 0.6], [0.2, 1.4], [0.12, 1.8], [0, 2.0]], C.gold, { seg: 6 });
    });
    return { w: 45, d: 27, h: 60.4 };
  });

  // ===========================================================================================================
  // Mannheim: Wasserturm am Friedrichsplatz (1886–1889)
  // ===========================================================================================================
  // Runder Turm aus rotem Neckartäler Sandstein, 60 m hoch und 19 m breit: kräftiger Sockel mit Rundbogennische, aus
  // der das Wasser über Stufen in das lange Becken davor fällt, oben ein Säulenkranz mit hohen Bogenfenstern, darüber
  // die grüne Kuppel mit Laterne und der Figur der Amphitrite. Davor das Becken mit den Wasserspielen – für BrunnenTV
  // ein Brunnen mit eigenem Turm.
  const MA = { stone: 0xb5644f, stoneDark: 0x9a5140, light: 0xddb59c, copper: 0x77a993, copperDark: 0x5a8c77, pane: 0x4e5866, terrace: 0xd8c9b2, rim: 0xc9b69a, water: 0x7cc8ec, jet: 0xe2f3ff, lawn: 0x8fbf6a, bronze: 0x6f9c86 };

  /** Stehende Figur mit erhobenem Dreizack (Andeutung der Amphitrite), Fuß bei (x, y, z), Höhe h. */
  function tridentFigure(b, x, y, z, h, col) {
    const { F } = b;
    const k = h / 5;
    const seg = b.lod ? 5 : 8;
    b.xf([x, y, z], [0, 0, 0], k, () => {
      F.lathe(0, 0, 0, [[0.75, 0], [0.7, 0.6], [0.5, 2.2], [0.4, 3.1], [0.48, 3.6], [0.3, 3.95], [0, 4.0]], col, { seg });
      F.ball(0, 4.3, 0, 0.32, col, { ws: seg, hs: 4 });
      F.rod([0.4, 3.5, 0], [0.75, 4.2, 0.1], 0.12, col, { seg: 4 });
      F.rod([0.78, 2.2, 0.1], [0.78, 5.6, 0.1], 0.06, col, { seg: 4 });
      if (!b.lod) for (const dx of [-0.18, 0, 0.18]) F.rod([0.78 + dx, 5.35, 0.1], [0.78 + dx, 5.75, 0.1], 0.04, col, { seg: 3 });
      F.rod([-0.4, 3.5, 0], [-0.7, 2.6, 0.2], 0.12, col, { seg: 4 });
    });
  }

  landmark('wasserturmMannheim', { places: ['Mannheim'], slot: 'square', title: 'Wasserturm' }, (b) => {
    const { F, G, W } = b;
    const near = !b.lod;
    const C = MA;
    const seg = near ? 24 : 12;
    b.xf([0, 0, 0], [0, 0, 0], 0.85, () => {
      const tz = -34; // Turmmitte
      // Terrasse mit Treppen, Rasen und dem langen Becken nach vorn
      F.rbox(0, 0, tz, 32, 2.2, 30, 1.5, C.terrace, { seg: 3 });
      F.box(0, 0, -11, 46, 0.5, 22, C.terrace);
      for (const sx of [-1, 1]) F.box(sx * 17.5, 0.5, -11, 11, 0.15, 20, C.lawn);
      // Becken: Rand, Wasser, Stufen der Kaskade aus der Nische, Fontänen
      F.box(0, 0.5, -10.5, 22.6, 0.75, 19.4, C.rim);
      W.poolRect(0, 1.1, -10.5, 21, 18, C.water, { rings: 0.35, c: [0, -2] });
      for (let i = 0; i < 4; i++) {
        const y = 1.1 + i * 0.55;
        F.box(0, 0.5, -21 - i * 1.1, 9 - i * 0.8, y - 0.4, 1.1, C.rim);
        W.poolRect(0, y + 0.01, -21 - i * 1.1, 8.4 - i * 0.8, 1.0, C.water, { rings: 0.1 });
      }
      if (near) {
        for (const [x, z, v] of [[-6, -6, 7.5], [6, -6, 7.5], [-6, -14, 6], [6, -14, 6], [0, -10, 9]]) W.jet([x, 1.2, z], [0, v, 0], 1.15, 0.12, C.jet, { apex: true, n: 7, seg: 6, r1: 0.06, ph: x + z, pulse: 0.3 });
      }
      // Turm: Sockel, Schaft, Säulenkranz, Gesims, Kuppel, Laterne, Figur
      const y0 = 2.2;
      F.lathe(0, y0, tz, [[10.4, 0], [10.4, 3.2], [9.9, 3.6], [9.6, 4]], [C.stoneDark, C.light, C.stone], { seg, g: [0.85, 1] });
      F.lathe(0, y0 + 4, tz, [[9.6, 0], [9.3, 26]], C.stone, { seg, g: [0.86, 1.03] });
      F.lathe(0, y0 + 30, tz, [[9.3, 0], [10.3, 0.6], [10.3, 1.6], [9.4, 2.0]], C.light, { seg });
      for (const y of [10.6, 19.4]) F.lathe(0, y0 + y, tz, [[9.5, 0], [9.72, 0.2], [9.72, 0.7], [9.45, 0.9]], C.light, { seg });
      F.lathe(0, y0 + 32, tz, [[9.0, 0], [9.0, 9.5]], C.stoneDark, { seg, g: [0.8, 1] });
      F.lathe(0, y0 + 41.5, tz, [[9.4, 0], [10.4, 0.7], [10.4, 1.7], [9.8, 2.0]], C.light, { seg });
      // Kuppel: leicht spitz, mit Rippen; Laterne mit Bögen; Figur
      const prof = [[9.6, 0], [9.2, 2.6], [8.0, 5.2], [6.0, 7.6], [3.6, 9.4], [1.8, 10.4]];
      F.lathe(0, y0 + 43.5, tz, prof, C.copper, { seg, g: [0.86, 1.1] });
      if (near) {
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * TAU;
          const pt = ([r, y]) => [Math.sin(a) * (r + 0.08), y0 + 43.5 + y, tz + Math.cos(a) * (r + 0.08)];
          for (let i = 0; i + 1 < prof.length; i++) F.rod(pt(prof[i]), pt(prof[i + 1]), 0.16, C.copperDark, { seg: 4 });
        }
      }
      F.lathe(0, y0 + 53.9, tz, [[1.9, 0], [1.9, 2.4], [2.3, 2.7], [2.3, 3.1], [1.4, 3.3]], [C.light, C.light, C.light, C.copper], { seg: near ? 12 : 8 });
      tridentFigure(b, 0, y0 + 57.2, tz, 3.4, C.bronze);
      // Säulenkranz vor dem oberen Ring, Bogenfenster dazwischen, unten die Nische, Fensterreihen am Schaft
      const nC = near ? 16 : 8;
      for (let k = 0; k < nC; k++) {
        const a = ((k + 0.5) / nC) * TAU;
        const r = 9.6;
        F.cyl(Math.sin(a) * r, y0 + 32, tz + Math.cos(a) * r, 0.42, 0.38, 9.5, C.light, { seg: near ? 6 : 4, top: false });
        const aw = a + Math.PI / nC;
        b.at(Math.sin(aw) * 9.02, 0, tz + Math.cos(aw) * 9.02, aw, () => flatArch(b, 0, y0 + 33.2, 1.8, 6.2, null, C.pane));
      }
      for (let k = 0; k < (near ? 12 : 6); k++) {
        const a = ((k + 0.5) / (near ? 12 : 6)) * TAU + Math.PI / 12;
        if (Math.abs(Math.sin(a / 2 - Math.PI / 2)) > 0.97) continue; // vorn die Nische
        b.at(Math.sin(a) * 9.45, 0, tz + Math.cos(a) * 9.45, a, () => {
          flatArch(b, 0, y0 + 12, 1.3, 3.4, C.light, C.pane, 0.22);
          if (near) flatArch(b, 0, y0 + 21, 1.2, 3.0, C.light, C.pane, 0.22);
        });
      }
      // Nische mit Bogen, aus der die Kaskade kommt
      b.at(0, 0, tz + 10.42, 0, () => {
        G.extrude(arch(0, 6.4, y0 + 0.2, 9.5, near ? 10 : 6), 0.0, 0.02, mix(C.stoneDark, 0x000000, 0.35), { caps: 'f', sides: false });
        F.extrude(arch(0, 7.8, y0 - 0.2, 10.4, near ? 10 : 6), 0.0, 0.45, C.light, { holes: [arch(0, 6.4, y0 + 0.2, 9.5, near ? 10 : 6)] });
        if (near) {
          W.poolRect(0, y0 + 0.2, 0.3, 5.6, 0.6, C.water, { rings: 0.1 });
          for (const x of [-1.6, 0, 1.6]) W.jet([x, y0 + 3.6, 0.2], [0, 0, 1.2], y0 + 0.2, 0.1, C.jet, { n: 6, seg: 5, r1: 0.16, ph: x });
        }
      });
    });
    return { w: 39, d: 41.7, h: 53.8 };
  });

  // ===========================================================================================================
  // Lübeck: Holstentor (1464–1478)
  // ===========================================================================================================
  // Feldseite, wie man es von der Holstenbrücke kennt: zwei dicke Rundtürme mit spitzen schwarzen Kegeldächern, dazwischen
  // der Mittelbau mit dem spitzbogigen Durchgang und hohem Dach; Backstein, dazwischen Bänder aus hellem Terrakotta und
  // dunkel glasierten Steinen, kleine Fenster in Reihen. Die Türme stehen ein wenig schief – das ist echt (sie sanken
  // schon beim Bau ein); hier nur angedeutet. Dahinter der Treppengiebel der Stadtseite.
  const HT = { brick: 0xa8503c, brickDark: 0x8a3f31, band: 0xdcc6a0, glaze: 0x3f3532, slate: 0x4c5158, slateLight: 0x5d636b, pane: 0x3c3f46, gate: 0x2e2826, gold: 0xe2b84e, lawn: 0x8fbf6a, path: 0xd6c8ae };

  /** Reihe kleiner Rechteckfenster mit hellem Rahmen rund um einen Rundturm (Mitte x, z; Radius r) in Höhe y. */
  function towerWindows(b, x, z, r, y, h, n, a0, a1, c) {
    for (let i = 0; i < n; i++) {
      const a = a0 + ((i + 0.5) / n) * (a1 - a0);
      b.at(x + Math.sin(a) * (r + 0.02), 0, z + Math.cos(a) * (r + 0.02), a, () => {
        b.G.rect(0, y, 0.02, 0.9, h, c.pane);
        if (!b.lod) b.G.rect(0, y - 0.2, 0.04, 1.3, 0.2, c.band);
      });
    }
  }

  landmark('holstentor', { places: ['Lübeck'], slot: 'square', title: 'Holstentor' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = HT;
    const seg = near ? 20 : 10;
    b.xf([0, 0, 0], [0, 0, 0], 0.85, () => {
      // Rasen davor, ein Weg auf den Durchgang zu
      F.box(0, 0, -6, 46, 0.1, 12, C.lawn);
      F.box(0, 0.1, -6, 5, 0.06, 12, C.path);
      const tz = -18; // Turmmitten
      const R = 7.2;
      const H = 21; // Mauerhöhe der Türme
      for (const sx of [-1, 1]) {
        const x = sx * 10.8;
        // leicht nach außen geneigt (angedeutet): der Turm als Kegelstumpf, oben etwas versetzt
        b.xf([x, 0, tz], [0, 0, sx * -0.012], 1, () => {
          F.lathe(0, 0, 0, [[R + 0.6, 0], [R + 0.4, 3.2], [R, 3.6], [R, H]], [C.brickDark, C.brickDark, C.brick], { seg, g: [0.84, 1.02] });
          // Bänder: hell (Terrakotta), dunkel glasiert
          for (const [y, col, hh] of [[3.6, C.band, 0.5], [7.6, C.glaze, 0.7], [8.3, C.band, 0.6], [12.6, C.glaze, 0.7], [13.3, C.band, 0.6], [17.6, C.glaze, 0.7], [18.3, C.band, 0.6], [H - 0.6, C.band, 0.6]]) {
            F.lathe(0, y, 0, [[R + 0.06, 0], [R + 0.06, hh]], col, { seg, top: false });
          }
          // Fensterreihen auf der Schauseite
          for (const [y, h] of [[5, 1.6], [9.6, 2.0], [14.6, 2.0], [19.1, 1.0]]) towerWindows(b, 0, 0, R + 0.06, y, h, near ? 7 : 4, -Math.PI * 0.72, Math.PI * 0.72, C);
          // Kegeldach mit Traufe, zwei kleinen Gauben und Knauf
          F.lathe(0, H, 0, [[R + 0.7, 0], [R + 0.5, 0.5], [0.25, 16.5]], C.slate, { seg, g: [0.88, 1.1] });
          if (near) {
            for (const a of [-0.6, 0.6]) {
              const gx = Math.sin(a) * (R - 1.2);
              const gz = Math.cos(a) * (R - 1.2);
              b.at(gx, 0, gz, a, () => {
                F.box(0, H + 2.2, 0, 1.4, 1.5, 1.4, C.slateLight);
                F.extrude([[-0.85, H + 3.7], [0.85, H + 3.7], [0, H + 4.6]], -0.7, 0.75, C.slate, { crease: 2 });
                G.rect(0, H + 2.5, 0.72, 0.7, 0.9, C.pane);
              });
            }
          }
          F.ball(0, H + 16.6, 0, 0.35, C.gold, { ws: 8, hs: 4 });
          F.cyl(0, H + 16.9, 0, 0.06, 0.06, 1.2, C.gold, { seg: 4 });
        });
      }
      // Mittelbau: Block zwischen den Türmen, vorn mit Durchgang, Bändern und Fenstern; hohes Satteldach mit Giebeln
      const WC = 14.4;
      F.box(0, 0, tz + 1, WC, H + 2.6, 16, C.brick, { g: [0.84, 1.02] });
      for (const [y, col, hh] of [[3.6, C.band, 0.5], [7.6, C.glaze, 0.7], [8.3, C.band, 0.6], [12.6, C.glaze, 0.7], [13.3, C.band, 0.6], [17.6, C.glaze, 0.7], [18.3, C.band, 0.6], [H + 2, C.band, 0.6]]) {
        F.box(0, y, tz + 1, WC + 0.1, hh, 16.1, col);
      }
      b.at(0, 0, tz + 9.02, 0, () => {
        // spitzbogiger Durchgang mit Laibung, darüber das goldene Schriftband (nur Striche, keine Inschrift)
        G.extrude(arch(0, 5.2, 0, 8.6, near ? 10 : 6, true), 0.01, 0.02, C.gate, { caps: 'f', sides: false });
        F.extrude(arch(0, 6.6, 0, 9.6, near ? 10 : 6, true), 0, 0.5, C.brickDark, { holes: [arch(0, 5.2, 0, 8.6, near ? 10 : 6, true)] });
        G.rect(0, 10.1, 0.04, 7.4, 0.9, C.glaze);
        if (near) for (let i = 0; i < 7; i++) G.rect(-2.7 + i * 0.9, 10.3, 0.06, 0.5, 0.5, C.gold);
        for (const [y, h] of [[14.4, 2.2], [19.2, 1.4]]) for (const x of [-4.2, -1.4, 1.4, 4.2]) {
          G.rect(x, y, 0.03, 1.0, h, C.pane);
          if (near) G.rect(x, y - 0.2, 0.05, 1.4, 0.2, C.band);
        }
      });
      const rY = H + 2.6;
      b.gable(0, rY, tz + 1, WC, 16, 11, C.slate, { axis: 'z', oe: 0.3, og: 0.2, ridge: near });
      // Giebel vorn: Backstein-Dreieck mit Blendnischen; hinten der Treppengiebel der Stadtseite
      F.extrude([[-WC / 2, rY], [WC / 2, rY], [0, rY + 11]], tz + 8.6, tz + 9.1, C.brick, { crease: 2 });
      if (near) for (const x of [-3, 0, 3]) b.at(0, 0, tz + 9.12, 0, () => G.extrude(arch(x, 1.3, rY + 1, 6 - Math.abs(x) * 1.1, 6, true), 0.0, 0.02, C.brickDark, { caps: 'f', sides: false }));
      const steps = [];
      const n = 5;
      for (let i = 0; i < n; i++) {
        const x0 = WC / 2 - (i * WC) / (2 * n);
        const yA = rY + (i * 11) / n;
        steps.push([x0, yA], [x0, yA + 11 / n + 0.8]);
      }
      const half = steps.map(([x, y]) => [x - WC / (2 * n), y]);
      const stepped = [[-WC / 2, rY], [WC / 2, rY], ...[[WC / 2, rY + 2.2], ...half.slice(1)], [0, rY + 12.6], ...half.slice(1).reverse().map(([x, y]) => [-x, y]), [-WC / 2, rY + 2.2]];
      F.extrude(stepped, tz - 7.6, tz - 6.9, C.brick, { crease: 2 });
    });
    return { w: 39, d: 22, h: 33.2 };
  });

  // ===========================================================================================================
  // Freiburg im Breisgau: Münster Unserer Lieben Frau
  // ===========================================================================================================
  // Der eine Westturm (116 m) aus rotem Sandstein: quadratischer Unterbau mit Portalhalle, darüber das Achteck mit
  // hohen Fenstern und der durchbrochene Maßwerkhelm, durch den man den Himmel sieht. Dahinter Langhaus und der höhere
  // Chor mit den beiden schlanken Hahnentürmen.
  const FR = { stone: 0xb46e5d, light: 0xc98a76, dark: 0x8c5247, slate: 0x5a5d66, pane: 0x3d4552, gate: 0x3b2e2b };

  /** Durchbrochener Helm: acht Grate mit Krabben, Ringe und schräge Streben je Seite, dazu ein dünner dunkler Kern. */
  function openSpire(b, x, z, r, y0, y1, col, core) {
    const { F } = b;
    const near = !b.lod;
    const corner = (k, t) => {
      const a = Math.PI / 8 + (k / 8) * TAU;
      const rr = r * (1 - t);
      return [x + Math.cos(a) * rr, y0 + (y1 - y0) * t, z + Math.sin(a) * rr];
    };
    if (!near) {
      // fern: geschlossene Pyramide, etwas dunkler, mit zwei hellen Ringen
      spire(F, ngon(8, r, Math.PI / 8, 0, 0, x, z), y0, y1, mix(col, core, 0.45), { ax: x, az: z, g: [0.9, 1.08] });
      return;
    }
    F.cyl(x, y0, z, r * 0.16, 0.05, (y1 - y0) * 0.96, core, { seg: 6 });
    for (let k = 0; k < 8; k++) {
      F.rod(corner(k, 0), corner(k, 1), 0.42, col, { seg: 4 });
      // Krabben an den Graten
      for (let i = 1; i < 9; i++) {
        const p = corner(k, i / 9.5);
        const a = Math.PI / 8 + (k / 8) * TAU;
        F.rod(p, [p[0] + Math.cos(a) * 0.9, p[1] + 0.5, p[2] + Math.sin(a) * 0.9], 0.22, col, { seg: 3 });
      }
    }
    const rings = [0, 0.14, 0.3, 0.46, 0.62, 0.78];
    for (let j = 0; j < rings.length; j++) {
      for (let k = 0; k < 8; k++) {
        F.rod(corner(k, rings[j]), corner((k + 1) % 8, rings[j]), 0.3, col, { seg: 3 });
        if (j + 1 < rings.length) {
          // Maßwerk: Kreuzstreben in jedem Feld
          F.rod(corner(k, rings[j]), corner((k + 1) % 8, rings[j + 1]), 0.18, col, { seg: 3 });
          F.rod(corner((k + 1) % 8, rings[j]), corner(k, rings[j + 1]), 0.18, col, { seg: 3 });
        }
      }
    }
    // Kreuzblume
    F.ball(x, y1 + 0.6, z, 0.8, col, { ws: 6, hs: 4 });
    F.rod([x, y1, z], [x, y1 + 2.6, z], 0.25, col, { seg: 4 });
  }

  landmark('freiburgerMuenster', { places: ['Freiburg im Breisgau'], slot: 'skyline', title: 'Münster' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = FR;
    b.xf([0, 0, 0], [0, 0, 0], 0.85, () => {
      const S = 13.5; // Unterbau des Turms
      const tz = -S / 2 - 1;
      // --- Unterbau mit Strebepfeilern, Portalhalle und Fenstern ------------------------------------------------
      F.box(0, 0, tz, S, 46, S, C.stone, { g: [0.84, 1.03] });
      for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        loft(F, [[chamfer(2.6, 2.6, 0, sx * (S / 2 - 0.6), tz + sz * (S / 2 - 0.6)), 0], [chamfer(1.8, 1.8, 0, sx * (S / 2 - 0.6), tz + sz * (S / 2 - 0.6)), 46]], C.light, { g: [0.84, 1.03] });
        if (near) spire(F, chamfer(1.9, 1.9, 0, sx * (S / 2 - 0.6), tz + sz * (S / 2 - 0.6)), 46, 51, C.light, { ax: sx * (S / 2 - 0.6), az: tz + sz * (S / 2 - 0.6) });
      }
      for (const y of [14, 30, 45.2]) F.box(0, y, tz, S + 0.6, 0.8, S + 0.6, C.light);
      b.at(0, 0, tz + S / 2, 0, () => b.sides(S, S, (len, face) => {
        if (face === 'f') {
          G.extrude(arch(0, 5.4, 0.3, 11, near ? 10 : 6, true), 0.02, 0.03, C.gate, { caps: 'f', sides: false });
          F.extrude(arch(0, 7.2, 0, 12.6, near ? 10 : 6, true), 0, 0.6, C.light, { holes: [arch(0, 5.4, 0.3, 11, near ? 10 : 6, true)] });
          if (near) F.extrude([[-4.4, 12.2], [4.4, 12.2], [0, 17.5]], 0, 0.5, C.light, { crease: 2 });
        }
        lancet(b, 0, 19, 3.2, 9.5, C.pane);
        lancet(b, 0, 33, 2.4, 10, C.pane);
      }, 'frl'));
      // --- Sterngalerie und Achteck mit hohen Fenstern ---------------------------------------------------------------
      const R8 = 6.4;
      prism(F, ngon(8, R8 + 1.4, Math.PI / 8, 0, 0, 0, tz), 46, 47.2, C.light);
      prism(F, ngon(8, R8, Math.PI / 8, 0, 0, 0, tz), 47.2, 72, C.stone, { g: [0.88, 1.04] });
      prism(F, ngon(8, R8 + 0.5, Math.PI / 8, 0, 0, 0, tz), 71.4, 72.4, C.light);
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * TAU;
        const r = R8 * Math.cos(Math.PI / 8) + 0.02;
        if (near) b.at(Math.sin(a) * r, 0, tz + Math.cos(a) * r, a, () => lancet(b, 0, 50, 2.6, 18, C.pane));
        // Fialen auf den Ecken des Achtecks
        const ca = Math.PI / 8 + (k / 8) * TAU;
        const px = Math.cos(ca) * (R8 + 0.3);
        const pz = tz + Math.sin(ca) * (R8 + 0.3);
        if (near) spire(F, chamfer(0.9, 0.9, 0, px, pz), 72.4, 77, C.light, { ax: px, az: pz });
      }
      if (!near) for (let k = 0; k < 8; k += 2) {
        const a = (k / 8) * TAU;
        const r = R8 * Math.cos(Math.PI / 8) + 0.02;
        b.at(Math.sin(a) * r, 0, tz + Math.cos(a) * r, a, () => lancet(b, 0, 50, 2.6, 18, C.pane));
      }
      openSpire(b, 0, tz, R8 + 0.2, 72.4, 116, C.light, C.dark);
      // --- Langhaus mit Seitenschiffen, Querhaus, Chor ------------------------------------------------------------
      const nz0 = tz - S / 2;
      const NL = 52;
      F.box(0, 0, nz0 - NL / 2, 15, 25, NL, C.stone, { g: [0.84, 1.02] });
      b.gable(0, 25, nz0 - NL / 2, 15, NL, 13, C.slate, { axis: 'z', oe: 0.4, og: 0, ridge: near });
      for (const sx of [-1, 1]) {
        F.box(sx * 11, 0, nz0 - NL / 2, 7, 13, NL, C.stone, { g: [0.84, 1.02] });
        const q = [[sx * 14.6, 13, nz0], [sx * 14.6, 13, nz0 - NL], [sx * 7.4, 19.5, nz0 - NL], [sx * 7.4, 19.5, nz0]];
        F.quad(...(sx > 0 ? q : [...q].reverse()), C.slate);
        b.at(sx * 14.5, 0, nz0 - NL / 2, (sx * Math.PI) / 2, () => {
          for (let i = -2; i <= 2; i++) {
            lancet(b, i * 9.5, 3, 3, 8, C.pane);
            F.box(i * 9.5 + 4.75, 0, 0.4, 1.2, 12, 0.8, C.light);
          }
        });
        b.at(sx * 7.5, 0, nz0 - NL / 2, (sx * Math.PI) / 2, () => {
          if (near) for (let i = -2; i <= 2; i++) lancet(b, i * 9.5, 15.5, 2.4, 7, C.pane);
        });
      }
      // Querhaus und Chor, höher, mit polygonalem Abschluss
      const cz = nz0 - NL;
      F.box(0, 0, cz - 6, 36, 25, 12, C.stone, { g: [0.84, 1.02] });
      b.gable(0, 25, cz - 6, 36, 12, 8, C.slate, { axis: 'x', oe: 0.4, og: 0.3, ridge: near });
      for (const sx of [-1, 1]) b.at(sx * 18, 0, cz - 6, (sx * Math.PI) / 2, () => {
        F.extrude([[-6, 25], [6, 25], [0, 33]], -0.3, 0, C.stone, { crease: 2 });
        lancet(b, 0, 6, 4.2, 14, C.pane);
      });
      for (const z of [nz0, nz0 - NL + 0.4]) b.at(0, 0, z, 0, () => F.extrude([[-7.5, 25], [7.5, 25], [0, 38]], -0.4, 0, C.stone, { crease: 2 }));
      const choir = [[-11, cz - 12], [11, cz - 12], [11, cz - 40], [7, cz - 47], [0, cz - 50], [-7, cz - 47], [-11, cz - 40]];
      prism(F, choir, 0, 29, C.stone, { g: [0.84, 1.02], top: false });
      // hohe Chorfenster auf jeder Seite des Vielecks (Wand schaut nach außen)
      for (let i = 1; i < choir.length; i++) {
        const [ax, az] = choir[i];
        const [qx, qz] = choir[(i + 1) % choir.length];
        const L = Math.hypot(qx - ax, qz - az);
        const ry = Math.atan2(qz - az, -(qx - ax)) + Math.PI;
        const n = Math.max(1, Math.round(L / 9));
        for (let k = 0; k < n; k++) {
          const t = (k + 0.5) / n;
          b.at(ax + (qx - ax) * t, 0, az + (qz - az) * t, ry, () => lancet(b, 0, 6, Math.min(3.4, L / n - 2), 17, C.pane));
        }
      }
      loft(F, [[choir, 29], [[[-1, cz - 12], [1, cz - 12], [1, cz - 40], [0.6, cz - 41], [0, cz - 41.5], [-0.6, cz - 41], [-1, cz - 40]], 45]], C.slate, { g: [0.88, 1.06] });
      // die beiden Hahnentürme am Übergang zum Chor
      for (const sx of [-1, 1]) {
        const hx = sx * 13.5;
        const hz = cz - 14;
        F.box(hx, 0, hz, 5.2, 40, 5.2, C.stone, { g: [0.86, 1.04] });
        prism(F, ngon(8, 2.9, Math.PI / 8, 0, 0, hx, hz), 40, 48, C.light);
        spire(F, ngon(8, 3.0, Math.PI / 8, 0, 0, hx, hz), 48, 62, C.stone, { ax: hx, az: hz, g: [0.9, 1.06] });
      }
    });
    return { w: 31.2, d: 99, h: 100.8 };
  });

  // ===========================================================================================================
  // Magdeburg: Dom St. Mauritius und Katharina über der Elbe
  // ===========================================================================================================
  // Die beiden Westtürme (rund 100 m) aus hellem Sandstein: quadratisch bis zur Höhe des Langhauses, darüber zwei
  // achteckige Glockengeschosse mit Spitzbogenfenstern und die steinernen Achteckhelme mit Kreuzblumen. Dazwischen die
  // Westfront mit Portal und großem Fenster, dahinter das lange Langhaus und der Chor mit Umgang.
  const MD = { stone: 0xc8bc9f, light: 0xdcd2bb, dark: 0x9f9478, slate: 0x5a5f66, pane: 0x3f4752, gate: 0x3b322c };

  landmark('magdeburgerDom', { places: ['Magdeburg'], slot: 'skyline', title: 'Dom' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = MD;
    b.xf([0, 0, 0], [0, 0, 0], 0.85, () => {
      const TW = 12; // Turmbreite
      const gap = 10; // Westfront zwischen den Türmen
      const tz = -TW / 2;
      for (const sx of [-1, 1]) {
        const x = sx * (gap / 2 + TW / 2);
        F.box(x, 0, tz, TW, 44, TW, C.stone, { g: [0.84, 1.03] });
        for (const y of [12, 26, 43.2]) F.box(x, y, tz, TW + 0.5, 0.8, TW + 0.5, C.light);
        b.at(x, 0, 0, 0, () => b.sides(TW, TW, () => {
          lancet(b, 0, 16, 2.2, 8, C.pane);
          lancet(b, 0, 30, 2.6, 11, C.pane);
        }, 'frkl'));
        // zwei Achteckgeschosse, Wimperge, Helm
        const R = 5.4;
        prism(F, ngon(8, R, Math.PI / 8, 0, 0, x, tz), 44, 58, C.stone, { g: [0.88, 1.03] });
        prism(F, ngon(8, R + 0.4, Math.PI / 8, 0, 0, x, tz), 57.4, 58.4, C.light);
        prism(F, ngon(8, R - 0.4, Math.PI / 8, 0, 0, x, tz), 58.4, 70, C.stone, { g: [0.88, 1.03] });
        prism(F, ngon(8, R, Math.PI / 8, 0, 0, x, tz), 69.4, 70.4, C.light);
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * TAU;
          for (const [r, y, h, w] of [[R, 46.5, 9, 2.2], [R - 0.4, 60, 8.5, 1.9]]) {
            if (!near && y > 50) continue;
            const rr = r * Math.cos(Math.PI / 8) + 0.02;
            b.at(x + Math.sin(a) * rr, 0, tz + Math.cos(a) * rr, a, () => {
              lancet(b, 0, y, w, h, C.pane);
              if (near) F.extrude([[-1.6, y + h - 0.5], [1.6, y + h - 0.5], [0, y + h + 3]], 0, 0.35, C.light, { crease: 2 });
            });
          }
        }
        // Ecktürmchen am Übergang zum Achteck
        if (near) for (const [ex, ez] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          const px = x + ex * (TW / 2 - 0.8);
          const pz = tz + ez * (TW / 2 - 0.8);
          prism(F, chamfer(1.4, 1.4, 0, px, pz), 44, 48, C.light);
          spire(F, chamfer(1.5, 1.5, 0, px, pz), 48, 52, C.light, { ax: px, az: pz });
        }
        // steinerner Helm mit Krabben (nah) und Kreuzblume
        spire(F, ngon(8, R - 0.2, Math.PI / 8, 0, 0, x, tz), 70.4, 99, C.dark, { ax: x, az: tz, g: [0.88, 1.08] });
        if (near) {
          for (let k = 0; k < 8; k++) {
            const a = Math.PI / 8 + (k / 8) * TAU;
            for (let i = 1; i < 6; i++) {
              const t = i / 6.5;
              const r = (R - 0.2) * (1 - t);
              const p = [x + Math.cos(a) * r, 70.4 + 28.6 * t, tz + Math.sin(a) * r];
              F.rod(p, [p[0] + Math.cos(a) * 0.7, p[1] + 0.5, p[2] + Math.sin(a) * 0.7], 0.2, C.dark, { seg: 3 });
            }
          }
        }
        F.ball(x, 99.5, tz, 0.6, C.dark, { ws: 6, hs: 4 });
        F.rod([x, 99, tz], [x, 101.4, tz], 0.18, C.dark, { seg: 4 });
      }
      // Westfront zwischen den Türmen
      F.box(0, 0, tz - 1, gap + 0.4, 34, TW - 2, C.stone, { g: [0.84, 1.03] });
      F.extrude([[-gap / 2 - 0.2, 34], [gap / 2 + 0.2, 34], [0, 44]], tz - 0.2, tz + TW / 2 - 1, C.stone, { crease: 2 });
      b.at(0, 0, tz + TW / 2 - 0.98, 0, () => {
        G.extrude(arch(0, 4.6, 0.2, 9.5, near ? 10 : 6, true), 0.01, 0.02, C.gate, { caps: 'f', sides: false });
        F.extrude(arch(0, 6.2, 0, 10.6, near ? 10 : 6, true), 0, 0.5, C.light, { holes: [arch(0, 4.6, 0.2, 9.5, near ? 10 : 6, true)] });
        lancet(b, 0, 13, 5.8, 16, C.pane);
        if (near) G.disc(0, 38.5, 0.04, 1.6, C.pane, { seg: 12 });
      });
      // Langhaus mit Seitenschiffen, Querhaus, Chor
      const nz0 = tz - TW / 2;
      const NL = 62;
      F.box(0, 0, nz0 - NL / 2, 14, 30, NL, C.stone, { g: [0.84, 1.02] });
      b.gable(0, 30, nz0 - NL / 2, 14, NL, 12, C.slate, { axis: 'z', oe: 0.4, og: 0, ridge: near });
      for (const sx of [-1, 1]) {
        F.box(sx * 11.5, 0, nz0 - NL / 2, 9, 19, NL, C.stone, { g: [0.84, 1.02] });
        const q = [[sx * 16.2, 19, nz0], [sx * 16.2, 19, nz0 - NL], [sx * 7, 24, nz0 - NL], [sx * 7, 24, nz0]];
        F.quad(...(sx > 0 ? q : [...q].reverse()), C.slate);
        b.at(sx * 16, 0, nz0 - NL / 2, (sx * Math.PI) / 2, () => {
          for (let i = -3; i <= 3; i++) {
            lancet(b, i * 8.6, 4, 3, 11, C.pane);
            F.box(i * 8.6 + 4.3, 0, 0.5, 1.3, 18, 1, C.light);
          }
        });
        if (near) b.at(sx * 7, 0, nz0 - NL / 2, (sx * Math.PI) / 2, () => {
          for (let i = -3; i <= 3; i++) lancet(b, i * 8.6, 21, 2.4, 7, C.pane);
        });
      }
      const cz = nz0 - NL;
      F.box(0, 0, cz - 7, 40, 30, 14, C.stone, { g: [0.84, 1.02] });
      b.gable(0, 30, cz - 7, 40, 14, 9, C.slate, { axis: 'x', oe: 0.4, og: 0.3, ridge: near });
      for (const sx of [-1, 1]) b.at(sx * 20, 0, cz - 7, (sx * Math.PI) / 2, () => {
        F.extrude([[-7, 30], [7, 30], [0, 39]], -0.3, 0, C.stone, { crease: 2 });
        lancet(b, 0, 6, 4.6, 18, C.pane);
      });
      const chFull = [[-14, cz - 14], [14, cz - 14], [14, cz - 26]];
      for (let i = 1; i < 6; i++) {
        const a = (i / 6) * Math.PI;
        chFull.push([14 * Math.cos(a), cz - 26 - 12 * Math.sin(a)]);
      }
      chFull.push([-14, cz - 26]);
      prism(F, chFull, 0, 28, C.stone, { g: [0.84, 1.02], top: false });
      loft(F, [[chFull, 28], [chFull.map(([x, z]) => [x * 0.08, cz - 14 + (z - (cz - 14)) * 0.55]), 40]], C.slate, { g: [0.88, 1.06] });
      for (let i = 2; i < chFull.length; i++) {
        const [ax, az] = chFull[i];
        const [qx, qz] = chFull[(i + 1) % chFull.length];
        if (Math.hypot(qx - ax, qz - az) < 3) continue;
        b.at((ax + qx) / 2, 0, (az + qz) / 2, Math.atan2(qz - az, -(qx - ax)) + Math.PI, () => lancet(b, 0, 6, 2.8, 15, C.pane));
      }
    });
    return { w: 34.6, d: 95.2, h: 86.2 };
  });

  // ===========================================================================================================
  // Hanau: Brüder-Grimm-Nationaldenkmal vor dem Neustädter Rathaus
  // ===========================================================================================================
  // Auf dem Marktplatz das Denkmal (1896): auf hohem Steinsockel die Brüder in Bronze, Wilhelm sitzend, Jacob neben
  // ihm stehend, gemeinsam ein Buch. Dahinter das barocke Neustädter Rathaus aus rotem Sandstein mit hellen Feldern,
  // Mittelrisalit mit Uhr im Giebel und Dachreiter mit geschweifter Haube. Hanau ist der Nachbar von Erlensee.
  const HU = { sand: 0xb8695a, sandLight: 0xcf8f7c, plaster: 0xefe3cc, roof: 0x575a63, pane: 0x4d5868, door: 0x4a3b33, gold: 0xe2b84e, deep: 0x3b3436, light: 0xe9dcc4, granite: 0x9a958c, graniteLight: 0xb3ada2, bronze: 0x47524a, bronzeLight: 0x5c6b5b, pave: 0xcfc4b0 };

  /** Zwei Gestalten in Bronze (Andeutung, keine Nachbildung): links sitzend mit Buch, rechts stehend, Fuß bei y. */
  function grimmBrothers(b, y, c) {
    const { F } = b;
    const seg = b.lod ? 5 : 9;
    // sitzend (links): Stuhl, Oberkörper, Beine, Kopf, Buch auf dem Knie
    b.at(-0.85, y, 0, 0.15, () => {
      F.box(0, 0, -0.25, 1.2, 1.1, 1.0, c.bronze);
      F.box(0, 1.1, -0.65, 1.2, 0.9, 0.22, c.bronze);
      F.lathe(0, 1.1, -0.25, [[0.48, 0], [0.5, 0.5], [0.4, 1.15], [0.22, 1.35], [0, 1.4]], c.bronzeLight, { seg });
      F.ball(0, 2.68, -0.22, 0.24, c.bronzeLight, { ws: seg, hs: 5 });
      for (const sx of [-0.2, 0.2]) {
        F.box(sx, 1.0, 0.3, 0.3, 0.26, 1.0, c.bronzeLight);
        F.box(sx, 0, 0.72, 0.28, 1.05, 0.3, c.bronzeLight);
      }
      F.box(0.15, 1.3, 0.55, 0.5, 0.08, 0.4, c.bronze, { k: 1.2 });
    });
    // stehend (rechts): langer Rock, Kopf, ein Arm zum Buch hin
    b.at(0.75, y, 0.1, -0.2, () => {
      F.lathe(0, 0, 0, [[0.5, 0], [0.48, 0.7], [0.4, 1.7], [0.42, 2.25], [0.3, 2.55], [0, 2.6]], c.bronzeLight, { seg });
      F.ball(0, 2.85, 0, 0.25, c.bronzeLight, { ws: seg, hs: 5 });
      F.rod([-0.35, 2.3, 0], [-0.75, 1.65, 0.35], 0.11, c.bronzeLight, { seg: 4 });
      F.rod([0.35, 2.3, 0], [0.42, 1.4, 0.05], 0.11, c.bronzeLight, { seg: 4 });
    });
  }

  landmark('grimmDenkmal', { places: ['Hanau'], slot: 'square', title: 'Brüder-Grimm-Denkmal' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = HU;
    b.xf([0, 0, 0], [0, 0, 0], 0.85, () => {
      // --- Rathaus ---------------------------------------------------------------------------------------------
      const rz = -16; // Front des Rathauses
      const RW = 44;
      const RD = 15;
      const eave = 15;
      F.box(0, 0, rz - RD / 2, RW, eave, RD, C.plaster, { g: [0.88, 1.02] });
      F.box(0, 0, rz - RD / 2 + 0.05, RW + 0.1, 5, RD + 0.1, C.sand, { g: [0.86, 1.02] });
      F.box(0, 5, rz - RD / 2 + 0.25, RW + 0.5, 0.5, RD + 0.5, C.sandLight);
      F.box(0, eave - 0.8, rz - RD / 2 + 0.3, RW + 0.8, 0.8, RD + 0.8, C.sandLight);
      // Mansarddach: steiler unterer Teil, flacher oberer
      loft(F, [[chamfer(RW + 0.6, RD + 0.6, 0, 0, rz - RD / 2), eave], [chamfer(RW - 2.6, RD - 3.6, 0, 0, rz - RD / 2), eave + 4.5]], C.roof, { top: false, g: [0.86, 1.04] });
      b.hip(0, eave + 4.5, rz - RD / 2, RW - 2.6, RD - 3.6, 2.2, C.roof, { oe: 0.1 });
      // Mittelrisalit mit Giebel und Uhr
      F.box(0, 0, rz - 0.2, 12, eave + 3, 0.8, C.sand, { g: [0.88, 1.02] });
      F.extrude([[-6.6, eave + 3], [6.6, eave + 3], [0, eave + 7]], rz - 0.4, rz + 0.25, C.sandLight, { crease: 2 });
      b.at(0, 0, rz + 0.22, 0, () => {
        goldDial(b, 0, eave + 4.4, 1.1, C.gold, C.deep);
        // Fenster: unten Arkaden, oben zwei Reihen mit Rahmen; Lisenen aus rotem Sandstein
        for (let i = -7; i <= 7; i++) {
          const x = i * 2.85;
          if (Math.abs(x) < 6.2) {
            flatArch(b, x, 0.4, 2.0, 3.8, C.sandLight, C.door, 0.25);
          } else {
            flatArch(b, x, 1.2, 1.4, 2.6, C.sandLight, C.pane, 0.2);
          }
          stoneWin(b, x, 6.4, 1.4, 2.8, C.sandLight, C.pane, { cross: true, fw: 0.22 });
          stoneWin(b, x, 10.6, 1.4, 2.6, C.sandLight, C.pane, { cross: true, fw: 0.22 });
        }
        for (const x of [-RW / 2 + 0.4, -6, 6, RW / 2 - 0.4]) F.box(x, 5.5, 0.1, 0.8, eave - 6.2, 0.3, C.sand);
      });
      if (near) for (let i = -2; i <= 2; i++) b.at(i * 7.5, 0, rz - 1.4, 0, () => {
        F.box(0, eave + 1.2, 0.1, 1.6, 1.8, 1.4, C.roof);
        G.rect(0, eave + 1.5, 0.82, 0.9, 1.1, C.pane);
      });
      // Dachreiter über der Mitte
      F.box(0, eave + 6.5, rz - RD / 2, 3.6, 3.2, 3.6, C.light);
      if (near) b.at(0, 0, rz - RD / 2 + 1.82, 0, () => flatArch(b, 0, eave + 7.1, 1.3, 2.0, null, C.deep));
      baroqueHelm(b, 0, eave + 9.7, rz - RD / 2, 0.42, C);
      // --- Platz und Denkmal davor -----------------------------------------------------------------------------
      F.box(0, 0, -8, RW, 0.08, 16, C.pave);
      const mz = -6.5;
      F.box(0, 0.08, mz, 7, 0.45, 7, C.granite);
      F.box(0, 0.53, mz, 6.2, 0.45, 6.2, C.granite);
      F.box(0, 0.98, mz, 4.2, 3.6, 3.4, C.granite, { g: [0.88, 1.04] });
      F.box(0, 4.58, mz, 4.8, 0.5, 4.0, C.graniteLight);
      if (near) b.at(0, 0, mz + 1.71, 0, () => {
        G.rect(0, 2.2, 0.02, 2.6, 0.9, C.bronze);
        for (const x of [-1.6, 1.6]) G.disc(x, 3.6, 0.02, 0.32, C.bronze, { seg: 10 });
      });
      b.xf([0, 5.08, mz], [0, 0, 0], 1.35, () => grimmBrothers(b, 0, C));
      // Laternen auf dem Platz, Bäume flankieren
      if (near) for (const sx of [-1, 1]) {
        F.cyl(sx * 6.5, 0, mz + 2.5, 0.08, 0.06, 3.6, 0x3f4448, { seg: 5 });
        F.ball(sx * 6.5, 3.8, mz + 2.5, 0.3, 0xfff2d0, { ws: 6, hs: 4 });
      }
    });
    return { w: 38, d: 26.6, h: 29 };
  });

  // ===========================================================================================================
  // Alsfeld: Rathaus am Marktplatz (1512–1516)
  // ===========================================================================================================
  // Eins der bekanntesten Fachwerkhäuser Hessens: unten die offene Halle aus Stein mit Spitzbögen, darüber zwei
  // vorkragende Fachwerkgeschosse, ein sehr steiles Dach und an den beiden vorderen Ecken je ein Erkertürmchen mit
  // spitzem Schieferhelm. Rechts daneben das steinerne Weinhaus mit Treppengiebel.
  const AL = { stone: 0xb9ab95, stoneDark: 0x8d806c, plaster: 0xf4ecdb, beam: 0x5b3a2c, slate: 0x4f535b, pane: 0x4f5a68, deep: 0x2f2a28, gold: 0xe2b84e, wein: 0xd8cbb2 };

  /** Fachwerkwand in der Ebene z = 0 (schaut nach +z): Breite w ab x0, Fuß y, Höhe h; Pfosten, Riegel, Streben, Fenster. */
  function timberWall(b, x0, w, y, h, c, o = {}) {
    const { F, G } = b;
    const t = 0.24;
    const near = !b.lod;
    G.rect(x0 + w / 2, y, 0.01, w, h, c.plaster);
    const n = Math.max(2, Math.round(w / 1.25));
    const step = w / n;
    G.rect(x0 + w / 2, y, 0.03, w, t, c.beam);
    G.rect(x0 + w / 2, y + h - t, 0.03, w, t, c.beam);
    if (near) G.rect(x0 + w / 2, y + h * 0.36, 0.03, w, t * 0.8, c.beam);
    for (let i = 0; i <= n; i++) G.rect(x0 + i * step, y, 0.035, t, h, c.beam);
    const wins = o.wins ?? [];
    for (let i = 0; i < n; i++) {
      const xm = x0 + (i + 0.5) * step;
      if (wins.includes(i)) {
        G.rect(xm, y + h * 0.4, 0.04, step * 0.62, h * 0.42, c.pane);
        continue;
      }
      if (!near) continue;
      // Mann-Figur: zwei Streben je Feld, abwechselnd
      const a = [x0 + i * step + t / 2, y + t];
      const bq = [x0 + (i + 1) * step - t / 2, y + h - t];
      if (i % 2) F.rod([a[0], a[1], 0.05], [bq[0], bq[1], 0.05], 0.1, c.beam, { seg: 3 });
      else F.rod([bq[0], a[1], 0.05], [a[0], bq[1], 0.05], 0.1, c.beam, { seg: 3 });
    }
  }

  landmark('alsfelderRathaus', { places: ['Alsfeld'], slot: 'square', title: 'Rathaus' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = AL;
    b.xf([0, 0, 0], [0, 0, 0], 0.9, () => {
      const RW = 17;
      const RD = 11;
      const z0 = -1; // Front der Halle
      const x0 = -5; // Rathaus links der Mitte, rechts das Weinhaus
      b.at(x0, 0, 0, 0, () => {
        // Halle: Steinsockel mit Spitzbögen vorn und an der Seite
        F.box(0, 0, z0 - RD / 2, RW, 4.2, RD, C.stone, { g: [0.86, 1.02] });
        b.at(0, 0, z0 + 0.01, 0, () => {
          for (const x of [-5.6, 0, 5.6]) {
            G.extrude(arch(x, 3.6, 0, 3.6, near ? 8 : 5, true), 0.0, 0.02, C.deep, { caps: 'f', sides: false });
            if (near) G.extrude(arch(x, 4.2, -0.1, 3.95, 8, true), 0.02, 0.03, C.stoneDark, { caps: 'f', holes: [arch(x, 3.6, 0, 3.6, 8, true)], sides: false });
          }
        });
        // zwei Fachwerkgeschosse, jedes kragt 0,4 m vor
        const floors = [[4.2, 3.2, 0.45], [7.4, 3.1, 0.85]];
        for (const [y, h, k] of floors) {
          F.box(0, y, z0 - RD / 2 + k / 2, RW + k * 2, h, RD + k, C.plaster, { g: [0.95, 1.02] });
          F.box(0, y - 0.25, z0 - RD / 2 + k / 2, RW + k * 2 + 0.1, 0.3, RD + k + 0.1, C.beam);
          b.at(0, 0, z0 + k + 0.01, 0, () => timberWall(b, -RW / 2 - k, RW + 2 * k, y, h, C, { wins: [2, 3, 5, 6, 8, 9, 10] }));
          for (const sx of [-1, 1]) b.at(sx * (RW / 2 + k + 0.01), 0, z0 - RD / 2 + k / 2, (sx * Math.PI) / 2, () => timberWall(b, -(RD + k) / 2, RD + k, y, h, C, { wins: [2, 5] }));
        }
        const top = 10.5;
        const k = 0.85;
        // sehr steiles Satteldach, Giebel zur Seite; zwei Gauben
        b.gable(0, top, z0 - RD / 2 + k / 2, RW + 2 * k, RD + k, 11, C.slate, { axis: 'x', oe: 0.4, og: 0.4, ridge: near });
        for (const sx of [-1, 1]) b.at(sx * (RW / 2 + k), 0, z0 - RD / 2 + k / 2, (sx * Math.PI) / 2, () => {
          F.extrude([[-(RD + k) / 2, top], [(RD + k) / 2, top], [0, top + 11]], -0.2, 0, C.plaster, { crease: 2 });
          if (near) {
            G.rect(0, top + 1.2, 0.03, 0.24, 8.5, C.beam);
            for (const yy of [top + 0.1, top + 3.6, top + 7]) {
              const half = ((RD + k) / 2) * (1 - (yy - top) / 11);
              G.rect(0, yy, 0.03, 2 * half - 0.2, 0.22, C.beam);
            }
            G.rect(-1.6, top + 1.2, 0.04, 1.0, 1.4, C.pane);
            G.rect(1.6, top + 1.2, 0.04, 1.0, 1.4, C.pane);
          }
        });
        if (near) for (const x of [-3.5, 3.5]) b.at(x, 0, z0 + k - 2.8, 0, () => {
          F.box(0, top + 2.4, 0.4, 2.0, 1.6, 1.6, C.plaster);
          b.gable(0, top + 4.0, 0.4, 2.2, 1.8, 1.2, C.slate, { axis: 'z', oe: 0.1, og: 0.1, ridge: false, soffit: C.slate });
          F.extrude([[-1.0, top + 4.0], [1.0, top + 4.0], [0, top + 5.1]], 1.0, 1.2, C.plaster, { crease: 2 });
          G.rect(0, top + 2.7, 1.22, 1.0, 1.0, C.pane);
        });
        // die beiden Erkertürmchen an den vorderen Ecken
        for (const sx of [-1, 1]) {
          const ex = sx * (RW / 2 + k - 0.6);
          const ez = z0 + k - 0.6;
          const R = 1.55;
          prism(F, ngon(8, R, Math.PI / 8, 0, 0, ex, ez), 4.6, top + 0.6, C.plaster, { g: [0.95, 1.02] });
          prism(F, ngon(8, R + 0.12, Math.PI / 8, 0, 0, ex, ez), 4.2, 4.6, C.beam);
          prism(F, ngon(8, R + 0.12, Math.PI / 8, 0, 0, ex, ez), 7.3, 7.6, C.beam);
          for (let q = 0; q < 8; q++) {
            const a = ((q + 0.5) / 8) * TAU;
            const r = R * Math.cos(Math.PI / 8) + 0.02;
            b.at(ex + Math.sin(a) * r, 0, ez + Math.cos(a) * r, a, () => {
              if (Math.cos(a) > -0.3) G.rect(0, 5.4, 0.02, 0.6, 1.3, C.pane);
              if (near) G.rect(0, 4.6, 0.03, 0.18, top - 4, C.beam);
            });
          }
          spire(F, ngon(8, R + 0.25, Math.PI / 8, 0, 0, ex, ez), top + 0.6, top + 9.5, C.slate, { ax: ex, az: ez, g: [0.9, 1.08] });
          F.ball(ex, top + 9.7, ez, 0.2, C.gold, { ws: 6, hs: 3 });
        }
      });
      // --- Weinhaus (Stein, Treppengiebel zur Straße) ------------------------------------------------------------
      const wx = x0 + RW / 2 + 1 + 5.5;
      F.box(wx, 0, z0 - 6, 11, 10, 12, C.wein, { g: [0.86, 1.02] });
      const steps = [[-5.5, 10], [5.5, 10], [5.5, 11.6], [4.2, 11.6], [4.2, 13.2], [2.8, 13.2], [2.8, 14.8], [1.4, 14.8], [1.4, 16.4], [-1.4, 16.4], [-1.4, 14.8], [-2.8, 14.8], [-2.8, 13.2], [-4.2, 13.2], [-4.2, 11.6], [-5.5, 11.6]];
      F.extrude(steps.map(([x, y]) => [wx + x, y]), z0 - 0.5, z0, C.wein, { crease: 2 });
      b.gable(wx, 10, z0 - 6.5, 10.6, 11, 6.4, C.slate, { axis: 'z', oe: 0.2, og: 0, ridge: near });
      b.at(wx, 0, z0 + 0.01, 0, () => {
        G.extrude(arch(0, 2.2, 0, 3.4, near ? 8 : 5, true), 0.0, 0.02, C.deep, { caps: 'f', sides: false });
        for (const [x, y] of [[-3, 4.6], [0, 4.6], [3, 4.6], [-3, 7.6], [0, 7.6], [3, 7.6], [0, 11.8]]) stoneWin(b, x, y, 1.1, 1.8, C.stoneDark, C.pane, { fw: 0.18, cross: true });
      });
    });
    return { w: 27.8, d: 11.7, h: 19.5 };
  });

  // ===========================================================================================================
  // Bad Hersfeld: Stiftsruine
  // ===========================================================================================================
  // Die größte romanische Kirchenruine der Welt: Mauern aus rotem Sandstein ohne Dach, das Langhaus mit leeren
  // Rundbogenarkaden, Querhaus und hoher Ostchor, im Westen der massige Westbau. Daneben der freistehende
  // Katharinenturm mit Schieferhelm (dort hängt die Lullusglocke). Im Sommer spannt sich für die Festspiele ein weißes
  // Membrandach über das Langhaus.
  const HF = { stone: 0xb06b58, stoneLight: 0xc78a74, stoneDark: 0x8a4f40, slate: 0x4f535b, lawn: 0x8fbf6a, path: 0xd8c9ae, membrane: 0xf3f2ee, mast: 0x9aa0a6 };

  /**
   * Mauerscheibe in der Ebene z (Dicke t nach −z), x0 … x1, y0 … y1, mit durchgehenden Rundbogenöffnungen
   * (openings = [[x, y, w, h], …], man sieht hindurch). b.F, Farbe col.
   */
  function ruinWall(b, x0, x1, y0, y1, z, t, openings, col) {
    const n = b.lod ? 5 : 8;
    const holes = openings.map(([x, y, w, h]) => arch(x, w, y, h, n));
    b.F.extrude([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z - t, z, col, { holes, g: [0.84, 1.03] });
  }

  landmark('stiftsruine', { places: ['Bad Hersfeld'], slot: 'skyline', title: 'Stiftsruine' }, (b) => {
    const { F } = b;
    const near = !b.lod;
    const C = HF;
    b.xf([0, 0, 0], [0, 0, 0], 0.85, () => {
      F.box(0, 0, -50, 70, 0.08, 104, C.lawn);
      const NW = 26; // Breite des Langhauses (außen)
      const z0 = -14; // Ostkante des Westbaus
      const NL = 48;
      // --- Westbau: massiger Block mit großer Öffnung, oben zwei Geschosse Rundbogenfenster ---------------------
      ruinWall(b, -NW / 2, NW / 2, 0, 34, -2, 3, [[0, 0, 7, 12], [-6, 17, 2.6, 5], [6, 17, 2.6, 5], [0, 17, 2.6, 5], [-6, 26, 2.4, 4.5], [0, 26, 2.4, 4.5], [6, 26, 2.4, 4.5]], C.stone);
      for (const sx of [-1, 1]) {
        b.at(sx * (NW / 2 - 1.5), 0, -8, (sx * Math.PI) / 2, () => ruinWall(b, -6, 6, 0, 34, 0, 3, [[0, 18, 2.6, 5]], C.stone));
      }
      ruinWall(b, -NW / 2, NW / 2, 12, 34, z0 + 3, 3, [[0, 14, 8, 12], [-7, 27, 2.4, 4.5], [7, 27, 2.4, 4.5]], C.stone);
      F.box(0, 34, -8, NW + 0.6, 0.6, 12.6, C.stoneLight, { skip: 'b' });
      // --- Langhaus: Hochschiffwände auf Arkaden, niedrige Seitenschiffmauern --------------------------------------
      const arc = [];
      for (let i = 0; i < 8; i++) arc.push([-NL / 2 + 3 + i * 6, 0.6, 4.2, 9.5]);
      const clere = [];
      for (let i = 0; i < 8; i++) clere.push([-NL / 2 + 3 + i * 6, 13.5, 2.0, 4.4]);
      for (const sx of [-1, 1]) {
        b.at(sx * 7, 0, z0 - NL / 2, (sx * Math.PI) / 2, () => ruinWall(b, -NL / 2, NL / 2, 0, 19.5, 0.6, 1.2, [...arc, ...clere], C.stone));
        const side = [];
        for (let i = 0; i < 8; i++) side.push([-NL / 2 + 3 + i * 6, 3.2, 1.8, 4]);
        b.at(sx * NW / 2, 0, z0 - NL / 2, (sx * Math.PI) / 2, () => ruinWall(b, -NL / 2, NL / 2, 0, 9, 0, 1.2, side, C.stone));
        if (near) for (let i = 0; i <= 8; i++) F.box(sx * (NW / 2 + 0.5), 0, z0 - i * 6, 1.2, 7, 1.4, C.stoneDark);
      }
      // --- Querhaus und Ostchor: hohe Mauern, große Fenster, Apsis --------------------------------------------------
      const qz = z0 - NL;
      const QW = 54;
      for (const z of [qz, qz - 14]) ruinWall(b, -QW / 2, QW / 2, 0, 22, z, 1.4, [[-19, 7, 3.2, 8], [19, 7, 3.2, 8], ...(z === qz ? [[0, 0, 12, 18]] : [[0, 0, 11, 18], [-11, 8, 3, 7], [11, 8, 3, 7]])], C.stone);
      for (const sx of [-1, 1]) b.at(sx * QW / 2, 0, qz - 7, (sx * Math.PI) / 2, () => {
        ruinWall(b, -7, 7, 0, 22, 1.4, 1.4, [[0, 6, 3.6, 9]], C.stone);
        F.extrude([[-7, 22], [7, 22], [0, 29]], 0, 1.4, C.stone, { holes: [arch(0, 2, 23, 3.2, 6)] });
      });
      // Ostchor mit halbrunder Apsis (oben offen)
      const cz = qz - 14;
      for (const sx of [-1, 1]) b.at(sx * 8, 0, cz - 8, (sx * Math.PI) / 2, () => ruinWall(b, -8, 8, 0, 21, 0.7, 1.4, [[-3.5, 7, 2.6, 7], [3.5, 7, 2.6, 7]], C.stone));
      const seg = near ? 10 : 6;
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * Math.PI;
        const a1 = ((i + 1) / seg) * Math.PI;
        const r = 8;
        const p0 = [Math.cos(a0) * r, cz - 16 - Math.sin(a0) * r * 0.9];
        const p1 = [Math.cos(a1) * r, cz - 16 - Math.sin(a1) * r * 0.9];
        const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
        b.at((p0[0] + p1[0]) / 2, 0, (p0[1] + p1[1]) / 2, Math.atan2(p1[1] - p0[1], -(p1[0] - p0[0])) + Math.PI, () => {
          ruinWall(b, -L / 2 - 0.05, L / 2 + 0.05, 0, 19, 0.7, 1.4, i % 3 === 1 && near ? [[0, 8, Math.min(2.4, L - 1), 6]] : [], C.stone);
        });
      }
      // Mauerkronen leicht unregelmäßig (Ruine): ein paar Brocken obenauf
      if (near) for (const [x, y, z, w] of [[7, 19.5, z0 - 10, 1.6], [-7, 19.5, z0 - 30, 2.2], [20, 22, qz, 2], [-12, 22, qz - 14, 1.8], [0, 34, -2.5, 3]]) F.box(x, y, z, w, 0.9, 1.3, C.stoneLight);
      // --- Festspiel-Membrandach über dem Langhaus ----------------------------------------------------------------
      const mY = 21;
      const pts = [[-7.5, z0 - 2], [7.5, z0 - 2], [7.5, z0 - NL + 2], [-7.5, z0 - NL + 2]];
      F.quad([pts[0][0], mY + 1.8, pts[0][1]], [0, mY + 4.2, pts[0][1] - 6], [0, mY + 2.2, z0 - NL / 2], [pts[0][0], mY, z0 - NL / 2], C.membrane, { k: 1.05 });
      for (const [sx, zA, zB] of [[-1, z0 - 2, z0 - NL / 2], [1, z0 - 2, z0 - NL / 2], [-1, z0 - NL / 2, z0 - NL + 2], [1, z0 - NL / 2, z0 - NL + 2]]) {
        const A = [sx * 7.5, mY + (zA === z0 - 2 ? 1.8 : 0), zA];
        const B = [0, mY + (zA === z0 - 2 ? 4.2 : 2.2), zA === z0 - 2 ? zA - 6 : zA];
        const Cq = [0, mY + (zB === z0 - NL + 2 ? 4.2 : 2.2), zB === z0 - NL + 2 ? zB + 6 : zB];
        const D = [sx * 7.5, mY + (zB === z0 - NL + 2 ? 1.8 : 0), zB];
        F.quad(...(sx > 0 ? [A, D, Cq, B] : [A, B, Cq, D]), C.membrane, { k: 1.05 });
        F.quad(...(sx > 0 ? [A, B, Cq, D] : [A, D, Cq, B]), mix(C.membrane, 0x9aa0a6, 0.25));
      }
      for (const z of [z0 - 8, z0 - NL + 8]) F.cyl(0, 19.5, z, 0.18, 0.15, mY + 4.6 - 19.5, C.mast, { seg: 5 });
      void pts;
      // --- Katharinenturm daneben -------------------------------------------------------------------------------
      const kx = 24;
      const kz = qz + 12;
      F.box(kx, 0, kz, 8, 24, 8, C.stone, { g: [0.86, 1.03] });
      F.box(kx, 23.6, kz, 8.5, 0.6, 8.5, C.stoneLight);
      b.at(kx, 0, kz, 0, () => b.at(0, 0, 4, 0, () => b.sides(8, 8, () => {
        b.G.extrude(arch(-1.4, 1.2, 18, 3, 6), 0.01, 0.02, 0x2f2a28, { caps: 'f', sides: false });
        b.G.extrude(arch(1.4, 1.2, 18, 3, 6), 0.01, 0.02, 0x2f2a28, { caps: 'f', sides: false });
      })));
      spire(F, chamfer(8.6, 8.6, 0, kx, kz), 24.2, 38, C.slate, { ax: kx, az: kz, g: [0.88, 1.08] });
      F.ball(kx, 38.2, kz, 0.3, 0xe2b84e, { ws: 6, hs: 3 });
    });
    return { w: 59.6, d: 86.7, h: 32.7 };
  });

  // ===========================================================================================================
  // Gräfenhainichen: Ferropolis, die „Stadt aus Eisen“
  // ===========================================================================================================
  // Auf der Halbinsel im Gremminer See stehen fünf ausgediente Großgeräte aus dem Braunkohletagebau im Halbrund um die
  // Festivalarena: ein Schaufelradbagger, ein Eimerkettenbagger, zwei Absetzer mit langen Auslegern und ein kleinerer
  // Bagger. Rostrot, grau und verblichenes Orange; davor der See.
  const FP = { rust: 0x9a5a3e, rustDark: 0x6f4232, grey: 0x8d9296, greyDark: 0x5e6367, orange: 0xc98a4a, house: 0xb7b2a6, track: 0x46484b, lawn: 0x8fae64, sand: 0xc9b38c, water: 0x6fb2d2, stage: 0x2f3134, light: 0xd8d9da };

  /** Gitterträger von p0 nach p1: zwei Gurte im Abstand w (quer, waagrecht), Zickzack-Streben; r Stabdicke. */
  function lattice(b, p0, p1, w, col, r = 0.22, n = 0) {
    const { F } = b;
    const dx = p1[0] - p0[0];
    const dz = p1[2] - p0[2];
    const L = Math.hypot(dx, dz) || 1;
    const nx = (-dz / L) * (w / 2);
    const nz = (dx / L) * (w / 2);
    const A = (p, s) => [p[0] + s * nx, p[1], p[2] + s * nz];
    const k = n || Math.max(2, Math.round(Math.hypot(dx, p1[1] - p0[1], dz) / (w * 1.2)));
    for (const s of [-1, 1]) F.rod(A(p0, s), A(p1, s), r, col, { seg: 4 });
    // Bandbrücke oben: eine Platte zwischen den Gurten (von oben und unten sichtbar) gibt dem Träger Masse
    const d0 = A(p0, -0.8);
    const d1 = A(p1, -0.8);
    const e0 = A(p0, 0.8);
    const e1 = A(p1, 0.8);
    F.quad(d0, e0, e1, d1, mix(col, 0x3a3c3f, 0.35));
    F.quad(d0, d1, e1, e0, mix(col, 0x3a3c3f, 0.5));
    // Untergurt in der Mitte, etwas tiefer: der Träger bekommt Höhe
    const drop = w * 0.7;
    const q0 = [p0[0], p0[1] - drop, p0[2]];
    const q1 = [p1[0], p1[1] - drop, p1[2]];
    F.rod(q0, q1, r, col, { seg: 4 });
    if (b.lod) return;
    for (let i = 0; i < k; i++) {
      const t0 = i / k;
      const t1 = (i + 1) / k;
      const P = (t, d = 0) => [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t - d, p0[2] + (p1[2] - p0[2]) * t];
      for (const s of [-1, 1]) {
        F.rod(A(P(t0), s), P(t1, drop), r * 0.6, col, { seg: 3 });
        F.rod(P(t1, drop), A(P(t1), s), r * 0.6, col, { seg: 3 });
      }
      F.rod(A(P(t1), -1), A(P(t1), 1), r * 0.5, col, { seg: 3 });
    }
  }

  /** Raupenfahrwerk: zwei Raupen (Länge l, Breite w) um (x, z), Drehung ry. */
  function crawler(b, x, z, ry, l, w, c) {
    b.at(x, 0, z, ry, () => {
      for (const s of [-1, 1]) b.F.rbox(s * (w / 2 - 1.2), 0, 0, 2.4, 2.4, l, 1.1, c.track, { seg: 3 });
      b.F.box(0, 1.4, 0, w - 2, 1.6, l * 0.6, c.greyDark);
    });
  }

  /** Schaufelrad (Radius R, Achse quer zur Blickrichtung um (x, y, z), Drehung ry): Kranz, Speichen, Eimer. */
  function bucketWheel(b, x, y, z, ry, R, c) {
    const { F } = b;
    const n = b.lod ? 8 : 14;
    b.at(x, 0, z, ry, () => {
      b.xf([0, y, 0], [0, 0, Math.PI / 2], 1, () => {
        F.torus(0, 0, 0, R, 0.35, c.orange, { seg: b.lod ? 12 : 24, tube: 4 });
        if (!b.lod) F.torus(0, 0.9, 0, R * 0.92, 0.25, c.orange, { seg: 24, tube: 4 });
      });
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU;
        const py = y + Math.cos(a) * R;
        const pz = Math.sin(a) * R;
        F.rod([0.45, y, 0], [0.45, py, pz], 0.16, c.orange, { seg: 3 });
        b.xf([-0.2, py + Math.cos(a) * 0.6, pz + Math.sin(a) * 0.6], [-a, 0, 0], 1, () => F.box(0, -0.5, 0, 1.6, 1.1, 1.3, c.rustDark));
      }
      F.cyl(0, y - 0.6, 0, 0.6, 0.6, 1.2, c.greyDark, { seg: 6 });
    });
  }

  landmark('ferropolis', { places: ['Gräfenhainichen'], slot: 'skyline', far: true, title: 'Stadt aus Eisen' }, (b) => {
    const { F, G, W } = b;
    const near = !b.lod;
    const C = FP;
    b.xf([0, 0, 0], [0, 0, 0], 1.0, () => {
      // See vorn, Halbinsel, Arena mit Bühne
      W.poolRect(0, 0.05, -14, 200, 28, C.water, { rings: 0.08 });
      F.box(0, 0, -29, 202, 0.6, 2, C.sand);
      F.box(0, 0, -80, 190, 0.5, 100, C.lawn);
      F.box(0, 0.5, -78, 70, 0.1, 50, C.sand);
      F.box(0, 0.5, -98, 22, 2.2, 12, C.stage);
      F.box(0, 2.7, -103.5, 22, 9, 1, C.stage);
      for (const sx of [-1, 1]) F.box(sx * 10.5, 2.7, -98, 0.6, 9, 0.6, C.greyDark);
      F.box(0, 11.7, -98, 23, 0.8, 12.5, C.greyDark);
      if (near) for (const [x, z] of [[-34, -60], [34, -60], [-30, -94], [30, -94]]) {
        F.cyl(x, 0.5, z, 0.25, 0.2, 18, C.grey, { seg: 5 });
        F.box(x, 18.5, z, 3, 1.4, 0.6, C.light);
      }
      // --- Schaufelradbagger (links) -------------------------------------------------------------------------
      b.xf([-50, 0, -62], [0, 0, 0], 1.35, () => {
        const x = 0;
        const z = 0;
        crawler(b, x, z, 0, 14, 11, C);
        F.cyl(x, 3, z, 5, 5, 1.2, C.greyDark, { seg: near ? 12 : 8 });
        F.box(x + 2, 4.2, z, 12, 7, 9, C.house, { g: [0.86, 1.02] });
        F.box(x + 2, 11.2, z, 12.4, 0.5, 9.4, C.rust);
        if (near) b.at(x + 2, 0, z + 4.5, 0, () => { for (const wx of [-4, -1.4, 1.2, 3.8]) G.rect(wx, 7.4, 0.03, 1.6, 1.4, 0x40474f); });
        // Mast (A-Bock) und Ausleger nach vorn rechts, Gegenausleger nach hinten
        const top = [x, 30, z];
        for (const dz of [-3.5, 3.5]) F.rod([x - 3, 11.7, z + dz], top, 0.4, C.rust, { seg: 5 });
        F.rod([x + 5, 11.7, z], top, 0.4, C.rust, { seg: 5 });
        const tip = [x + 34, 14, z + 16];
        lattice(b, [x + 4, 10.5, z + 1], tip, 3.2, C.rust, 0.28);
        F.rod(top, [tip[0] - 2, tip[1] + 1.5, tip[2] - 1], 0.14, C.greyDark, { seg: 3 });
        lattice(b, [x - 2, 11, z - 1], [x - 22, 18, z - 8], 2.6, C.rust, 0.24);
        F.box(x - 22, 13, z - 8, 6, 5, 5, C.greyDark);
        F.rod(top, [x - 21, 18.5, z - 8], 0.14, C.greyDark, { seg: 3 });
        bucketWheel(b, tip[0] + 2, tip[1], tip[2] + 0.6, Math.atan2(tip[0] - x, tip[2] - z) + Math.PI / 2, 6.2, C);
      });
      // --- Absetzer (rechts und hinten): Portal auf zwei Raupen, sehr langer Ausleger mit Band -----------------------
      for (const [x0, z0, dir, len] of [[52, -66, -1, 62], [20, -112, 1, 70]]) b.xf([x0, 0, z0], [0, 0, 0], 1.3, () => {
        const x = 0;
        const z = 0;
        crawler(b, x - 5, z, Math.PI / 2, 12, 9, C);
        crawler(b, x + 5, z, Math.PI / 2, 12, 9, C);
        F.box(x, 3.2, z, 16, 2, 8, C.greyDark);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) F.rod([x + sx * 6, 5.2, z + sz * 3], [x + sx * 2, 22, z + sz * 1.5], 0.42, C.grey, { seg: 5 });
        F.box(x, 22, z, 8, 5, 6, C.house);
        F.box(x, 27, z, 8.4, 0.5, 6.4, C.grey);
        const mastTop = [x, 40, z];
        F.rod([x, 27.5, z - 2], mastTop, 0.4, C.grey, { seg: 5 });
        F.rod([x, 27.5, z + 2], mastTop, 0.4, C.grey, { seg: 5 });
        const a = dir > 0 ? -0.55 : Math.PI + 0.35;
        const tip = [x + Math.cos(a) * len, 30, z + Math.sin(a) * len * 0.45 + 4];
        lattice(b, [x, 24, z], tip, 2.8, C.grey, 0.26);
        F.rod(mastTop, [(x + tip[0]) / 2, 28.5, (z + tip[2]) / 2], 0.12, C.greyDark, { seg: 3 });
        F.rod(mastTop, [tip[0], tip[1] + 1.2, tip[2]], 0.12, C.greyDark, { seg: 3 });
        const back = [x - Math.cos(a) * 18, 20, z - Math.sin(a) * 8];
        lattice(b, [x, 23, z], back, 2.4, C.grey, 0.24);
        F.box(back[0], 15, back[2], 5, 5, 4, C.greyDark);
        F.rod(mastTop, [back[0], 20.5, back[2]], 0.12, C.greyDark, { seg: 3 });
      });
      // --- Eimerkettenbagger (vorn rechts): Kasten auf Schienenfahrwerk, schräge Eimerleiter ------------------------
      b.xf([14, 0, -50], [0, 0, 0], 1.3, () => {
        const x = 0;
        const z = 0;
        for (let i = -2; i <= 2; i++) F.box(x + i * 5, 0.5, z, 3, 2.4, 10, C.track);
        F.box(x, 2.9, z, 28, 3, 9, C.rust, { g: [0.86, 1.02] });
        F.box(x - 4, 5.9, z, 14, 8, 7, C.house);
        F.box(x - 4, 13.9, z, 14.4, 0.5, 7.4, C.rust);
        for (const sx of [-1, 1]) F.rod([x + sx * 12, 5.9, z], [x + sx * 4, 21, z], 0.36, C.rust, { seg: 5 });
        lattice(b, [x + 6, 19.5, z + 2], [x + 26, 1.2, z + 14], 2.6, C.orange, 0.26);
        F.rod([x + 4, 21, z], [x + 22, 6, z + 11], 0.12, C.greyDark, { seg: 3 });
        if (near) for (let i = 0; i < 9; i++) {
          const t = (i + 0.5) / 9;
          F.box(x + 6 + 20 * t, 19.5 - 18.3 * t - 1.6, z + 2 + 12 * t, 1.2, 0.9, 1.4, C.rustDark);
        }
      });
      // --- kleiner Bagger hinten links ---------------------------------------------------------------------------
      b.xf([-34, 0, -110], [0, 0, 0], 1.3, () => {
        const x = 0;
        const z = 0;
        crawler(b, x, z, 0.3, 10, 8, C);
        F.box(x, 3.2, z, 9, 6, 7, C.orange, { g: [0.86, 1.02] });
        lattice(b, [x + 3, 8, z + 2], [x + 20, 16, z + 10], 2.2, C.orange, 0.22);
        bucketWheel(b, x + 21.5, 16, z + 10.6, 0.3 + Math.PI / 2, 4, C);
      });
    });
    return { w: 202, d: 130.3, h: 52.1 };
  });

  // ===========================================================================================================
  // Leuna: Chemiepark
  // ===========================================================================================================
  // Hinter dem Ort die Silhouette des Chemiestandorts: schlanke Kolonnen, Kugelbehälter, Rohrbrücken, ein hoher
  // Schornstein mit rot-weißem Kopf und die Fackel mit kleiner Flamme. Ohne Firmennamen.
  const LE = { steel: 0xc9ccd0, steelDark: 0x8e9398, white: 0xeef0f1, red: 0xc9473b, pipe: 0x9aa3ab, yellow: 0xd9b54a, hall: 0xb9b4a8, roof: 0x7d8288, flame: 0xffb347, ground: 0xa9a596 };

  landmark('chemiepark', { places: ['Leuna'], slot: 'skyline', far: true, title: 'Chemiepark' }, (b) => {
    const { F, L } = b;
    const near = !b.lod;
    const C = LE;
    const seg = near ? 12 : 7;
    F.box(0, 0, -45, 170, 0.1, 90, C.ground);
    // Hallen und Werkstätten vorn
    for (const [x, w, h, d] of [[-60, 30, 10, 20], [-22, 22, 13, 18], [40, 36, 9, 22], [72, 18, 12, 16]]) {
      F.box(x, 0, -14, w, h, d, C.hall, { g: [0.86, 1.02] });
      F.box(x, h, -14, w + 0.4, 0.5, d + 0.4, C.roof);
    }
    // Kolonnen: verschieden hohe Zylinder mit Bühnen und Kopf
    for (const [x, z, r, h] of [[-38, -48, 2.8, 58], [-31, -50, 2.1, 44], [-24, -46, 3.2, 66], [8, -52, 2.4, 50], [15, -55, 3.0, 61], [22, -50, 1.9, 38]]) {
      F.cyl(x, 0, z, r, r, h, C.steel, { seg, g: [0.86, 1.05] });
      F.lathe(x, h, z, dome(r, r * 0.6, 3), C.steel, { seg });
      for (let y = 10; y < h - 2; y += near ? 9 : 18) F.cyl(x, y, z, r + 0.7, r + 0.7, 0.3, C.steelDark, { seg });
    }
    // Kugelbehälter
    for (const [x, z, r] of [[48, -50, 7], [64, -52, 6], [56, -66, 6.5]]) {
      F.ball(x, r + 3, z, r, C.white, { ws: near ? 16 : 10, hs: near ? 10 : 6 });
      if (near) for (let k = 0; k < 6; k++) {
        const a = (k / 6) * TAU;
        F.cyl(x + Math.sin(a) * r * 0.85, 0, z + Math.cos(a) * r * 0.85, 0.35, 0.35, r + 3, C.steelDark, { seg: 5 });
      }
    }
    // Rohrbrücken quer durchs Werk
    for (const z of [-34, -38]) {
      F.box(0, 7, z, 150, 0.6, 2.2, C.pipe);
      if (near) for (let x = -72; x <= 72; x += 12) F.box(x, 0, z, 0.6, 7, 0.6, C.steelDark);
      for (const dy of [0.7, 1.4]) F.rod([-75, 7 + dy, z], [75, 7 + dy, z], 0.35, dy > 1 ? C.yellow : C.pipe, { seg: 5 });
    }
    // hoher Schornstein, rot-weiß
    const sx = -70;
    const sz = -64;
    F.cyl(sx, 0, sz, 4.2, 2.6, 110, C.white, { seg, g: [0.88, 1.04] });
    for (const y of [86, 96, 106]) F.cyl(sx, y, sz, 4.2 - 1.6 * (y / 110) + 0.05, 4.2 - 1.6 * ((y + 4) / 110) + 0.05, 4, C.red, { seg, top: false });
    // Fackel mit Flamme
    const fx = 82;
    const fz = -72;
    F.cyl(fx, 0, fz, 1.0, 0.7, 70, C.steelDark, { seg: 6 });
    if (near) for (const y of [20, 40, 60]) for (let k = 0; k < 3; k++) {
      const a = (k / 3) * TAU;
      F.rod([fx + Math.sin(a) * 6, 0, fz + Math.cos(a) * 6], [fx, y, fz], 0.12, C.steelDark, { seg: 3 });
    }
    L.lathe(fx, 70, fz, [[0.6, 0], [1.4, 1.5], [1.1, 3.5], [0.4, 5.5], [0, 6.5]], C.flame, { seg: 8 });
    return { w: 174.6, d: 90, h: 110 };
  });

  // ===========================================================================================================
  // Schwangau: Schloss Neuschwanstein vor den Bergen
  // ===========================================================================================================
  // Das Märchenschloss auf dem Felsen über der Pöllatschlucht: helle Mauern, viele schlanke Türme mit spitzen
  // Schieferhelmen, der hohe Palas mit Giebeln, der quadratische Hauptturm, vorn der rötliche Torbau. Darunter Fels und
  // Wald, dahinter die Gipfel.
  const NS = { wall: 0xeee9df, shade: 0xd9d2c4, slate: 0x56627a, slateDark: 0x46506a, brick: 0xc89470, pane: 0x4a5464, rock: 0x9a958b, rockDark: 0x7d786f, forest: 0x4f7f4a, forest2: 0x5f8f50, mount: 0x8e98a6, snow: 0xf4f6f8, gold: 0xe2b84e };

  landmark('neuschwanstein', { places: ['Schwangau'], slot: 'skyline', far: true, title: 'Neuschwanstein' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = NS;
    const H = 26; // Fels unter dem Schloss
    // Fels: unregelmäßiger Sockel, unten bewaldet; das Schloss steht obenauf (die Berge dahinter bringt alpenGipfel)
    loft(F, [[chamfer(120, 70, 22, 4, -50), 0], [chamfer(96, 52, 14, 2, -52), H * 0.5], [chamfer(80, 40, 8, 0, -54), H]], [C.forest, C.rock], { g: [0.8, 1.04], capCol: C.rockDark });
    if (near) for (let i = 0; i < 26; i++) {
      const a = (i / 26) * TAU;
      const x = 4 + Math.cos(a) * 54;
      const z = -50 + Math.sin(a) * 31;
      const r = 5 + (i % 4);
      F.ball(x, r * 1.2 + (i % 3) * 1.5, z, r, i % 2 ? C.forest : C.forest2, { ws: 6, hs: 4, sy: 1.2 });
    }
    b.xf([-7, 0, -55], [0, 0, 0], 1.45, () => {
    const H = 26 / 1.45;
    const y0 = H;
    const z0 = 0;
    // Palas: hoher Block mit Giebel nach vorn, Fensterreihen
    F.box(-10, y0, z0 - 4, 14, 28, 26, C.wall, { g: [0.88, 1.03] });
    b.gable(-10, y0 + 28, z0 - 4, 14, 26, 10, C.slate, { axis: 'z', oe: 0.3, og: 0.2, ridge: near });
    b.at(-10, 0, z0 + 9, 0, () => {
      F.extrude([[-7, y0 + 28], [7, y0 + 28], [0, y0 + 38]], -0.4, 0, C.wall, { crease: 2 });
      for (const y of [y0 + 6, y0 + 12, y0 + 18, y0 + 24]) for (const x of [-4, 0, 4]) flatArch(b, x, y, 1.4, 3, null, C.pane);
      if (near) flatArch(b, 0, y0 + 30, 1.6, 4, null, C.pane);
    });
    // Hauptturm hinten (quadratisch, hoch) und schlanker Treppenturm
    F.box(-26, y0, z0 - 6, 7, 40, 7, C.wall, { g: [0.88, 1.03] });
    spire(F, chamfer(7.6, 7.6, 0, -26, z0 - 6), y0 + 40, y0 + 52, C.slate, { ax: -26, az: z0 - 6 });
    for (const [x, z, r, h, hh] of [[1.5, z0 + 7, 2.4, 40, 12], [-18, z0 + 9, 2.0, 32, 10], [-2, z0 - 16, 2.6, 36, 11], [12, z0 + 2, 1.7, 26, 8]]) {
      roundTower(b, x, y0, z, r, h, C.wall, C.slate);
      F.ball(x, y0 + h + r * 1.9 + 0.2, z, 0.3, C.gold, { ws: 6, hs: 3 });
      if (near) for (const yy of [h * 0.5, h * 0.75]) b.at(x, 0, z + r, 0, () => flatArch(b, 0, y0 + yy, 0.8, 1.8, null, C.pane));
    }
    // Ritterhaus und Torbau vorn rechts (rötlicher Backstein)
    F.box(16, y0, z0 + 8, 18, 14, 10, C.wall, { g: [0.88, 1.03] });
    b.gable(16, y0 + 14, z0 + 8, 18, 10, 5, C.slate, { axis: 'x', oe: 0.3, og: 0.2, ridge: near });
    F.box(30, y0, z0 + 10, 12, 18, 12, C.brick, { g: [0.86, 1.02] });
    for (const sx of [-1, 1]) {
      F.cyl(30 + sx * 5.5, y0 + 18, z0 + 15.5, 1.0, 1.0, 3, C.brick, { seg: 8 });
      spire(F, ngon(8, 1.2, 0, 0, 0, 30 + sx * 5.5, z0 + 15.5), y0 + 21, y0 + 25, C.slate, { ax: 30 + sx * 5.5, az: z0 + 15.5 });
    }
    b.at(30, 0, z0 + 16.02, 0, () => {
      G.extrude(arch(0, 3.2, y0, 5, near ? 8 : 5), 0, 0.02, 0x3b322c, { caps: 'f', sides: false });
      for (const x of [-3.5, 0, 3.5]) flatArch(b, x, y0 + 9, 1.2, 2.6, null, C.pane);
    });
    // Mauern auf dem Fels
    F.box(8, y0 - 3, z0 + 14, 50, 3.5, 1.6, C.shade);
    });
    return { w: 128, d: 89, h: 101.4 };
  });

  // ===========================================================================================================
  // Wuppertal: Schwebebahn über der Wupper
  // ===========================================================================================================
  // Die Hängebahn auf ihrem Stahlgerüst: grüngraue Stützen wie umgedrehte Trapeze stehen schräg über dem Fluss, oben
  // der Fahrbalken, darunter hängt ein Wagen. Der Fluss läuft hier quer durchs Bild (die Bahn folgt ihm).
  const WU = { steel: 0x5f7f77, steelDark: 0x4a645d, water: 0x7cb6c8, bank: 0xb3a892, wall: 0xc8bba4, car: 0x2f6fb6, carLight: 0xe8eef3, window: 0x3c4652, lawn: 0x8fbf6a, roof: 0x6d7378 };

  landmark('schwebebahn', { places: ['Wuppertal'], slot: 'skyline', title: 'Schwebebahn' }, (b) => {
    const { F, G, W } = b;
    const near = !b.lod;
    const C = WU;
    const L = 150; // Länge des gezeigten Stücks
    const zr = -22; // Flussmitte
    const half = 9;
    // Ufer: erhöhte Rasenstreifen mit Mauerkante, dazwischen das Wasser (das Gelände ist flach, der Fluss liegt obenauf)
    W.poolRect(0, 0.06, zr, L + 4, 2 * half, C.water, { rings: 0.15 });
    for (const s of [-1, 1]) {
      F.box(0, 0, zr + s * (half + 6), L + 4, 1.1, 12, C.lawn, { skip: 'b' });
      F.box(0, 0, zr + s * (half + 0.3), L + 4, 1.25, 0.6, C.wall, { skip: 'b' });
    }
    const yT = 12; // Unterkante des Fahrbalkens
    const n = near ? 6 : 4;
    for (let i = 0; i <= n; i++) {
      const x = -L / 2 + (i * L) / n;
      // Stütze: zwei schräge Beine auf beiden Ufern, oben ein Querriegel; leicht schräg wie die echten
      for (const s of [-1, 1]) {
        F.rod([x - 1.6, 0, zr + s * (half + 1.5)], [x - 1.2, yT + 1.2, zr + s * 2.2], 0.32, C.steel, { seg: 4 });
        F.rod([x + 1.6, 0, zr + s * (half + 1.5)], [x + 1.2, yT + 1.2, zr + s * 2.2], 0.32, C.steel, { seg: 4 });
        if (near) F.rod([x - 1.5, 2, zr + s * (half + 1.2)], [x + 1.4, yT, zr + s * 2.4], 0.14, C.steelDark, { seg: 3 });
      }
      F.box(x, yT + 1.0, zr, 3.2, 0.7, 5, C.steelDark);
    }
    // Fahrbalken: Fachwerkträger zwischen den Stützen
    for (const s of [-1, 1]) {
      F.box(0, yT + 1.7, zr + s * 1.1, L + 2, 0.4, 0.4, C.steel);
      F.box(0, yT - 0.6, zr + s * 0.9, L + 2, 0.4, 0.4, C.steel);
      if (near) for (let x = -L / 2; x < L / 2; x += 3) F.rod([x, yT - 0.4, zr + s * 0.9], [x + 3, yT + 1.7, zr + s * 1.1], 0.1, C.steel, { seg: 3 });
    }
    F.box(0, yT - 0.9, zr, L + 2, 0.3, 0.8, C.steelDark);
    // Wagen: hängt an zwei Gehängen unter der Schiene
    const cx = 18;
    const cl = 22; // Wagenlänge
    const cy = yT - 6.6; // Unterkante des Wagens
    // Gehänge: von den Laufwerken auf der Schiene seitlich um den Balken herum nach unten
    for (const dx of [-7, 7]) {
      F.box(cx + dx, yT - 1.1, zr, 2.6, 0.9, 1.1, C.steelDark);
      F.rod([cx + dx, yT - 0.8, zr + 0.6], [cx + dx, yT - 2.2, zr + 1.3], 0.16, C.steelDark, { seg: 4 });
      F.rod([cx + dx, yT - 2.2, zr + 1.3], [cx + dx, cy + 3.1, zr + 0.3], 0.16, C.steelDark, { seg: 4 });
    }
    F.rbox(cx, cy, zr, cl, 3.1, 2.6, 0.9, C.car, { seg: 3 });
    F.rbox(cx, cy + 3.0, zr, cl - 1.2, 0.35, 2.3, 0.6, C.roof, { seg: 2 });
    for (const s of [-1, 1]) b.at(cx, 0, zr + s * 1.31, s > 0 ? 0 : Math.PI, () => {
      G.rect(0, cy + 1.3, 0.02, cl - 2.4, 1.2, C.window);
      G.rect(0, cy + 0.5, 0.02, cl - 1.6, 0.35, C.carLight);
      if (near) for (const dx of [-cl / 4, cl / 4]) G.rect(dx, cy + 0.2, 0.03, 1.2, 2.4, mix(C.car, 0x000000, 0.25));
    });
    for (const s of [-1, 1]) b.at(cx + s * (cl / 2 - 0.05), 0, zr, s * Math.PI / 2, () => G.rect(0, cy + 1.4, 0.02, 1.6, 1.1, C.window));
    return { w: L + 4, d: 43, h: yT + 2.1 };
  });

  // ===========================================================================================================
  // Darmstadt: Hochzeitsturm auf der Mathildenhöhe
  // ===========================================================================================================
  // Backsteinturm (48,5 m) mit den fünf runden „Fingern“ obenauf und der großen Uhr, daneben die russische Kapelle mit
  // goldenen Zwiebeln und das Ausstellungsgebäude. Jugendstil.
  const DA = { brick: 0xa0563f, brickDark: 0x83452f, copper: 0x5f8e7c, stone: 0xe6dcc8, pane: 0x40495a, gold: 0xe2b84e, white: 0xf1ece2, chapel: 0xece6da, roof: 0x5c8f7a, lawn: 0x8fbf6a, ink: 0x2b2522 };

  landmark('hochzeitsturm', { places: ['Darmstadt'], slot: 'skyline', title: 'Hochzeitsturm' }, (b) => {
    const { F, G } = b;
    const near = !b.lod;
    const C = DA;
    b.xf([0, 0, 0], [0, 0, 0], 0.9, () => {
      F.box(0, 0, -30, 90, 0.08, 60, C.lawn);
      // Ausstellungsgebäude (flach, lang) hinter dem Turm
      F.box(8, 0, -40, 50, 9, 18, C.stone, { g: [0.88, 1.02] });
      F.box(8, 9, -40, 50.6, 0.6, 18.6, C.brickDark);
      if (near) b.at(8, 0, -31, 0, () => { for (let x = -22; x <= 22; x += 4) G.rect(x, 2.4, 0.02, 2.2, 4.6, C.pane); });
      // Turm
      const tx = -6;
      const tz = -22;
      const TW = 10;
      const TD = 7;
      F.box(tx, 0, tz, TW, 40, TD, C.brick, { g: [0.84, 1.03] });
      F.box(tx, 0, tz, TW + 0.4, 2.4, TD + 0.4, C.stone);
      // fünf Finger: Halbzylinder mit Kupferkappe, mittlerer am höchsten
      const fingers = [[-4, 4.4], [-2, 6.4], [0, 8.4], [2, 6.4], [4, 4.4]];
      for (const [fx, h] of fingers) {
        const x = tx + fx;
        F.box(x, 40, tz, 2.0, h, TD, C.brick, { g: [0.9, 1.04] });
        b.xf([x, 40 + h, tz + TD / 2 + 0.05], [-Math.PI / 2, 0, 0], 1, () => F.cyl(0, 0, 0, 1.08, 1.08, TD + 0.1, C.copper, { seg: near ? 10 : 6, a0: -Math.PI / 2, a1: Math.PI / 2, top: true, bottom: true }));
      }
      b.at(tx, 0, tz + TD / 2 + 0.01, 0, () => {
        // Fensterband über die Ecke (schmale senkrechte Fenster), große Uhr, Sonnenuhr-artiges Feld
        for (const x of [-3, -1, 1, 3]) G.rect(x, 16, 0.02, 1.0, 12, C.pane);
        G.rect(0, 29.5, 0.02, 4.6, 4.6, C.white);
        if (near) {
          G.disc(0, 31.8, 0.04, 1.9, C.gold, { seg: 16 });
          G.quad([0, 31.8, 0.06], [0.12, 31.8, 0.06], [0.12, 33.4, 0.06], [0, 33.4, 0.06], C.ink);
          G.quad([0, 31.8, 0.06], [1.2, 31.2, 0.06], [1.2, 31.35, 0.06], [0, 31.95, 0.06], C.ink);
          for (const sx of [-1, 1]) F.cyl(sx * 2.9, 29.6, 0.3, 0.12, 0.2, 3.6, C.gold, { seg: 5 });
        }
        G.extrude(arch(0, 2.2, 0, 3.2, near ? 8 : 5), 0, 0.02, C.ink, { caps: 'f', sides: false });
      });
      // Russische Kapelle rechts vorn: weißer Bau, goldene Zwiebeln
      const cx = 24;
      const cz = -16;
      F.box(cx, 0, cz, 10, 9, 10, C.chapel, { g: [0.88, 1.02] });
      b.hip(cx, 9, cz, 10, 10, 2, C.roof, { oe: 0.3 });
      F.cyl(cx, 11, cz, 2.2, 2.2, 4, C.chapel, { seg: near ? 12 : 8 });
      F.lathe(cx, 15, cz, onion(2.3, 5.6), C.gold, { seg: near ? 14 : 8 });
      F.box(cx, 20.6, cz, 0.16, 1.6, 0.16, C.gold);
      for (const [dx, dz] of [[-3.6, -3.6], [3.6, -3.6], [-3.6, 3.6], [3.6, 3.6]]) {
        F.cyl(cx + dx, 9.5, cz + dz, 0.9, 0.9, 2.2, C.chapel, { seg: 8 });
        F.lathe(cx + dx, 11.7, cz + dz, onion(0.95, 2.6), C.gold, { seg: near ? 10 : 6 });
      }
      if (near) b.at(cx, 0, cz + 5.02, 0, () => G.extrude(arch(0, 1.8, 0, 3.6, 8), 0, 0.02, C.ink, { caps: 'f', sides: false }));
    });
    return { w: 81, d: 54, h: 44.5 };
  });
}
