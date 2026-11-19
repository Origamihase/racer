// Die große Karte im Menü („Karte“ im Titel- und Pausenmenü): die ganze Welt des Spiels mit allen Orten, frei
// verschiebbar und zoombar (Maus: Ziehen und Rad, Touch: Ziehen und zwei Finger, Tasten: Pfeile/WASD und + −).
// Tippen auf einen Ort öffnet seine Karte: Name, Land, Streams laut Wiki, eigene Besuche, Straßenweg von hier und die
// Abzeichen anderer Sammlungen. Oben zählt sie besuchte Orte, Länder und gefahrene Kilometer; die laufende Fahrt
// (Route, gefahrener Weg, Ziel und Auto) ist eingezeichnet.
//
// Gezeichnet wird mit dem Zeichner aus src/map/mapview.js: Kacheln mit eingebrannten Namen (je Maßstabsstufe einmal
// für die ganze Welt gesetzt), darüber je Bild nur Fahrt, Herzen, Abzeichen und Auswahl. Ein neues Bild entsteht nur,
// wenn sich etwas bewegt oder noch Kacheln fehlen.
import {
  MapPainter, View, THEMES, PLACE_BY_INDEX, bucketOf, bucketScale, dotRadius, menuLayoutOf, pickPlace, project,
  countryName, badgesAt, badgeTotals, badgesVersion,
} from '../map/mapview.js';
import { places, nodes, routeFrom, stateOfNode } from '../map/graph.js';
import { drawCar, drawFlag, drawHeart } from '../map/symbols.js';
import { fmtNum, fmtKm } from '../util.js';

const MIN_SCALE = 2.6; // ganze Welt
const MAX_SCALE = 9000; // Straßen in den Orten
const HOME = 'Erlensee'; // Start jeder Fahrt: von hier misst die Ortskarte ohne laufende Fahrt
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

function el(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}

const CELL = 64;
function addSeg(map, ax, ay, bx, by) {
  const i0 = Math.floor(Math.min(ax, bx) / CELL);
  const i1 = Math.floor(Math.max(ax, bx) / CELL);
  const j0 = Math.floor(Math.min(ay, by) / CELL);
  const j1 = Math.floor(Math.max(ay, by) / CELL);
  if ((i1 - i0 + 1) * (j1 - j0 + 1) > 400) return; // weit außerhalb des Bilds
  for (let i = i0; i <= i1; i++) {
    for (let j = j0; j <= j1; j++) {
      const k = i * 4096 + j;
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(ax, ay, bx, by);
    }
  }
}
/** Schneidet die Strecke (ax, ay)–(bx, by) das Rechteck? (Liang–Barsky) */
function segHitsBox(ax, ay, bx, by, x0, y0, x1, y1) {
  let t0 = 0;
  let t1 = 1;
  const dx = bx - ax;
  const dy = by - ay;
  for (const [p, q] of [[-dx, ax - x0], [dx, x1 - ax], [-dy, ay - y0], [dy, y1 - ay]]) {
    if (p === 0) {
      if (q < 0) return false;
    } else {
      const r = q / p;
      if (p < 0) t0 = Math.max(t0, r);
      else t1 = Math.min(t1, r);
      if (t0 > t1) return false;
    }
  }
  return true;
}
function hitsSegs(map, x0, y0, x1, y1) {
  for (let i = Math.floor(x0 / CELL); i <= Math.floor(x1 / CELL); i++) {
    for (let j = Math.floor(y0 / CELL); j <= Math.floor(y1 / CELL); j++) {
      const L = map.get(i * 4096 + j);
      if (!L) continue;
      for (let k = 0; k < L.length; k += 4) if (segHitsBox(L[k], L[k + 1], L[k + 2], L[k + 3], x0, y0, x1, y1)) return true;
    }
  }
  return false;
}

/** Einen Besuch zählen (Spielstand: Wiki-Name → Zahl der Besuche). Liefert die neue Zahl. */
export function recordVisit(save, placeIdx) {
  const key = places[placeIdx].key;
  save.visits = save.visits || {};
  save.visits[key] = (save.visits[key] || 0) + 1;
  return save.visits[key];
}

/** Besuchte Orte als Liste von Ortsindizes, dazu die Zahl der Länder. */
export function visitSummary(visits = {}) {
  const idx = [];
  const cc = new Set();
  for (const p of places) {
    if (!(visits[p.key] > 0)) continue;
    idx.push(p.i);
    cc.add(p.cc);
  }
  return { idx, countries: cc.size };
}

export class MapScreen {
  constructor() {
    this.painter = new MapPainter({ theme: 'light', look: 'menu' });
    this.view = new View();
    this.x = 10;
    this.y = project(51, 10).y;
    this.scale = 20;
    this.zoom = null; // weiches Zoomen {target, ax, ay}
    this.vel = [0, 0]; // Schwung nach dem Loslassen (Bildpunkte je Sekunde)
    this.keys = new Set();
    this.pointers = new Map();
    this.sel = -1;
    this.need = true;
    this.done = true;
    this.raf = 0;
    this.stats = { frames: 0, total: 0, max: 0, last: 0 };
    this.warm = new Set(); // Maßstabsstufen mit fertiger Beschriftung
    this.frame = this.frame.bind(this);
  }

  /** In den Abschnitt s einhängen. d = {save, nav (NavModel der laufenden Fahrt oder null)}. */
  mount(s, d) {
    this.save = d.save;
    this.nav = d.nav || null;
    this.dist = null; // Straßenkilometer ab hier: beim nächsten Antippen neu
    const sum = visitSummary(this.save.visits);
    this.visited = sum.idx;
    s.textContent = '';
    this.root = s;
    this.canvas = el('canvas', 'map-canvas', s);
    this.canvas.setAttribute('aria-label', 'Landkarte');
    const top = el('div', 'map-top', s);
    const head = el('div', 'map-head', top);
    el('h2', '', head, '🗺️ Karte');
    const chips = el('div', 'map-chips', head);
    const chip = (icon, text) => {
      const c = el('span', 'map-chip', chips);
      el('span', 'map-chip-icon', c, icon);
      el('span', '', c, text);
    };
    chip('❤️', `${fmtNum(sum.idx.length)} von ${fmtNum(places.length)} Orten`);
    chip('🌍', sum.countries === 1 ? '1 Land' : `${fmtNum(sum.countries)} Länder`);
    chip('🛣️', fmtKm((this.save.stats.totalKm || 0) * 1000, 0) + ' gefahren');
    for (const t of badgeTotals()) chip(t.icon, t.text);
    const back = el('div', 'menu row map-back', top);
    const bb = el('button', 'btn primary', back, '← Zurück');
    bb.type = 'button';
    bb.dataset.action = 'back';
    const zoom = el('div', 'map-zoom', s);
    const zb = (text, label, f) => {
      const b = el('button', 'btn map-zbtn', zoom, text);
      b.type = 'button';
      b.setAttribute('aria-label', label);
      b.addEventListener('click', f);
    };
    zb('+', 'Näher', () => this.zoomBy(2));
    zb('−', 'Weiter weg', () => this.zoomBy(0.5));
    zb('⌖', this.nav ? 'Zum Auto' : 'Zur Heimat', () => this.home(true));
    this.card = el('div', 'map-card hidden', s);
    this.hint = el('div', 'map-hint', s, matchMedia('(pointer: coarse)').matches
      ? 'Ziehen zum Verschieben · zwei Finger zum Zoomen · Ort antippen'
      : 'Ziehen zum Verschieben · Mausrad zum Zoomen · Ort anklicken');
    this.placed = false;
    this.age = 0;
    this.listen();
    this.sel = -1;
    this.badgeV = badgesVersion();
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Aushängen: Schleife und Horcher beenden (die Kacheln bleiben für das nächste Öffnen). */
  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.off?.();
    this.off = null;
    this.keys.clear();
    this.pointers.clear();
  }

  listen() {
    const c = this.canvas;
    const opts = { passive: false };
    const on = (t, e, f, o) => {
      t.addEventListener(e, f, o);
      return () => t.removeEventListener(e, f, o);
    };
    const offs = [
      on(c, 'pointerdown', (e) => this.down(e)),
      on(c, 'pointermove', (e) => this.move(e)),
      on(c, 'pointerup', (e) => this.up(e)),
      on(c, 'pointercancel', (e) => this.up(e, true)),
      on(c, 'wheel', (e) => this.wheel(e), opts),
      on(c, 'dblclick', (e) => e.preventDefault()),
      on(window, 'keyup', (e) => this.keys.delete(e.code)),
      on(window, 'blur', () => this.keys.clear()),
    ];
    // Größe erst, wenn der Abschnitt sichtbar ist (beim Einhängen ist er noch verborgen)
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.root);
    offs.push(() => ro.disconnect());
    this.off = () => offs.forEach((f) => f());
  }

  resize() {
    const r = this.root.getBoundingClientRect();
    this.w = Math.max(1, Math.round(r.width));
    this.h = Math.max(1, Math.round(r.height));
    // höchstens zwei Bildpunkte je CSS-Bildpunkt: auf Handys mit DPR 3 reicht das und hält 60 Bilder je Sekunde
    this.ps = clamp(window.devicePixelRatio || 1, 1, 2);
    this.canvas.width = Math.round(this.w * this.ps);
    this.canvas.height = Math.round(this.h * this.ps);
    this.need = true;
    if (!this.placed && this.w > 1 && this.h > 1) {
      this.placed = true;
      this.home(false);
    }
  }

  /** Auf das Auto (mit Fahrt) bzw. auf Europa um die Heimat. */
  home(animate) {
    const m = this.nav;
    let x;
    let y;
    let scale;
    if (m && (m.pose.x || m.pose.y)) {
      x = m.pose.x;
      y = m.pose.y;
      scale = 90;
    } else {
      const p = project(50.4, 10.2);
      x = p.x;
      y = p.y;
      scale = clamp(Math.min(this.w / 30, this.h / 22), 8, 60);
    }
    if (animate) this.flyTo(x, y, scale);
    else {
      this.x = x;
      this.y = y;
      this.scale = scale;
      this.zoom = null;
      this.need = true;
    }
  }

  /** Weich an einen Punkt fliegen (Verschieben und Zoomen zugleich). */
  flyTo(x, y, scale) {
    this.fly = { x0: this.x, y0: this.y, s0: this.scale, x, y, s: clamp(scale, MIN_SCALE, MAX_SCALE), t: 0 };
    this.zoom = null;
    this.vel = [0, 0];
  }

  /** Zoomen um den Faktor f, der Kartenpunkt unter (ax, ay) bleibt stehen (Standard: Bildmitte). */
  zoomBy(f, ax = this.w / 2, ay = this.h / 2) {
    const base = this.zoom ? this.zoom.target : this.scale;
    const o = [0, 0];
    this.viewNow().toWorld(ax, ay, o);
    this.zoom = { target: clamp(base * f, MIN_SCALE, MAX_SCALE), ax, ay, wx: o[0], wy: o[1] };
    this.fly = null;
    this.need = true;
  }

  viewNow() {
    return this.view.set(this.x, this.y, this.scale, 0, this.w, this.h);
  }

  /** Maßstab setzen, der Kartenpunkt (wx, wy) bleibt bei (ax, ay). */
  setScale(s, ax, ay, wx, wy) {
    this.scale = clamp(s, MIN_SCALE, MAX_SCALE);
    this.x = wx - (ax - this.w / 2) / this.scale;
    this.y = wy - (ay - this.h / 2) / this.scale;
  }

  // --- Eingaben ----------------------------------------------------------------------------
  local(e) {
    const r = this.canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }
  down(e) {
    e.preventDefault();
    this.canvas.setPointerCapture?.(e.pointerId);
    const [x, y] = this.local(e);
    this.pointers.set(e.pointerId, { x, y, x0: x, y0: y, t0: performance.now() });
    this.vel = [0, 0];
    this.fly = null;
    this.zoom = null;
    this.samples = [];
    if (this.pointers.size === 2) this.pinchStart();
    if (this.pointers.size > 1) this.tapOk = false;
    else this.tapOk = true;
  }
  pinchStart() {
    const [a, b] = [...this.pointers.values()];
    const o = [0, 0];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    this.viewNow().toWorld(mx, my, o);
    this.pinch = { d0: Math.max(10, Math.hypot(a.x - b.x, a.y - b.y)), s0: this.scale, wx: o[0], wy: o[1] };
  }
  move(e) {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    e.preventDefault();
    const [x, y] = this.local(e);
    const dx = x - p.x;
    const dy = y - p.y;
    p.x = x;
    p.y = y;
    if (Math.hypot(x - p.x0, y - p.y0) > 8) this.tapOk = false;
    if (this.pointers.size >= 2 && this.pinch) {
      const [a, b] = [...this.pointers.values()];
      const d = Math.max(10, Math.hypot(a.x - b.x, a.y - b.y));
      this.setScale(this.pinch.s0 * (d / this.pinch.d0), (a.x + b.x) / 2, (a.y + b.y) / 2, this.pinch.wx, this.pinch.wy);
    } else if (this.pointers.size === 1) {
      this.x -= dx / this.scale;
      this.y -= dy / this.scale;
      const t = performance.now();
      this.samples.push([t, dx, dy]);
      while (this.samples.length && t - this.samples[0][0] > 90) this.samples.shift();
    }
    this.need = true;
  }
  up(e, cancel = false) {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    this.pointers.delete(e.pointerId);
    if (this.pointers.size === 1) {
      // vom Zoomen zurück zum Ziehen: kein Sprung
      this.pinch = null;
      this.samples = [];
      return;
    }
    if (this.pointers.size) return;
    this.pinch = null;
    const t = performance.now();
    if (!cancel && this.tapOk && t - p.t0 < 450) {
      this.tap(p.x, p.y, t);
      return;
    }
    // Schwung: mittlere Geschwindigkeit der letzten Bewegungen
    const S = (this.samples || []).filter((q) => t - q[0] < 90);
    if (S.length >= 2) {
      const span = Math.max(16, t - S[0][0]);
      const vx = (S.reduce((a, q) => a + q[1], 0) / span) * 1000;
      const vy = (S.reduce((a, q) => a + q[2], 0) / span) * 1000;
      if (Math.hypot(vx, vy) > 120) this.vel = [vx, vy];
    }
  }
  tap(x, y, t) {
    // doppelt getippt: näher heran
    if (this.lastTap && t - this.lastTap.t < 320 && Math.hypot(x - this.lastTap.x, y - this.lastTap.y) < 30) {
      this.lastTap = null;
      this.zoomBy(2, x, y);
      return;
    }
    this.lastTap = { t, x, y };
    this.select(this.pick(x, y));
  }
  /** Ort unter dem Bildpunkt: sein Punkt (44 Bildpunkte Trefferfläche) oder sein Name. */
  pick(x, y) {
    const v = this.viewNow();
    const b = bucketOf(v.scale);
    const L = menuLayoutOf(b);
    let i = pickPlace(v, x, y, 22, L.shown);
    if (i >= 0) return i;
    const f = v.scale / bucketScale(b);
    const o = [0, 0];
    for (const l of L.labels) {
      if (l.kind !== 'place') continue;
      v.toScreen(l.x, l.y, o);
      const x0 = o[0] + l.dx * f;
      const y0 = o[1] + l.dy * f;
      if (x >= x0 - 4 && x <= x0 + l.w * f + 4 && y >= y0 - 6 && y <= y0 + l.h * f + 6) i = l.i;
    }
    return i;
  }
  wheel(e) {
    e.preventDefault();
    const [x, y] = this.local(e);
    const d = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
    this.zoomBy(Math.exp(-clamp(d, -400, 400) * 0.0022), x, y);
  }
  /** Tasten (von Menus.onKey weitergereicht). Liefert true, wenn die Karte die Taste genommen hat. */
  onKey(e) {
    const c = e.code;
    if (/^(Arrow(Up|Down|Left|Right)|Key[WASD])$/.test(c)) {
      if (document.activeElement?.closest?.('.map-zoom')) document.activeElement.blur();
      this.keys.add(c);
      this.fly = null;
      e.preventDefault();
      return true;
    }
    if (c === 'Equal' || c === 'NumpadAdd' || c === 'PageUp' || e.key === '+') {
      this.zoomBy(1.6);
      e.preventDefault();
      return true;
    }
    if (c === 'Minus' || c === 'NumpadSubtract' || c === 'PageDown' || e.key === '-') {
      this.zoomBy(1 / 1.6);
      e.preventDefault();
      return true;
    }
    if ((c === 'Escape' || c === 'Backspace') && this.sel >= 0) {
      this.select(-1);
      e.preventDefault();
      return true;
    }
    return false;
  }

  // --- Ortskarte ---------------------------------------------------------------------------
  select(i) {
    this.sel = i;
    this.selT = 0;
    this.need = true;
    const card = this.card;
    card.textContent = '';
    card.classList.toggle('hidden', i < 0);
    if (i < 0) return;
    const p = places[i];
    const close = el('button', 'map-card-x', card, '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Schließen');
    close.addEventListener('click', () => this.select(-1));
    const n = (this.save.visits || {})[p.key] || 0;
    el('div', 'mc-name', card, p.name);
    el('div', 'mc-sub', card, countryName(p.cc) + (p.pop > 0 ? ' · ' + fmtNum(p.pop) + ' Einwohner' : ''));
    const row = (icon, text, cls = '') => {
      const r = el('div', 'mc-row ' + cls, card);
      el('span', 'mc-icon', r, icon);
      el('span', '', r, text);
    };
    row('📺', p.n === 1 ? '1 Stream laut Wiki' : `${fmtNum(p.n)} Streams laut Wiki`);
    row(n ? '❤️' : '🤍', n ? (n === 1 ? 'Einmal besucht' : `${fmtNum(n)}-mal besucht`) : 'Noch nicht besucht', n ? 'mc-visited' : '');
    const km = this.roadKm(i);
    if (km !== null) row('🛣️', km < 1 ? 'Du bist hier' : `${fmtNum(Math.round(km))} km Straßenweg ${this.nav ? 'von hier' : 'ab ' + HOME}`);
    for (const b of badgesAt(i)) row(b.icon, b.text);
    // Ort nicht unter der Karte verstecken
    requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      const R = this.root.getBoundingClientRect();
      const q = PLACE_BY_INDEX[i];
      const o = [0, 0];
      this.viewNow().toScreen(q.x, q.y, o);
      const left = r.left - R.left;
      const topY = r.top - R.top;
      const under = o[0] > left - 30 && o[0] < left + r.width + 30 && o[1] > topY - 30;
      const out = o[0] < 20 || o[1] < 20 || o[0] > this.w - 20 || o[1] > this.h - 20;
      if (under || out) {
        const wide = r.width < this.w * 0.6;
        const tx = wide ? left + r.width + (this.w - left - r.width) / 2 : this.w / 2;
        const ty = wide ? this.h / 2 : topY / 2;
        this.flyTo(q.x - (tx - this.w / 2) / this.scale, q.y - (ty - this.h / 2) / this.scale, this.scale);
      }
    });
  }
  /** Straßenkilometer zum Ort: von der laufenden Fahrt aus, sonst ab der Heimat. */
  roadKm(i) {
    try {
      if (!this.dist) {
        const trip = this.nav && this.nav.trip;
        this.dist = trip ? trip.distances() : routeFrom(stateOfNode(nodes.findIndex((n) => n.id === HOME)));
      }
      const km = this.dist.toPlace(i).km;
      return Number.isFinite(km) ? km : null;
    } catch (e) {
      return null;
    }
  }

  // --- Zeichnen ------------------------------------------------------------------------------
  frame(t) {
    this.raf = requestAnimationFrame(this.frame);
    const dt = clamp((t - (this.tLast || t)) / 1000, 0, 0.1);
    this.tLast = t;
    let moving = false;
    // Tasten: gleichmäßig verschieben
    const kx = (this.keys.has('ArrowRight') || this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('ArrowLeft') || this.keys.has('KeyA') ? 1 : 0);
    const ky = (this.keys.has('ArrowDown') || this.keys.has('KeyS') ? 1 : 0) - (this.keys.has('ArrowUp') || this.keys.has('KeyW') ? 1 : 0);
    if (kx || ky) {
      const sp = (Math.min(this.w, this.h) * 0.9 * dt) / this.scale;
      this.x += kx * sp;
      this.y += ky * sp;
      moving = true;
    }
    if (this.vel[0] || this.vel[1]) {
      this.x -= (this.vel[0] * dt) / this.scale;
      this.y -= (this.vel[1] * dt) / this.scale;
      const f = Math.exp(-dt * 4.5);
      this.vel = [this.vel[0] * f, this.vel[1] * f];
      if (Math.hypot(this.vel[0], this.vel[1]) < 12) this.vel = [0, 0];
      moving = true;
    }
    if (this.zoom) {
      const z = this.zoom;
      const k = 1 - Math.exp(-dt * 14);
      let s = this.scale * Math.pow(z.target / this.scale, k);
      if (Math.abs(Math.log(z.target / s)) < 0.003) {
        s = z.target;
        this.zoom = null;
      }
      this.setScale(s, z.ax, z.ay, z.wx, z.wy);
      moving = true;
    }
    if (this.fly) {
      const f = this.fly;
      f.t = Math.min(1, f.t + dt / 0.6);
      const e = f.t < 0.5 ? 4 * f.t ** 3 : 1 - (-2 * f.t + 2) ** 3 / 2;
      this.x = f.x0 + (f.x - f.x0) * e;
      this.y = f.y0 + (f.y - f.y0) * e;
      this.scale = f.s0 * Math.pow(f.s / f.s0, e);
      if (f.t >= 1) this.fly = null;
      moving = true;
    }
    // Rand der Welt
    const half = this.w / 2 / this.scale;
    this.x = clamp(this.x, -175 + Math.min(half, 150), 180 - Math.min(half, 150));
    this.y = clamp(this.y, project(78, 0).y, project(-58, 0).y);
    if (this.sel >= 0) {
      this.selT += dt;
      if (this.selT < 1.2) moving = true;
    }
    if (badgesVersion() !== this.badgeV) {
      this.badgeV = badgesVersion();
      this.need = true;
    }
    // Hinweis nach dem ersten Bewegen oder nach acht Sekunden ausblenden
    this.age = (this.age || 0) + dt;
    if ((moving || this.age > 8) && !this.hint.classList.contains('gone')) this.hint.classList.add('gone');
    if (!this.placed) return;
    if (!moving && !this.need && this.done) {
      // in Ruhe: die Beschriftung der Nachbarstufen vorbereiten (Zoomen ruckelt dann nicht)
      const b = bucketOf(this.scale);
      for (const nb of [b + 1, b - 1, b + 2]) {
        if (!this.warm.has(nb)) {
          this.warm.add(nb);
          menuLayoutOf(nb);
          break;
        }
      }
      return;
    }
    this.draw();
  }

  draw() {
    const t0 = performance.now();
    const ctx = this.canvas.getContext('2d');
    const v = this.viewNow();
    const ps = this.ps;
    const T = THEMES[this.painter.theme];
    this.done = this.painter.drawTiles(ctx, v, ps, 5);
    ctx.setTransform(ps, 0, 0, ps, 0, 0);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    this.drawTrip(ctx, v, T);
    this.drawMarks(ctx, v, T);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.need = false;
    const ms = performance.now() - t0;
    const S = this.stats;
    S.frames++;
    S.total += ms;
    S.max = Math.max(S.max, ms);
    S.last = ms;
  }

  /** Laufende Fahrt: gefahrener Weg, Route bis zum Ziel, Zielfahne und Auto. */
  drawTrip(ctx, v, T) {
    const m = this.nav;
    if (!m || !m.pose) return;
    const o = [0, 0];
    const segs = (this.segs = new Map()); // Stücke der Linien in 64-Bildpunkt-Feldern (für die Namen darüber)
    const W = this.w + 40;
    const H = this.h + 40;
    // Linienzug als Pfad; Stücke ganz neben dem Bild (beide Enden jenseits derselben Kante) setzen nur den Stift um,
    // so bleibt auch ein langer gefahrener Weg beim Verschieben billig
    const path = (P) => {
      const p = new Path2D();
      let pen = false;
      let px = 0;
      let py = 0;
      for (let i = 0; i < P.length; i += 2) {
        if (Number.isNaN(P[i])) {
          pen = false;
          continue;
        }
        v.toScreen(P[i], P[i + 1], o);
        const off = pen && ((px < -40 && o[0] < -40) || (py < -40 && o[1] < -40) || (px > W && o[0] > W) || (py > H && o[1] > H));
        if (pen && !off) {
          p.lineTo(o[0], o[1]);
          addSeg(segs, px, py, o[0], o[1]);
        } else p.moveTo(o[0], o[1]);
        px = o[0];
        py = o[1];
        pen = true;
      }
      return p;
    };
    const w = clamp(2 + Math.log2(v.scale / 20), 2.5, 6);
    if (m.trail.length >= 4) {
      const p = path(m.trail);
      ctx.strokeStyle = T.drivenCase;
      ctx.lineWidth = w + 2.5;
      ctx.stroke(p);
      ctx.strokeStyle = T.driven;
      ctx.lineWidth = w;
      ctx.stroke(p);
    }
    const R = m.route;
    if (R) {
      const a0 = Math.max(0, m.routeA());
      const p = path(R.line.slice(a0, R.line.len));
      ctx.strokeStyle = T.routeGlow;
      ctx.lineWidth = w + 9;
      ctx.stroke(p);
      ctx.strokeStyle = T.routeCase;
      ctx.lineWidth = w + 3;
      ctx.stroke(p);
      ctx.strokeStyle = T.route;
      ctx.lineWidth = w;
      ctx.stroke(p);
    }
    this.relabel(ctx, v, T);
    if (m.trip && m.trip.target >= 0) {
      const q = PLACE_BY_INDEX[m.trip.target];
      v.toScreen(q.x, q.y, o);
      drawFlag(ctx, o[0], o[1], 0.75);
    }
    // das Auto: in der Weltansicht kleiner, damit es Europa nicht zudeckt
    v.toScreen(m.pose.x, m.pose.y, o);
    const size = clamp(16 + 2.4 * Math.log2(v.scale / 3), 18, 28);
    ctx.strokeStyle = 'rgba(47,111,228,0.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(o[0], o[1], size * 0.62, 0, Math.PI * 2);
    ctx.stroke();
    drawCar(ctx, o[0], o[1], Math.atan2(m.pose.dx, -m.pose.dy), size, null);
  }

  /** Ortsnamen, über die Route oder gefahrener Weg laufen, noch einmal obenauf (wie in den Kacheln). */
  relabel(ctx, v, T) {
    const b = bucketOf(v.scale);
    const f = v.scale / bucketScale(b);
    const o = [0, 0];
    const ps = this.ps;
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.lineJoin = 'round';
    for (const l of menuLayoutOf(b).labels) {
      if (l.kind !== 'place') continue;
      v.toScreen(l.x, l.y, o);
      const x0 = o[0] + l.dx * f;
      const y0 = o[1] + l.dy * f;
      if (x0 > this.w || y0 > this.h || x0 + l.w * f < 0 || y0 + l.h * f < 0) continue;
      if (!hitsSegs(this.segs, x0, y0, x0 + l.w * f, y0 + l.h * f)) continue;
      ctx.setTransform(ps * f, 0, 0, ps * f, ps * x0, ps * y0);
      ctx.font = l.font;
      ctx.lineWidth = 3;
      ctx.strokeStyle = T.halo;
      ctx.strokeText(l.text, 1, l.h / 2);
      ctx.fillStyle = T.text;
      ctx.fillText(l.text, 1, l.h / 2);
    }
    ctx.restore();
  }

  /** Herzen auf besuchten Orten, Ringe an Orten mit Abzeichen und die Auswahl. */
  drawMarks(ctx, v, T) {
    const b = bucketOf(v.scale);
    const bs = bucketScale(b);
    const f = v.scale / bs;
    const shown = menuLayoutOf(b).shown;
    const o = [0, 0];
    const inside = () => o[0] > -20 && o[1] > -20 && o[0] < this.w + 20 && o[1] < this.h + 20;
    for (const i of shown) {
      if (!badgesAt(i).length) continue;
      const p = PLACE_BY_INDEX[i];
      v.toScreen(p.x, p.y, o);
      if (!inside()) continue;
      ctx.strokeStyle = '#f2b51c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(o[0], o[1], dotRadius(p, bs) * f + 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const i of this.visited) {
      if (!shown.has(i)) continue;
      const p = PLACE_BY_INDEX[i];
      v.toScreen(p.x, p.y, o);
      if (!inside()) continue;
      drawHeart(ctx, o[0], o[1], Math.max(4.5, dotRadius(p, bs) * f * 1.25), T.heart, '#ffffff');
    }
    if (this.sel >= 0) {
      const p = PLACE_BY_INDEX[this.sel];
      v.toScreen(p.x, p.y, o);
      const k = clamp(this.selT / 0.35, 0, 1);
      const r = (shown.has(this.sel) ? dotRadius(p, bs) * f : 4) + 5 + 5 * (1 - k);
      ctx.strokeStyle = 'rgba(47,111,228,' + (0.35 + 0.5 * k).toFixed(2) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(o[0], o[1], r, 0, Math.PI * 2);
      ctx.stroke();
      if (!shown.has(this.sel)) {
        ctx.fillStyle = T.route;
        ctx.beginPath();
        ctx.arc(o[0], o[1], 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
