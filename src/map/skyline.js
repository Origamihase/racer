// Der Horizont der Gegend: welche Berge und Hügel man von einem Punkt der Karte aus sieht (Höhen aus landscape.js),
// je Himmelsrichtung als Erhebungswinkel in drei Entfernungen – nah (Hügel ringsum), mittel (das nächste Gebirge), fern
// (die Alpen vom Alpenvorland aus). sky.js baut daraus die drei Hügelketten am Horizont, statt sie zu erfinden: im
// Norddeutschen Tiefland bleibt er flach, im Rheintal stehen Schwarzwald und Vogesen, vor München die Alpen.
// Dazu je Richtung, wie viel Wald auf den nahen Hügeln steht, und ob die fernen Gipfel Schnee tragen. Rein
// rechnerisch, läuft auch unter Node (tools/landschaft-test.mjs).
import { heightAt, coverAt, landscapeReady } from './landscape.js';

/** Bänder (km): nah, mittel, fern; Abtastung je Strahl (km, wächst nach außen). */
export const SKY = { near: [2.5, 14], mid: [14, 45], far: [45, 180], step0: 0.6, grow: 1.09, eye: 2, bend: 0.0683 };

const RAD = Math.PI / 180;
const kmPerUnit = (y) => 111.32 * Math.cos(2 * Math.atan(Math.exp(-y * RAD)) - Math.PI / 2);
const band = (a, b, v) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const COV = { forest: 0, urban: 0, crop: 0, rock: 0 };

/**
 * Horizont am Kartenpunkt (x, y) in n Richtungen (Peilung im Uhrzeigersinn ab Norden, i · 360°/n): Erhebungswinkel
 * (rad) je Band in near, mid, far (Erdkrümmung und Lichtbrechung abgezogen), wood (0..1: Waldanteil auf den nahen
 * Hügeln), snow (0..1: Höhe der fernen Gipfel über der Schneegrenze), top (m: höchster Punkt im fernen Band). Ohne
 * Daten null.
 */
export function skyline(x, y, n = 360) {
  if (!landscapeReady()) return null;
  const kpu = kmPerUnit(y);
  const h0 = heightAt(x, y) + SKY.eye;
  const out = { n, near: new Float32Array(n), mid: new Float32Array(n), far: new Float32Array(n), wood: new Float32Array(n), snow: new Float32Array(n), rockN: new Float32Array(n), rockM: new Float32Array(n), top: new Float32Array(n) };
  // Abtaststellen einmal für alle Strahlen
  const D = [];
  for (let d = SKY.near[0], st = SKY.step0; d < SKY.far[1]; d += st, st *= SKY.grow) D.push(d);
  for (let i = 0; i < n; i++) {
    const b = (i / n) * Math.PI * 2;
    // Karten-y zeigt nach Süden
    const ux = Math.sin(b) / kpu;
    const uy = -Math.cos(b) / kpu;
    let eN = -1;
    let eM = -1;
    let eF = -1;
    let wood = 0;
    let wn = 0;
    let hN = 0;
    let hM = 0;
    let hF = 0;
    for (const d of D) {
      const px = x + ux * d;
      const py = y + uy * d;
      const h = heightAt(px, py);
      const e = Math.atan((h - h0 - SKY.bend * d * d) / (d * 1000));
      if (d < SKY.near[1]) {
        if (e > eN) eN = e;
        if (h > hN) hN = h;
        coverAt(px, py, COV);
        wood += COV.forest;
        wn++;
      } else if (d < SKY.mid[1]) {
        if (e > eM) eM = e;
        if (h > hM) hM = h;
      } else {
        if (e > eF) eF = e;
        if (h > hF) hF = h;
      }
    }
    out.near[i] = eN;
    out.mid[i] = eM;
    out.far[i] = eF;
    out.wood[i] = wn ? wood / wn : 0;
    const top = Math.max(hM, hF);
    out.top[i] = top;
    out.snow[i] = band(2300, 3200, top);
    out.rockN[i] = band(1700, 2300, hN);
    out.rockM[i] = band(1700, 2300, hM);
  }
  return out;
}

/** Wert eines Rings (Float32Array, Peilung a in rad) linear zwischen den Richtungen. */
export function ringAt(arr, a) {
  const n = arr.length;
  let f = ((a / (Math.PI * 2)) % 1) * n;
  if (f < 0) f += n;
  const i = Math.floor(f);
  const t = f - i;
  return arr[i % n] * (1 - t) + arr[(i + 1) % n] * t;
}
