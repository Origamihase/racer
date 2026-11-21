// Der große Mittelbildschirm (wie im Model 3): links die Fahrzeugansicht mit Spuren und
// Verkehr, rechts die Navi-Karte mit Route – ferngesteuert von den Zuschauern.
import * as THREE from 'three';
import { clamp, lerp, tachoKmh } from '../util.js';
import { roundRect } from '../textures.js';
import { drawDamageCar, damageBand } from './screen-damage.js';
import { NaviScreen } from '../map/navview.js';
import { fmtKm } from '../map/navroute.js';

const CW = 1024;
const CH = 640;
const SPLIT = 372;
/** Größe der Zeichenfläche (px) und das Fenster der Rückfahrkamera darin (rearcam.js; nur in R): oben rechts, groß. */
export const SCREEN_PX = [CW, CH];
export const REAR_RECT = { x: SPLIT + 12, y: 58, w: CW - SPLIT - 24, h: Math.round(((CW - SPLIT - 24) * 9) / 16), r: 14 };
// Linien der Spuransicht (Meter quer zur Fahrbahn): die vier Spuren der Autobahn
const AB_EDGES = [-7.5, -3.75, 0, 3.75, 7.5];
// Breite von Verzögerungs- und Beschleunigungsstreifen der XXL-Welt (rechts neben der rechten Spur)
const EXTRA_LANE = 3;
const ascending = (a, b) => a - b;

/**
 * Linien der Spuransicht für einen Querschnitt der XXL-Welt: road = {lanes: [{x, w}] wie PROFILES in
 * src/game/trip.js, extraLane: Mitte des Zusatzstreifens oder null}. Schreibt die Ränder aller Spuren von links nach
 * rechts in out (gemeinsame Ränder benachbarter Spuren einmal) und liefert out.
 */
function roadEdges(road, out) {
  out.length = 0;
  for (const l of road.lanes) out.push(l.x - l.w / 2, l.x + l.w / 2);
  if (road.extraLane !== null) out.push(road.extraLane + EXTRA_LANE / 2);
  out.sort(ascending);
  let n = 0;
  for (let i = 0; i < out.length; i++) if (!n || out[i] - out[n - 1] > 0.01) out[n++] = out[i];
  out.length = n;
  return out;
}

const LIGHT = { bg: '#eceef0', panel: '#f4f5f6', text: '#1d1f22', sub: '#6b7078', lane: '#c3c7cc', car: '#9aa0a8', dock: '#1b1c1f' };
const DARK = { bg: '#141518', panel: '#1b1c20', text: '#f2f3f5', sub: '#9097a1', lane: '#4a4f57', car: '#6d737c', dock: '#0c0d0f' };

export class CenterScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = CW;
    this.canvas.height = CH;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 8;
    this.live = false;
    // Tacho und Navi-Karte der Drohnenansicht (ui/drone-hud.js): solange hudOut gilt, zeichnet der Bildschirm weiter,
    // auch ohne Cockpit im Bild, und reicht jedes neue Bild an onDraw(canvas, navi) weiter (hochgeladen wird es dann
    // nicht; navi: die Navi-Ansicht mit ihrer letzten Ansage, für das kleine Navi auf dem Handy)
    this.hudOut = false;
    this.onDraw = null;
    this.kmh = null; // die Zahl des Tachos im letzten Bild (null: noch keins)
    this.acc = 0;
    this.spin = 0;
    this.edges = []; // Linien der Spuransicht in der XXL-Welt (roadEdges), wiederverwendet
  }

  update(dt, st) {
    this.acc += dt;
    this.spin += dt;
    // zeichnen und hochladen nur, solange das Cockpit zu sehen ist (live: dann zeigt das HUD die Zahl des Tachos hier,
    // this.kmh, damit beide in jedem Bild dieselbe Geschwindigkeit nennen); in der Drohnenansicht nur zeichnen (hudOut)
    this.live = st.nav.visible !== false;
    if (this.acc < 1 / 15) return;
    if (!this.live && !this.hudOut) return;
    this.step = this.acc;
    this.acc = 0;
    this.draw(st);
    if (this.live) this.texture.needsUpdate = true;
    if (this.hudOut && this.onDraw) this.onDraw(this.canvas, this.navi);
  }

  draw(st) {
    const ctx = this.ctx;
    const T = st.dark ? DARK : LIGHT;
    this.T = T;
    ctx.save();
    ctx.fillStyle = T.bg;
    ctx.fillRect(0, 0, CW, CH);
    // rechts die Karte mit Navi (src/map/navview.js)
    (this.navi || (this.navi = new NaviScreen())).draw(ctx, SPLIT, 0, CW - SPLIT, CH - 64, st, this.step);
    this.drawCarPanel(ctx, st, T);
    if (st.trunk > 0) this.drawTrunkCam(ctx);
    // in R: über der Karte ein ruhiges Feld bis zur Unterkante des Kamerabilds (auch unter der halb durchsichtigen
    // oberen Leiste), damit neben dem Bild kein Rest der Route und der Straßen blitzt
    if (st.gear === 'R') {
      ctx.fillStyle = T.panel;
      ctx.fillRect(SPLIT, 0, CW - SPLIT, REAR_RECT.y + REAR_RECT.h + 4);
    }
    this.drawTopBar(ctx, st, T);
    if (st.gear === 'R') this.drawRearFrame(ctx);
    this.drawDock(ctx, st, T);
    if (st.lowBattery) this.drawLowBattery(ctx, st.lowBattery);
    if (st.funkloch > 0) {
      ctx.fillStyle = `rgba(120,120,120,${0.35 * st.funkloch})`;
      ctx.fillRect(SPLIT, 0, CW - SPLIT, CH - 64);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Keine Verbindung', SPLIT + (CW - SPLIT) / 2, 300);
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText('Mobilfunk wird neu gebündelt …', SPLIT + (CW - SPLIT) / 2, 340);
    }
    ctx.restore();
  }

  /**
   * Bitspende „Kofferraum öffnen“ (st.trunk: Sekunden, die sie noch läuft): An der Stelle der Spuransicht zeigt der
   * Bildschirm die Kofferraum-Kamera – was hinten mitfährt, mit REC-Punkt wie jedes Kamerabild des Wagens. Der
   * Innenspiegel bleibt dabei ein Spiegel.
   */
  drawTrunkCam(ctx) {
    const x = 14;
    const y = 262;
    const w = SPLIT - 28;
    const h = CH - 84 - y;
    ctx.save();
    roundRect(ctx, x, y, w, h, 14);
    ctx.clip();
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, '#2a2c30');
    g.addColorStop(1, '#141517');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
    // der Kofferraum von oben-hinten: Kisten, Kabel, die Stream-Technik (Zeichnung 512 × 160, auf die Breite gesetzt)
    const k = w / 512;
    ctx.translate(x, y + 44 + (h - 44 - 160 * k) / 2);
    ctx.scale(k, k);
    const box = (bx, by, bw, bh, col, label) => {
      ctx.fillStyle = col;
      roundRect(ctx, bx, by, bw, bh, 8);
      ctx.fill();
      ctx.fillStyle = '#e8e8e8';
      ctx.font = 'bold 17px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, bx + bw / 2, by + bh / 2 + 6);
    };
    box(24, 38, 120, 84, '#3b3f46', 'Akku-Pack');
    box(160, 60, 96, 62, '#20242a', 'Router');
    box(272, 28, 92, 94, '#5a2a2a', 'KONFETTI');
    box(380, 52, 110, 70, '#1e3550', 'LTE ×3');
    ctx.strokeStyle = '#d4a21a';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(140 + i * 8, 88);
      ctx.bezierCurveTo(180, 143 - i * 6, 330, 146, 380, 88 + i * 6);
      ctx.stroke();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Kopfzeile des Kamerabilds
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(x, y, w, 40);
    ctx.fillStyle = Math.sin(this.spin * 5) > -0.2 ? '#ff4d4d' : '#7a2a2a';
    ctx.beginPath();
    ctx.arc(x + 22, y + 20, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 20px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Kofferraum-Kamera', x + 38, y + 21);
    ctx.restore();
  }

  // ------------------------------------------------------------------
  drawCarPanel(ctx, st, T) {
    ctx.fillStyle = T.panel;
    ctx.fillRect(0, 0, SPLIT, CH);
    // Gang + Akku
    ctx.textBaseline = 'alphabetic';
    ctx.font = '600 26px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'left';
    const gears = ['P', 'R', 'N', 'D'];
    const gear = st.gear || 'D';
    gears.forEach((g, i) => {
      ctx.fillStyle = g === gear ? T.text : T.sub;
      ctx.font = (g === gear ? '700 28px' : '500 24px') + ' "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(g, 26 + i * 30, 78);
    });
    // Akku-Symbol
    const bx = 196;
    const by = 56;
    ctx.strokeStyle = T.text;
    ctx.lineWidth = 3;
    roundRect(ctx, bx, by, 60, 26, 5);
    ctx.stroke();
    ctx.fillStyle = T.text;
    ctx.fillRect(bx + 60, by + 8, 5, 10);
    const pct = clamp(st.battery, 0, 100);
    ctx.fillStyle = pct < 15 ? '#e0301e' : pct < 30 ? '#f0a020' : '#34c759';
    ctx.fillRect(bx + 4, by + 4, 52 * (pct / 100), 18);
    ctx.fillStyle = T.text;
    ctx.font = '600 26px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText(Math.round(pct) + ' %', bx + 76, 79);

    // Geschwindigkeit
    ctx.textAlign = 'center';
    ctx.font = '600 104px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = T.text;
    this.kmh = tachoKmh(st.speedKmh);
    ctx.fillText(String(this.kmh), SPLIT / 2, 196);
    ctx.font = '500 26px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = T.sub;
    ctx.fillText('km/h', SPLIT / 2, 232);
    // Wagen von oben mit den Schadenszonen (src/cockpit/screen-damage.js)
    if (st.damage) drawDamageCar(ctx, st.damage, 20, 100, 56, 114, T);
    if (st.limit) {
      ctx.save();
      ctx.translate(SPLIT - 58, 150);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d4141b';
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.fillStyle = '#111';
      ctx.font = 'bold 30px Arial, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(st.limit), 0, 2);
      ctx.restore();
    }

    // Spuransicht (perspektivisch)
    const top = 262;
    const bottom = CH - 78;
    const vx = SPLIT / 2;
    const horizonY = top;
    const proj = (lat, dist) => {
      // lat in m relativ zur eigenen Position, dist in m voraus
      const d = clamp(dist, -18, 120);
      const k = 1 / (1 + (d + 18) / 26);
      const y = lerp(horizonY + 6, bottom, k * 1.05);
      const x = vx + lat * 30 * k;
      return [x, y, k];
    };
    const px = st.playerX;
    // Spuren und Autos nur im eigenen Feld zeichnen: von der linken Spur aus liegen die rechten
    // Spuren (und Lkw, die man gerade überholt) seitlich weit draußen, sonst landen sie auf der Karte
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, top, SPLIT, CH - top);
    ctx.clip();
    // Fahrbahnränder und Leitlinien: ohne Angabe die vier Spuren der Autobahn. Die Welt meldet den Querschnitt, auf
    // dem der Wagen gerade fährt (st.road): Rampe, Landstraße und Ortsstraße haben andere Spuren, und die gesperrte
    // linke Spur, das Rechtsfahrgebot und der Verkehr der Autobahn gehören nur auf die Autobahn
    const road = st.road && st.road.lanes ? st.road : null;
    const onAb = !road || road.autobahn;
    const laneEdges = road ? roadEdges(road, this.edges) : AB_EDGES;
    const last = laneEdges.length - 1;
    if (onAb && st.leftLane > 0) {
      ctx.fillStyle = `rgba(62,120,255,${0.25 + 0.15 * Math.sin(this.spin * 6)})`;
      ctx.beginPath();
      let p = proj(-7.5 - px, -18);
      ctx.moveTo(p[0], p[1]);
      for (let d = -18; d <= 120; d += 6) {
        p = proj(-7.5 - px, d);
        ctx.lineTo(p[0], p[1]);
      }
      for (let d = 120; d >= -18; d -= 6) {
        p = proj(-3.75 - px, d);
        ctx.lineTo(p[0], p[1]);
      }
      ctx.fill();
    }
    laneEdges.forEach((lx, i) => {
      ctx.strokeStyle = T.lane;
      ctx.lineWidth = i === 0 || i === last ? 4 : 3;
      ctx.setLineDash(i === 0 || i === last ? [] : [14, 14]);
      ctx.beginPath();
      for (let d = -18; d <= 120; d += 4) {
        const p = proj(lx - px, d);
        if (d === -18) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);
    if (onAb && st.leftLane <= 0) {
      const p = proj(-5.625 - px, 40);
      ctx.font = `${Math.round(30 * p[2] + 12)}px "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🔒', p[0], p[1]);
    }
    // andere Fahrzeuge (hinten zuerst … vorne zuletzt, damit nahe oben liegen)
    const cars = ((onAb && st.cars) || []).filter((c) => c.ds > -18 && c.ds < 120).sort((a, b) => b.ds - a.ds);
    for (const c of cars) {
      const p0 = proj(c.dx - px, c.ds - c.len / 2);
      const p1 = proj(c.dx - px, c.ds + c.len / 2);
      const w = c.w * 30 * p0[2];
      ctx.fillStyle = c.kind === 'polizei' ? '#5c7ed6' : T.car;
      pill(ctx, p0[0] - w / 2, p1[1], w, Math.max(4, p0[1] - p1[1]), Math.min(8, w / 3));
      ctx.fill();
      if (c.brake) {
        ctx.fillStyle = '#ff3b30';
        ctx.fillRect(p0[0] - w / 2, p0[1] - 4, w, 4);
      }
    }
    // eigenes Auto (schwarz)
    const me = proj(0, 0);
    const meTop = proj(0, 4.7);
    const mw = 1.85 * 30 * me[2];
    ctx.fillStyle = '#111214';
    pill(ctx, me[0] - mw / 2, meTop[1], mw, me[1] - meTop[1], 10);
    ctx.fill();
    ctx.fillStyle = 'rgba(120,150,190,0.8)';
    pill(ctx, me[0] - mw * 0.36, meTop[1] + (me[1] - meTop[1]) * 0.18, mw * 0.72, (me[1] - meTop[1]) * 0.28, 6);
    ctx.fill();
    ctx.restore();

    // Linke-Spur-Status (auf eigenem Streifen, damit keine Spurlinien durch die Schrift laufen)
    const band = ctx.createLinearGradient(0, CH - 128, 0, CH - 112);
    band.addColorStop(0, T.panel + '00');
    band.addColorStop(1, T.panel);
    ctx.fillStyle = band;
    ctx.fillRect(0, CH - 128, SPLIT, 16);
    ctx.fillStyle = T.panel;
    ctx.fillRect(0, CH - 112, SPLIT, 112);
    ctx.textAlign = 'center';
    ctx.font = '600 24px "Helvetica Neue", Arial, sans-serif';
    const dmg = damageBand(st.damage, this.spin);
    if (dmg) {
      ctx.fillStyle = dmg.color;
      fitText(ctx, dmg.text, SPLIT / 2, CH - 86, SPLIT - 28);
    } else if (onAb && st.leftLane > 0) {
      ctx.fillStyle = '#2f6fe4';
      ctx.fillText('Linke Spur frei · ' + Math.ceil(st.leftLane) + ' s', SPLIT / 2, CH - 86);
    } else if (onAb) {
      ctx.fillStyle = T.sub;
      ctx.fillText('Rechtsfahrgebot aktiv', SPLIT / 2, CH - 86);
    }
  }

  drawTopBar(ctx, st, T) {
    ctx.fillStyle = st.dark ? 'rgba(20,21,24,0.85)' : 'rgba(244,245,246,0.88)';
    ctx.fillRect(SPLIT, 0, CW - SPLIT, 50);
    ctx.fillStyle = T.text;
    ctx.font = '600 24px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('👤 Mini Adam', SPLIT + 20, 26);
    ctx.textAlign = 'right';
    ctx.fillText(st.clock + '   ' + st.temp + ' °C   ' + (st.funkloch > 0 ? 'Kein Netz' : 'LTE ▂▄▆█'), CW - 18, 26);
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * Unter dem Bild der Rückfahrkamera (nur in R): eine dunkle Karte mit weichem Schatten über der Karte des Navis, ein
   * paar Pixel größer als das Bild und mit kleinerem Eckradius – so deckt sie auch die Spitzen der Ecken, die das Bild
   * mit seinen runden Ecken frei lässt, und von der Karte blitzt dort nichts durch (Radius ≤ e·√2/(√2−1)).
   */
  drawRearFrame(ctx) {
    const R = REAR_RECT;
    const e = 4;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#0b0c0e';
    roundRect(ctx, R.x - e, R.y - e, R.w + 2 * e, R.h + 2 * e, R.r - 3);
    ctx.fill();
    ctx.restore();
  }

  drawDock(ctx, st, T) {
    ctx.fillStyle = T.dock;
    ctx.fillRect(0, CH - 64, CW, 64);
    ctx.fillStyle = '#e6e8eb';
    ctx.font = '30px "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const icons = ['🚗', '❄️', '🎵', '📞', '📡', '🌧️', '⚙️'];
    icons.forEach((ic, i) => ctx.fillText(ic, 70 + i * 90, CH - 32));
    ctx.font = '600 26px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = '#e6e8eb';
    ctx.textAlign = 'right';
    ctx.fillText('21,0 °', CW - 26, CH - 32);
    if (st.wiperOn) {
      // rechts neben den Symbolen (die enden bei x ≈ 630), damit sich nichts überlappt
      ctx.textAlign = 'left';
      ctx.fillStyle = '#4c8dff';
      ctx.font = '600 22px "Helvetica Neue", Arial, sans-serif';
      fitText(ctx, 'Wischer: Auto (Beta)', 656, CH - 32, CW - 130 - 656, 14);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * Akku-Karte (game.js AKKU_CARD; b: screenState lowBattery): rot über der Spuransicht – „Akku fast leer“ bei 10 %,
   * „Akku kritisch“ bei 5 %, „Akku leer“, bis der Wagen steht; mit dem Rest im Batteriesymbol, den Prozent, was zu tun
   * ist, und dem Ladepark, den OMI nennt. Gleitet herein und hinaus, ab „kritisch“ pulsiert der Rand.
   */
  drawLowBattery(ctx, b) {
    const x = 14;
    const w = SPLIT - 28;
    const h = 176;
    const y = 270 + (1 - b.alpha) * 18;
    ctx.save();
    ctx.globalAlpha = b.alpha;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 5;
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, b.lvl > 1 ? '#e0281e' : '#e4502f');
    g.addColorStop(1, b.lvl > 1 ? '#a3101a' : '#b8291c');
    ctx.fillStyle = g;
    roundRect(ctx, x, y, w, h, 16);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    if (b.lvl > 1) {
      ctx.strokeStyle = `rgba(255,255,255,${0.5 + 0.35 * Math.sin(this.spin * 6)})`;
      ctx.lineWidth = 3;
      roundRect(ctx, x + 1.5, y + 1.5, w - 3, h - 3, 15);
      ctx.stroke();
    }
    // Batteriesymbol mit dem Rest; leer ein Ausrufezeichen
    const ix = x + 20;
    const iy = y + 22;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    roundRect(ctx, ix, iy, 56, 28, 6);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ix + 58, iy + 9, 5, 10);
    ctx.textBaseline = 'middle';
    if (b.lvl < 3) ctx.fillRect(ix + 5, iy + 5, Math.max(4, 46 * clamp(b.pct / 100, 0, 1)), 18);
    else {
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillText('!', ix + 28, iy + 15);
    }
    // Titel, Prozent und was zu tun ist
    ctx.textAlign = 'left';
    ctx.font = '700 28px "Helvetica Neue", Arial, sans-serif';
    fitText(ctx, ['', 'Akku fast leer', 'Akku kritisch', 'Akku leer'][b.lvl], ix + 80, iy + 15, x + w - 98 - ix);
    ctx.font = '700 46px "Helvetica Neue", Arial, sans-serif';
    const pct = Math.round(clamp(b.pct, 0, 100)) + ' %';
    ctx.fillText(pct, x + 20, y + 98);
    const tx = x + 34 + ctx.measureText(pct).width;
    ctx.font = '600 22px "Helvetica Neue", Arial, sans-serif';
    fitText(ctx, ['', b.planned ? 'Ladestopp geplant' : 'Bitte bald laden', 'Jetzt laden!', 'Der Wagen rollt aus'][b.lvl], tx, y + 100, x + w - 18 - tx);
    // der Ladeplatz, den OMI nennt – sein Name sagt schon „Ladepark …“ bzw. „Ladesäule in …“ (leer: nichts mehr zu
    // planen)
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '500 20px "Helvetica Neue", Arial, sans-serif';
    const park = b.park ? b.park + ' · ' + fmtKm(b.km) : 'Nächste Ladesäule ansteuern';
    fitText(ctx, b.lvl === 3 ? 'Kein Strom mehr für den Antrieb' : park, x + 20, y + 146, w - 40);
    ctx.restore();
  }
}

/**
 * Abgerundetes Rechteck, dessen Radius höchstens die halbe kürzere Seite ist: Die Autos in der
 * Spuransicht sind flach (oft nur 4–10 px hoch), mit zu großem Radius überschlägt sich der Pfad
 * und es entstehen Schnörkel statt Kapseln.
 */
function pill(ctx, x, y, w, h, r) {
  roundRect(ctx, x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2)));
}

function fitText(ctx, text, x, y, maxW, minSize = 14) {
  let size = parseFloat(ctx.font.match(/(\d+)px/)[1]);
  while (ctx.measureText(text).width > maxW && size > minSize) {
    size -= 2;
    ctx.font = ctx.font.replace(/\d+px/, size + 'px');
  }
  // Passt es immer noch nicht, wird mit „…“ gekürzt
  if (ctx.measureText(text).width > maxW) {
    let t = text;
    while (t.length > 4 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
    text = t.trimEnd() + '…';
  }
  ctx.fillText(text, x, y);
}
