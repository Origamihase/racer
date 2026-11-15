// Der große Mittelbildschirm (wie im Model 3): links die Fahrzeugansicht mit Spuren und
// Verkehr, rechts die Navi-Karte mit Route – ferngesteuert von den Zuschauern.
import * as THREE from 'three';
import { clamp, lerp, fbm1, mulberry32, fmtNum } from '../util.js';
import { roundRect } from '../textures.js';

const CW = 1024;
const CH = 640;
const SPLIT = 372;

const LIGHT = {
  bg: '#eceef0', panel: '#f4f5f6', text: '#1d1f22', sub: '#6b7078', lane: '#c3c7cc', car: '#9aa0a8',
  land: '#efece6', road: '#ffffff', roadCase: '#d4d0c8', hwy: '#ffd36a', hwyCase: '#d9a640', water: '#a9d3ec',
  park: '#cfe7c4', town: '#e2ddd5', route: '#2f6fe4', routeCase: '#1e4fb0', dock: '#1b1c1f', card: 'rgba(32,34,38,0.92)',
};
const DARK = {
  bg: '#141518', panel: '#1b1c20', text: '#f2f3f5', sub: '#9097a1', lane: '#4a4f57', car: '#6d737c',
  land: '#25272b', road: '#3a3d43', roadCase: '#2c2e33', hwy: '#8a6d2c', hwyCase: '#5d4a20', water: '#1d3550',
  park: '#233428', town: '#2f3136', route: '#4c8dff', routeCase: '#2a5fc0', dock: '#0c0d0f', card: 'rgba(10,11,13,0.92)',
};

/** x-Position der Autobahn in der Karte (Meter) – sanft geschwungen. */
export function mapRoadX(s) {
  return 900 * fbm1(s / 3200, 5) + 260 * fbm1(s / 950, 8);
}

export class CenterScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = CW;
    this.canvas.height = CH;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 8;
    this.zoom = 0.16;
    this.acc = 0;
    this.spin = 0;
    this.featureCache = new Map();
  }

  update(dt, st) {
    this.acc += dt;
    this.spin += dt;
    if (this.acc < 1 / 15) return;
    this.acc = 0;
    this.draw(st);
    this.texture.needsUpdate = true;
  }

  draw(st) {
    const ctx = this.ctx;
    const T = st.dark ? DARK : LIGHT;
    this.T = T;
    ctx.save();
    ctx.fillStyle = T.bg;
    ctx.fillRect(0, 0, CW, CH);
    this.drawMap(ctx, st, T);
    this.drawCarPanel(ctx, st, T);
    this.drawTopBar(ctx, st, T);
    this.drawDock(ctx, st, T);
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

  // ------------------------------------------------------------------
  drawCarPanel(ctx, st, T) {
    ctx.fillStyle = T.panel;
    ctx.fillRect(0, 0, SPLIT, CH);
    // Gang + Akku
    ctx.textBaseline = 'alphabetic';
    ctx.font = '600 26px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'left';
    const gears = ['P', 'R', 'N', 'D'];
    gears.forEach((g, i) => {
      ctx.fillStyle = g === 'D' ? T.text : T.sub;
      ctx.font = (g === 'D' ? '700 28px' : '500 24px') + ' "Helvetica Neue", Arial, sans-serif';
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
    ctx.fillText(String(Math.round(st.speedKmh)), SPLIT / 2, 196);
    ctx.font = '500 26px "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = T.sub;
    ctx.fillText('km/h', SPLIT / 2, 232);
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
    // Fahrbahnränder und Leitlinien
    const laneEdges = [-7.5, -3.75, 0, 3.75, 7.5];
    if (st.leftLane > 0) {
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
      ctx.lineWidth = i === 0 || i === 4 ? 4 : 3;
      ctx.setLineDash(i === 0 || i === 4 ? [] : [14, 14]);
      ctx.beginPath();
      for (let d = -18; d <= 120; d += 4) {
        const p = proj(lx - px, d);
        if (d === -18) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);
    if (st.leftLane <= 0) {
      const p = proj(-5.625 - px, 40);
      ctx.font = `${Math.round(30 * p[2] + 12)}px "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🔒', p[0], p[1]);
    }
    // andere Fahrzeuge (hinten zuerst … vorne zuletzt, damit nahe oben liegen)
    const cars = (st.cars || []).filter((c) => c.ds > -18 && c.ds < 120).sort((a, b) => b.ds - a.ds);
    for (const c of cars) {
      const p0 = proj(c.dx - px, c.ds - c.len / 2);
      const p1 = proj(c.dx - px, c.ds + c.len / 2);
      const w = c.w * 30 * p0[2];
      ctx.fillStyle = c.kind === 'polizei' ? '#5c7ed6' : T.car;
      roundRect(ctx, p0[0] - w / 2, p1[1], w, Math.max(4, p0[1] - p1[1]), Math.min(8, w / 3));
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
    roundRect(ctx, me[0] - mw / 2, meTop[1], mw, me[1] - meTop[1], 10);
    ctx.fill();
    ctx.fillStyle = 'rgba(120,150,190,0.8)';
    roundRect(ctx, me[0] - mw * 0.36, meTop[1] + (me[1] - meTop[1]) * 0.18, mw * 0.72, (me[1] - meTop[1]) * 0.28, 6);
    ctx.fill();

    // Linke-Spur-Status
    ctx.textAlign = 'center';
    ctx.font = '600 24px "Helvetica Neue", Arial, sans-serif';
    if (st.leftLane > 0) {
      ctx.fillStyle = '#2f6fe4';
      ctx.fillText('Linke Spur frei · ' + Math.ceil(st.leftLane) + ' s', SPLIT / 2, CH - 86);
    } else {
      ctx.fillStyle = T.sub;
      ctx.fillText('Rechtsfahrgebot aktiv', SPLIT / 2, CH - 86);
    }
  }

  // ------------------------------------------------------------------
  features(chunk) {
    if (this.featureCache.has(chunk)) return this.featureCache.get(chunk);
    const rnd = mulberry32(chunk * 977 + 3);
    const s0 = chunk * 600;
    const f = { roads: [], towns: [], parks: [], water: null, exit: null };
    if (rnd() < 0.55) {
      const s = s0 + rnd() * 600;
      const a = (rnd() - 0.5) * 1.2;
      f.roads.push({ s, a, len: 1500 + rnd() * 2500 });
      if (rnd() < 0.6) f.exit = s;
    }
    if (rnd() < 0.35) {
      const side = rnd() < 0.5 ? -1 : 1;
      f.towns.push({ s: s0 + rnd() * 600, x: side * (300 + rnd() * 900), r: 120 + rnd() * 220, seed: chunk });
    }
    const np = Math.floor(rnd() * 3);
    for (let i = 0; i < np; i++) {
      f.parks.push({ s: s0 + rnd() * 600, x: (rnd() < 0.5 ? -1 : 1) * (200 + rnd() * 1400), r: 150 + rnd() * 400, k: rnd() });
    }
    if (rnd() < 0.12) f.water = { s: s0 + rnd() * 600, a: (rnd() - 0.5) * 0.8 };
    this.featureCache.set(chunk, f);
    if (this.featureCache.size > 80) this.featureCache.delete(this.featureCache.keys().next().value);
    return f;
  }

  drawMap(ctx, st, T) {
    const nv = st.navi || {};
    const x0 = SPLIT;
    const w = CW - SPLIT;
    const h = CH - 64;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, 0, w, h);
    ctx.clip();
    ctx.fillStyle = T.land;
    ctx.fillRect(x0, 0, w, h);

    const s0 = st.s;
    const remaining = Math.max(0, nv.remaining ?? 3000);
    const targetZoom = clamp(330 / Math.max(remaining + 250, 400), 0.07, 0.42);
    this.zoom = lerp(this.zoom, targetZoom, 0.08);
    const z = this.zoom;
    const cx = x0 + w / 2;
    const cy = h * 0.8;
    const ax = mapRoadX(s0);
    const tan = (mapRoadX(s0 + 25) - mapRoadX(s0 - 25)) / 50;
    const heading = Math.atan(tan);
    const toScreen = (mx, ms) => {
      const X = mx - ax;
      const Y = -(ms - s0);
      const c = Math.cos(-heading);
      const s = Math.sin(-heading);
      return [cx + (X * c - Y * s) * z, cy + (X * s + Y * c) * z];
    };
    const sMin = s0 - (h * 0.25) / z - 600;
    const sMax = s0 + (h * 0.9) / z + 600;
    const c0 = Math.floor(sMin / 600);
    const c1 = Math.floor(sMax / 600);

    // Parks, Orte, Wasser
    for (let c = c0; c <= c1; c++) {
      const f = this.features(c);
      for (const p of f.parks) {
        const [px, py] = toScreen(mapRoadX(p.s) + p.x, p.s);
        ctx.fillStyle = T.park;
        ctx.beginPath();
        ctx.ellipse(px, py, p.r * z, p.r * z * (0.6 + p.k * 0.6), p.k * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (f.water) {
        ctx.strokeStyle = T.water;
        ctx.lineWidth = Math.max(5, 60 * z);
        ctx.beginPath();
        const ws = f.water.s;
        const a = f.water.a;
        for (let i = -6; i <= 6; i++) {
          const mx = mapRoadX(ws) + i * 400;
          const ms = ws + i * 400 * Math.tan(a) + Math.sin(i) * 80;
          const [px, py] = toScreen(mx, ms);
          if (i === -6) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      for (const t of f.towns) {
        const rnd = mulberry32(t.seed);
        ctx.fillStyle = T.town;
        const [tx, ty] = toScreen(mapRoadX(t.s) + t.x, t.s);
        ctx.beginPath();
        ctx.arc(tx, ty, t.r * z, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = T.road;
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          const a = rnd() * Math.PI;
          ctx.moveTo(tx - Math.cos(a) * t.r * z, ty - Math.sin(a) * t.r * z);
          ctx.lineTo(tx + Math.cos(a) * t.r * z, ty + Math.sin(a) * t.r * z);
          ctx.stroke();
        }
      }
    }
    // Nebenstraßen
    for (let c = c0; c <= c1; c++) {
      const f = this.features(c);
      for (const r of f.roads) {
        const bx = mapRoadX(r.s);
        const p1 = toScreen(bx - Math.cos(r.a) * r.len, r.s - Math.sin(r.a) * r.len);
        const p2 = toScreen(bx + Math.cos(r.a) * r.len, r.s + Math.sin(r.a) * r.len);
        ctx.strokeStyle = T.roadCase;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
        ctx.strokeStyle = T.road;
        ctx.lineWidth = 6;
        ctx.stroke();
      }
    }
    // Autobahn
    const hwy = [];
    for (let s = sMin; s <= sMax; s += 40 / Math.max(z, 0.05)) hwy.push(toScreen(mapRoadX(s), s));
    const strokePath = (pts, color, width) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.stroke();
    };
    strokePath(hwy, T.hwyCase, 17);
    strokePath(hwy, T.hwy, 12);

    // Route
    if (nv.target) {
      const rec = nv.recalc || 0;
      const sT = s0 + remaining;
      const side = nv.side || 1;
      const route = [];
      if (nv.wende && nv.wendeS > s0) {
        for (let s = s0; s <= nv.wendeS; s += 30) route.push(toScreen(mapRoadX(s) + 6, s));
        for (let i = 0; i <= 8; i++) {
          const a = (i / 8) * Math.PI;
          route.push(toScreen(mapRoadX(nv.wendeS) + 6 - (1 - Math.cos(a)) * 70, nv.wendeS + Math.sin(a) * 120));
        }
        for (let s = nv.wendeS; s >= s0 - 900; s -= 30) route.push(toScreen(mapRoadX(s) - 134, s));
      } else {
        const sExit = Math.max(s0, sT - 260);
        for (let s = s0; s <= sExit; s += Math.max(20, 12 / z)) route.push(toScreen(mapRoadX(s), s));
        const ex = mapRoadX(sExit);
        const px = mapRoadX(sT) + side * 520;
        for (let i = 1; i <= 10; i++) {
          const k = i / 10;
          route.push(toScreen(lerp(ex, px, k * k), lerp(sExit, sT + 120, k)));
        }
      }
      if (rec < 1) {
        ctx.globalAlpha = 1 - rec;
        strokePath(route, T.routeCase, 15);
        strokePath(route, T.route, 10);
        ctx.globalAlpha = 1;
      }
      // Ziel-Pin
      if (!nv.wende) {
        const [px, py] = toScreen(mapRoadX(sT) + side * 520, sT + 120);
        if (px > x0 - 40 && px < CW + 40 && py > -40 && py < h + 40) {
          ctx.fillStyle = '#e8352b';
          ctx.beginPath();
          ctx.arc(px, py - 26, 15, Math.PI, 0);
          ctx.lineTo(px, py);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(px, py - 26, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Fahrzeugpfeil
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(47,111,228,0.18)';
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(17, 18);
    ctx.lineTo(0, 8);
    ctx.lineTo(-17, 18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2f6fe4';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(12, 13);
    ctx.lineTo(0, 5);
    ctx.lineTo(-12, 13);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Neuberechnung
    if (nv.recalc > 0) {
      ctx.fillStyle = `rgba(255,255,255,${0.5 * nv.recalc})`;
      ctx.fillRect(x0, 0, w, h);
      ctx.save();
      ctx.translate(cx, h * 0.45);
      ctx.strokeStyle = '#2f6fe4';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, 34, this.spin * 6, this.spin * 6 + 4.2);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#1d1f22';
      ctx.font = 'bold 32px "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Route wird neu berechnet …', cx, h * 0.45 + 80);
    }

    // Navi-Karten oben links
    if (nv.target) {
      ctx.fillStyle = T.card;
      roundRect(ctx, x0 + 18, 70, w - 36, 118, 16);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.font = 'bold 30px "Helvetica Neue", Arial, sans-serif';
      const instr = nv.wende && nv.wendeS > s0 ? 'Bitte wenden' : remaining > 400 ? 'A7 folgen' : 'Ausfahrt nehmen';
      const nextDist = nv.wende && nv.wendeS > s0 ? nv.wendeS - s0 : Math.max(0, remaining - 260);
      ctx.fillText(this.arrowFor(instr) + '  ' + instr, x0 + 38, 112);
      ctx.font = '600 28px "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(fmtDist(nextDist), CW - 36, 112);
      ctx.textAlign = 'left';
      ctx.font = '26px "Helvetica Neue", Arial, sans-serif';
      const right = fmtDist(remaining) + ' · ' + (nv.eta || '');
      const rightW = ctx.measureText(right).width;
      ctx.fillStyle = '#c9d6ff';
      fitText(ctx, '🏁 ' + nv.target, x0 + 38, 160, CW - 36 - rightW - 26 - (x0 + 38), 20);
      ctx.font = '26px "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(right, CW - 36, 160);
      // Ferngesteuert-Banner
      ctx.fillStyle = 'rgba(200,16,46,0.94)';
      roundRect(ctx, x0 + 18, h - 74, w - 36, 56, 14);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.font = 'bold 24px "Helvetica Neue", Arial, sans-serif';
      fitText(ctx, '📡 Ferngesteuert von ' + (nv.bidder || '—'), x0 + 34, h - 38, w - 210);
      ctx.textAlign = 'right';
      ctx.font = 'bold 26px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(nv.bid || '', CW - 36, h - 38);
    }
    ctx.restore();
  }

  arrowFor(instr) {
    if (instr === 'Bitte wenden') return '↶';
    if (instr === 'Ausfahrt nehmen') return '↗';
    return '↑';
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
    ctx.fillText('21,0 °', CW - 150, CH - 32);
    ctx.fillStyle = st.wiperOn ? '#4c8dff' : '#e6e8eb';
    ctx.fillText(st.wiperOn ? 'Wischer: Auto (Beta)' : '', CW - 360, CH - 32);
    ctx.textBaseline = 'alphabetic';
  }
}

function fmtDist(m) {
  if (m >= 1000) return fmtNum(m / 1000, m >= 10000 ? 0 : 1) + ' km';
  return Math.max(0, Math.round(m / 10) * 10) + ' m';
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
