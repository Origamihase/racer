// Touch-Bedienung für Daumen im Querformat (ersetzt die vier kleinen Knöpfe):
//  links  – „Wischen“: Daumen irgendwo aufsetzen und zur Seite ziehen (stufenlos, ein weicher Knopf zeigt den
//           Ausschlag), kurz wischen wechselt die Spur; „Tasten“: zwei große Lenkknöpfe wie die Pfeiltasten.
//  rechts – Bremse (groß) und Strom.
// Mehrere Finger gleichzeitig (jeder Zeiger für sich, mit Pointer-Capture); Drehen, Pause und Fokusverlust lassen alles
// los. Die Rechenregeln (Totzone, Kennlinie, Wischen) stehen in touch-model.js.
import { eventTime } from '../input.js';
import { dragToAnalog, swipeDir, TOUCH } from './touch-model.js';

const el = (tag, cls, parent, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
};

export class TouchControls {
  /** @param {HTMLElement} root der .touch-Container @param {import('../input.js').Input} input */
  constructor(root, input) {
    this.root = root;
    this.input = input;
    this.mode = 'wischen';
    this.drag = null; // { id, x0, y0, t0, x, y }
    this.drags = 0;
    // Lenkfläche links (unter den kleinen Knöpfen, damit die oben bleiben)
    this.zone = el('div', 'tc-zone');
    root.insertBefore(this.zone, root.firstChild);
    this.base = el('div', 'tc-base', this.zone);
    this.knob = el('div', 'tc-knob', this.zone);
    this.hint = el('div', 'tc-hint', this.zone, '◀ ziehen ▶');
    // Lenkknöpfe (Bedienung „Tasten“)
    this.left = el('button', 't-left tc-key', root, '◀');
    this.right = el('button', 't-right tc-key', root, '▶');
    for (const [b, dir] of [[this.left, -1], [this.right, 1]]) {
      b.type = 'button';
      this.bindKey(b, dir);
    }
    // Pedale
    this.brake = el('button', 't-brake tc-pedal', root, 'Bremse');
    this.gas = el('button', 't-gas tc-pedal', root, 'Strom');
    for (const [b, k] of [[this.brake, 'brake'], [this.gas, 'gas']]) {
      b.type = 'button';
      this.bindPedal(b, k);
    }
    this.bindZone();
    const reset = () => this.reset();
    window.addEventListener('blur', reset);
    window.addEventListener('orientationchange', reset);
    window.addEventListener('resize', () => {
      if (this.drag) this.reset();
    });
    document.addEventListener('visibilitychange', reset);
    input.onReleaseAll = () => this.reset(false);
    this.configure({ touchMode: 'wischen', cruise: false });
  }

  /** Einstellungen übernehmen (Bedienung, Tempomat). */
  configure(ds) {
    this.mode = ds.touchMode === 'tasten' ? 'tasten' : 'wischen';
    this.root.classList.toggle('tc-tasten', this.mode === 'tasten');
    this.root.classList.toggle('tc-cruise', !!ds.cruise);
    this.gas.textContent = ds.cruise ? 'Strom +' : 'Strom';
    this.reset();
  }

  /** Alles loslassen (Drehen, Pause, Fokusverlust). release: false, wenn die Eingabe selbst gerade loslässt. */
  reset(release = true) {
    this.drag = null;
    this.zone.classList.remove('active');
    this.input.touch.analog = 0;
    if (release) {
      this.input.touch.gas = false;
      this.input.touch.brake = false;
      this.input.touchSteer('touch-l', -1, false);
      this.input.touchSteer('touch-r', 1, false);
    }
    for (const b of [this.left, this.right, this.brake, this.gas]) b.classList.remove('down');
  }

  radius() {
    // auf kleinen Handys ein kürzerer Weg für vollen Einschlag
    return Math.max(44, Math.min(TOUCH.radius, Math.min(window.innerWidth, window.innerHeight) * 0.16));
  }

  bindZone() {
    const z = this.zone;
    z.addEventListener('pointerdown', (e) => {
      if (this.mode !== 'wischen' || this.drag) return;
      e.preventDefault();
      try {
        z.setPointerCapture(e.pointerId);
      } catch (err) {
        /* ältere Browser */
      }
      const r = z.getBoundingClientRect();
      this.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: eventTime(e), x: e.clientX, y: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top };
      this.input.lastDevice = 'touch';
      this.input.anyKey = true;
      z.classList.add('active');
      z.style.setProperty('--tc-r', this.radius() + 'px');
      this.base.style.transform = `translate(${this.drag.ox}px, ${this.drag.oy}px)`;
      this.place(0);
    });
    z.addEventListener('pointermove', (e) => {
      const d = this.drag;
      if (!d || e.pointerId !== d.id) return;
      e.preventDefault();
      d.x = e.clientX;
      d.y = e.clientY;
      const R = this.radius();
      const dx = Math.max(-R, Math.min(R, d.x - d.x0));
      this.input.touch.analog = dragToAnalog(dx, R);
      this.place(dx);
    });
    const end = (e) => {
      const d = this.drag;
      if (!d || e.pointerId !== d.id) return;
      e.preventDefault();
      const ms = eventTime(e) - d.t0;
      const dir = e.type === 'pointerup' ? swipeDir(e.clientX - d.x0, e.clientY - d.y0, ms) : 0;
      this.input.touch.analog = 0;
      if (dir) this.input.touch.lane = dir;
      this.drag = null;
      this.drags++;
      if (this.drags >= 6) this.hint.classList.add('gone');
      z.classList.remove('active');
    };
    z.addEventListener('pointerup', end);
    z.addEventListener('pointercancel', end);
    z.addEventListener('lostpointercapture', end);
  }

  place(dx) {
    const d = this.drag;
    if (!d) return;
    this.knob.style.transform = `translate(${d.ox + dx}px, ${d.oy}px)`;
  }

  bindKey(b, dir) {
    const id = dir < 0 ? 'touch-l' : 'touch-r';
    const on = (e) => {
      e.preventDefault();
      try {
        b.setPointerCapture(e.pointerId);
      } catch (err) {
        /* egal */
      }
      b.classList.add('down');
      this.input.touchSteer(id, dir, true, eventTime(e));
    };
    const off = (e) => {
      e.preventDefault();
      b.classList.remove('down');
      this.input.touchSteer(id, dir, false, eventTime(e));
    };
    b.addEventListener('pointerdown', on);
    b.addEventListener('pointerup', off);
    b.addEventListener('pointercancel', off);
    b.addEventListener('lostpointercapture', off);
  }

  bindPedal(b, key) {
    const on = (e) => {
      e.preventDefault();
      try {
        b.setPointerCapture(e.pointerId);
      } catch (err) {
        /* egal */
      }
      b.classList.add('down');
      this.input.lastDevice = 'touch';
      this.input.touch[key] = true;
    };
    const off = (e) => {
      e.preventDefault();
      b.classList.remove('down');
      this.input.touch[key] = false;
    };
    b.addEventListener('pointerdown', on);
    b.addEventListener('pointerup', off);
    b.addEventListener('pointercancel', off);
    b.addEventListener('lostpointercapture', off);
  }
}
