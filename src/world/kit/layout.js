// Ortsplan: rein rechnerisch (ohne three.js), damit ein Node-Test jeden Ort der Karte prüfen kann.
//
// Ein Ort ist ein Straßenabschnitt der Länge len. u = Meter ab Ortsbeginn, der Fahrer fährt zu wachsendem u, im Ort
// liegt alles bei z = −u. x ist die seitliche Lage wie im Straßenprofil „stadt“: eigene Spur x = 9,0, Gegenspur 5,75,
// Bordstein rechts bei 11,0 und links bei 3,9. Dahinter je 5 m Gehweg, dann die Häuserflucht.
//
// Die Brunnen-Regel: jeder Ort bekommt mindestens einen Brunnen auf einem Platz direkt an der Straße (rechts, auf
// der Fahrerseite der Fahrbahn), mit Laternen daneben. Alles, was den Blick vom Fahrersitz auf ihn verstellen würde
// (Bäume, Autos, Buden, Menschen), wird nach dem Planen aus den Sichtlinien geräumt; sightBlockers() prüft das
// und wird vom Planer und vom Node-Test (tools/citykit-test.mjs) gleichermaßen benutzt.

export const STREET = {
  lane: 9.0, // eigene Spur
  other: 5.75, // Gegenspur
  eye: 8.6, // Fahrerauge seitlich (Linkslenker sitzt links der Spurmitte)
  eyeY: 1.2,
  curbR: 11.0,
  curbL: 3.9,
  pave: 5.0, // Gehwegtiefe: 2,2 m Streifen (Bäume, Laternen, Parkplätze) + 2,8 m Gehweg
  strip: 2.2,
  top: 0.12, // Oberkante von Gehweg und Platz
};

/** Ortsgröße aus der Einwohnerzahl; die Längen folgen graph.js townLen. */
export function sizeOf(pop) {
  return pop >= 300000 ? 'gross' : pop >= 50000 ? 'stadt' : pop >= 5000 ? 'klein' : 'dorf';
}
export const TOWN_LEN = { dorf: 300, klein: 500, stadt: 800, gross: 1200 };

/** Baustil der Gegend (für die regionalen Hausvarianten). */
export function regionOf(place) {
  const cc = place.cc;
  const lat = place.lat ?? 50;
  if (cc === 'DE') return lat > 52.7 ? 'brick' : lat < 47.9 ? 'alpine' : 'default';
  if (cc === 'AT' || cc === 'CH' || cc === 'LI') return 'alpine';
  if (['IT', 'ES', 'PT', 'GR', 'HR', 'MT', 'MC', 'VA', 'CV', 'DO', 'MX', 'JO'].includes(cc)) return 'med';
  if (cc === 'FR') return lat < 45.5 ? 'med' : 'default';
  if (['SE', 'NO', 'FI', 'DK'].includes(cc)) return 'nordic';
  if (cc === 'NL' || cc === 'BE') return 'dutch';
  if (cc === 'GB' || cc === 'IE') return 'british';
  if (cc === 'US' || cc === 'CA') return 'american';
  if (cc === 'JP') return 'japanese';
  return 'default';
}

// Plätze je Größe: Breite entlang der Straße (S) und Tiefe hinter dem Gehweg (D), beides Vielfache der 8-m-Pflasterkachel
const SQUARE = { dorf: [24, 16], klein: [32, 16], stadt: [40, 24], gross: [48, 24] };
// Hauptbrunnen je Größe (Auswahl nach Zufall des Ortes), dazu weitere in größeren Orten
const MAIN = {
  dorf: ['fountainTrough', 'fountainTrough', 'fountainMarket'],
  klein: ['fountainMarket', 'fountainBowls', 'fountainTrough'],
  stadt: ['fountainBowls', 'fountainJets', 'fountainMarket'],
  gross: ['fountainGrand', 'fountainBowls', 'fountainJets'],
};
const EXTRA = { dorf: [], klein: ['fountainDrink'], stadt: ['fountainPond', 'fountainDrink'], gross: ['fountainPond', 'fountainJets', 'fountainDrink'] };
const SPECIAL = { Augsburg: 'fountainOrigin', 'Nürnberg': 'fountainBoss' };
// Radius der Brunnen, die Hauptbrunnen eines Orts sein können (info.r aus fountains.js; tools/citykit-test.mjs prüft,
// dass beide übereinstimmen): damit lässt sich die Insel eines Zielbrunnens ohne Grafik planen
export const FOUNTAIN_R = { fountainTrough: 2.8, fountainMarket: 4.2, fountainBowls: 4.3, fountainJets: 4.6, fountainGrand: 7.5, fountainOrigin: 4.5, fountainBoss: 7.3 };
// Insel des Zielbrunnens im Straßenbau: Bordstein und ein schmaler Pflasterring um das Becken, höchstens 8 m Radius
export const ISLAND = { kerb: 0.45, ring: 0.35, max: 8 };

// Häuser je Größe: Rand (außen) und Mitte; gap = Abstand zwischen zwei Häusern [min, max]
const ROWS = {
  dorf: { edge: ['cottage1', 'cottage2', 'cottage3', 'timberHouse1', 'timberHouse2', 'farm'], mid: ['timberHouse1', 'timberHouse2', 'cottage2', 'cottage1', 'inn'], gap: [3, 9], gapMid: [2, 5] },
  klein: { edge: ['cottage1', 'cottage2', 'townHouse1', 'townHouse3', 'timberHouse1'], mid: ['shopBakery', 'shopIce', 'shopPharmacy', 'shopBooks', 'shopFlowers', 'shopCafe', 'shopHair', 'shopKiosk', 'townHouse1', 'townHouse2', 'townHouse4', 'oldTown1', 'oldTown2', 'oldTown3'], gap: [2, 6], gapMid: [0, 0.4] },
  stadt: { edge: ['townHouse1', 'townHouse2', 'townHouse3', 'townHouse4', 'shopKiosk', 'shopElectro', 'apartment'], mid: ['shopBakery', 'shopIce', 'shopDoner', 'shopPharmacy', 'shopBooks', 'shopBank', 'shopVeg', 'shopCafe', 'shopToys', 'shopPizza', 'shopTravel', 'shopDriving', 'townHouse2', 'oldTown4', 'oldTown5', 'hotel', 'cinema'], gap: [0, 1.5], gapMid: [0, 0.3] },
  gross: { edge: ['apartment', 'apartment', 'office', 'townHouse2', 'shopElectro', 'shopDoner', 'hotel', 'messe'], mid: ['shopBakery', 'shopIce', 'shopDoner', 'shopPharmacy', 'shopBank', 'shopCafe', 'shopToys', 'shopPizza', 'shopTravel', 'townHouse2', 'hotel', 'cinema', 'apartment', 'office', 'office', 'deptStore'], gap: [0, 1], gapMid: [0, 0.3] },
};
// Höchstens einmal je Ort (die Messe ist ein Unikat)
const ONCE = new Set(['messe']);
// Hafenorte: am Rand der Häuserzeilen stehen Speicher aus Backstein (wie in der Speicherstadt)
const HARBOUR = new Set(['Hamburg', 'Bremen', 'Bremerhaven', 'Cuxhaven', 'Wilhelmshaven', 'Emden', 'Kiel', 'Lübeck', 'Flensburg', 'Rostock', 'Wismar', 'Stralsund', 'Puttgarden', 'Amsterdam', 'Rotterdam', 'Antwerpen', 'Kopenhagen', 'Danzig']);
// Großstadt: Straßenbahnhalte statt Parkplätzen an der n-ten Laterne jeder Seite
const TRAM_AT = new Set([2, 7, 12]);
// Altstadt vor Wahrzeichen: niedrige Häuser, damit Türme und Kuppeln über die Dächer schauen
const OLD_TOWN = ['oldTown1', 'oldTown2', 'oldTown3', 'oldTown4', 'oldTown5', 'shopCafe', 'shopBakery', 'shopIce', 'townHouse1', 'shopBooks'];
// Rückwand des Hauptplatzes (quer zur Straße, schaut zur Straße)
const BACK = { dorf: ['villageChurch1', 'villageChurch2', 'inn'], klein: ['townHall', 'townChurch', 'marketHall'], stadt: ['townHall', 'townChurch', 'marketHall'], gross: ['townHall', 'townChurch', 'station'] };
const FRONT_KINDS = new Set(['village', 'shop', 'town', 'city', 'region', 'ground', 'landmark', 'rest']);
const THIN = new Set(['lamp', 'tree', 'signal']);
// Was niedriger ist, verdeckt den Brunnen nicht (Bänke, Beete, Tauben, Pflaster)
const LOW = 0.95;

/**
 * Art des Hauptbrunnens eines Orts, an dem auch jede Fahrt dorthin endet: die beiden Sonderbrunnen in Augsburg und
 * Nürnberg, sonst nach der Größe des Orts. Für denselben Ort immer dieselbe, unabhängig vom übrigen Plan.
 */
export function goalKind(place, size = sizeOf(place.pop ?? 0)) {
  const special = SPECIAL[place.key] ?? SPECIAL[place.name];
  if (special) return special;
  const list = MAIN[size];
  return list[hashKey('Brunnen ' + (place.key ?? place.name)) % list.length];
}
/** Radius der Insel, auf der der Zielbrunnen eines Orts mitten im Brunnenplatz der Straße steht. */
export function islandRadius(place) {
  return Math.min(ISLAND.max, FOUNTAIN_R[goalKind(place)] + ISLAND.kerb + ISLAND.ring);
}

/** Name auf Ortsschild und Navi: wie shortName in src/game/navi.js (Zusätze in Klammern, nach Komma oder Strich fallen weg). */
export function signName(name) {
  const n = String(name ?? '').split(/[,(–:]/)[0].trim();
  return n.length > 24 ? n.slice(0, 23) + '…' : n;
}

/** Kleiner, schneller Zufall (mulberry32). */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Fester Zufallskeim aus einem Namen. */
export function hashKey(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
const pick = (rnd, list) => list[Math.floor(rnd() * list.length)];
const span = (rnd, [a, b]) => a + rnd() * (b - a);

/**
 * Grundriss eines Bausteins in Ortskoordinaten: Mitte (cx, cz), halbe Maße (hw, hd), Drehung ang, Höhe h.
 * Häuser und Bodenkacheln haben ihren Ursprung in der Mitte der Vorderkante (sie reichen nach −z), alles andere
 * (und was info.centre trägt, etwa der Maibaum) in der Mitte der Grundfläche.
 */
export function footprint(it, info) {
  const front = FRONT_KINDS.has(info.kind) && !info.centre;
  const c = Math.cos(it.ry);
  const s = Math.sin(it.ry);
  const off = front ? -info.d / 2 : 0;
  const fp = { cx: it.x + s * off, cz: it.z + c * off, hw: info.w / 2, hd: info.d / 2, ang: it.ry, h: info.h };
  // Laternen, Ampeln und Bäume verdecken in Augenhöhe nur mit Mast oder Stamm (Arm und Krone hängen darüber)
  if (THIN.has(info.kind)) fp.thin = { cx: it.x, cz: it.z, hw: 0.25, hd: 0.25, ang: 0 };
  return fp;
}

/** Achsparallele Hülle eines Grundrisses [x0, x1, z0, z1] und ob sich zwei Hüllen überschneiden. */
export function aabb(fp) {
  const c = Math.abs(Math.cos(fp.ang));
  const s = Math.abs(Math.sin(fp.ang));
  const hx = fp.hw * c + fp.hd * s;
  const hz = fp.hw * s + fp.hd * c;
  return [fp.cx - hx, fp.cx + hx, fp.cz - hz, fp.cz + hz];
}
const touches = (a, b) => a[0] < b[1] - 0.05 && b[0] < a[1] - 0.05 && a[2] < b[3] - 0.05 && b[2] < a[3] - 0.05;

/** Schneidet die Strecke (ax, az)–(bx, bz) den gedrehten Grundriss f? (Liang–Barsky im Rahmen des Grundrisses) */
export function segHitsBox(ax, az, bx, bz, f, pad = 0) {
  const c = Math.cos(f.ang);
  const s = Math.sin(f.ang);
  // Ortskoordinaten → Rahmen des Grundrisses (lokale x-Achse = (c, −s), lokale z-Achse = (s, c))
  const lx = (x, z) => (x - f.cx) * c - (z - f.cz) * s;
  const lz = (x, z) => (x - f.cx) * s + (z - f.cz) * c;
  const x0 = lx(ax, az);
  const z0 = lz(ax, az);
  const dx = lx(bx, bz) - x0;
  const dz = lz(bx, bz) - z0;
  let t0 = 0;
  let t1 = 1;
  const clip = (p, q) => {
    if (Math.abs(p) < 1e-12) return q >= 0;
    const r = q / p;
    if (p < 0) {
      if (r > t1) return false;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return false;
      if (r < t1) t1 = r;
    }
    return true;
  };
  const hw = f.hw + pad;
  const hd = f.hd + pad;
  return clip(-dx, x0 + hw) && clip(dx, hw - x0) && clip(-dz, z0 + hd) && clip(dz, hd - z0) && t0 <= t1;
}

/** Fahrerpositionen (Ortskoordinaten x, z), von denen aus ein Brunnen frei zu sehen sein muss. */
export function viewPoints(f) {
  const pts = [];
  // auf der Anfahrt von 45 m vorher (gut 3 s bei 50 km/h) bis zum Vorbeifahren, alle 3 m
  for (let d = 45; d >= 0; d -= 3) pts.push([STREET.eye, -(f.u - d)]);
  return pts;
}

/**
 * Alles, was die Sicht vom Fahrersitz auf den Brunnen f verstellt: Bausteine mit Höhe über LOW, deren Grundriss eine
 * Sichtlinie schneidet (Ziele: Mitte und beide Seiten des Brunnens). Liefert die Indizes in plan.items.
 */
export function sightBlockers(plan, f, points = viewPoints(f)) {
  const out = new Set();
  const targets = [[f.x, f.z], [f.x, f.z - f.r * 0.6], [f.x, f.z + f.r * 0.6], [f.x - f.r * 0.6, f.z]];
  // Vorauswahl: nur Bausteine im Rechteck um alle Sichtlinien
  let x0 = Infinity;
  let x1 = -Infinity;
  let z0 = Infinity;
  let z1 = -Infinity;
  for (const [x, z] of [...points, ...targets]) {
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    z0 = Math.min(z0, z);
    z1 = Math.max(z1, z);
  }
  const near = [];
  for (let i = 0; i < plan.items.length; i++) {
    const it = plan.items[i];
    if (it.fountain === f.id || it.fp.h <= LOW) continue;
    const e = Math.hypot(it.fp.hw, it.fp.hd) + 0.05;
    if (it.fp.cx + e < x0 || it.fp.cx - e > x1 || it.fp.cz + e < z0 || it.fp.cz - e > z1) continue;
    near.push(i);
  }
  for (const [ex, ez] of points) {
    for (const [tx, tz] of targets) {
      for (const i of near) {
        const fp = plan.items[i].fp;
        if (!out.has(i) && segHitsBox(ex, ez, tx, tz, fp.thin ?? fp, 0.05)) out.add(i);
      }
    }
  }
  return [...out];
}

/** Wie weit vor dem Brunnen (in Metern, bis max) ist seine Mitte vom Fahrersitz aus ununterbrochen frei zu sehen? */
export function sightDistance(plan, f, max = 120) {
  let free = 0;
  for (let d = 0; d <= max; d += 2) {
    if (sightBlockers(plan, f, [[STREET.eye, -(f.u - d)]]).length) break;
    free = d;
  }
  return free;
}

/**
 * Plant einen Ort. place = { key, name, cc, pop, n, lat? }, opts = { len, seed, goal (u des Ziels), infoOf(name),
 * landmarks ([{ name, slot }] aus landmarkFor), signName (Name auf dem Ortsschild, Standard signName(place.name)),
 * nextName (nächster Ort, klein unter dem Ortsende-Schild) }.
 * Ergebnis: { place, size, region, len, items, fountains, squares, texts, goal, landmarks }. Wahrzeichen: 'square' wird
 * Rückwand des Hauptplatzes (der Platz wächst mit), 'skyline' steht links hinter der Häuserzeile, mit einer Lücke in
 * der Zeile, durch die man es sieht; 'river' und 'open' stehen nur in plan.landmarks (placed = false) und bleiben dem
 * Streckenbau überlassen.
 * items: { name, x, y, z, ry, tint?, fp } in Ortskoordinaten; fountains: { id, kind, title, x, y, z, u, ry, r, h,
 * place, special, goal, cam: { pos, look } } (cam in Ortskoordinaten, für die Nahaufnahme aus 2–4 m).
 */
export function planTown(place, opts = {}) {
  const infoOf = opts.infoOf;
  const size = opts.size ?? sizeOf(place.pop ?? 0);
  const len = opts.len ?? TOWN_LEN[size];
  const rnd = rng(opts.seed ?? hashKey(place.key ?? place.name ?? 'Ort'));
  const top = STREET.top;
  const plan = { place: { key: place.key, name: place.name ?? place.key, cc: place.cc }, size, region: regionOf(place), len, items: [], fountains: [], squares: [], texts: [], goal: opts.goal ?? null, landmarks: [] };
  const marks = opts.landmarks ?? [];
  // regionale Spielart eines Hauses, wenn es sie gibt (town.js: name@gegend)
  const reg = (name) => {
    if (plan.region === 'default' || !opts.has) return name;
    const r = name + '@' + plan.region;
    return opts.has(r) ? r : name;
  };
  const squareMark = marks.find((m) => m.slot === 'square');
  const busy = []; // belegte Grundrisse (Häuser, Plätze), um Überschneidungen zu vermeiden

  const add = (name, x, y, z, ry, o = {}) => {
    const info = infoOf(name);
    const it = { name, x, y, z, ry, ...o };
    if (o.tint === undefined && info.tints && info.tints.length > 1) it.tint = pick(rnd, info.tints);
    it.fp = footprint(it, info);
    plan.items.push(it);
    return it;
  };
  // Seitenrahmen: side +1 rechts, −1 links; d = Abstand von der Bordsteinkante nach außen
  const sx = (side, d) => (side > 0 ? STREET.curbR + d : STREET.curbL - d);
  const toRoad = (side) => (side > 0 ? -Math.PI / 2 : Math.PI / 2);
  const lineD = STREET.pave; // Häuserflucht

  // --- 1. Hauptplatz mit Brunnen, rechts an der Straße, beim Ziel (60 % wie das Ziel im Straßenbau) ---------------
  const special = SPECIAL[place.key] ?? SPECIAL[place.name];
  const mainKind = special ?? pick(rnd, MAIN[size]);
  const mainInfo = infoOf(mainKind);
  const mr = mainInfo.r ?? mainInfo.w / 2;
  // Der Platz wächst mit seinem Brunnen (der Endgegner braucht auch im Dorf Raum) und mit einem Wahrzeichen als Rückwand
  const S = Math.max(SQUARE[size][0], Math.ceil((2 * mr + 10) / 8) * 8, squareMark ? Math.ceil((infoOf(squareMark.name).w + 4) / 8) * 8 : 0);
  const D = Math.max(SQUARE[size][1], Math.ceil((2 * mr + 3) / 8) * 8);
  const uc = Math.round(Math.min(len - S / 2 - 30, Math.max(S / 2 + 40, opts.goal ?? len * 0.6)));
  const sq = { kind: 'main', side: 1, u0: uc - S / 2, u1: uc + S / 2, d0: lineD, d1: lineD + D };
  plan.squares.push(sq);
  const fountains = [];
  const placeFountain = (kind, side, d, u, ryExtra = 0, o = {}) => {
    const info = infoOf(kind);
    const x = sx(side, d);
    const z = -u;
    const ry = toRoad(side) + ryExtra;
    const id = fountains.length;
    const it = add(kind, x, o.y ?? top, z, ry, { fountain: id });
    const c = Math.cos(ry);
    const s = Math.sin(ry);
    const tr = ([px, py, pz]) => [x + px * c + pz * s, (o.y ?? top) + py, z - px * s + pz * c];
    const f = {
      id, kind, title: info.title, x, y: o.y ?? top, z, u, ry, r: info.r ?? Math.max(info.w, info.d) / 2, h: info.h,
      place: place.key, special: info.special ?? null, goal: !!o.goal, size: info.size,
      cam: info.cam ? { pos: tr(info.cam.pos), look: tr(info.cam.look) } : null,
    };
    fountains.push(f);
    return { f, it };
  };
  // Brunnen nah an die Straße: Vorderkante 1,2 m hinter dem Gehweg, aber im Platz
  const md = Math.min(lineD + D - mr - 1.5, lineD + 1.2 + mr);
  const main = placeFountain(mainKind, 1, md, uc, 0, { goal: opts.goal != null });
  // Pflaster des Platzes
  for (let u = sq.u0 + 4; u < sq.u1; u += 8) for (let d = lineD + 4; d < sq.d1; d += 8) add('plaza', sx(1, d), 0, -u, 0);
  // Vor dem Platz eine kleine Grünfläche ohne Haus: der Brunnen ist schon von weitem zu sehen
  busy.push({ side: 1, u0: sq.u0 - 14, u1: sq.u1 });
  add('flowerBed', sx(1, lineD + 2.2), top, -(sq.u0 - 7), 0);
  add('bench', sx(1, lineD + 4.2), top, -(sq.u0 - 10.5), -Math.PI / 2);

  // Rückwand des Platzes: ein Wahrzeichen oder ein großes Haus quer, schaut zur Straße
  const backName = pick(rnd, BACK[size]);
  const bi = infoOf(backName);
  if (squareMark) {
    add(squareMark.name, sx(1, sq.d1), 0, -uc, toRoad(1));
    plan.landmarks.push({ name: squareMark.name, slot: 'square', placed: true });
  } else if (bi.w <= S + 0.5) add(backName, sx(1, sq.d1), 0, -uc, toRoad(1));
  else add(reg(pick(rnd, ROWS[size].mid)), sx(1, sq.d1), 0, -uc, toRoad(1));

  // Laternen am Brunnen: hinter ihm (weiter weg von der Straße) und nach ihm (in Fahrtrichtung)
  const lamp = size === 'dorf' || size === 'klein' ? 'lampOld' : 'lampModern';
  const fx = main.f.x;
  add(lamp, fx + mr + 1.4, top, -(uc - mr * 0.7), 0);
  add(lamp, fx - mr * 0.5, top, -(uc + mr + 1.6), 0);
  // Bänke um den Brunnen, Blumen, Bäume an den hinteren Ecken, Tauben vorn
  add('bench', fx + mr + 1.2, top, -(uc + mr * 0.5 + 0.5), -Math.PI / 2);
  add('benchPark', fx, top, -(uc + mr + 1.6) + 0.0, Math.PI);
  add('flowerTub', fx + mr + 1.0, top, -(uc - mr - 1.2), 0);
  add('flowerTub', fx - mr - 0.4, top, -(uc + mr + 1.4), 0);
  for (const du of [-S / 2 + 3, S / 2 - 3]) add(pick(rnd, ['streetTree', 'streetTree2']), sx(1, sq.d1 - 3), top, -(uc + du), rnd() * 6);
  for (let i = 0; i < 3; i++) add(i % 2 ? 'pigeonPeck' : 'pigeon', fx - mr - 0.8 - rnd() * 0.8, top, -(uc + (rnd() - 0.5) * mr), rnd() * 6.28);
  // Dorf: Maibaum hinten; Kleinstadt und größer: Marktstände hinter dem Brunnen, Café nach dem Brunnen
  if (size === 'dorf') {
    add('maypole', sx(1, sq.d1 - 3), top, -(uc + S / 2 - 7), 0);
  } else {
    const stalls = ['stallFruit', 'stallFlowers', 'stallBakery'];
    for (let i = 0; i < (size === 'klein' ? 2 : 3); i++) add(stalls[i], sx(1, sq.d1 - 2.2), top, -(uc - S / 2 + 6 + i * 4.2), toRoad(1));
    add('cafeSet', fx - mr * 0.3, top, -(uc + S / 2 - 3), 0);
  }
  // Menschen auf dem Platz
  const people = opts.people ?? true;
  if (people) {
    add('oma_sit', fx + mr + 1.2, top + 0.03, -(uc + mr * 0.5 + 0.5), -Math.PI / 2);
    add(pick(rnd, ['kind_wave', 'kind_cheer']), fx - mr * 0.2, top, -(uc + mr + 3.0), Math.PI * 0.9);
    add(pick(rnd, ['mann_stand', 'frau_stand', 'frau2_stand']), fx + mr + 2.6, top, -(uc - 2), -Math.PI / 2);
  }

  // --- 2. Weitere Brunnen in größeren Orten: auf eigenen kleinen Plätzen links ------------------------------------
  const extras = special && size === 'gross' ? EXTRA.gross.slice(1) : EXTRA[size];
  let side2u = len * 0.25;
  for (const kind of extras) {
    const info = infoOf(kind);
    const r = info.r ?? info.w / 2;
    const w2 = Math.ceil((2 * r + 6) / 8) * 8;
    const d2 = Math.ceil((2 * r + 4) / 8) * 8;
    const u2 = Math.round(side2u + w2 / 2);
    if (u2 + w2 / 2 > len - 40) break;
    if (Math.abs(u2 - uc) < S / 2 + w2 / 2 + 20) {
      side2u = uc + S / 2 + 30;
      continue;
    }
    const sq2 = { kind: 'extra', side: -1, u0: u2 - w2 / 2, u1: u2 + w2 / 2, d0: lineD, d1: lineD + d2 };
    plan.squares.push(sq2);
    busy.push({ side: -1, u0: sq2.u0, u1: sq2.u1 });
    for (let u = sq2.u0 + 4; u < sq2.u1; u += 8) for (let d = lineD + 4; d < sq2.d1; d += 8) add('plaza', sx(-1, d), 0, -u, 0);
    placeFountain(kind, -1, lineD + d2 / 2, u2);
    add(lamp, sx(-1, lineD + d2 / 2 + r + 1.3), top, -(u2 - r * 0.5), 0);
    add('bench', sx(-1, lineD + d2 - 1.0), top, -(u2 + r * 0.4), Math.PI / 2);
    // Baum in der hinteren Ecke, wenn seine Krone den Brunnen nicht berührt; sonst ein Blumenkübel
    const td = lineD + d2 - 2.1;
    const tu = u2 + w2 / 2 - 2.1;
    const roomy = Math.max(Math.abs(td - (lineD + d2 / 2)), Math.abs(tu - u2)) >= r + 2.1;
    add(roomy ? pick(rnd, ['streetTree', 'streetTreeTall']) : 'flowerTub', sx(-1, td), top, -tu, rnd() * 6);
    if (people) add(pick(rnd, ['mann_walk', 'frau_walk', 'opa_walk']), sx(-1, lineD + 1), top, -(u2 + r + 1), Math.PI);
    side2u = u2 + w2 / 2 + 60 + rnd() * 60;
  }

  // --- 3. Wahrzeichen hinter der linken Zeile, je mit einer Lücke (Grünstreifen), durch die man es sieht -------------
  const skyBoxes = [];
  const views = []; // Sichtlücken: dort kein Straßenbaum vor dem Wahrzeichen
  const free = (side, u0, u1) => busy.every((b) => b.side !== side || u1 <= b.u0 || u0 >= b.u1);
  // Reihe um Reihe: vor dem Platz beginnend in Fahrtrichtung; was hinter dem Ortsende anfinge, kommt in eine Reihe
  // weiter hinten (Türme dürfen über das Ortsende hinaus stehen, sie sind von weitem zu sehen)
  // Stücke bis 150 m Höhe (Dom, Michel, Herkules) stehen 30 m hinter der Flucht, höhere (ganze Skylines,
  // Fernsehtürme) 90 m: von der Straße sieht man sie durch die Lücke und über die Dächer hinweg, ohne Wand
  let ahead = uc + 140;
  let deepNear = lineD + 30;
  let deepFar = lineD + 90;
  let back = lineD; // tiefste Hinterkante aller bisher gesetzten Stücke
  let inRow = 0;
  for (const m of marks) {
    if (m.slot !== 'skyline') {
      if (m.slot !== 'square') plan.landmarks.push({ name: m.name, slot: m.slot, placed: false });
      continue;
    }
    const info = infoOf(m.name);
    if (inRow > 0 && ahead > len - 40) {
      deepNear = back + 30;
      deepFar = back + 90;
      inRow = 0;
      ahead = uc + 140;
    }
    // Hohe Stücke (Skylines, Fernsehtürme) stehen tiefer und bekommen die breitere Lücke
    const tall = info.h > 150;
    const deep = tall ? deepFar : deepNear;
    const half = tall ? 36 : 24;
    const u = Math.round(ahead + info.w / 2);
    ahead += info.w + 70;
    back = Math.max(back, deep + info.d);
    inRow++;
    // Lücke in der Zeile vor dem Stück (im Ort); liegt dort ein Nebenplatz, daneben
    const gc = Math.min(Math.max(u, 44), len - 40);
    let gu = null;
    for (const du of [0, 30, -30, 60, -60]) {
      if (free(-1, gc + du - half, gc + du + half) && gc + du - half > 20 && gc + du + half < len - 16) {
        gu = gc + du;
        break;
      }
    }
    const it = add(m.name, sx(-1, deep), 0, -u, toRoad(-1));
    skyBoxes.push(aabb(it.fp));
    plan.landmarks.push({ name: m.name, slot: 'skyline', placed: true, u, view: gu });
    if (gu === null) continue;
    busy.push({ side: -1, u0: gu - half, u1: gu + half });
    views.push({ side: -1, u0: gu - half, u1: gu + half });
    // Grünstreifen mit nur Niedrigem: Rasen, Beete und Bänke, zwei kleine Bäume an den Enden
    for (let du = -half + 4; du <= half - 4; du += 8) for (const d of [4, 12]) add('lawn', sx(-1, lineD + d), 0, -(gu + du), 0);
    for (let du = -half + 12; du <= half - 12; du += 12) add('flowerBed', sx(-1, lineD + 2.4), top, -(gu + du), 0);
    for (const du of [-6, 6]) add('bench', sx(-1, lineD + 5.2), top, -(gu + du), toRoad(-1));
    for (const du of [-half + 3, half - 3]) add(pick(rnd, ['streetTree', 'streetTree2']), sx(-1, lineD + 3), top, -(gu + du), rnd() * 6);
  }

  // --- 4. Häuserzeilen auf beiden Seiten --------------------------------------------------------------------------
  // Vor einem Wahrzeichen (linke Seite) stehen in Stadt und Großstadt niedrige Altstadthäuser: über eine Zeile der Höhe
  // Hr sieht man ein Stück im seitlichen Abstand X erst ab 1,2 + (Hr − 1,2) · X / 11 m, also hält die Altstadt die
  // Türme frei
  const harbour = size !== 'dorf' && (HARBOUR.has(place.key) || HARBOUR.has(place.name));
  const rows = harbour ? { ...ROWS[size], edge: [...ROWS[size].edge, 'speicher1', 'speicher2', 'speicher1'] } : ROWS[size];
  const once = new Set();
  const oldTown = (size === 'gross' || size === 'stadt') ? plan.landmarks.filter((l) => l.slot === 'skyline' && l.placed).map((l) => {
    const r = Math.min(infoOf(l.name).w, 160) / 2 + 70;
    return [l.u - r, l.u + r];
  }) : [];
  for (const side of [1, -1]) {
    let u = 18 + rnd() * 6;
    let sinceStreet = 0;
    while (u < len - 16) {
      const mid = Math.abs(u - uc) < len * 0.28;
      const low = side === -1 && oldTown.some(([a, b]) => u + 6 > a && u < b);
      const list = mid ? rows.mid : rows.edge;
      let base = low ? pick(rnd, OLD_TOWN) : pick(rnd, list);
      if (ONCE.has(base) && once.has(base)) base = pick(rnd, list.filter((n) => !ONCE.has(n)));
      const name = reg(base);
      const info = infoOf(name);
      // Querstraße: alle 110–160 m eine Lücke von 10 m (nicht in Dörfern)
      if (size !== 'dorf' && sinceStreet > 110 + rnd() * 50) {
        u += 10;
        sinceStreet = 0;
        continue;
      }
      if (!free(side, u, u + info.w)) {
        const b = busy.find((q) => q.side === side && u + info.w > q.u0 && u < q.u1);
        u = b ? b.u1 + 0.01 : u + 2;
        continue;
      }
      if (u + info.w > len - 14) break;
      add(name, sx(side, lineD), 0, -(u + info.w / 2), toRoad(side));
      if (ONCE.has(base)) once.add(base);
      const g = span(rnd, mid ? rows.gapMid : rows.gap);
      u += info.w + g;
      sinceStreet += info.w + g;
    }
  }

  // Großstadt: eine Gruppe Glastürme um die Mitte, hinter den Häuserzeilen gestaffelt, als Skyline über den Dächern
  // (nicht, wo ein Wahrzeichen steht, und gar nicht neben einer ganzen Skyline wie in Frankfurt)
  if (size === 'gross' && !marks.some((m) => m.slot === 'skyline' && infoOf(m.name).h > 150 && infoOf(m.name).w > 200)) {
    const towers = ['glassTower1', 'glassTower2', 'glassTower3'];
    const n = 7;
    for (let k = 0; k < n; k++) {
      const side = k % 2 ? -1 : 1;
      const u = uc + (k - (n - 1) / 2) * 42 + (rnd() - 0.5) * 18;
      if (u < 60 || u > len - 60) continue;
      if (plan.squares.some((q) => q.side === side && u > q.u0 - 40 && u < q.u1 + 40)) continue;
      const it = add(pick(rnd, towers), sx(side, lineD + 32 + (k % 3) * 24 + rnd() * 8), 0, -u, toRoad(side));
      // nicht in ein Wahrzeichen und nicht in ein tiefes Haus der Zeile (Messe 34 m, Kaufhaus 20 m)
      const tb = aabb(it.fp);
      if (skyBoxes.some((b) => touches(b, tb)) || plan.items.some((o) => o !== it && HOUSE_KINDS.has(infoOf(o.name).kind) && touches(aabb(o.fp), tb))) plan.items.pop();
    }
  }

  // --- 5. Gehwege: Kacheln, Laternen, Bäume, Parkplätze, Kleinkram, Menschen -------------------------------------
  for (const side of [1, -1]) {
    // 8-m-Platten bis kurz vor das Ortsende, dann 4-m-Platten: der Gehweg endet genau bei len (Ortslängen sind Vielfache von 4)
    for (let u = 0; u + 4 <= len + 1e-6;) {
      const L = u + 8 <= len + 1e-6 ? 8 : 4;
      add(L === 8 ? 'pavement' : 'pavement4', sx(side, 0), 0, -(u + L / 2), toRoad(side));
      u += L;
    }
    const onSquare = (u) => plan.squares.some((q) => q.side === side && u > q.u0 - 1 && u < q.u1 + 1);
    let u = 14 + rnd() * 8;
    let k = 0;
    let lampNo = 0;
    while (u < len - 12) {
      if (!onSquare(u)) {
        // Laterne am Bordstein, Arm über die Fahrbahn
        add(lamp, sx(side, 0.45), top, -u, side > 0 ? -Math.PI / 2 : Math.PI / 2);
        const a = u + 6;
        const b = u + 24;
        // zwischen zwei Laternen: Straßenbahnhalt (Großstadt), Baum oder Autos (ab Kleinstadt), sonst Grün
        if (size === 'gross' && TRAM_AT.has(lampNo++) && !onSquare(u + 10) && !onSquare(u + 16) && u + 20 < len - 3) {
          add('tramStop', sx(side, 1.15), top, -(u + 13), toRoad(side));
        } else if (size !== 'dorf' && rnd() < 0.55) {
          let cu = a + 1;
          while (cu + 4.6 < b) {
            const car = pick(rnd, ['carSmall', 'carCompact', 'carCompact', 'carVan']);
            const ci = infoOf(car);
            if (onSquare(cu) || onSquare(cu + ci.d) || cu + ci.d > len - 2) break;
            add(car, sx(side, 1.15), top, -(cu + ci.d / 2), side > 0 ? Math.PI : 0);
            cu += ci.d + 1.2 + rnd() * 1.5;
          }
        } else if (u + 13 < len - 3 && !onSquare(u + 13) && !views.some((v) => v.side === side && u + 13 > v.u0 - 3 && u + 13 < v.u1 + 3)) {
          // Krone (bis 2 m Radius) bleibt über dem Gehweg; vor einer Sichtlücke steht keiner
          add(pick(rnd, ['streetTree', 'streetTree2', 'streetTreeTall']), sx(side, 2.05), top, -(u + 13), rnd() * 6.28);
        }
        // Kleinkram am Rand des Gehwegs (nah an der Hauswand stört er niemanden)
        const small = ['bin', 'bench', 'postBox', 'hydrant', 'bikeStand', 'flowerTub', 'adColumn', 'phoneBox', 'parkingMeter'];
        if (rnd() < 0.7) {
          const nm = small[k++ % small.length];
          const si = infoOf(nm);
          if (!onSquare(u + 9)) add(nm, sx(side, lineD - Math.max(si.d, si.w) / 2 - 0.15), top, -(u + 9), toRoad(side) + (nm === 'bikeStand' ? Math.PI / 2 : 0));
        }
        // Fußgänger auf dem Gehweg
        if (people && rnd() < (size === 'dorf' ? 0.35 : 0.7)) {
          const walk = rnd() < 0.6;
          const nm = walk ? pick(rnd, ['mann_walk', 'frau_walk', 'frau2_walk', 'opa_walk', 'oma_walk', 'kind_walk', 'gassi_walk']) : pick(rnd, ['mann_wave', 'frau_wave', 'kind_wave', 'fan_wave', 'polizei_wave', 'markt_wave']);
          const pu = u + 16 + rnd() * 4;
          if (!onSquare(pu) && pu < len - 2) {
            const ry = walk ? (rnd() < 0.5 ? 0 : Math.PI) : toRoad(side);
            add(nm, sx(side, STREET.strip + 0.8 + rnd() * 1.2), top, -pu, ry);
            if (nm === 'gassi_walk') add('dog', sx(side, STREET.strip + 1.4), top, -pu + (ry === 0 ? -0.6 : 0.6), ry);
          }
        }
      }
      u += 28 + rnd() * 4;
    }
  }
  // Ortsschild und Ortsende mit dem Namen, den auch das Navi zeigt (opts.signName vom Straßenbau, sonst dieselbe Kürzung wie
  // shortName in src/game/navi.js: bis zur ersten Klammer, zum ersten Komma oder Gedankenstrich, höchstens 24 Zeichen)
  const sign = opts.signName ?? signName(plan.place.name);
  plan.signName = sign;
  plan.texts.push({ name: 'townSign', x: sx(1, 0.9), y: top, z: -8, ry: 0, text: sign });
  plan.texts.push({ name: 'townExit', x: sx(1, 0.9), y: top, z: -(len - 8), ry: 0, text: sign, next: opts.nextName ?? '' });
  add('bollards3', sx(1, 1.0), top, -(uc - S / 2 - 2), Math.PI / 2);

  // --- 6. Sichtlinien zum Brunnen freiräumen (Regel, nicht Zufall), und im Becken steht nichts --------------------
  plan.fountains = fountains;
  const boxes = plan.items.filter((it) => it.fountain !== undefined).map((it) => aabb(it.fp));
  plan.items = plan.items.filter((it) => it.fountain !== undefined || it.fp.h <= STREET.top + 0.01 || boxes.every((b) => !touches(b, aabb(it.fp))));
  for (const f of fountains) {
    const drop = new Set(sightBlockers(plan, f));
    if (drop.size) plan.items = plan.items.filter((_, i) => !drop.has(i));
  }
  plan.layout = townLayout(plan, infoOf);
  return plan;
}

const r1 = (v) => Math.round(v * 100) / 100;
const HOUSE_KINDS = new Set(['village', 'shop', 'town', 'city', 'region']);

/**
 * Lageplan eines geplanten Orts für das Navi: reine Daten, gerundet auf 1 cm, für denselben Ort immer gleich. Alles im
 * Rahmen des Ortsabschnitts wie plan.items: x seitlich wie im Straßenprofil „stadt“ (rechts +), z = −u (u = Meter ab
 * Ortsbeginn). buildTown baut genau das; tools/citykit-test.mjs prüft es an den gebauten Meshes nach.
 * - streets: [{ id, kind, width, pts: [[x, z], …], lanes: [x eigene Spur, x Gegenspur] }]: die Ortsdurchfahrt zwischen
 *   den Bordsteinen (der Ort hat keine Querstraßen, nur Lücken zwischen den Häusern)
 * - walks: Gehwege [{ side, x0, x1, z0, z1 }] (Bordstein bis Häuserflucht)
 * - squares: Plätze [{ kind ('main' | 'extra'), side, x0, x1, z0, z1, fountain }]
 * - fountains: [{ id, kind, x, z, r, goal }]
 * - name: Name auf Ortsschild und Ortsende (wie im Navi), signs: [{ kind ('townSign' | 'townExit'), x, z, text }]
 * - goal: Zielplatz { x, z (Mitte des Hauptbrunnens: die Stecknadel), kind, square (Index in squares) }
 * - buildings: Häuser und Türme [[x0, x1, z0, z1, h], …]; landmarks: gesetzte Wahrzeichen [{ name, slot, x0, x1, z0, z1, h }]
 */
export function townLayout(plan, infoOf) {
  const box = (fp) => aabb(fp).map(r1);
  const sideX = (side, d0, d1) => (side > 0 ? [STREET.curbR + d0, STREET.curbR + d1] : [STREET.curbL - d1, STREET.curbL - d0]);
  const walks = [1, -1].map((side) => {
    const tiles = plan.items.filter((it) => (it.name === 'pavement' || it.name === 'pavement4') && Math.sign(it.x - (STREET.curbL + STREET.curbR) / 2) === side);
    const z0 = Math.min(...tiles.map((it) => it.fp.cz - it.fp.hw));
    const z1 = Math.max(...tiles.map((it) => it.fp.cz + it.fp.hw));
    const [x0, x1] = sideX(side, 0, STREET.pave);
    return { side, x0: r1(x0), x1: r1(x1), z0: r1(z0), z1: r1(z1) };
  });
  const squares = plan.squares.map((q) => {
    const [x0, x1] = sideX(q.side, q.d0, q.d1);
    const f = plan.fountains.find((ff) => Math.sign(ff.x - (STREET.curbL + STREET.curbR) / 2) === q.side && -ff.z > q.u0 && -ff.z < q.u1);
    return { kind: q.kind, side: q.side, x0: r1(x0), x1: r1(x1), z0: r1(-q.u1), z1: r1(-q.u0), fountain: f ? f.id : null };
  });
  const fountains = plan.fountains.map((f) => ({ id: f.id, kind: f.kind, x: r1(f.x), z: r1(f.z), r: r1(f.r), goal: f.goal }));
  const main = plan.fountains[0];
  const buildings = [];
  const landmarks = [];
  for (const it of plan.items) {
    const info = infoOf(it.name);
    if (info.kind === 'landmark') {
      const m = plan.landmarks.find((l) => l.name === it.name && l.placed);
      const [x0, x1, z0, z1] = box(it.fp);
      landmarks.push({ name: it.name, slot: m ? m.slot : 'skyline', x0, x1, z0, z1, h: r1(info.h) });
    } else if (HOUSE_KINDS.has(info.kind) && !info.centre && info.h > 2) buildings.push([...box(it.fp), r1(info.h)]);
  }
  const xc = (STREET.curbL + STREET.curbR) / 2;
  return {
    len: plan.len,
    name: plan.signName,
    signs: plan.texts.map((t) => ({ kind: t.name, x: r1(t.x), z: r1(t.z), text: t.text })),
    streets: [{ id: 'main', kind: 'main', width: r1(STREET.curbR - STREET.curbL), pts: [[r1(xc), 0], [r1(xc), -plan.len]], lanes: [STREET.lane, STREET.other] }],
    walks,
    squares,
    fountains,
    goal: main ? { x: r1(main.x), z: r1(main.z), kind: main.kind, square: 0 } : null,
    buildings,
    landmarks,
  };
}

/**
 * Zielbrunnen: ein Brunnen mit kleinem Platz (Pflaster, Bänke, Blumen, Laternen, Tauben) am Ende einer Straße.
 * Rahmen des Platzes: Brunnen im Ursprung, der Spieler kommt von +z (schaut nach −z). opts = { size | pop, seed,
 * place (Schlüssel, für die beiden Sonderbrunnen), infoOf, people }.
 * Ergebnis: { kind, title, special, S, items (im Rahmen des Platzes), cam: { pos, look } }.
 */
export function planGoal(opts = {}) {
  const infoOf = opts.infoOf;
  const size = opts.size ?? sizeOf(opts.pop ?? 0);
  const rnd = rng(opts.seed ?? hashKey(String(opts.place ?? 'Ziel')));
  const top = STREET.top;
  const special = SPECIAL[opts.place];
  const GOAL = { dorf: ['fountainTrough', 'fountainMarket', 'fountainWall'], klein: ['fountainMarket', 'fountainBowls', 'fountainTrough'], stadt: ['fountainBowls', 'fountainJets', 'fountainPond'], gross: ['fountainGrand', 'fountainJets', 'fountainBowls'] };
  const kind = opts.kind ?? special ?? pick(rnd, GOAL[size]);
  const info = infoOf(kind);
  const r = info.r ?? info.w / 2;
  const S = Math.max(16, Math.ceil((2 * r + 8) / 8) * 8);
  const items = [];
  const add = (name, x, y, z, ry, o = {}) => {
    const i2 = infoOf(name);
    const it = { name, x, y, z, ry, ...o };
    if (o.tint === undefined && i2.tints && i2.tints.length > 1) it.tint = pick(rnd, i2.tints);
    it.fp = footprint(it, i2);
    items.push(it);
    return it;
  };
  for (let x = -S / 2 + 4; x < S / 2; x += 8) for (let z = -S / 2 + 4; z < S / 2; z += 8) add('plaza', x, 0, z, 0);
  // Der Wandbrunnen bringt seine Mauer mit; er rückt nach hinten, damit vor ihm Platz bleibt
  const fz = info.wall ? -1.5 : 0;
  add(kind, 0, top, fz, 0, { fountain: 0 });
  const a = Math.max(r + 1.6, 3.2);
  add('bench', -a, top, 0.4, Math.PI / 2);
  add('bench', a, top, 0.4, -Math.PI / 2);
  for (const sx of [-1, 1]) {
    add('flowerTub', sx * (S / 2 - 1.2), top, S / 2 - 1.2, 0);
    add('lampOld', sx * (S / 2 - 1.0), top, -(S / 2 - 1.0), 0);
    add('flowerBed', sx * (S / 2 - 2.4), top, -(S / 2 - 2.4), 0);
  }
  if (r < 5) add(pick(rnd, ['streetTree', 'streetTree2']), 0, top, -(S / 2 - 2.2), rnd() * 6);
  // Tauben links vorn (rechts vorn steht die Kamera der Nahaufnahme)
  for (let i = 0; i < 3; i++) add(i === 1 ? 'pigeonPeck' : 'pigeon', -1.2 - rnd() * 1.4, top, r + 0.6 + rnd() * 1.2, rnd() * 6.28);
  if (opts.people !== false) {
    add('oma_sit', -a, top + 0.03, 0.4, Math.PI / 2);
    add(pick(rnd, ['fan_signHallo', 'fan2_signDanke', 'fan_cheer']), a + 1.6, top, -1.2, -Math.PI / 2 - 0.4);
  }
  const cam = info.cam ? { pos: [info.cam.pos[0], top + info.cam.pos[1], fz + info.cam.pos[2]], look: [info.cam.look[0], top + info.cam.look[1], fz + info.cam.look[2]] } : null;
  // Lageplan im Rahmen des Platzes: Pflaster S × S um den Ursprung, Stecknadel auf der Brunnenmitte
  const layout = { squares: [{ kind: 'goal', x0: -S / 2, x1: S / 2, z0: -S / 2, z1: S / 2 }], goal: { x: 0, z: fz, kind, square: 0 } };
  return { kind, title: info.title, special: info.special ?? null, r, S, items, cam, fz, layout };
}

// --- Rastanlage (Autobahn-Tanke) ----------------------------------------------------------------------------------
// Rahmen wie bei einem Ort: x seitlich wie im Profil „rampe“ (eigene Spur x = 9,0, rechts +), z = −u, u = Meter ab
// Beginn der Anlage. Die Zufahrt (Einbahn, Asphalt x 6 … 12) läuft gerade von (9, 0) bis (9, −len): dort schließen
// Ausfahrt (Verzögerungsstreifen, Rampe) und Einfahrt (Beschleunigungsstreifen) des Straßenbaus an; die Schleife
// Autobahn → Zufahrt → Autobahn entsteht so aus drei Abschnitten. Rechts der Zufahrt in Fahrtrichtung: Tafel, Mast,
// Tankdach mit Vorplatz und Lkw-Hof dahinter, Ladepark mit Picknickwiese, Raststätte mit Parkplätzen, am Ende eine
// Wiese; links ein Baumgürtel zur Autobahn hin, rechts hinten ein zweiter. Die Anlage bringt ihren Boden mit: Rasen
// in Mähstreifen bei y = lawn, alle Fahr- und Gehflächen bei y = pave (die Zufahrt sinkt an beiden Enden auf 0).
export const REST = { len: 180, lane: 9.0, road: [6.0, 12.0], x0: -10, x1: 76, lawn: 0.03, pave: 0.05, ramp: 6, stripe: 6 };

/**
 * Plant eine Rastanlage. opts = { name (Ort, nach dem sie heißt), seed, infoOf, people }. Ergebnis: { name, title, len,
 * items, texts, ground, park, layout }; items wie bei planTown ({ name, x, y, z, ry, tint?, fp }), ground die Flächen
 * für den Boden (rest_ground in rest.js), park die Ladebuchten mit Heldenbucht, Haltepunkt und Kamera.
 */
export function planRest(opts = {}) {
  const infoOf = opts.infoOf;
  const title = opts.title ?? `Rastanlage ${signName(opts.name ?? 'Kirchheim')}`;
  const rnd = rng(opts.seed ?? hashKey(title));
  const { len, lawn, pave } = REST;
  const [r0, r1] = REST.road;
  const items = [];
  const add = (name, x, y, z, ry, o = {}) => {
    const info = infoOf(name);
    const it = { name, x, y, z, ry, ...o };
    if (o.tint === undefined && info.tints && info.tints.length > 1) it.tint = pick(rnd, info.tints);
    it.fp = footprint(it, info);
    items.push(it);
    return it;
  };
  // Drehung, die die Vorderseite (+z) eines Bausteins zur Zufahrt (−x) dreht; seine +x-Achse zeigt dann nach +z
  const FACE_ROAD = -Math.PI / 2;
  // Ort eines Punkts (lx, lz) im Rahmen eines zur Zufahrt gedrehten Bausteins mit Ursprung (x0, z0)
  const toRoad = (x0, z0, lx, lz) => [x0 - lz, z0 + lx];
  const paved = [];
  const pave2 = (kind, x0, x1, u0, u1) => paved.push({ kind, x0, x1, z0: -u1, z1: -u0 });
  const marks = [];

  // Zufahrt mit Randlinien und Pfeilen
  paved.push({ kind: 'road', x0: r0, x1: r1, z0: -len, z1: 0 });
  marks.push({ kind: 'line', x0: r0 + 0.15, x1: r0 + 0.3, z0: -len + 2, z1: -2 });
  for (const u of [24, 100, 160]) marks.push({ kind: 'arrow', x: REST.lane, z: -u, ry: 0 });

  // 1. Tafel und Mast an der Einfahrt
  add('autobahn_schild', 14.4, lawn, -5, 0);
  const pylon = add('preis_pylon', 17, lawn, -13, 0);

  // 2. Tankdach mit Vorplatz, dahinter der Lkw-Hof (Reihen längs, Fahrerhaus in Fahrtrichtung)
  const canU = 32;
  const canopy = add('rasthof_canopy', 14.5, 0, -canU, FACE_ROAD);
  pave2('yard', r1, 38, 10, 56);
  const lorryX = [42.5, 49.5, 56.5, 63.5];
  const lorryU = [23, 41.5, 64];
  pave2('yard', 38, 68, 10, 76);
  const lorries = [];
  lorryX.forEach((x, i) => lorryU.forEach((u, j) => {
    // einige Plätze bleiben frei, sonst wirkt der Hof wie ein Lager
    if ((i * 3 + j) % 4 === 3) return;
    add('lkw_stehend', x, pave, -u, Math.PI);
    lorries.push([x, -u, Math.PI]);
  }));
  for (const x of [39, 46, 53, 60, 67]) marks.push({ kind: 'line', x0: x - 0.06, x1: x + 0.06, z0: -73, z1: -13 });
  // Autos an den Zapfsäulen (die Inseln liegen bei x 18,5 und 26,5)
  add('carCompact', 22.5, pave, -26, Math.PI);
  add('carSmall', 22.5, pave, -41, Math.PI);
  add('carVan', 16.3, pave, -35.5, Math.PI);

  // 3. Ladepark: Vorderkante an der Zufahrt, Buchten quer (Bug nach +x), Säulen am Bug
  const parkU = 67;
  const park = add('ladepark', r1, 0, -parkU, FACE_ROAD);
  const pi = infoOf('ladepark');
  const bays = pi.bays.map(([bx, bz], i) => {
    const [x, z] = toRoad(r1, -parkU, bx, bz);
    return { id: i, x, z, ry: -Math.PI / 2 };
  });
  const posts = pi.posts.map(([px, pz, top, kind]) => {
    const [x, z] = toRoad(r1, -parkU, px, pz);
    return { x, y: top, z, kind };
  });
  // Geparkte E-Autos (rückwärts eingeparkt); Bucht 1 bis 4 bleibt frei (Heldenbucht 3, die Kamera steht in Bucht 4)
  for (const i of [0, 5, 7]) {
    const b = bays[i];
    add(pick(rnd, ['carCompact', 'carSmall']), b.x + 0.2, 0.05, b.z, Math.PI / 2);
    b.free = false;
  }
  for (const b of bays) b.free = b.free ?? true;
  const hero = bays[pi.hero];
  const post = posts[pi.heroPost];
  // Haltepunkt: Mitte der Heldenbucht, rückwärts eingeparkt (Bug zur Zufahrt, −x): die Säule steht dann an der linken
  // hinteren Ecke des Autos, an der Ladeklappe. Auf ihrem Poller steht der Popcorn-Eimer.
  const stop = { x: hero.x, y: pi.ground, z: hero.z, ry: Math.PI / 2 };
  const P = (lx, lz) => toRoad(r1, -parkU, lx, lz);
  const postX = pi.posts[pi.heroPost][0];
  const [pcx, pcz] = P(pi.popcorn[0], pi.popcorn[2]);
  const popcorn = [pcx, pi.popcorn[1], pcz];
  if (opts.popcorn !== false) add('popcorn_eimer', pcx, pi.popcorn[1], pcz, 0.4);
  // Nahaufnahme aus gut 3 m in 1,2 m Höhe: die Kamera steht in der freien Nachbarbucht, Blick schräg auf Säule, Eimer
  // und das Heck des Autos
  const [ccx, ccz] = P(postX + 1.6, -2.5);
  const [clx, clz] = P(postX - 0.3, -5.0);
  const cam = { pos: [ccx, pi.ground + 1.2, ccz], look: [clx, pi.ground + 0.95, clz] };
  // Picknickwiese hinter dem Ladepark
  for (const [x, u] of [[27, 58.5], [31.5, 66], [27, 73]]) add('picknick', x, lawn, -u, Math.PI / 2);
  for (const [x, u] of [[34.5, 59], [34, 75], [25, 79]]) add(pick(rnd, ['parkTree', 'parkTree2']), x, lawn, -u, rnd() * 6.28);
  add('bin', 24.5, lawn, -63.2, FACE_ROAD);

  // 4. Raststätte mit Vorplatz: Parkbuchten an der Zufahrt, Gehweg vor der Glasfront
  const shopU = 110.5;
  const shopX = 21;
  const shop = add('rasthof_pavilion', shopX, 0, -shopU, FACE_ROAD);
  const si = infoOf('rasthof_pavilion');
  pave2('yard', r1, 17, 80, 141);
  // Gehweg bis an die Glasfront (5 m hinter der Vorderkante des Bausteins, unter dem Vordach)
  pave2('walk', 17, shopX + 5, 80, 141);
  for (let u = 84; u <= 137.01; u += 2.6) marks.push({ kind: 'line', x0: r1 + 0.3, x1: 16.8, z0: -u - 0.06, z1: -u + 0.06 });
  let k = 0;
  for (let u = 85.3; u < 137; u += 2.6, k++) {
    if (k % 3 === 1 || rnd() < 0.3) continue;
    add(pick(rnd, ['carSmall', 'carCompact', 'carCompact', 'carVan']), 14.6, pave, -u, Math.PI / 2);
  }
  const [dx, dz] = toRoad(shopX, -shopU, si.door[0], si.door[1]);
  for (const du of [-8, 8]) add('bench', 18.2, pave, dz + du, Math.PI / 2);
  add('bin', 18.0, pave, dz - 5, Math.PI / 2);
  add('flowerTub', 18.2, pave, dz + 4.5, 0);
  add('flowerTub', 18.2, pave, dz - 3.5, 0);
  if (opts.people !== false) {
    add('mann_walk', 19.3, pave, dz + 11, 0);
    add(pick(rnd, ['frau_wave', 'kind_wave']), 19.0, pave, dz - 7, Math.PI / 2);
  }

  // 5. Wiese am Ende mit Picknick, Bäumen und einer Bank; Bäume hinter der Raststätte
  for (const [x, u] of [[19, 152], [26, 160], [19, 168]]) add('picknick', x, lawn, -u, rnd() * 0.4 - 0.2);
  for (const [x, u] of [[29.5, 150], [15.5, 160], [31, 171], [42, 156], [54, 148], [58, 166], [46, 174]]) add(pick(rnd, ['parkTree', 'parkTree2']), x, lawn, -u, rnd() * 6.28);
  for (const [x, u] of [[55, 90], [62, 104], [56, 120], [63, 134]]) add(pick(rnd, ['parkTree', 'parkTree2']), x, lawn, -u, rnd() * 6.28);

  // 6. Laternen an der Zufahrt (Arm über die Fahrbahn), wo nichts im Weg steht
  for (const u of [8, 57, 82, 143, 174]) add('lampModern', r1 + 0.5, u < 10 ? lawn : pave, -u, FACE_ROAD);
  for (const u of [20, 60, 100, 140]) add('lampModern', r0 - 0.5, lawn, -u, Math.PI / 2);

  // 7. Baumgürtel: links zur Autobahn (zwei versetzte Reihen), rechts hinten eine Reihe Fichten
  for (let u = 4; u <= len - 4; u += 8) {
    add('spruce', -7, lawn, -u, rnd() * 6.28);
    add(pick(rnd, ['parkTree', 'parkTree2']), -1.6, lawn, -(u + 4), rnd() * 6.28);
  }
  for (let u = 8; u <= len - 8; u += 9) add('spruce', 72, lawn, -u, rnd() * 6.28);

  // Boden: Rasen ringsum, dazu die Flächen in Gehhöhe
  const ground = { base: [REST.x0, REST.x1, -len, 0], lawn, pave, stripe: REST.stripe, ramp: REST.ramp, paved, marks, holes: [] };
  // unter dem Ladepark liegt sein eigener Boden: dort kein Rasen
  const pk = aabb(park.fp);
  ground.holes.push({ x0: pk[0], x1: Math.min(pk[1], r1 + pi.groundD), z0: pk[2], z1: pk[3] });

  const box = (fp) => aabb(fp).map(r1c);
  const shopBox = box(shop.fp);
  const parkBox = box(park.fp);
  const layout = {
    len,
    name: title,
    streets: [{ id: 'schleife', kind: 'loop', width: r1 - r0, pts: [[REST.lane, 0], [REST.lane, -len]], lanes: [REST.lane] }],
    entry: [REST.lane, 0],
    exit: [REST.lane, -len],
    paved: paved.filter((p) => p.kind !== 'road').map((p) => ({ kind: p.kind, x0: r1c(p.x0), x1: r1c(p.x1), z0: r1c(p.z0), z1: r1c(p.z1) })),
    park: { x0: parkBox[0], x1: parkBox[1], z0: parkBox[2], z1: parkBox[3], bays: bays.map((b) => ({ id: b.id, x: r1c(b.x), z: r1c(b.z), free: b.free })), hero: hero.id },
    stop: { x: r1c(stop.x), z: r1c(stop.z), ry: stop.ry },
    post: [r1c(post.x), r1c(post.y), r1c(post.z)],
    shop: { x0: shopBox[0], x1: shopBox[1], z0: shopBox[2], z1: shopBox[3], door: [r1c(dx), r1c(dz)], name: si.name },
    canopy: box(canopy.fp),
    pylon: [r1c(pylon.x), r1c(pylon.z)],
    lorries,
    buildings: [shopBox.concat(r1c(si.h)), box(canopy.fp).concat(r1c(infoOf('rasthof_canopy').h))],
  };
  return { name: opts.name ?? null, title, len, items, texts: [{ name: 'autobahn_schild', at: 0, title }], ground, park: { bays, posts, hero: hero.id, stop, cam, post, popcorn }, layout };
}
const r1c = (v) => Math.round(v * 100) / 100;
