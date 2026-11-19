// Weiche Formen für Plüschfiguren: Körper werden als Abstandsfunktionen beschrieben (Kugeln, Ellipsoide,
// Kapseln, weich verschmolzen) und einmal beim Laden in Dreiecksnetze verwandelt. So gehen Nase, Wangen,
// Hals oder Schultern ohne Knick ineinander über – wie bei einem prall gestopften Stofftier.
// Zwei Wege zum Netz: „Surface Nets“ für beliebige Formen (Kopf, Haare, Bart, Cap) und ein Strahlen-Netz
// für sternförmige Körper (Bauch, Arme, Beine): dessen Ringe liegen genau dort, wo Säume sitzen sollen.
import * as THREE from 'three';

// --- Abstandsfunktionen ---------------------------------------------------------------------
/** Weiche Vereinigung: k = Breite der Hohlkehle */
export const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
/** Weicher Schnitt (für Abschneiden und Aushöhlen: smax(a, -b, k)) */
export const smax = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.max(a, b) + h * h * k * 0.25;
};

/** Ellipsoid um (cx, cy, cz) mit den Halbachsen (rx, ry, rz) – nahe der Oberfläche genau genug */
export function ell(x, y, z, cx, cy, cz, rx, ry, rz) {
  const px = (x - cx) / rx;
  const py = (y - cy) / ry;
  const pz = (z - cz) / rz;
  const k0 = Math.sqrt(px * px + py * py + pz * pz);
  if (k0 < 1e-6) return -Math.min(rx, ry, rz);
  const qx = px / rx;
  const qy = py / ry;
  const qz = pz / rz;
  return (k0 * (k0 - 1)) / Math.sqrt(qx * qx + qy * qy + qz * qz);
}

/** Superellipsoid (n = 2: Ellipsoid, größer: kantiger – für Kissenformen wie Cap-Krone oder Schuh) */
export function sell(x, y, z, cx, cy, cz, rx, ry, rz, n) {
  const px = Math.abs((x - cx) / rx);
  const py = Math.abs((y - cy) / ry);
  const pz = Math.abs((z - cz) / rz);
  const f = Math.pow(Math.pow(px, n) + Math.pow(py, n) + Math.pow(pz, n), 1 / n);
  return (f - 1) * Math.min(rx, ry, rz);
}

/** Kapsel von a nach b mit den Radien ra und rb (weicher Kegel) */
export function cone(x, y, z, ax, ay, az, bx, by, bz, ra, rb) {
  const dx = bx - ax;
  const dy = by - ay;
  const dz = bz - az;
  const px = x - ax;
  const py = y - ay;
  const pz = z - az;
  let t = (px * dx + py * dy + pz * dz) / (dx * dx + dy * dy + dz * dz);
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const qx = px - dx * t;
  const qy = py - dy * t;
  const qz = pz - dz * t;
  return Math.sqrt(qx * qx + qy * qy + qz * qz) - (ra + (rb - ra) * t);
}

// --- Netze -------------------------------------------------------------------------------------
// Zusatzdaten je Ecke (Name → Breite und Vorgabe). Was ein Stück nicht setzt, bekommt beim Zusammenfügen die Vorgabe.
//   color: Stofffarbe (linear) · fuzz: Flausch/Randlicht · flow: Strichrichtung × Florlänge (0 = kurzer Plüsch)
//   seam: (vorzeichenbehafteter Abstand zur nächsten Naht, zur nächsten Steppstich-Reihe, Lauflänge entlang der
//         Stiche, frei) in m – beides darf über ein Dreieck hinweg keinen falschen Nulldurchgang haben
//   logo: Lage im Aufdruck (0 … 1, außerhalb davon kein Aufdruck) · skin: (Knochen A, Knochen B, Gewicht von B)
export const SOFT_ATTRS = {
  color: { size: 3, fill: [1, 1, 1] },
  fuzz: { size: 1, fill: [1] },
  flow: { size: 3, fill: [0, 0, 0] },
  seam: { size: 4, fill: [1, 1, 0, 0] },
  logo: { size: 2, fill: [-1, -1] },
  skin: { size: 3, fill: [0, 0, 0] },
};

/** Ein Stück Netz: Positionen, Normalen, Dreiecke und Zusatzdaten je Ecke (siehe SOFT_ATTRS). */
export class SoftPart {
  constructor(pos, nrm, idx) {
    this.pos = pos;
    this.nrm = nrm;
    this.idx = idx;
    this.attr = {};
  }

  get count() {
    return this.pos.length / 3;
  }

  /** Legt ein Zusatzfeld an (mit der Vorgabe gefüllt), falls es noch fehlt. */
  field(name) {
    if (!this.attr[name]) {
      const { size, fill } = SOFT_ATTRS[name];
      const a = new Float32Array(this.count * size);
      for (let i = 0; i < a.length; i++) a[i] = fill[i % size];
      this.attr[name] = a;
    }
    return this.attr[name];
  }

  /** Füllt ein Zusatzfeld: fn(x, y, z, nx, ny, nz, out) schreibt out[0 … size−1] (vorbelegt mit dem alten Wert). */
  set(name, fn) {
    const a = this.field(name);
    const size = SOFT_ATTRS[name].size;
    const o = new Array(size);
    const { pos, nrm } = this;
    for (let i = 0, n = this.count; i < n; i++) {
      for (let k = 0; k < size; k++) o[k] = a[i * size + k];
      fn(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], nrm[i * 3], nrm[i * 3 + 1], nrm[i * 3 + 2], o);
      for (let k = 0; k < size; k++) a[i * size + k] = o[k];
    }
    return this;
  }

  /** Einfarbig (THREE.Color, linear) mit festem Flausch */
  flat(color, fuzz = 1) {
    this.field('color');
    this.field('fuzz');
    const c = this.attr.color;
    const f = this.attr.fuzz;
    for (let i = 0, n = this.count; i < n; i++) {
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
      f[i] = fuzz;
    }
    return this;
  }

  /** Mischt eine zweite Farbe ein: w(x, y, z) = Anteil 0 … 1 */
  tint(color, w) {
    return this.set('color', (x, y, z, nx, ny, nz, o) => {
      const k = Math.min(1, Math.max(0, w(x, y, z, nx, ny, nz)));
      o[0] += (color.r - o[0]) * k;
      o[1] += (color.g - o[1]) * k;
      o[2] += (color.b - o[2]) * k;
    });
  }

  /** Fester Strich (Florrichtung × Florlänge) für das ganze Stück oder je Ecke über fn(x, y, z, out). */
  nap(fn) {
    return this.set('flow', (x, y, z, nx, ny, nz, o) => fn(x, y, z, o, nx, ny, nz));
  }

  /**
   * Nähte: fn(x, y, z, out) schreibt out = [Abstand Naht, Abstand Steppstich, Lauflänge, –] (vorbelegt mit dem alten
   * Wert). Die Abstände müssen über ein Dreieck hinweg (fast) linear sein – Ebenen und Kegel sind es –, dann zeichnet
   * der Shader die Linie haarscharf.
   */
  seams(fn) {
    return this.set('seam', (x, y, z, nx, ny, nz, o) => fn(x, y, z, o, nx, ny, nz));
  }

  /**
   * Eingebackene Umgebungsverdeckung: in Falten und dort, wo ein Teil auf dem anderen sitzt, wird die
   * Farbe dunkler. sdf = Abstand zur ganzen Figur (alle Nachbarteile), radii = Tastweiten entlang der Normalen.
   */
  occlude(sdf, strength = 0.55, radii = [0.012, 0.032, 0.07]) {
    const { pos, nrm } = this;
    const col = this.field('color');
    for (let i = 0, n = this.count; i < n; i++) {
      const x = pos[i * 3];
      const y = pos[i * 3 + 1];
      const z = pos[i * 3 + 2];
      const nx = nrm[i * 3];
      const ny = nrm[i * 3 + 1];
      const nz = nrm[i * 3 + 2];
      let occ = 0;
      for (const r of radii) {
        const d = sdf(x + nx * r, y + ny * r, z + nz * r);
        occ += Math.min(1, Math.max(0, 1 - d / r));
      }
      const f = 1 - strength * Math.min(1, occ / radii.length) ** 0.8;
      col[i * 3] *= f;
      col[i * 3 + 1] *= f;
      col[i * 3 + 2] *= f;
    }
    return this;
  }

  /** Wirft Dreiecke weg, deren Ecken alle verdeckt liegen (keep(x, y, z) = false), und räumt die Ecken auf. */
  trim(keep) {
    const { pos, idx } = this;
    const n = this.count;
    const ok = new Uint8Array(n);
    for (let i = 0; i < n; i++) ok[i] = keep(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]) ? 1 : 0;
    const map = new Int32Array(n).fill(-1);
    const out = [];
    let m = 0;
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t];
      const b = idx[t + 1];
      const c = idx[t + 2];
      if (!ok[a] && !ok[b] && !ok[c]) continue;
      for (const v of [a, b, c]) {
        if (map[v] < 0) map[v] = m++;
        out.push(map[v]);
      }
    }
    const pick = (src, size) => {
      const dst = new Float32Array(m * size);
      for (let i = 0; i < n; i++) {
        if (map[i] < 0) continue;
        for (let k = 0; k < size; k++) dst[map[i] * size + k] = src[i * size + k];
      }
      return dst;
    };
    this.pos = pick(this.pos, 3);
    this.nrm = pick(this.nrm, 3);
    for (const name of Object.keys(this.attr)) this.attr[name] = pick(this.attr[name], SOFT_ATTRS[name].size);
    this.idx = out;
    return this;
  }

  /** Verschiebt/dreht/skaliert das Stück (Matrix4); Normalen und Strich werden mitgedreht. */
  transform(m) {
    const v = new THREE.Vector3();
    const nm = new THREE.Matrix3().getNormalMatrix(m);
    const lin = new THREE.Matrix3().setFromMatrix4(m);
    const { pos, nrm } = this;
    const flow = this.attr.flow;
    for (let i = 0, n = this.count; i < n; i++) {
      v.fromArray(pos, i * 3).applyMatrix4(m).toArray(pos, i * 3);
      v.fromArray(nrm, i * 3).applyMatrix3(nm).normalize().toArray(nrm, i * 3);
      if (flow) {
        // Richtung drehen, Länge (Florlänge) behalten
        v.fromArray(flow, i * 3);
        const len = v.length();
        if (len > 0) v.applyMatrix3(lin).setLength(len).toArray(flow, i * 3);
      }
    }
    if (m.determinant() < 0) {
      const { idx } = this;
      for (let t = 0; t < idx.length; t += 3) {
        const a = idx[t];
        idx[t] = idx[t + 1];
        idx[t + 1] = a;
      }
    }
    return this;
  }

  clone() {
    const p = new SoftPart(this.pos.slice(), this.nrm.slice(), this.idx.slice());
    for (const name of Object.keys(this.attr)) p.attr[name] = this.attr[name].slice();
    return p;
  }
}

/**
 * Fügt Stücke zu einer Geometrie zusammen (ein Draw Call je Material). Zusatzfelder heißen in der Geometrie
 * color, plushFuzz, plushFlow, plushSeam, plushLogo; aus „skin“ werden skinIndex/skinWeight.
 */
export function toGeometry(parts, { skinned = false } = {}) {
  let n = 0;
  let ni = 0;
  for (const p of parts) {
    n += p.count;
    ni += p.idx.length;
  }
  const pos = new Float32Array(n * 3);
  const nrm = new Float32Array(n * 3);
  const idx = n > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
  // alle Felder immer anlegen: fehlt eines, liest der Shader 0 (eine Naht überall, ein Aufdruck bei 0, 0)
  const names = Object.keys(SOFT_ATTRS).filter((name) => name !== 'skin' || skinned);
  const data = {};
  for (const name of names) data[name] = new Float32Array(n * SOFT_ATTRS[name].size);
  let o = 0;
  let oi = 0;
  for (const p of parts) {
    pos.set(p.pos, o * 3);
    nrm.set(p.nrm, o * 3);
    for (const name of names) data[name].set(p.field(name), o * SOFT_ATTRS[name].size);
    for (let i = 0; i < p.idx.length; i++) idx[oi + i] = p.idx[i] + o;
    o += p.count;
    oi += p.idx.length;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  const GEO_NAME = { color: 'color', fuzz: 'plushFuzz', flow: 'plushFlow', seam: 'plushSeam', logo: 'plushLogo' };
  for (const name of names) {
    if (name !== 'skin') g.setAttribute(GEO_NAME[name], new THREE.BufferAttribute(data[name], SOFT_ATTRS[name].size));
  }
  if (skinned) {
    const si = new Uint16Array(n * 4);
    const sw = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      const w = data.skin[i * 3 + 2];
      si[i * 4] = data.skin[i * 3];
      si[i * 4 + 1] = data.skin[i * 3 + 1];
      sw[i * 4] = 1 - w;
      sw[i * 4 + 1] = w;
    }
    g.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4));
    g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
  }
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeBoundingSphere();
  g.computeBoundingBox();
  return g;
}

/**
 * Morph-Ziele aus Geometrien derselben Bauart (gleiche Ecken in gleicher Reihenfolge, z. B. dieselben Stücke mit
 * anders gelegten Stützpunkten): gespeichert wird die Verschiebung von Position und Normale gegenüber geo.
 */
export function addMorphs(geo, targets) {
  const diff = (name) => targets.map((t) => {
    const a = t.attributes[name].array;
    const b = geo.attributes[name].array;
    const d = new Float32Array(b.length);
    for (let i = 0; i < b.length; i++) d[i] = a[i] - b[i];
    return new THREE.BufferAttribute(d, 3);
  });
  geo.morphAttributes.position = diff('position');
  geo.morphAttributes.normal = diff('normal');
  geo.morphTargetsRelative = true;
  return geo;
}

// Steigung der Abstandsfunktion (Tetraeder-Differenzen: vier Auswertungen)
const G = [0, 0, 0];
function gradient(sdf, x, y, z, e) {
  const a = sdf(x + e, y - e, z - e);
  const b = sdf(x - e, y - e, z + e);
  const c = sdf(x - e, y + e, z - e);
  const d = sdf(x + e, y + e, z + e);
  G[0] = (a - b - c + d) / (4 * e);
  G[1] = (-a - b + c + d) / (4 * e);
  G[2] = (-a + b - c + d) / (4 * e);
  return G;
}

/** Normale = Steigung der Abstandsfunktion (glatter als gemittelte Flächennormalen) */
function sdfNormals(sdf, pos, e) {
  const nrm = new Float32Array(pos.length);
  for (let i = 0; i < pos.length; i += 3) {
    const g = gradient(sdf, pos[i], pos[i + 1], pos[i + 2], e);
    const l = Math.hypot(g[0], g[1], g[2]) || 1;
    nrm[i] = g[0] / l;
    nrm[i + 1] = g[1] / l;
    nrm[i + 2] = g[2] / l;
  }
  return nrm;
}

/**
 * Surface Nets: Oberfläche sdf = 0 im Quader lo … hi mit Maschenweite h.
 * Erst wird grob abgetastet (jede dritte Masche); fein gerechnet wird nur nahe der Oberfläche.
 */
export function netMesh(sdf, lo, hi, h) {
  const S = 3;
  const bx = Math.ceil((hi[0] - lo[0]) / h / S);
  const by = Math.ceil((hi[1] - lo[1]) / h / S);
  const bz = Math.ceil((hi[2] - lo[2]) / h / S);
  const nx = bx * S + 1;
  const ny = by * S + 1;
  const nz = bz * S + 1;
  const val = new Float32Array(nx * ny * nz);
  const state = new Uint8Array(nx * ny * nz); // 0 = unbekannt, 1 = nur Vorzeichen, 2 = genau
  const at = (i, j, k) => i + nx * (j + ny * k);
  const reach = S * h * 0.87 * 1.35;
  const active = [];
  for (let k = 0; k < bz; k++) {
    for (let j = 0; j < by; j++) {
      for (let i = 0; i < bx; i++) {
        const d = sdf(lo[0] + (i + 0.5) * S * h, lo[1] + (j + 0.5) * S * h, lo[2] + (k + 0.5) * S * h);
        const near = Math.abs(d) <= reach;
        if (near) active.push(i, j, k);
        for (let c = 0; c <= S; c++) {
          for (let b = 0; b <= S; b++) {
            for (let a = 0; a <= S; a++) {
              const q = at(i * S + a, j * S + b, k * S + c);
              if (near) {
                if (state[q] < 2) {
                  val[q] = sdf(lo[0] + (i * S + a) * h, lo[1] + (j * S + b) * h, lo[2] + (k * S + c) * h);
                  state[q] = 2;
                }
              } else if (state[q] === 0) {
                val[q] = d;
                state[q] = 1;
              }
            }
          }
        }
      }
    }
  }
  // je Zelle mit Vorzeichenwechsel eine Ecke: Mittel der Schnittpunkte auf den Zellkanten
  const cnx = nx - 1;
  const cny = ny - 1;
  const cell = new Int32Array(cnx * cny * (nz - 1)).fill(-1);
  const cat = (i, j, k) => i + cnx * (j + cny * k);
  const pos = [];
  const cv = new Float32Array(8);
  const EDGES = [0, 1, 2, 3, 4, 5, 6, 7, 0, 2, 1, 3, 4, 6, 5, 7, 0, 4, 1, 5, 2, 6, 3, 7];
  for (let q = 0; q < active.length; q += 3) {
    for (let c = 0; c < S; c++) {
      for (let b = 0; b < S; b++) {
        for (let a = 0; a < S; a++) {
          const i = active[q] * S + a;
          const j = active[q + 1] * S + b;
          const k = active[q + 2] * S + c;
          let mask = 0;
          for (let m = 0; m < 8; m++) {
            const v = val[at(i + (m & 1), j + ((m >> 1) & 1), k + (m >> 2))];
            cv[m] = v;
            if (v < 0) mask |= 1 << m;
          }
          if (mask === 0 || mask === 255) continue;
          let sx = 0;
          let sy = 0;
          let sz = 0;
          let cnt = 0;
          for (let e = 0; e < 24; e += 2) {
            const m0 = EDGES[e];
            const m1 = EDGES[e + 1];
            const v0 = cv[m0];
            const v1 = cv[m1];
            if (v0 < 0 === v1 < 0) continue;
            const t = v0 / (v0 - v1);
            sx += (m0 & 1) + ((m1 & 1) - (m0 & 1)) * t;
            sy += ((m0 >> 1) & 1) + (((m1 >> 1) & 1) - ((m0 >> 1) & 1)) * t;
            sz += (m0 >> 2) + ((m1 >> 2) - (m0 >> 2)) * t;
            cnt++;
          }
          cell[cat(i, j, k)] = pos.length / 3;
          pos.push(lo[0] + (i + sx / cnt) * h, lo[1] + (j + sy / cnt) * h, lo[2] + (k + sz / cnt) * h);
        }
      }
    }
  }
  // Vierecke: je Gitterkante mit Vorzeichenwechsel die vier Zellen ringsum verbinden
  const idx = [];
  const quad = (a, b, c, d, flip) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (flip) idx.push(a, d, c, a, c, b);
    else idx.push(a, b, c, a, c, d);
  };
  for (let k = 0; k < nz - 1; k++) {
    for (let j = 0; j < cny; j++) {
      for (let i = 0; i < cnx; i++) {
        if (cell[cat(i, j, k)] < 0) continue;
        const v0 = val[at(i, j, k)];
        if (j > 0 && k > 0) {
          const v1 = val[at(i + 1, j, k)];
          if (v0 < 0 !== v1 < 0) quad(cell[cat(i, j - 1, k - 1)], cell[cat(i, j, k - 1)], cell[cat(i, j, k)], cell[cat(i, j - 1, k)], v0 >= 0);
        }
        if (i > 0 && k > 0) {
          const v1 = val[at(i, j + 1, k)];
          if (v0 < 0 !== v1 < 0) quad(cell[cat(i - 1, j, k - 1)], cell[cat(i, j, k - 1)], cell[cat(i, j, k)], cell[cat(i - 1, j, k)], v0 < 0);
        }
        if (i > 0 && j > 0) {
          const v1 = val[at(i, j, k + 1)];
          if (v0 < 0 !== v1 < 0) quad(cell[cat(i - 1, j - 1, k)], cell[cat(i, j - 1, k)], cell[cat(i, j, k)], cell[cat(i - 1, j, k)], v0 >= 0);
        }
      }
    }
  }
  // Ecken genau auf die Oberfläche ziehen (zwei Newton-Schritte entlang der Steigung)
  const p = new Float32Array(pos);
  const e = h * 0.5;
  for (let it = 0; it < 2; it++) {
    for (let i = 0; i < p.length; i += 3) {
      const d = sdf(p[i], p[i + 1], p[i + 2]);
      const g = gradient(sdf, p[i], p[i + 1], p[i + 2], e);
      const l2 = g[0] * g[0] + g[1] * g[1] + g[2] * g[2];
      if (l2 < 1e-6) continue;
      const s = Math.max(-h, Math.min(h, d / l2));
      p[i] -= g[0] * s;
      p[i + 1] -= g[1] * s;
      p[i + 2] -= g[2] * s;
    }
  }
  return new SoftPart(p, sdfNormals(sdf, p, e), idx);
}

/**
 * Abstand vom Ursprung o entlang der Richtung d bis zur äußersten Oberfläche (sdf = 0) innerhalb von rmax:
 * von außen nach innen getastet (Schritte nach dem Abstandswert), dann eingegabelt (Regula falsi, Illinois).
 * So trifft der Strahl auch bei nicht ganz sternförmigen Körpern die Außenhaut.
 */
function surfaceAlong(sdf, ox, oy, oz, dx, dy, dz, rmax) {
  let r1 = rmax;
  let f1 = sdf(ox + dx * r1, oy + dy * r1, oz + dz * r1);
  let r0 = r1;
  let f0 = f1;
  while (f0 >= 0) {
    r1 = r0;
    f1 = f0;
    r0 = r1 - Math.max(f1 * 0.85, 0.0012);
    if (r0 <= 0) return 0;
    f0 = sdf(ox + dx * r0, oy + dy * r0, oz + dz * r0);
  }
  // r0 innen (f0 < 0), r1 außen (f1 ≥ 0)
  let side = 0;
  let r = r0;
  for (let it = 0; it < 7 && r1 - r0 > 2e-5; it++) {
    r = (r0 * f1 - r1 * f0) / (f1 - f0);
    const f = sdf(ox + dx * r, oy + dy * r, oz + dz * r);
    if (f < 0) {
      r0 = r;
      f0 = f;
      if (side === -1) f1 *= 0.5;
      side = -1;
    } else {
      r1 = r;
      f1 = f;
      if (side === 1) f0 *= 0.5;
      side = 1;
    }
  }
  return r;
}

/** Dreiecke für ein Raster aus Reihen × Spalten (Spalten geschlossen) mit je einer Spitze oben und unten. */
function ballIndex(R, n) {
  const idx = [];
  const last = 1 + R * n;
  for (let j = 0; j < n; j++) {
    const j1 = (j + 1) % n;
    idx.push(0, 1 + j, 1 + j1);
    for (let r = 0; r < R - 1; r++) {
      const p0 = 1 + r * n;
      const p1 = p0 + n;
      idx.push(p0 + j, p1 + j, p1 + j1, p0 + j, p1 + j1, p0 + j1);
    }
    idx.push(last, 1 + (R - 1) * n + j1, 1 + (R - 1) * n + j);
  }
  return idx;
}

/**
 * Strahlen-Netz für sternförmige Körper: von der Achse a → b gehen Strahlen nach außen (an den Enden
 * halbkugelförmig), der Schnitt mit sdf = 0 ergibt die Ecke. Das Netz hat saubere Ringe und Spalten.
 * @param {object} o segs: Spalten rundum (oder Liste von Winkeln), ts: Lage der Ringe auf der Achse (1 … 0),
 *   caps: Ringe je Endkappe, front: Richtung des Winkels 0, rmax: größter Abstand von der Achse
 */
export function rayMesh(sdf, a, b, { segs = 16, ts = [1, 0.5, 0], caps = 4, front = [0, 0, 1], rmax = 0.4 } = {}) {
  const A = new THREE.Vector3().fromArray(a);
  const B = new THREE.Vector3().fromArray(b);
  const w = new THREE.Vector3().subVectors(B, A);
  if (w.lengthSq() < 1e-10) w.set(0, 1, 0);
  w.normalize();
  const u = new THREE.Vector3().fromArray(front);
  u.addScaledVector(w, -u.dot(w)).normalize();
  const v = new THREE.Vector3().crossVectors(w, u);
  const angles = Array.isArray(segs) ? segs : Array.from({ length: segs }, (_, i) => (i / segs) * Math.PI * 2);
  const n = angles.length;
  // Reihen von oben (b) nach unten (a): [Ursprung auf der Achse, Polwinkel]
  const rows = [];
  for (let i = 1; i <= caps; i++) rows.push([1, ((i / caps) * Math.PI) / 2]);
  for (const t of ts) if (t < 1 && t > 0) rows.push([t, Math.PI / 2]);
  for (let i = 0; i < caps; i++) rows.push([0, Math.PI / 2 + ((i / caps) * Math.PI) / 2]);
  const pos = [];
  const o = new THREE.Vector3();
  const d = new THREE.Vector3();
  const hit = (t, psi, th) => {
    o.lerpVectors(A, B, t);
    const s = Math.sin(psi);
    d.set(0, 0, 0).addScaledVector(u, s * Math.cos(th)).addScaledVector(v, s * Math.sin(th)).addScaledVector(w, Math.cos(psi));
    const r = surfaceAlong(sdf, o.x, o.y, o.z, d.x, d.y, d.z, rmax);
    pos.push(o.x + d.x * r, o.y + d.y * r, o.z + d.z * r);
  };
  hit(1, 0, 0);
  for (const [t, psi] of rows) for (const th of angles) hit(t, psi, th);
  hit(0, Math.PI, 0);
  const p = new Float32Array(pos);
  return new SoftPart(p, sdfNormals(sdf, p, 0.0015), ballIndex(rows.length, n));
}

/**
 * Strahlen-Netz um einen Mittelpunkt mit frei verteilten Reihen (Polwinkel ab „up“, 0 … π, ohne die Pole) und
 * Spalten (Winkel um „up“, 0 = „front“): dort dichter, wo die Form feiner ist (Gesicht, Mund).
 */
export function rayBall(sdf, c, { thetas, phis, up = [0, 1, 0], front = [0, 0, 1], rmax = 0.4 }) {
  const w = new THREE.Vector3().fromArray(up).normalize();
  const u = new THREE.Vector3().fromArray(front);
  u.addScaledVector(w, -u.dot(w)).normalize();
  const v = new THREE.Vector3().crossVectors(w, u);
  const pos = [];
  const hit = (th, ph) => {
    const s = Math.sin(th);
    const dx = u.x * s * Math.cos(ph) + v.x * s * Math.sin(ph) + w.x * Math.cos(th);
    const dy = u.y * s * Math.cos(ph) + v.y * s * Math.sin(ph) + w.y * Math.cos(th);
    const dz = u.z * s * Math.cos(ph) + v.z * s * Math.sin(ph) + w.z * Math.cos(th);
    const r = surfaceAlong(sdf, c[0], c[1], c[2], dx, dy, dz, rmax);
    pos.push(c[0] + dx * r, c[1] + dy * r, c[2] + dz * r);
  };
  hit(0, 0);
  for (const th of thetas) for (const ph of phis) hit(th, ph);
  hit(Math.PI, 0);
  const p = new Float32Array(pos);
  return new SoftPart(p, sdfNormals(sdf, p, 0.0015), ballIndex(thetas.length, phis.length));
}

/**
 * Winkel-Liste mit örtlich dichterer Teilung: n Schritte von a nach b, die Dichte ist 1 + Σ k·exp(−((x − m)/s)²)
 * für jeden Zusatz [m, s, k] (so liegen bei Augen und Mund mehr Reihen als am Hinterkopf).
 */
export function spacing(a, b, n, extra = [], closed = false) {
  const N = 2000;
  const cum = new Float64Array(N + 1);
  for (let i = 1; i <= N; i++) {
    const x = a + ((b - a) * (i - 0.5)) / N;
    let dens = 1;
    for (const [m, s, k] of extra) dens += k * Math.exp(-(((x - m) / s) ** 2));
    cum[i] = cum[i - 1] + dens;
  }
  // geschlossen (rundum): n Werte ab a, b selbst fehlt; offen: die n − 1 Werte zwischen a und b
  const out = [];
  let j = 0;
  for (let i = closed ? 0 : 1; i < n; i++) {
    const target = (cum[N] * i) / n;
    while (j < N && cum[j + 1] < target) j++;
    const f = (target - cum[j]) / (cum[j + 1] - cum[j] || 1);
    out.push(a + ((b - a) * (j + f)) / N);
  }
  return out;
}

/**
 * Gitterfläche aus einer Formel: fn(u, v, out) schreibt den Punkt für u, v ∈ 0 … 1.
 * closedU schließt die Fläche in u-Richtung (Schlauch). Normalen aus den Nachbarpunkten.
 */
export function gridMesh(nu, nv, fn, { closedU = false, flip = false } = {}) {
  const cols = closedU ? nu : nu + 1;
  const pos = new Float32Array(cols * (nv + 1) * 3);
  const o = [0, 0, 0];
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i < cols; i++) {
      fn(i / nu, j / nv, o);
      pos.set(o, (j * cols + i) * 3);
    }
  }
  const idx = [];
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const i1 = closedU ? (i + 1) % nu : i + 1;
      const a = j * cols + i;
      const b = j * cols + i1;
      const c = (j + 1) * cols + i1;
      const d = (j + 1) * cols + i;
      if (flip) idx.push(a, c, b, a, d, c);
      else idx.push(a, b, c, a, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return new SoftPart(pos, g.getAttribute('normal').array, idx);
}

/**
 * Schlauch entlang einer Kurve (Lippen, Brauen, Bart, Ringe): path(u, out) schreibt den Punkt für u ∈ 0 … 1,
 * section(u) liefert die Halbachsen [quer, hoch] des ovalen Querschnitts. Offene Schläuche enden in einer Spitze
 * (Halbachsen dort gegen 0 laufen lassen), closed schließt die Kurve zum Ring.
 * @param {object} o nu: Ringe entlang, nv: Ecken rundum, up: ungefähre Hochrichtung des Querschnitts ([x, y, z]
 *   oder up(u, out) – etwa die Hautnormale, dann liegt ein flacher Querschnitt auf der Haut), us: eigene Lage der
 *   Ringe (Liste von u)
 */
export function tubeMesh(path, section, { nu = 16, nv = 10, closed = false, up = [0, 1, 0], us = null } = {}) {
  const U = us || Array.from({ length: closed ? nu : nu + 1 }, (_, i) => (closed ? i / nu : 0.5 - 0.5 * Math.cos((Math.PI * i) / nu)));
  const rings = U.length;
  const P = new THREE.Vector3();
  const A = new THREE.Vector3();
  const Bv = new THREE.Vector3();
  const T = new THREE.Vector3();
  const B = new THREE.Vector3(1, 0, 0);
  const N = new THREE.Vector3();
  const UP = new THREE.Vector3();
  const upFn = typeof up === 'function' ? up : null;
  if (!upFn) UP.fromArray(up).normalize();
  const o = [0, 0, 0];
  const uo = [0, 0, 0];
  const at = (u, v) => {
    path(closed ? ((u % 1) + 1) % 1 : Math.min(1, Math.max(0, u)), o);
    return v.fromArray(o);
  };
  const pos = [];
  const e = 0.5 / Math.max(rings, 8);
  for (let i = 0; i < rings; i++) {
    const u = U[i];
    at(u, P);
    T.subVectors(at(u + e, A), at(u - e, Bv));
    if (T.lengthSq() < 1e-14) T.set(0, 0, 1);
    T.normalize();
    if (upFn) {
      upFn(u, uo);
      UP.fromArray(uo).normalize();
    }
    N.crossVectors(T, UP);
    // läuft die Kurve genau entlang der Hochrichtung, bleibt der Querschnitt wie im Ring davor
    if (N.lengthSq() > 1e-8) B.copy(N).normalize();
    N.crossVectors(B, T).normalize();
    const [rb, rn] = section(u);
    for (let j = 0; j < nv; j++) {
      const ph = (j / nv) * Math.PI * 2;
      pos.push(
        P.x + B.x * rb * Math.cos(ph) + N.x * rn * Math.sin(ph),
        P.y + B.y * rb * Math.cos(ph) + N.y * rn * Math.sin(ph),
        P.z + B.z * rb * Math.cos(ph) + N.z * rn * Math.sin(ph),
      );
    }
  }
  const idx = [];
  const last = closed ? rings : rings - 1;
  for (let i = 0; i < last; i++) {
    const i1 = (i + 1) % rings;
    for (let j = 0; j < nv; j++) {
      const j1 = (j + 1) % nv;
      const a = i * nv + j;
      const b = i1 * nv + j;
      const c = i1 * nv + j1;
      const d = i * nv + j1;
      idx.push(a, b, c, a, c, d);
    }
  }
  if (!closed) {
    // Spitzen schließen
    for (const [ring, flip] of [[0, false], [rings - 1, true]]) {
      at(U[ring], P);
      const tip = pos.length / 3;
      pos.push(P.x, P.y, P.z);
      for (let j = 0; j < nv; j++) {
        const a = ring * nv + j;
        const b = ring * nv + ((j + 1) % nv);
        if (flip) idx.push(tip, b, a);
        else idx.push(tip, a, b);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return new SoftPart(g.getAttribute('position').array, g.getAttribute('normal').array, idx);
}
