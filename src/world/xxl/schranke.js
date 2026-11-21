// „Bezahlschranke ist ein geiles Wort“ (Stream des Eigentümers vom 21.11.2026): In jedem fünften Ort steht gleich
// hinter der Ortstafel eine rot-weiße Schranke über der eigenen Spur, mit Kassenhäuschen und Münzschild. Wo das
// Spiel sie spielt (gags.js), ist sie zu, bis jemand im Chat ein paar Cent einwirft – sie geht auf, lange bevor der
// Wagen dort ist; sonst steht sie offen. Aufgehalten wird niemand.
//
// Rahmen der Schranke: Fuß des Pfostens im Ursprung auf dem Streifen rechts (Ortskoordinaten: x wie die Straße,
// z = −u), der Arm zeigt geschlossen nach −x über die eigene Spur und klappt zum Öffnen nach oben.
import * as THREE from 'three';
import { W } from '../../curve.js';
import { places } from '../../map/graph.js';
import { STREET } from '../kit/layout.js';

export const SCHRANKE = {
  u: 11, // hinter der Ortstafel (signplan.js TOWN_SIGN_IN 6 m), vor der ersten Laterne des Gehwegs (ab 14 m)
  x: STREET.curbR + 0.55, // Pfosten auf dem Streifen rechts, 0,55 m hinter dem Bordstein
  arm: 4.0, // über die eigene Spur bis kurz vor die Mittellinie
  h: 1.0, // Höhe der Drehachse
  every: 5, // jeder fünfte Ort (nach seiner Nummer in der Karte)
};

/**
 * Die Schranke einer Ortsdurchfahrt oder null: { u (Ortskoordinate), s (Meter der Fahrt) } – in jedem fünften Ort,
 * nie im Startort.
 */
export function schrankeOf(sec) {
  if (!sec || sec.kind !== 'stadt' || sec.start || !places[sec.place] || sec.place % SCHRANKE.every !== 0) return null;
  return { u: SCHRANKE.u, s: sec.s0 + SCHRANKE.u };
}

let parts = null;
/** Geometrien und Materialien teilen sich alle Schranken (sie bleiben, wenn ein Ort abgeräumt wird). */
function shared() {
  if (parts) return parts;
  const seg = SCHRANKE.arm / 8;
  parts = {
    post: new THREE.BoxGeometry(0.2, 1.15, 0.2),
    band: new THREE.BoxGeometry(0.21, 0.1, 0.21),
    seg: new THREE.BoxGeometry(seg, 0.09, 0.07),
    weight: new THREE.BoxGeometry(0.36, 0.15, 0.12),
    box: new THREE.BoxGeometry(0.34, 0.5, 0.26),
    plate: new THREE.BoxGeometry(0.32, 0.24, 0.03),
    coin: new THREE.CylinderGeometry(0.075, 0.075, 0.02, 20),
    yellow: W.lambert({ color: 0xf2c230 }),
    black: W.lambert({ color: 0x23262b }),
    red: W.lambert({ color: 0xd8282d }),
    white: W.lambert({ color: 0xf4f4f4 }),
    grey: W.lambert({ color: 0x8a949e }),
    blue: W.lambert({ color: 0x1f5fbf }),
    gold: W.lambert({ color: 0xf6cf45 }),
  };
  return parts;
}

/** Baut eine Schranke: { group, set(k) – 0 zu … 1 offen, k }. Sie steht offen da. */
export function buildSchranke() {
  const P = shared();
  const group = new THREE.Group();
  group.name = 'Bezahlschranke';
  const mesh = (geo, mat, x, y, z, parent = group) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  // Pfosten mit schwarzen Bändern, davor (dem Wagen zu) das Kassenhäuschen mit blauem Münzschild
  mesh(P.post, P.yellow, 0, 0.575, 0);
  mesh(P.band, P.black, 0, 0.35, 0);
  mesh(P.band, P.black, 0, 0.75, 0);
  mesh(P.box, P.grey, 0.02, 0.95, 0.36);
  mesh(P.plate, P.blue, 0.02, 1.36, 0.42);
  const coin = mesh(P.coin, P.gold, 0.02, 1.36, 0.44);
  coin.rotation.x = Math.PI / 2;
  // der Arm: acht Stücke rot und weiß, am Pfosten ein Gegengewicht; er dreht um die Achse längs der Straße
  const pivot = new THREE.Group();
  pivot.position.set(0, SCHRANKE.h, 0);
  group.add(pivot);
  const seg = SCHRANKE.arm / 8;
  for (let i = 0; i < 8; i++) mesh(P.seg, i % 2 ? P.white : P.red, -(seg / 2 + i * seg), 0, 0, pivot);
  mesh(P.weight, P.black, 0.24, 0, 0, pivot);
  const rig = {
    group,
    k: -1,
    set(k) {
      k = Math.min(1, Math.max(0, k));
      if (k === rig.k) return;
      rig.k = k;
      // weich anfahren und abbremsen; offen steht der Arm fast senkrecht, ein wenig über die Straße geneigt
      const e = k * k * (3 - 2 * k);
      pivot.rotation.z = -e * Math.PI * 0.47;
    },
  };
  rig.set(1);
  return rig;
}
