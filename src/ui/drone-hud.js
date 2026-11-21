// Tacho und Navi-Karte in der Drohnenansicht (Besitzer, 21.11.2026: „Tacho und Navi-Karte in die Drohnenansicht.“):
// ein Kärtchen am Rand (sicht.js droneHud: rechts in der Spalte des Chats, nie in der freien Sicht), nur in der
// Drohnenansicht zu sehen (style.css body.drone). Es zeigt nichts Eigenes: Der Mittelbildschirm zeichnet weiter, auch
// wenn das Cockpit nicht zu sehen ist (screen.js hudOut), und hier stehen zwei Ausschnitte davon – der Tacho (Zahl,
// km/h, Tempolimit) und die Navi-Karte (Ansage mit Nummer der Ausfahrt, nächste Ausfahrt, Route, Ziel mit Entfernung
// und Ankunft, das Gebot). So nennen beide Ansichten dieselben Zahlen.

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

export class DroneHud {
  constructor(parent) {
    this.parent = parent;
    this.el = el('div', 'drone-hud', parent);
    this.tacho = el('canvas', 'dh-tacho', this.el);
    this.map = el('canvas', 'dh-map', this.el);
    this.rect = null;
    this.on = false;
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
    this.size(this.map, Math.max(1, Math.floor(MAP_SRC.w * k)), Math.max(1, Math.floor(MAP_SRC.h * k)), dpr);
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

  /** Neues Bild des Mittelbildschirms (screen.js onDraw): beide Ausschnitte herüberholen. */
  copy(src) {
    if (!this.on) return;
    this.blit(this.tacho, src, TACHO_SRC);
    this.blit(this.map, src, MAP_SRC);
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
