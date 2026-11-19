// Das Navi im Mittelbildschirm (nur „Navi ferngesteuert XXL“), in Fahrtrichtung und schräg von oben wie das Navi im
// Lkw-Spiel: weit weg von der nächsten Handlung die echte Karte (Straßen, Orte, Route), nah an ihr und abseits der
// Autobahn die Nahansicht – die Straße so, wie die Welt sie baut (roadahead.js, COMMON.md §9), mit ihren echten
// Querschnitten (Fahrbahnen, Mittelstreifen, Leitlinien); beide liegen auf demselben Boden, blenden mit gleichem Kurs
// und Maßstab über und gehen zum Horizont hin in Dunst über. Darüber die Ansage (Pfeil, Entfernung in Metern der Fahrt,
// Schildtext, Spurhinweis), unten das Ziel mit Kartenkilometern und Ankunft in der Uhr des Spiels, ein schmaler Streifen
// mit der ganzen Route und den Orten darauf und wie gewohnt der Bieter mit seinem Gebot. Überfahrten hüpfen, ein neues
// Ziel zeichnet seine Route ein.
//
// Zeichnet in einen Ausschnitt der Leinwand von CenterScreen (src/cockpit/screen.js), etwa 15-mal je Sekunde. Die
// statischen Ebenen der Karte kommen aus dem Zwischenspeicher des Zeichners (MapPainter.drawTilted: WebGL legt ihn
// schräg; ohne WebGL flach mit drawRotated); je Bild entstehen nur Route, gefahrener Weg, Namen, Schilder, Auto, die
// Nahansicht und die Karten darüber. Boden: Persp/TiltView/ribbon aus persp.js.
import {
  MapPainter, View, THEMES, PLACE_BY_INDEX, visiblePlaces, bucketOf, bucketScale, dotRadius, isCity, placeLabels,
  netData, kmPerUnit, countryColor,
} from './mapview.js';
import { roadAhead, closeScene, curvePoint } from './roadahead.js';
import { Persp, TiltView, ribbon } from './persp.js';
import { places } from './graph.js';
import { fmtMeters, fmtKm } from './navroute.js';
import { FONT, TRANSIT_COLOR, rrect, fit, drawTurnIcon, drawTransitShape, drawCar, drawShield, drawFlag, drawHeart } from './symbols.js';

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Farben der Karten über der Karte (wie im klassischen Bildschirm, etwas deckender: keine Ortspunkte scheinen durch). */
const CARD = { light: 'rgba(32,34,38,0.96)', dark: 'rgba(10,11,13,0.96)' };
/** Spielminuten je echter Minute, wenn st.nav.timeScale fehlt (die klassische Uhr läuft 30-mal so schnell). */
export const CLOCK_SCALE = 30;
/** Ansagen, die eine Stelle auf dem Weg meinen (Überfahrten). */
const TRANSIT_TURN = { faehre: true, zug: true, flug: true };
/** So weit voraus (m) liefert der Verlauf der Welt die Straße (course.preview: höchstens 401 Punkte alle 10 m). */
const AHEAD_MAX = 4000;
/**
 * Kamera: Neigung und Brennweite (Bildpunkte). Lange Brennweite: der Boden liegt deutlich schräg (am Auto auf cos 50°
 * gestaucht), läuft aber nur sanft zusammen; bis unter die Ansage reicht er gut doppelt so weit wie flach.
 */
export const TILT = (50 * Math.PI) / 180;
export const FOCAL = 760;
/** Dunst zum Horizont: ganz bis Bildzeile FOG_Y[0] (hinter der Ansage), frei ab FOG_Y[1]. */
export const FOG_Y = [150, 202];
const FOG = { light: [220, 230, 238], dark: [18, 24, 33] };
/**
 * Querschnitte der Welt (Paket Engine, VIS/Autobahntextur) relativ zur Linie, die closeScene liefert (MID): Asphalt
 * [a, b], Linien [x, Breite, Strich, Periode] (Strich 0 = durchgezogen). Autobahn: unsere Fahrbahn −8,25…10,5 (vier
 * Spuren, Standstreifen), Mittelstreifen bei −9, die Gegenfahrbahn gespiegelt (2 · −9 − x).
 */
const XS = {
  ab: { a: -28.5, b: 10.5, gaps: [[-9.75, -8.25]], lines: [[-3.75, 0.15, 6, 18], [0, 0.15, 6, 18], [3.75, 0.15, 6, 18], [-7.65, 0.3, 0, 0], [7.65, 0.3, 0, 0], [10.25, 0.2, 0, 0], [-14.25, 0.15, 6, 18], [-18, 0.15, 6, 18], [-21.75, 0.15, 6, 18], [-10.35, 0.3, 0, 0], [-25.65, 0.3, 0, 0], [-28.25, 0.2, 0, 0]] },
  rampe: { a: -2.5, b: 2.5, gaps: [], lines: [[-2.1, 0.25, 0, 0], [2.1, 0.25, 0, 0]] },
  verbindung: { a: -4, b: 4, gaps: [], lines: [[0, 0.15, 6, 18], [-3.6, 0.25, 0, 0], [3.6, 0.25, 0, 0]] },
  land: { a: -4, b: 4, gaps: [], lines: [[0, 0.13, 4, 12], [-3.75, 0.13, 0, 0], [3.75, 0.13, 0, 0]] },
  stadt: { a: -3.475, b: 3.625, gaps: [], lines: [[0, 0.12, 3, 9]] },
};

/** Weißer Knopf mit dem Ausfahrtpfeil: die nächste Handlung auf der Route (k = Größe, 1 am Auto). */
function exitButton(ctx, x, y, T, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.fillStyle = 'rgba(0,0,0,0.16)';
  ctx.beginPath();
  ctx.ellipse(0, 15, 9, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = T.routeCase;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  drawTurnIcon(ctx, 'exit', 0, 0, 20, T.routeCase);
  ctx.restore();
}
/** Die Zielfahne hüpft kurz, wenn ein neues Ziel kommt. */
function flagPop(m) {
  const rv = m.reroute;
  return rv < 2 ? 1 + 0.35 * Math.max(0, Math.sin(clamp((rv - 1.1) / 0.5, 0, 1) * Math.PI)) : 1;
}
/** Lage des Autos im Bild (Anteil der Höhe): knapp über der Zielkarte, der Boden davor zählt. */
const CAR_Y = 0.69;
/** Größe eines aufrechten Zeichens auf dem Boden: mit der Tiefe kleiner, aber immer gut lesbar. */
const upright = (m) => clamp(0.55 + 0.45 * m, 0.78, 1);

/**
 * Das Auto als kleiner schwarzer Pfeil, flach auf dem Boden (c = cos der Neigung staucht ihn), mit etwas Dicke wie ein
 * Spielzeug und einem weichen Hof.
 */
function drawGroundCar(ctx, x, y, size, c, glow) {
  ctx.save();
  ctx.translate(x, y);
  if (glow) {
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.95, size * 0.95 * c, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const k = size / 40;
  const body = (dy) => {
    ctx.beginPath();
    const P = (px, py) => [px * k, py * k * c + dy];
    ctx.moveTo(...P(0, -21));
    ctx.lineTo(...P(13, 13.5));
    ctx.quadraticCurveTo(...P(14.2, 17.4), ...P(10.6, 16.2));
    ctx.lineTo(...P(0, 7));
    ctx.lineTo(...P(-10.6, 16.2));
    ctx.quadraticCurveTo(...P(-14.2, 17.4), ...P(-13, 13.5));
    ctx.closePath();
  };
  const lift = 4 * (1 - c) + 1;
  ctx.lineJoin = 'round';
  // Schatten, Dicke (Seitenwand), weißer Rand, Oberseite mit hellerer rechter Hälfte
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  body(lift + 2);
  ctx.fill();
  body(0);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4.5 * k;
  ctx.save();
  ctx.translate(0, lift);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#0b0c0e';
  for (let d = lift; d > 0; d -= 1) {
    body(d);
    ctx.fill();
  }
  body(-0.5);
  ctx.stroke();
  ctx.fillStyle = '#17181b';
  ctx.fill();
  ctx.fillStyle = '#3a3d44';
  ctx.beginPath();
  ctx.moveTo(0, -21 * k * c - 0.5);
  ctx.lineTo(13 * k, 13.5 * k * c - 0.5);
  ctx.quadraticCurveTo(14.2 * k, 17.4 * k * c - 0.5, 10.6 * k, 16.2 * k * c - 0.5);
  ctx.lineTo(0, 7 * k * c - 0.5);
  ctx.closePath();
  ctx.fill();
  // Mini Adams rote Kappe als Punkt vorn auf dem Pfeil
  ctx.fillStyle = '#e0301e';
  ctx.beginPath();
  ctx.ellipse(0, -2 * k * c - 0.5, 3 * k, 3 * k * c, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Linear auf einem Linienzug [d, X, …] (nach d sortiert): X bei d (außerhalb NaN). */
function xAt(pts, d) {
  const n = pts.length / 2;
  if (n < 2 || d < pts[0] || d > pts[(n - 1) * 2]) return NaN;
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (pts[mid * 2] <= d) lo = mid;
    else hi = mid;
  }
  const d0 = pts[lo * 2];
  const d1 = pts[hi * 2];
  const t = d1 > d0 ? (d - d0) / (d1 - d0) : 0;
  return pts[lo * 2 + 1] + (pts[hi * 2 + 1] - pts[lo * 2 + 1]) * t;
}

/**
 * Das Navi. draw() zeichnet in den Bereich (x0, y0, w, h) der Leinwand; st wie bei CenterScreen.update, dazu
 * st.nav = {model: NavModel, bidder, bid, clockMin, timeScale?, eta?, visible}; step = Sekunden seit dem letzten Bild.
 */
export class NaviScreen {
  constructor() {
    this.painter = new MapPainter({ theme: 'light', look: 'navi' });
    this.view = new View();
    this.cam = new Persp();
    this.tv = new TiltView(this.view, this.cam);
    this.tilt = undefined; // schräge Sicht möglich (WebGL)? Beim ersten Bild geprüft
    this.logK = Math.log(12);
    this.logQ = Math.log(0.17); // Maßstab der Nahansicht: Bildpunkte je Meter der Fahrt (am Auto)
    this.kmPerM0 = 0; // Stauchung der letzten Straße (Kartenkilometer je Meter der Fahrt)
    this.budget = 3; // ms je Bild für die nächsten Kartenausschnitte (mindestens ein Stück)
    this.closeW = 0; // 0 = Karte, 1 = Nahansicht (dazwischen blenden beide über)
    this.closeOn = false;
    this.prev = new Map(); // Lage der Namen vom letzten Bild
    this.progress = { target: -1, km: 0 }; // Kilometer zum Ziel, als es kam (Streifen unten)
    this.t = 0;
    this.stats = { ms: 0, n: 0, total: 0, max: 0 };
  }

  /** Zielmaßstab in Bildpunkten je Kilometer, je nach Lage und nächster Handlung. */
  targetK(m, ins, h) {
    const kind = m.pose.kind;
    const hop = m.hop ? m.hopPose() : null;
    if (hop) return this.hopK((hop.a1 - hop.a0) * kmPerUnit(m.pose.y));
    if (kind === 'stadt') return 150;
    if (kind === 'zub' || kind === 'term') return 95;
    if (kind === 'ramp' || kind === 'auf' || kind === 'conn') return 80;
    const base = kind === 'land' ? 26 : 9;
    if (ins.turn === 'exit' || ins.turn === 'arrive' || ins.turn === 'faehre' || ins.turn === 'zug' || ins.turn === 'flug') {
      if (isFinite(ins.km) && ins.km > 0) return clamp(150 / Math.max(ins.km, 0.4), base, 110);
    }
    return base;
  }

  /** Maßstab einer Überfahrt von km Kartenkilometern: sie liegt ganz zwischen Auto und Ansage. */
  hopK(km) {
    return clamp(this.cam.depthAtY(232) / Math.max(km, 1), 0.05, 40);
  }

  /**
   * Maßstab (Bildpunkte je Kartenkilometer), auf den die Karte als Nächstes hinauszoomt: der Reisemaßstab der Straße,
   * vor und während einer Überfahrt ihr Maßstab. Der Kartenzeichner hält dafür eine Reserve bereit.
   */
  reserveK(m, ins, kT, hop) {
    if (hop) return kT;
    let k = Math.min(kT, m.trip.section.kind === 'land' ? 26 : 9);
    const R = m.route;
    if (R && TRANSIT_TURN[ins.turn]) {
      const a0 = m.routeA();
      const mp = R.line.map.find((q) => q.kind === 'transit' && q.a1 > a0);
      if (mp) k = Math.min(k, this.hopK((mp.a1 - mp.a0) * kmPerUnit(m.pose.y)));
    }
    return k;
  }

  /**
   * Zielmaßstab der Nahansicht in Bildpunkten je Meter der Fahrt (am Auto): die nächste Handlung rückt bis knapp
   * unter die Ansage; auf Autobahn und Landstraße ohne Handlung im Maßstab der Karte (kT Bildpunkte je Kartenkilometer
   * über kmPerM), mit Handlung höchstens bis zu ihm oder 0,2 px/m hinaus.
   */
  targetQ(m, ins, h, kT) {
    const sec = m.trip.section;
    // die Stelle der Handlung knapp unter der Ansage, damit man sieht, wie der Weg dort abgeht: die Marke einer
    // Ausfahrt (am Ende der Sperrfläche) oder eines Terminals gut 20 px darunter, die Zielfahne mit ihrem ganzen Mast
    const room = this.cam.depthAtY(ins.turn === 'arrive' ? 268 : 244);
    const fitQ = (d) => room / Math.max(d + 60, 1);
    const act = ins.dist > 0 && (ins.turn === 'exit' || ins.turn === 'arrive' || TRANSIT_TURN[ins.turn]);
    if (sec.kind === 'ab' || sec.kind === 'land') {
      const q0 = kT * (sec.kmPerM || 0.02);
      return act ? clamp(fitQ(ins.dist), Math.min(q0, 0.2), 1.6) : q0;
    }
    if (sec.kind === 'stadt') return act && ins.turn === 'arrive' ? clamp(fitQ(ins.dist), 0.25, 1.6) : 0.7;
    if (sec.kind === 'term') return 0.8;
    return act && ins.dist < 1200 ? clamp(fitQ(ins.dist), 0.25, 1.6) : 0.5;
  }

  draw(ctx, x0, y0, w, h, st, step = 1 / 15) {
    const t0 = performance.now();
    const nav = st.nav;
    const m = nav.model;
    const dt = clamp(step, 0, 0.5);
    this.t += dt;
    const theme = st.dark ? 'dark' : 'light';
    const T = THEMES[theme];
    this.painter.setTheme(theme);
    const ins = m.instruction();
    const hop = m.hopPose();
    const pose = hop || m.pose;
    const trip = m.trip;
    const sec = trip.section;
    const onRoad = sec.kind === 'ab' || sec.kind === 'land';
    const kmPerM = onRoad ? sec.kmPerM : 0;
    const ox = w / 2;
    const oy = h * CAR_Y;
    // schräg nur mit WebGL (die Karte braucht es); sonst alles flach wie von oben
    if (this.tilt === undefined) this.tilt = this.painter.canTilt();
    const cam = this.cam.set(ox, oy, this.tilt ? TILT : 0, FOCAL);

    // Nahansicht (die Straße, wie die Welt sie baut) nah an der nächsten Handlung und abseits von Autobahn und
    // Landstraße, sonst die Karte; beim Wechsel blenden beide über, Kurs und Lage des Autos bleiben dieselben
    const act = ins.dist > 0 && (ins.turn === 'exit' || ins.turn === 'arrive' || TRANSIT_TURN[ins.turn]);
    const near = !hop && (!onRoad || (act && ins.dist < (this.closeOn ? 2600 : 2200)));
    // Maßstäbe: Karte k (Bildpunkte je Kartenkilometer), Nahansicht q (je Meter der Fahrt); der gerade nicht gezeigte
    // läuft über kmPerM des Abschnitts mit, damit der Wechsel ohne Sprung geht
    const kT = this.targetK(m, ins, h);
    const follow = (cur, target, rate) => cur + (target - cur) * (1 - Math.exp(-dt * rate));
    if (kmPerM > 0) this.kmPerM0 = kmPerM;
    if (near) {
      if (!this.closeOn && kmPerM > 0) this.logQ = this.logK + Math.log(kmPerM);
      this.logQ = follow(this.logQ, Math.log(this.targetQ(m, ins, h, kT)), 1.1);
      // abseits der Straßen mit der Stauchung der letzten: so liegt die Karte, die im Voraus entsteht, nah an dem
      // Maßstab, mit dem sie zurückkommt
      const kpm = kmPerM || this.kmPerM0;
      if (kpm > 0) this.logK = this.logQ - Math.log(kpm);
    } else {
      if (this.closeOn && kmPerM > 0) this.logK = this.logQ - Math.log(kmPerM);
      this.logK = follow(this.logK, Math.log(kT), hop ? 2.5 : 1.1);
      if (kmPerM > 0) this.logQ = this.logK + Math.log(kmPerM);
    }
    this.closeOn = near;
    this.closeW = clamp(this.closeW + (near ? dt : -dt) / 0.9, 0, 1);
    const cw = ease(this.closeW);
    const kNow = Math.exp(this.logK);
    m.chordKm = 40 / kNow;
    // sichtbarer Boden in Bezugs-Bildpunkten: von unter dem unteren Rand bis in den vollen Dunst
    const flat = cam.k === 0;
    this.gz0 = cam.depthAtY(h + 30);
    this.gz1 = flat ? oy + 60 : cam.depthAtY(FOG_Y[0] - 6);
    // die Linie der Straße voraus (Adapter: ohne Kurven gerade, mit K2 course.preview) samt Kurs im Kartenrahmen
    const qNow = Math.exp(this.logQ);
    const line = roadAhead(trip, trip.s, Math.min(this.gz1 / qNow + 120, AHEAD_MAX));

    ctx.save();
    ctx.translate(x0, y0);
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const v = this.view;
    let close = null;
    // Kartenansicht: Kurs aus dem Weg auf der Karte. So zeigt die Straße der Karte am Auto nach vorn wie die der
    // Nahansicht, und die Übergabe stimmt am Auto. Den Kurs der Welt (psi) nimmt sie nicht: die Welt staucht die Karte
    // und legt ihre Bögen zwischen gerade Ruhezonen, ihr Kurs weicht im Mittel gut 15° von dem der Karte ab.
    const rot = -Math.PI / 2 - Math.atan2(m.pose.dy, m.pose.dx);
    v.set(pose.x, pose.y, kNow * kmPerUnit(pose.y), rot, w, h, ox, oy);
    const reserve = this.reserveK(m, ins, kT, hop) * kmPerUnit(pose.y);
    if (cw < 1) this.drawMapGround(ctx, m, T, theme, hop, reserve);
    else if (this.tilt) {
      // die Karte für ihre Rückkehr vorbereiten: die Reserve immer, den vorderen Ausschnitt abseits von Autobahn und
      // Landstraße (dort kommt die Karte erst nach der Handlung zurück, weit weg von hier)
      this.painter.drawTilted(null, this.tv, { yTop: FOG_Y[0] - 4, reserve, front: !onRoad, budget: this.budget });
    }
    if (cw > 0) {
      ctx.globalAlpha = cw;
      close = this.drawCloseGround(ctx, m, ins, T, theme, w, h, qNow, line);
      ctx.globalAlpha = 1;
    }
    if (!flat) this.drawFog(ctx, w, theme);
    // aufrecht auf dem Boden: Namen, Schilder, Knopf der Handlung, Fahne (je Ansicht mit ihrem Anteil)
    if (cw < 1) {
      ctx.globalAlpha = 1 - cw;
      this.drawMapMarks(ctx, m, ins, T, theme, w, h, hop, nav);
    }
    if (close) {
      ctx.globalAlpha = cw;
      this.drawCloseMarks(ctx, m, T, theme, w, h, close);
    }
    ctx.globalAlpha = 1;
    if (hop) {
      const bounce = Math.sin(hop.f * Math.PI);
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.ellipse(ox, oy + 16, 16 - bounce * 5, (5 - bounce * 1.5) * cam.c, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ox, oy - bounce * 26, 25, 0, Math.PI * 2);
      ctx.fill();
      drawTransitShape(ctx, hop.kind, ox, oy - bounce * 26, 1.05 + bounce * 0.25, TRANSIT_COLOR[hop.kind] || '#4d86c6');
    } else drawGroundCar(ctx, ox, oy, 40, cam.c, theme === 'dark' ? 'rgba(76,141,255,0.24)' : 'rgba(47,111,228,0.17)');

    this.drawBanner(ctx, ins, w, theme, hop);
    this.drawBottom(ctx, m, ins, nav, w, h, theme);
    ctx.restore();

    const ms = performance.now() - t0;
    const S = this.stats;
    S.ms = ms;
    S.n++;
    S.total += ms;
    S.max = Math.max(S.max, ms);
  }

  /** Dunst zum Horizont über allem, was auf dem Boden liegt (gleich in Karte und Nahansicht). */
  drawFog(ctx, w, theme) {
    const [r, g, b] = FOG[theme];
    const c = (a) => `rgba(${r},${g},${b},${a})`;
    const gr = ctx.createLinearGradient(0, FOG_Y[0], 0, FOG_Y[1]);
    // weich wie smoothstep
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      gr.addColorStop(t, c(+(1 - t * t * (3 - 2 * t)).toFixed(3)));
    }
    ctx.fillStyle = c(1);
    ctx.fillRect(0, 0, w, FOG_Y[0]);
    ctx.fillStyle = gr;
    ctx.fillRect(0, FOG_Y[0], w, FOG_Y[1] - FOG_Y[0]);
  }

  /** Kartenlinie (Kartenkoordinaten) → Boden (Bezugs-Bildpunkte vor dem Auto). */
  ground(P) {
    const n = P.length / 2;
    const G = new Float64Array(n * 2);
    const o = [0, 0];
    for (let i = 0; i < n; i++) {
      if (Number.isNaN(P[i * 2])) {
        G[i * 2] = G[i * 2 + 1] = NaN;
        continue;
      }
      this.tv.toGround(P[i * 2], P[i * 2 + 1], o);
      G[i * 2] = o[0];
      G[i * 2 + 1] = o[1];
    }
    return G;
  }
  /** Band auf dem Boden füllen. */
  band(ctx, G, hw, color) {
    ctx.fillStyle = color;
    ctx.fill(ribbon(this.cam, G, hw, this.gz0, this.gz1));
  }

  /** Die Karte auf dem Boden: statische Ebenen, gefahrener Weg, Route. */
  drawMapGround(ctx, m, T, theme, hop, reserve) {
    let ok = false;
    if (this.tilt) {
      const [r, g, b] = FOG[theme];
      ok = this.painter.drawTilted(ctx, this.tv, { fog: [r / 255, g / 255, b / 255], yTop: FOG_Y[0] - 4, reserve, budget: this.budget });
      // WebGL verloren: ab dem nächsten Bild flach (dieses noch mit der flachen Karte unter schrägen Linien)
      if (!ok) this.tilt = false;
    }
    if (!ok) this.painter.drawRotated(ctx, this.view, 1);
    // gefahrener Weg (hinter dem Auto), dann die Route nach vorn
    if (m.trail.length >= 4) {
      const G = this.ground(m.trail);
      this.band(ctx, G, 4.5, T.drivenCase);
      this.band(ctx, G, 3, T.driven);
    }
    this.drawRoute(ctx, m, T, hop);
  }

  /** Aufrecht auf der Karte: Handlungsknopf, Namen und Schilder, Fahne. */
  drawMapMarks(ctx, m, ins, T, theme, w, h, hop, nav) {
    const tv = this.tv;
    const o = [0, 0, 0];
    let markAt = null;
    if (ins.turn === 'exit' && ins.node >= 0 && !hop) {
      const p = m.nodeXY(ins.node);
      tv.toScreen(p.x, p.y, o);
      if (o[2] > 0 && o[0] > -20 && o[0] < w + 20 && o[1] > FOG_Y[1] - 20 && o[1] < h + 20) {
        markAt = [o[0], o[1], upright(o[2])];
        exitButton(ctx, o[0], o[1], T, markAt[2]);
      }
    }
    let flagAt = null;
    if (m.route && m.trip.target >= 0) {
      const P = PLACE_BY_INDEX[m.trip.target];
      tv.toScreen(P.x, P.y, o);
      if (o[2] > 0 && o[0] > -40 && o[0] < w + 40 && o[1] > FOG_Y[1] - 10 && o[1] < h + 50) flagAt = [o[0], o[1], upright(o[2])];
    }
    this.drawLabels(ctx, m, T, w, h, flagAt, markAt, nav.visited);
    if (flagAt) drawFlag(ctx, flagAt[0], flagAt[1], flagPop(m) * flagAt[2], theme === 'dark' ? '#e6e8eb' : '#1d1f22');
  }

  /**
   * Die Nahansicht auf dem Boden: Fahrbahnen mit ihren echten Querschnitten, Route, Orte – genau so, wie die Fahrt sie
   * der Welt vorgibt (closeScene in Fahrtmetern), längs der Linie des Adapters gebogen; q = Bildpunkte je Meter am
   * Auto. Liefert, was drawCloseMarks braucht.
   */
  drawCloseGround(ctx, m, ins, T, theme, w, h, q, line) {
    const trip = m.trip;
    const ahead = Math.min(this.gz1 / q + 80, AHEAD_MAX);
    const sc = closeScene(trip, ahead, Math.min(-this.gz0 / q + 80, 3000), ins);
    const P = [0, 0];
    const cx = sc.carX;
    /** Linienzug [d, X, …] der Szene, seitlich um dx Meter versetzt → Boden. */
    const G = (pts, dx = 0, upTo = Infinity) => {
      const n = pts.length / 2;
      const out = [];
      for (let i = 0; i < n; i++) {
        const d = pts[i * 2];
        if (d > upTo) {
          if (i > 0) {
            const t = (upTo - pts[i * 2 - 2]) / (d - pts[i * 2 - 2]);
            curvePoint(line, upTo, pts[i * 2 - 1] + (pts[i * 2 + 1] - pts[i * 2 - 1]) * t + dx - cx, P);
            out.push(P[0] * q, P[1] * q);
          }
          break;
        }
        curvePoint(line, d, pts[i * 2 + 1] + dx - cx, P);
        out.push(P[0] * q, P[1] * q);
      }
      return out;
    };
    const base = ctx.globalAlpha;
    // Grund: das Land unter dem Auto in der Farbe der Karte
    ctx.fillStyle = countryColor(trip.country, theme);
    ctx.fillRect(0, 0, w, h);
    // Orte: bebaute Fläche längs der Ortsdurchfahrt (von Ortsanfang bis Ortsende), darin die Straßen des Baukastens
    const band = Math.max(75 * q, 18);
    for (const t of sc.towns) {
      if (t.pts.length < 4) continue;
      const g = G(t.pts);
      // weicher Rand: zwei blasse Säume, dann die Fläche mit feiner Kante
      ctx.globalAlpha = base * 0.3;
      this.band(ctx, g, band * 1.45, T.town);
      ctx.globalAlpha = base * 0.55;
      this.band(ctx, g, band * 1.2, T.town);
      ctx.globalAlpha = base;
      this.band(ctx, g, band + 1.2, T.townEdge);
      this.band(ctx, g, band, T.town);
      for (const st of t.streets) this.band(ctx, G(st.pts), Math.max((st.w * q) / 2, 1.5), T.road);
      if (t.square) {
        const g2 = G([t.square.d, t.square.X]);
        const r = Math.max(t.square.r * q, 4);
        const o = this.cam.project(g2[0], g2[1], [0, 0, 0]);
        if (o[2] > 0) {
          ctx.fillStyle = T.road;
          ctx.beginPath();
          ctx.ellipse(o[0], o[1], r * o[2], r * o[2] * this.cam.c * o[2], 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    // Fahrbahnen mit echtem Querschnitt: erst alle Ränder, dann der Asphalt (die Autobahn obenauf), dann die Linien.
    // Ganz klein bleibt jede Straße mindestens so breit wie auf der Karte.
    const lo = -this.gz0 / q;
    const roads = sc.roads.map((r) => {
      const X = XS[r.kind] || XS.land;
      const ab = r.kind === 'ab';
      const minHw = ab ? 5.5 : 3.2;
      const real = ((X.b - X.a) / 2) * q;
      const hw = Math.max(real, minHw);
      const k = hw / real;
      const mid = (X.a + X.b) / 2;
      return { r, ab, X, k, hw, g: G(r.pts, mid), a: (r.role === 'cur' || r.role === 'ahead' ? 1 : 0.8) * r.fade };
    });
    for (const it of roads) {
      ctx.globalAlpha = base * it.a;
      this.band(ctx, it.g, it.hw + 1.8, it.ab ? T.hwyCase : T.roadCase);
    }
    for (const ab of [false, true]) {
      for (const it of roads) {
        if (it.ab !== ab) continue;
        ctx.globalAlpha = base * it.a;
        this.band(ctx, it.g, it.hw, ab ? T.hwy : T.road);
        // Mittelstreifen der Autobahn (nur wenn breit genug, um als Spalt zu lesen)
        if (it.k <= 1.01) {
          for (const [a, b] of it.X.gaps) if ((b - a) * q >= 1.2) this.band(ctx, G(it.r.pts, (a + b) / 2), ((b - a) / 2) * q, T.hwyCase);
        }
      }
    }
    // Leit- und Randlinien, wo die Spuren breit genug sind (Striche fest an der Straße, sie ziehen vorbei)
    if (q >= 0.75) {
      const lineCol = theme === 'dark' ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.92)';
      const lineDark = theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(150,140,125,0.55)';
      const s0 = trip.s;
      for (const it of roads) {
        if (it.k > 1.01) continue;
        ctx.globalAlpha = base * it.a * clamp((q - 0.75) / 0.3, 0, 1);
        const pts = it.r.pts;
        const d0 = Math.max(pts[0], -lo);
        const d1 = Math.min(pts[pts.length - 2], this.gz1 / q);
        const path = new Path2D();
        for (const [x, lw, dash, per] of it.X.lines) {
          const hw = Math.max((lw / 2) * q, 0.55);
          if (!dash) {
            ribbon(this.cam, G(pts, x), hw, this.gz0, this.gz1, path, false);
            continue;
          }
          // Striche: Weltmeter s mit (s mod Periode) < Strich
          const first = Math.floor((s0 + d0) / per) * per - s0;
          for (let a = first; a < d1; a += per) {
            const da = Math.max(a, d0);
            const db = Math.min(a + dash, d1);
            if (db <= da) continue;
            const xa = xAt(pts, da);
            const xb = xAt(pts, db);
            if (Number.isNaN(xa) || Number.isNaN(xb)) continue;
            const seg = G([da, xa, (da + db) / 2, (xa + xb) / 2, db, xb], x);
            ribbon(this.cam, seg, hw, this.gz0, this.gz1, path, false);
          }
        }
        ctx.fillStyle = it.ab ? lineCol : lineDark;
        ctx.fill(path);
      }
    }
    ctx.globalAlpha = base;
    // gefahrener Weg und Route (nach einem neuen Ziel wächst sie vom Auto aus nach vorn); eine Spur breit, wo es geht
    const wRt = clamp(1.9 * q, 3, 6);
    if (sc.trail.length >= 4) {
      const g = G(sc.trail);
      this.band(ctx, g, wRt + 1.5, T.drivenCase);
      this.band(ctx, g, wRt, T.driven);
    }
    if (sc.route.length >= 4) {
      const reach = m.reroute < 1.2 ? ahead * ease(clamp(m.reroute / 1.2, 0, 1)) : Infinity;
      const g = G(sc.route, 0, reach);
      this.band(ctx, g, wRt + 6, T.routeGlow);
      this.band(ctx, g, wRt + 2, T.routeCase);
      this.band(ctx, g, wRt, T.route);
    }
    return { sc, G, q };
  }

  /** Aufrecht in der Nahansicht: Ortsnamen am Ortsanfang, Terminal, angesagte Ausfahrt, Zielpunkt. */
  drawCloseMarks(ctx, m, T, theme, w, h, close) {
    const { sc, G, q } = close;
    const band = Math.max(75 * q, 18);
    const o = [0, 0, 0];
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    for (const mk of sc.marks) {
      const g = G([mk.d, mk.X]);
      if (g.length < 2) continue;
      this.cam.project(g[0], g[1], o);
      if (!(o[2] > 0) || o[1] < FOG_Y[1] - 20 || o[1] > h + 30 || o[0] < -60 || o[0] > w + 60) continue;
      const k = upright(o[2]);
      if (mk.type === 'town') {
        // Name links der Straße, wo das Ortsschild steht (nicht unter Ansage und Karten)
        const name = places[mk.place].name;
        const y = clamp(o[1], FOG_Y[1] + 20, h - 186);
        if (Math.abs(y - o[1]) > 120) continue;
        ctx.font = `700 ${Math.round(21 * k)}px ${FONT}`;
        ctx.textAlign = 'right';
        const x = o[0] - band * o[2] - 10;
        ctx.strokeStyle = T.halo;
        ctx.lineWidth = 5;
        ctx.strokeText(name, x, y);
        ctx.fillStyle = T.text;
        ctx.fillText(name, x, y);
      } else if (mk.type === 'term') {
        ctx.save();
        ctx.translate(o[0], o[1]);
        ctx.scale(k, k);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = T.routeCase;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        drawTransitShape(ctx, mk.transit, 0, 0, 0.85, TRANSIT_COLOR[mk.transit] || '#4d86c6');
        ctx.restore();
      } else if (mk.type === 'exit') exitButton(ctx, o[0], o[1], T, k);
      else if (mk.type === 'pin') drawFlag(ctx, o[0], o[1], flagPop(m) * k, theme === 'dark' ? '#e6e8eb' : '#1d1f22');
    }
    ctx.textAlign = 'left';
  }

  /** Route vom Auto bis zum Ziel: Schein, Rand, Füllung; nach einem neuen Ziel wächst sie vom Auto aus nach vorn. */
  drawRoute(ctx, m, T, hop) {
    const R = m.route;
    if (!R) return;
    const L = R.line;
    const a0 = hop ? Math.max(m.routeA(), hop.a0) : m.routeA();
    if (a0 < 0) return;
    const v = this.view;
    // altes Ziel blendet aus
    if (m.oldRoute && m.reroute < 0.6) {
      const Lo = m.oldRoute.line;
      const ao = Math.min(Lo.aOf(m.trip.s), Lo.len);
      if (ao >= 0) {
        const base = ctx.globalAlpha;
        ctx.globalAlpha = base * (1 - m.reroute / 0.6);
        this.band(ctx, this.ground(Lo.slice(ao, Lo.len)), 3.5, T.route);
        ctx.globalAlpha = base;
      }
    }
    // ein neues Ziel: die Route wächst in gut einer Sekunde vom Auto bis über den Bildrand (dahinter ist sie gleich ganz)
    let a1 = L.len;
    let growing = false;
    if (m.reroute < 1.2) {
      const reach = ((this.gz1 + 200) / v.scale) * ease(clamp(m.reroute / 1.2, 0, 1));
      if (a0 + reach < L.len) {
        a1 = a0 + reach;
        growing = true;
      }
    }
    if (a1 <= a0) return;
    const G = this.ground(L.slice(a0, a1));
    this.band(ctx, G, 11, T.routeGlow);
    this.band(ctx, G, 6.5, T.routeCase);
    this.band(ctx, G, 4.5, T.route);
    // Überfahrten auf der Route gestrichelt in ihrer Farbe
    for (const mp of L.map) {
      if (mp.kind !== 'transit' || mp.a1 < a0) continue;
      const g = this.ground(L.slice(Math.max(mp.a0, a0), Math.min(mp.a1, a1)));
      this.band(ctx, g, 4.5, '#ffffff');
      this.band(ctx, dashes(g, 10, 10), 3.5, T.route);
    }
    // Kopf der wachsenden Route: ein heller Punkt
    if (growing) {
      const o = [0, 0, 0];
      const e = [0, 0];
      L.at(a1, e);
      this.tv.toScreen(e[0], e[1], o);
      if (o[2] > 0) {
        const k = upright(o[2]);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(o[0], o[1], (7 + 4 * Math.sin(m.reroute * 12)) * k, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = T.route;
        ctx.beginPath();
        ctx.arc(o[0], o[1], 5 * k, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /** Ortsnamen und Autobahnschilder, ohne dass sich etwas überdeckt; Karten, Auto, Fahne und Handlungsknopf bleiben frei. */
  drawLabels(ctx, m, T, w, h, flagAt, markAt, visited) {
    const tv = this.tv;
    const v = this.view;
    const b = bucketOf(v.scale);
    const vis = visiblePlaces(b);
    const bs = bucketScale(b);
    const yTop = this.cam.k > 0 ? FOG_Y[1] : 0;
    const [x0, y0, x1, y1] = tv.bounds(40, yTop);
    const o = [0, 0, 0];
    const cands = [];
    const dots = [];
    let n = 0;
    for (const i of vis) {
      const p = PLACE_BY_INDEX[i];
      if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) continue;
      tv.toScreen(p.x, p.y, o);
      if (!(o[2] > 0) || o[1] < yTop - 30 || o[1] > h + 30 || o[0] < -200 || o[0] > w + 200) continue;
      const k = upright(o[2]);
      const city = isCity(p);
      const size = Math.round((city ? 21 : 18) * k);
      const font = `${city ? 700 : 600} ${size}px ${FONT}`;
      ctx.font = font;
      const tw = ctx.measureText(p.name).width;
      const r = dotRadius(p, bs) * 1.3 * o[2];
      dots.push({ x: p.x, y: p.y, r });
      cands.push({ x: p.x, y: p.y, w: tw + 6, h: size + 4, r, key: 'p' + i, text: p.name, font, imp: p.imp + (i === m.trip.target ? 10 : 0) });
      if (++n > 60) break;
    }
    // Schilder: Mitte der Autobahn-Etappen im Bild (die längsten zuerst), höchstens sechs
    const shields = [];
    for (const mk of netData().marks) {
      if (mk.kind !== 'ab' && mk.kind !== 'land') continue;
      if (mk.x < x0 || mk.x > x1 || mk.y < y0 || mk.y > y1) continue;
      if (mk.len * v.scale < 140) continue;
      tv.toScreen(mk.x, mk.y, o);
      if (!(o[2] > 0) || o[1] < yTop) continue;
      shields.push({ x: mk.x, y: mk.y, w: 0, h: Math.round(26 * upright(o[2])), r: 0, key: 's' + mk.edge, text: mk.text, kind: mk.kind, imp: 6.5 });
      if (shields.length >= 6) break;
    }
    for (const s of shields) {
      ctx.font = `700 ${Math.round(s.h * 0.62)}px ${FONT}`;
      s.w = Math.max(s.h * 1.25, ctx.measureText(s.text).width + s.h * 0.55) + 4;
    }
    const all = cands.concat(shields).sort((a, c) => c.imp - a.imp);
    // frei bleiben: Dunst und Ansage oben, Karten unten, Auto, Fahne
    const avoid = [[0, 0, w, Math.max(168, yTop)], [0, h - 168, w, h], [w / 2 - 34, h * CAR_Y - 30, w / 2 + 34, h * CAR_Y + 26]];
    if (flagAt) avoid.push([flagAt[0] - 6 * flagAt[2], flagAt[1] - 40 * flagAt[2], flagAt[0] + 26 * flagAt[2], flagAt[1] + 4]);
    if (markAt) avoid.push([markAt[0] - 16, markAt[1] - 16, markAt[0] + 16, markAt[1] + 16]);
    const placed = placeLabels(tv, all, { dots, avoid, pad: 6, gap: 4, prev: this.prev });
    const prev = new Map();
    for (const L of placed) {
      const c = L.c;
      prev.set(c.key, L.spot);
      if (c.r === 0) {
        drawShield(ctx, c.text, L.x + c.w / 2, L.y + c.h / 2, c.h - 2, c.kind);
        continue;
      }
      ctx.font = c.font;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = T.halo;
      ctx.lineWidth = 5;
      ctx.strokeText(c.text, L.x + 3, L.y + c.h / 2 + 1);
      ctx.fillStyle = T.text;
      ctx.fillText(c.text, L.x + 3, L.y + c.h / 2 + 1);
    }
    this.prev = prev;
    // besuchte Orte: ein Herz statt des Punkts
    if (!visited) return;
    for (const c of cands) {
      const i = +c.key.slice(1);
      if (i === m.trip.target || !(visited[places[i].key] > 0)) continue;
      tv.toScreen(c.x, c.y, o);
      if (o[2] > 0 && o[0] > -10 && o[1] > yTop && o[0] < w + 10 && o[1] < h + 10) drawHeart(ctx, o[0], o[1], (c.r / o[2]) * 1.25 * upright(o[2]), T.heart, '#ffffff');
    }
  }

  /** Ansage oben: Pfeil, Entfernung, Ziel der Handlung, Nebenzeile, Spurhinweis. */
  drawBanner(ctx, ins, w, theme, hop) {
    const x = 14;
    const y = 58;
    const bw = w - 28;
    const bh = 104;
    ctx.fillStyle = CARD[theme];
    rrect(ctx, x, y, bw, bh, 18);
    ctx.fill();
    // Pfeil im Feld links
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    rrect(ctx, x + 10, y + 10, 84, 84, 14);
    ctx.fill();
    drawTurnIcon(ctx, hop ? hop.kind : ins.turn, x + 52, y + 52, 70, '#ffffff');
    const tx = x + 108;
    const right = x + bw - 16;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    let head = ins.head;
    let sub = ins.sub;
    let dist = ins.dist > 0 && ins.turn !== 'none' && ins.turn !== 'straight' && ins.turn !== 'merge' ? fmtMeters(ins.dist) : '';
    if (hop) {
      head = ins.head && ins.turn === hop.kind ? ins.head : { faehre: 'Überfahrt mit der Fähre', zug: 'Mit dem Autozug', flug: 'Im Frachtflieger' }[hop.kind];
      sub = 'Gute Reise – gleich geht es weiter';
      dist = '';
    }
    // Spurpfeile rechts in der zweiten Zeile: der Name der Ausfahrt oben behält die ganze Breite
    let lanesW = 0;
    if (ins.lanes && !hop) lanesW = this.drawLanes(ctx, ins.lanes, right, y + 61);
    ctx.fillStyle = '#ffffff';
    if (dist) {
      ctx.font = `700 40px ${FONT}`;
      ctx.fillText(dist, tx, y + 48);
      const dx = tx + ctx.measureText(dist).width + 16;
      ctx.fillText(shrink(ctx, head, right - dx, 600, 27, 21), dx, y + 47);
    } else ctx.fillText(shrink(ctx, head, right - tx, 700, 30, 22), tx, y + 47);
    ctx.fillStyle = '#c9d6ff';
    ctx.fillText(shrink(ctx, sub || '', right - lanesW - tx, 500, 22, 18), tx, y + 84);
  }

  /**
   * Spurpfeile (rechts in der zweiten Zeile der Ansage): die genutzten Spuren hell, exit = es gibt einen
   * Verzögerungsstreifen. Liefert die belegte Breite.
   */
  drawLanes(ctx, lanes, right, y) {
    const n = lanes.n;
    const lw = 22;
    const x = right - n * lw;
    for (let i = 0; i < n; i++) {
      const use = lanes.use.includes(i);
      ctx.save();
      ctx.globalAlpha = use ? 1 : 0.32;
      const cx = x + i * lw + lw / 2;
      ctx.strokeStyle = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, y + 26);
      if (use) ctx.quadraticCurveTo(cx, y + 10, cx + 7, y + 6);
      else ctx.lineTo(cx, y + 6);
      ctx.stroke();
      ctx.beginPath();
      if (use) {
        ctx.moveTo(cx + 10, y + 3);
        ctx.lineTo(cx + 3, y + 1);
        ctx.lineTo(cx + 6, y + 10);
      } else {
        ctx.moveTo(cx, y);
        ctx.lineTo(cx - 5, y + 7);
        ctx.lineTo(cx + 5, y + 7);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      if (i < n - 1) {
        // vor dem Verzögerungsstreifen (letzte Spur) die breite, unterbrochene Linie wie auf der Fahrbahn
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        if (i === n - 2 && lanes.exit) for (let q = 0; q < 3; q++) ctx.fillRect(x + (i + 1) * lw - 1.25, y + 2 + q * 9, 2.5, 6);
        else ctx.fillRect(x + (i + 1) * lw - 0.75, y + 2, 1.5, 24);
      }
    }
    return n * lw + 12;
  }

  /** Unten: Ziel mit Kilometern und Ankunft, Streifen mit der ganzen Route, darunter der Bieter (wie gewohnt). */
  drawBottom(ctx, m, ins, nav, w, h, theme) {
    const x = 14;
    const bw = w - 28;
    // Bieter (rot, wie im klassischen Spiel)
    const by = h - 64;
    ctx.fillStyle = 'rgba(200,16,46,0.94)';
    rrect(ctx, x, by, bw, 50, 14);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = `700 25px ${FONT}`;
    const bid = nav.bid || '';
    ctx.fillText(bid, x + bw - 16, by + 26);
    const bidW = ctx.measureText(bid).width;
    ctx.textAlign = 'left';
    ctx.font = `700 22px ${FONT}`;
    ctx.fillText(fit(ctx, '📡 Ferngesteuert von ' + (nav.bidder || '—'), bw - bidW - 44), x + 16, by + 26);
    // Ziel und Route
    const cy = h - 160;
    ctx.fillStyle = CARD[theme];
    rrect(ctx, x, cy, bw, 88, 16);
    ctx.fill();
    const trip = m.trip;
    ctx.textBaseline = 'alphabetic';
    if (trip.target < 0 || !m.route) {
      ctx.font = `600 22px ${FONT}`;
      ctx.fillStyle = '#c9d6ff';
      ctx.textAlign = 'left';
      ctx.fillText('⏳ Warte auf das nächste Gebot …', x + 18, cy + 36);
      ctx.font = `500 19px ${FONT}`;
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fillText('Gefahren: ' + fmtKm(trip.km), x + 18, cy + 68);
      return;
    }
    const pl = places[trip.target];
    const km = m.remainingKm(ins);
    // Ankunft in der Uhr des Spiels: guidance().mins sind Minuten Fahrt im angenommenen Tempo, die Uhr läuft timeScale-mal
    // so schnell wie die echte Zeit (klassisch 30; die Integration legt den Maßstab der XXL-Uhr fest, REISE A6)
    const eta = nav.eta || (isFinite(ins.mins) && nav.clockMin !== undefined ? 'Ankunft ' + clock(nav.clockMin + ins.mins * (nav.timeScale ?? CLOCK_SCALE)) : '');
    // Kartenkilometer; kündigt die Ansage schon die Ankunft in den letzten 2 km an, dieselben Meter der Fahrt wie sie
    // (COMMON.md §9.5: ein so naher Ort steht auf keiner Kilometertafel mehr)
    const arriving = ins.turn === 'arrive' && ins.dist > 0 && ins.dist < 2000;
    const right = (arriving ? fmtMeters(ins.dist) : fmtKm(km)) + (eta ? ' · ' + eta : '');
    ctx.font = `600 21px ${FONT}`;
    const rw = ctx.measureText(right).width;
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(right, x + bw - 16, cy + 31);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#c9d6ff';
    // der Name des Ziels wie auf seiner Ortstafel: lange Namen kleiner gesetzt, nie um einen Zusatz gekürzt
    ctx.fillText(shrink(ctx, '🏁 ' + pl.name, bw - rw - 50, 700, 22, 16), x + 16, cy + 31);
    this.drawStrip(ctx, m, x + 18, cy + 68, bw - 36, km);
  }

  /**
   * Der ganze Weg als Streifen: links der Start dieses Ziels, rechts das Ziel, das Auto wandert mit den gefahrenen
   * Kilometern nach rechts (der Weg hinter ihm wird hell); dazwischen die Orte, durch die die Route noch führt.
   */
  drawStrip(ctx, m, x, y, len, km) {
    const R = m.route;
    const a0 = Math.max(m.routeA(), 0);
    const total = Math.max(R.line.len - a0, 1e-9);
    // Fortschritt seit das Ziel kam (wird der Weg länger, wächst der Streifen mit, ohne dass das Auto springt)
    const P = this.progress;
    if (P.target !== m.trip.target || !(P.km > 0)) {
      P.target = m.trip.target;
      P.km = Math.max(km, 1e-6);
    } else if (km > P.km) P.km = km;
    const f = clamp(1 - km / P.km, 0, 1);
    const cx = x + 10 + (len - 20) * f;
    ctx.lineCap = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(255,255,255,0.32)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(cx, y);
    ctx.stroke();
    ctx.strokeStyle = '#4c8dff';
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();
    // Orte: wichtige zuerst, mit Abstand, damit sich die Namen nicht berühren
    const stops = R.stops.filter((q) => q.a > a0 + total * 0.02 && q.place !== R.dest);
    stops.sort((p, q) => PLACE_BY_INDEX[q.place].imp - PLACE_BY_INDEX[p.place].imp);
    const used = [[cx - 14, cx + 14], [x + len - 24, x + len + 4]];
    ctx.font = `600 16px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    for (const q of stops) {
      const sx = cx + ((q.a - a0) / total) * (x + len - cx);
      const name = places[q.place].name;
      const tw = Math.min(ctx.measureText(name).width, 150);
      const lo = sx - tw / 2 - 6;
      const hi = sx + tw / 2 + 6;
      if (lo < x - 4 || hi > x + len + 4) continue;
      const tick = used.some(([a, b]) => sx > a - 2 && sx < b + 2);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, y, 3.4, 0, Math.PI * 2);
      ctx.fill();
      if (tick || used.some(([a, b]) => lo < b && hi > a)) continue;
      used.push([lo, hi]);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(fit(ctx, name, 150), sx, y - 9);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(x + 3, y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    drawFlag(ctx, x + len - 6, y + 9, 0.55, '#ffffff');
    drawCar(ctx, cx, y, Math.PI / 2, 20, null);
  }
}

/** Text in die Breite: erst die Schrift von px bis minPx verkleinern, dann kürzen (setzt ctx.font). */
function shrink(ctx, text, maxW, weight, px, minPx) {
  for (let size = px; size >= minPx; size--) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    if (ctx.measureText(text).width <= maxW) return text;
  }
  return fit(ctx, text, maxW);
}

function clock(min) {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}

/** Striche auf einem Boden-Linienzug: je dash Bezugs-Bildpunkte Strich, gap Lücke (NaN trennt die Striche). */
function dashes(G, dash, gap) {
  const out = [];
  let acc = 0;
  let on = true;
  let open = false; // ein Strich ist begonnen (sein Anfang steht in out)
  const n = G.length / 2;
  for (let i = 0; i + 1 < n; i++) {
    let ax = G[i * 2];
    let az = G[i * 2 + 1];
    const bx = G[i * 2 + 2];
    const bz = G[i * 2 + 3];
    if (Number.isNaN(ax) || Number.isNaN(bx)) {
      // Lücke im Linienzug: der Strich endet hier und geht dahinter weiter
      if (open) out.push(NaN, NaN);
      open = false;
      continue;
    }
    let len = Math.hypot(bx - ax, bz - az);
    if (on && !open) {
      out.push(ax, az);
      open = true;
    }
    while (len > 0) {
      const room = (on ? dash : gap) - acc;
      if (len < room) {
        acc += len;
        if (on) out.push(bx, bz);
        break;
      }
      const t = room / len;
      ax += (bx - ax) * t;
      az += (bz - az) * t;
      len -= room;
      acc = 0;
      if (on) out.push(ax, az, NaN, NaN);
      else out.push(ax, az);
      open = !on;
      on = !on;
    }
  }
  return out;
}
