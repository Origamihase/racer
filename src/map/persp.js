// Die schräge Sicht des Navis (2,5D, wie das Navi im Lkw-Spiel): der Boden – Karte oder Nahansicht – liegt flach vor
// dem Auto, die Kamera schaut um tilt geneigt nach vorn. Bodenpunkte in Bezugs-Bildpunkten: gx nach rechts, gz nach
// vorn, am Auto 1:1 wie in der flachen Ansicht (darum bleibt jeder Maßstab „Bildpunkte je Kilometer am Auto“).
//   w = 1 + gz · sin(tilt) / F,   x = ox + gx / w,   y = oy − gz · cos(tilt) / w
// Mit tilt = 0 ist das genau die flache Ansicht. Rein und unter Node prüfbar (tools/map-test.mjs).

export class Persp {
  constructor() {
    this.set(0, 0, 0, 500);
  }
  /** (ox, oy) = Bildpunkt des Autos, tilt = Neigung (Bogenmaß), F = Brennweite in Bildpunkten. */
  set(ox, oy, tilt, F) {
    this.ox = ox;
    this.oy = oy;
    this.tilt = tilt;
    this.F = F;
    this.c = Math.cos(tilt);
    this.k = Math.sin(tilt) / F;
    return this;
  }
  /** Bild-y des Horizonts (darüber liegt kein Boden). */
  get horizon() {
    return this.k > 0 ? this.oy - this.c / this.k : -Infinity;
  }
  /** Boden → Bild: out = [x, y, m], m = Maßstab an der Stelle (1 am Auto); hinter der Kamera m = 0, x = y = NaN. */
  project(gx, gz, out) {
    const w = 1 + gz * this.k;
    if (!(w > 0.02)) {
      out[0] = out[1] = NaN;
      out[2] = 0;
      return out;
    }
    out[0] = this.ox + gx / w;
    out[1] = this.oy - (gz * this.c) / w;
    out[2] = 1 / w;
    return out;
  }
  /** Bild → Boden: out = [gx, gz, m]; über dem Horizont NaN. */
  unproject(x, y, out) {
    const u = this.oy - y;
    const den = this.c - u * this.k;
    if (!(den > 1e-6)) {
      out[0] = out[1] = NaN;
      out[2] = 0;
      return out;
    }
    const w = this.c / den;
    out[0] = (x - this.ox) * w;
    out[1] = u / den;
    out[2] = 1 / w;
    return out;
  }
  /** Maßstab (Bildpunkte je Bezugs-Bildpunkt) auf der Bildzeile y. */
  scaleAtY(y) {
    return (this.c - (this.oy - y) * this.k) / this.c;
  }
  /** Bodentiefe gz, die auf Bildzeile y liegt (Infinity über dem Horizont). */
  depthAtY(y) {
    const u = this.oy - y;
    const den = this.c - u * this.k;
    return den > 1e-6 ? u / den : Infinity;
  }
}

/**
 * Kartenansicht in der schrägen Sicht: view (View aus mapview.js, flach und gedreht) bringt Kartenpunkte auf den
 * flachen Boden, cam (Persp) legt ihn schräg. toScreen liefert [x, y, m] wie Persp.project.
 */
export class TiltView {
  constructor(view, cam) {
    this.view = view;
    this.cam = cam;
    this.f = [0, 0];
  }
  get w() {
    return this.view.w;
  }
  get h() {
    return this.view.h;
  }
  get scale() {
    return this.view.scale;
  }
  /** Kartenpunkt → Boden (Bezugs-Bildpunkte vor dem Auto): out = [gx, gz]. */
  toGround(wx, wy, out) {
    const v = this.view;
    v.toScreen(wx, wy, out);
    out[0] -= v.ox;
    out[1] = v.oy - out[1];
    return out;
  }
  toScreen(wx, wy, out) {
    this.toGround(wx, wy, this.f);
    return this.cam.project(this.f[0], this.f[1], out);
  }
  /** Bildpunkt → Kartenpunkt (über dem Horizont NaN). */
  toWorld(sx, sy, out) {
    const g = this.cam.unproject(sx, sy, [0, 0, 0]);
    const v = this.view;
    return v.toWorld(v.ox + g[0], v.oy - g[1], out);
  }
  /**
   * Rechteck in Kartenkoordinaten, das den sichtbaren Boden von Bildzeile yTop bis zum unteren Rand (plus pad
   * Bildpunkte) deckt: [x0, y0, x1, y1].
   */
  bounds(pad = 0, yTop = 0) {
    const yt = Math.max(yTop - pad, this.cam.horizon + 4);
    const o = [0, 0];
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const [sx, sy] of [[-pad, yt], [this.w + pad, yt], [-pad, this.h + pad], [this.w + pad, this.h + pad]]) {
      this.toWorld(sx, sy, o);
      x0 = Math.min(x0, o[0]);
      y0 = Math.min(y0, o[1]);
      x1 = Math.max(x1, o[0]);
      y1 = Math.max(y1, o[1]);
    }
    return [x0, y0, x1, y1];
  }
}

/**
 * Ein Band (Straße, Route) auf dem Boden: Linienzug G = [gx, gz, …] in Bezugs-Bildpunkten, halbe Breite hw auf dem
 * Boden; liefert den Umriss im Bild als Path2D (oder zeichnet in path, wenn übergeben). Stücke hinter der Kamera oder
 * jenseits von gzMax fallen weg; die Ecken bleiben rund genug für weiche Linien (Gehrung höchstens doppelt so breit).
 */
export function ribbon(cam, G, hw, gzMin, gzMax, path = new Path2D(), caps = true) {
  const n = G.length / 2;
  let run = [];
  const flush = () => {
    if (run.length >= 4) band(cam, run, hw, path, caps);
    run = [];
  };
  // jedes Stück auf die Scheibe gzMin ≤ gz ≤ gzMax zuschneiden; wo es sie verlässt, endet ein Band
  for (let i = 0; i + 1 < n; i++) {
    const ax = G[i * 2];
    const az = G[i * 2 + 1];
    const bx = G[i * 2 + 2];
    const bz = G[i * 2 + 3];
    if (Number.isNaN(ax) || Number.isNaN(bx)) {
      flush();
      continue;
    }
    let t0 = 0;
    let t1 = 1;
    const dz = bz - az;
    if (Math.abs(dz) < 1e-9) {
      if (az < gzMin || az > gzMax) {
        flush();
        continue;
      }
    } else {
      let ta = (gzMin - az) / dz;
      let tb = (gzMax - az) / dz;
      if (ta > tb) [ta, tb] = [tb, ta];
      t0 = Math.max(t0, ta);
      t1 = Math.min(t1, tb);
      if (!(t0 < t1)) {
        flush();
        continue;
      }
    }
    if (t0 > 0 || !run.length) {
      flush();
      run.push(ax + (bx - ax) * t0, az + dz * t0);
    }
    run.push(ax + (bx - ax) * t1, az + dz * t1);
    if (t1 < 1) flush();
  }
  flush();
  return path;
}

const P = [0, 0, 0];
/** Umriss eines Bands ohne Schnitte: linker Rand hin, rechter zurück. */
function band(cam, G, hw, path, caps) {
  const n = G.length / 2;
  const L = new Float64Array(n * 2);
  const R = new Float64Array(n * 2);
  for (let i = 0; i < n; i++) {
    const a = Math.max(i - 1, 0);
    const b = Math.min(i + 1, n - 1);
    // Normale aus den Nachbarn (gemittelte Richtung), Gehrung begrenzt
    let tx = G[b * 2] - G[a * 2];
    let tz = G[b * 2 + 1] - G[a * 2 + 1];
    let l = Math.hypot(tx, tz) || 1;
    tx /= l;
    tz /= l;
    let m = 1;
    if (i > 0 && i < n - 1) {
      let ux = G[i * 2] - G[a * 2];
      let uz = G[i * 2 + 1] - G[a * 2 + 1];
      l = Math.hypot(ux, uz) || 1;
      ux /= l;
      uz /= l;
      const dot = ux * tx + uz * tz;
      m = 1 / Math.max(dot, 0.5);
    }
    const nx = tz * hw * m;
    const nz = -tx * hw * m;
    cam.project(G[i * 2] - nx, G[i * 2 + 1] - nz, P);
    L[i * 2] = P[0];
    L[i * 2 + 1] = P[1];
    cam.project(G[i * 2] + nx, G[i * 2 + 1] + nz, P);
    R[i * 2] = P[0];
    R[i * 2 + 1] = P[1];
  }
  path.moveTo(L[0], L[1]);
  for (let i = 1; i < n; i++) path.lineTo(L[i * 2], L[i * 2 + 1]);
  if (caps) cap(cam, G, n - 1, n - 2, hw, path);
  for (let i = n - 1; i >= 0; i--) path.lineTo(R[i * 2], R[i * 2 + 1]);
  if (caps) cap(cam, G, 0, 1, hw, path);
  path.closePath();
}
/** Runde Kappe am Ende i (Nachbar j) als Halbkreis auf dem Boden, von links nach rechts um das Ende herum. */
function cap(cam, G, i, j, hw, path) {
  let tx = G[i * 2] - G[j * 2];
  let tz = G[i * 2 + 1] - G[j * 2 + 1];
  const l = Math.hypot(tx, tz) || 1;
  tx /= l;
  tz /= l;
  // Normale rechts: (tz, −tx); Kappe von −N über T nach +N (bzw. umgekehrt am Anfang, wo i = 0 und T nach hinten zeigt)
  for (let a = 1; a < 6; a++) {
    const ang = (a / 6) * Math.PI;
    const cs = Math.cos(ang);
    const sn = Math.sin(ang);
    // Punkt: −N·cos + T·sin  (läuft von −N nach +N)
    const nx = -tz * cs + tx * sn;
    const nz = tx * cs + tz * sn;
    cam.project(G[i * 2] + nx * hw, G[i * 2 + 1] + nz * hw, P);
    path.lineTo(P[0], P[1]);
  }
}
