// Tacho und Navi-Karte in der Drohnenansicht (Besitzer, 21.11.2026: „Tacho und Navi-Karte in die Drohnenansicht.“):
// ein Kärtchen am Rand (sicht.js droneHud: rechts in der Spalte des Chats, nie in der freien Sicht), nur in der
// Drohnenansicht zu sehen (style.css body.drone). Es zeigt nichts Eigenes: Der Mittelbildschirm zeichnet weiter, auch
// wenn das Cockpit nicht zu sehen ist (screen.js hudOut), und hier stehen zwei Ausschnitte davon – der Tacho (Zahl,
// km/h, Tempolimit) und die Navi-Karte (Ansage mit Nummer der Ausfahrt, nächste Ausfahrt, Route, Ziel mit Entfernung
// und Ankunft, das Gebot). So nennen beide Ansichten dieselben Zahlen. Ist die Karte dafür zu klein (das Kärtchen auf
// dem Handy, schmaler als COMPACT_W), zeichnet es statt des Ausschnitts ein kleines Navi aus derselben Ansage: großer
// Pfeil, Entfernung, Nummer der Ausfahrt und ihr Name (drawCompactNavi).
import { FONT, rrect, fit, drawTurnIcon } from '../map/symbols.js';
import { numBox, numBoxWidth } from '../map/navview.js';

const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  e.className = cls;
  parent.appendChild(e);
  return e;
};

// Ausschnitte der Zeichenfläche des Mittelbildschirms (screen.js, 1024 × 640): der Tacho links (Zahl, km/h, Schild des
// Tempolimits; ohne den Wagen mit den Schadenszonen, den das HUD schon zeigt) und das Navi rechts unter der
// Statusleiste bis über das Dock
export const TACHO_SRC = { x: 84, y: 100, w: 278, h: 144 };
export const MAP_SRC = { x: 372, y: 44, w: 652, h: 532 };
// schmaler als so viele CSS-Pixel: das kleine Navi statt der verkleinerten Karte
export const COMPACT_W = 180;
// so hoch steht ein Name ohne Entfernung im kleinen Navi mindestens (Anteil seiner Höhe), sonst wäre er nicht zu lesen
const LEGIBLE = 0.14;

/**
 * Das kleine Navi in einer Fläche von w × h Gerätepixeln: links (oder oben, wenn sie eher hoch ist) der Pfeil der
 * Ansage, daneben groß die Entfernung in den Worten der Ansage (ins.say: dieselbe Zahl wie Mittelbildschirm und
 * Tafeln), darunter die Nummer der Ausfahrt im Kästchen und ihr Name. hop: eine Überfahrt (Fähre, Zug, Flug) läuft.
 */
export function drawCompactNavi(ctx, w, h, ins, hop) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(10,11,13,0.94)';
  rrect(ctx, 0, 0, w, h, Math.min(w, h) * 0.14);
  ctx.fill();
  if (!ins) return;
  const turn = hop ? hop.kind : ins.turn;
  const act = !hop && ins.dist > 0 && turn !== 'none' && turn !== 'straight' && turn !== 'merge';
  const dist = act ? ins.say : '';
  const no = turn === 'exit' && !hop ? ins.no : 0;
  let name = hop ? '' : ins.short || ins.head || ins.road || '';
  // bei einer Ausfahrt sagt das Kästchen mit der Nummer schon, dass es eine ist: dann nur ihr Name („Hanau“)
  if (no) name = name.replace(/^Ausfahrt\s+/, '');
  const pad = Math.round(Math.min(w, h) * 0.09);
  const wide = w > h * 1.2;
  // Pfeil: links über die ganze Höhe (breit) oder oben über die ganze Breite (hoch)
  const s = wide ? Math.min(h - 2 * pad, w * 0.4) : Math.min(w - 2 * pad, h * 0.46);
  const ix = wide ? pad + s / 2 : w / 2;
  const iy = wide ? h / 2 : pad + s / 2;
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  rrect(ctx, ix - s / 2, iy - s / 2, s, s, s * 0.17);
  ctx.fill();
  drawTurnIcon(ctx, turn === 'none' ? 'straight' : turn, ix, iy, s * 0.84, '#ffffff');
  const x0 = wide ? ix + s / 2 + pad : pad;
  const x1 = w - pad;
  const room = x1 - x0;
  const top = wide ? pad : iy + s / 2 + pad * 0.6;
  const rest = h - pad - top;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  // Entfernung groß, so groß, wie sie in die Breite passt; darunter Nummer und Name klein. Ohne Handlung steht der Name
  // groß da – ist er dafür zu lang, die Straße allein („A66“ statt „Auffahrt A66“), sonst nur der Pfeil
  ctx.font = `700 100px ${FONT}`;
  const size = (t) => Math.floor(Math.max(9, Math.min(rest * (dist ? 0.48 : 0.5), (100 * room) / Math.max(1, ctx.measureText(t).width))));
  const label = dist || [name, hop ? '' : ins.road].find((t) => t && size(t) >= h * LEGIBLE);
  if (!label) return;
  const big = size(label);
  const small = Math.max(8, Math.min(rest * 0.3, big * 0.62));
  // breit: Entfernung, Nummer und Name als Block mittig neben dem Pfeil
  const y0 = top + (wide && dist ? Math.max(0, (rest - big * 1.1 - small * 1.4) / 2) : 0);
  const y1 = y0 + (dist ? big * 0.55 : rest / 2);
  ctx.textAlign = wide ? 'left' : 'center';
  const tx = wide ? x0 : w / 2;
  ctx.font = `700 ${big}px ${FONT}`;
  ctx.fillText(fit(ctx, label, room), tx, y1);
  if (!dist) return;
  const y2 = y1 + big * 0.55 + small * 0.75;
  if (y2 + small * 0.5 > h - pad * 0.4) return;
  // Kästchen und Name zusammen links (breit) oder mittig (hoch)
  const bh = small * 1.3;
  const nw = numBoxWidth(ctx, no, bh);
  ctx.font = `600 ${Math.round(small)}px ${FONT}`;
  ctx.textAlign = 'left';
  const tw = Math.min(room - nw, ctx.measureText(name).width);
  let x = wide ? x0 : Math.max(pad, w / 2 - (nw + tw) / 2);
  x += numBox(ctx, no, x, y2, bh);
  // (ein Name, von dem kaum etwas zu lesen wäre, bleibt weg)
  const shown = name ? fit(ctx, name, x1 - x) : '';
  if (!shown || shown.length < Math.min(6, name.length)) return;
  ctx.fillStyle = '#c9d6ff';
  ctx.fillText(shown, x, y2);
}

export class DroneHud {
  constructor(parent) {
    this.parent = parent;
    this.el = el('div', 'drone-hud', parent);
    this.tacho = el('canvas', 'dh-tacho', this.el);
    this.map = el('canvas', 'dh-map', this.el);
    this.rect = null;
    this.on = false;
    this.compact = false; // die Karte wäre zu klein: das kleine Navi (drawCompactNavi)
    this.frames = 0; // Bilder, die herübergeholt wurden (Prüfung)
  }

  /**
   * Lage und Größe (sicht.js droneHud, CSS-Pixel); r = null oder zu klein: kein Platz (dann bleibt es aus). Hochkant
   * (r.chatTop) steht es über dem Chat, der dafür nach unten rückt (style.css .over-chat).
   */
  place(r, dpr = 1) {
    this.rect = r && r.width > 40 && r.height > 40 ? r : null;
    if (!this.rect) {
      this.show(false);
      return;
    }
    const s = this.el.style;
    s.left = r.left + 'px';
    s.top = r.top + 'px';
    s.width = r.width + 'px';
    s.height = r.height + 'px';
    this.el.classList.toggle('side', !!r.side);
    this.el.classList.toggle('over-chat', r.chatTop != null);
    if (r.chatTop != null) {
      this.parent.style.setProperty('--dh-chat-top', r.chatTop + 'px');
      this.parent.style.setProperty('--dh-chat-max', r.chatMax + 'px');
    }
    const pad = 6;
    const iw = r.width - 2 * pad - 2;
    const ih = r.height - 2 * pad - 2;
    // neben der Karte (Handy): der Tacho links, so breit, wie sein Ausschnitt bei voller Höhe es braucht, höchstens
    // 42 %; sonst über der Karte, 64 px hoch
    const tw = r.side ? Math.floor(Math.min(0.42 * iw, (ih * TACHO_SRC.w) / TACHO_SRC.h)) : Math.floor(Math.min(iw, (64 * TACHO_SRC.w) / TACHO_SRC.h));
    const th = Math.floor((tw * TACHO_SRC.h) / TACHO_SRC.w);
    // die Karte im Seitenverhältnis ihres Ausschnitts, so groß, wie der Rest es zulässt (dann sitzen die runden Ecken
    // am Bild selbst)
    const mw = Math.max(1, r.side ? iw - tw - pad : iw);
    const mh = Math.max(1, r.side ? ih : ih - th - pad);
    const k = Math.min(mw / MAP_SRC.w, mh / MAP_SRC.h);
    this.size(this.tacho, tw, th, dpr);
    // zu schmal für die Karte: das kleine Navi füllt den ganzen Platz
    this.compact = MAP_SRC.w * k < COMPACT_W;
    if (this.compact) this.size(this.map, Math.floor(mw), Math.floor(mh), dpr);
    else this.size(this.map, Math.max(1, Math.floor(MAP_SRC.w * k)), Math.max(1, Math.floor(MAP_SRC.h * k)), dpr);
  }

  /** Größe eines Bildes (CSS-Pixel) und seiner Zeichenfläche (Gerätepixel) – nur wenn sie sich ändert (das leert es). */
  size(c, w, h, dpr) {
    const W = Math.max(1, Math.round(w * dpr));
    const H = Math.max(1, Math.round(h * dpr));
    c.style.width = w + 'px';
    c.style.height = h + 'px';
    if (c.width !== W || c.height !== H) {
      c.width = W;
      c.height = H;
    }
  }

  /** Sichtbar (nur in der Drohnenansicht während der Fahrt, main.js)? */
  show(v) {
    const on = !!v && !!this.rect;
    if (on === this.on) return;
    this.on = on;
    this.el.classList.toggle('on', on);
  }

  /**
   * Neues Bild des Mittelbildschirms (screen.js onDraw): beide Ausschnitte herüberholen – oder, ist die Karte zu klein,
   * das kleine Navi aus der Ansage der Navi-Ansicht (navi.ins) zeichnen.
   */
  copy(src, navi = null) {
    if (!this.on) return;
    this.blit(this.tacho, src, TACHO_SRC);
    if (this.compact && navi && navi.ins) drawCompactNavi(this.map.getContext('2d'), this.map.width, this.map.height, navi.ins, navi.hop);
    else this.blit(this.map, src, MAP_SRC);
    this.frames++;
  }

  /** Ausschnitt a der Quelle so groß wie möglich ins Zielbild (ganz zu sehen, mittig; der Rest bleibt durchsichtig). */
  blit(c, src, a) {
    const ctx = c.getContext('2d');
    const k = Math.min(c.width / a.w, c.height / a.h);
    const w = a.w * k;
    const h = a.h * k;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, a.x, a.y, a.w, a.h, Math.round((c.width - w) / 2), Math.round((c.height - h) / 2), Math.round(w), Math.round(h));
  }
}
