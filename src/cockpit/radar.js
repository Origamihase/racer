// Der Radarwarner aus dem Shop: ein kleines, rundes Kästchen auf dem Armaturenbrett, links vom Lenkrad schräg
// vor dem Platz der Wackel-Elsa. Vorn ein dunkles Fensterchen mit drei Empfangsbalken, oben ein Lämpchen im Zierring
// und die Schlitze des Piepsers. Das Lämpchen glimmt ruhig grün; solange das Kästchen vor einem Blitzer warnt, blinkt
// es rot.
import * as THREE from 'three';
import { smoothstep } from '../util.js';
import { pillow, lathe, roundedRect, place, prep, meshOf } from './parts.js';
import { dashTopY } from './cabin.js';

// Platz auf dem Armaturenbrett (Fahrzeug-Koordinaten) und Drehung zum Fahrer hin: links neben dem Lenkradkranz, wo aus
// Mini Adams Sicht nur Armaturenbrett liegt – keine Straße, kein Spiegel, nicht OMI – und so weit hinten, dass die
// linke Hand es auch beim Lenken nicht verdeckt. Die Wackel-Elsa steht eine Handbreit rechts dahinter.
const SPOT = { x: -0.67, z: -0.64, yaw: 0.3 };
// Hochkant (Handy aufrecht) ist das Bild schmal: Dort stünde es am linken Bildrand und verlöre in einer langen
// Rechtskurve ein Stück. Es rückt dann 13,5 cm nach vorn zur Scheibe (2,4 cm Luft), im Bild zur Mitte hin: bei
// 390 × 844 rund 26 px Rand in Ruhe, 6 px in der Rechtskurve, frei von Hand, Kranz und Elsas Sockel. Dazwischen
// gleitet es mit dem Bildformat wie die Griffe der Hände (cockpit.setAspect).
const SPOT_TALL = { x: -0.675, z: -0.775, yaw: 0.3 };
// Gehäuse: Breite, Höhe, Tiefe (m) – und so tief steckt es im Polster des Armaturenbretts (kein Spalt darunter)
const BOX = { w: 0.066, h: 0.031, d: 0.048, sink: 0.0006 };
// Lämpchen: Ruhe, Warnung dunkel, Warnung hell (ungetönt wie die REC-Lampe der Action-Cam: bei Sonne, Regen und im
// Dunkeln dieselbe Farbe) – und so oft blinkt es je Sekunde
const LAMP = [0x1c8a4b, 0x4a100c, 0xff2a1e];
const BLINK_HZ = 3;
// Schein ums Lämpchen in den hellen Phasen der Warnung: Radius (m), Stärke in der Mitte, Neigung zum Fahrer (rad) und
// wie weit er vor dem Lämpchen schwebt (m) – so schneidet ihn das Gehäuse nicht an
const GLOW = { r: 0.026, gain: 0.7, tilt: 0.3, out: 0.03 };

/** Flaches Plättchen mit runden Ecken und weicher Kante, Vorderseite nach +z: w × h, Eckradius r, Dicke t. */
function plate(w, h, r, t) {
  const b = Math.min(0.0006, t / 3);
  return new THREE.ExtrudeGeometry(roundedRect(w - 2 * b, h - 2 * b, r - b), {
    depth: t - 2 * b, bevelEnabled: true, bevelSize: b, bevelThickness: b, bevelSegments: 2, curveSegments: 5,
  }).translate(0, 0, b - t);
}

/**
 * Baut das Kästchen. mats: Sammelmaterialien der Kabine (soft, gloss, satin, led), shadowMat: der weiche Schatten
 * unter allem, was auf dem Armaturenbrett steht. Gibt { group, place(x, z, yaw), update(alarm, t) } zurück:
 * update lässt das Lämpchen ruhig grün glimmen oder – solange alarm gilt – rot blinken (t: Spielzeit in Sekunden).
 */
export function buildRadar(mats, shadowMat) {
  const { w, h, d } = BOX;
  const top = h - BOX.sink;
  const L = { soft: [], gloss: [], satin: [], led: [] };
  // Gehäuse: gummiert, mit runden Kanten, Seiten und Deckel leicht gewölbt; nach unten dunkler (dort steht es im
  // eigenen Schatten)
  L.soft.push(prep(place(pillow(w, h, d, 0.0085, [0.0007, 0.0005, 0], 8), 0, h / 2 - BOX.sink, 0), 0x2c2f35, {
    shade: (p, n) => (0.66 + 0.34 * smoothstep(0, 0.014, p.y)) * (0.9 + 0.2 * Math.max(0, n.y)),
  }));
  // Fensterchen in der Stirnseite (zum Fahrer): dunkles Glas in schmalem Zierrahmen, darin drei Empfangsbalken und
  // oben links ein schmaler Lichtreflex (sonst stünde es als schwarzes Loch da)
  const fz = d / 2;
  const wy = top * 0.5;
  L.satin.push(prep(place(plate(0.04, 0.0166, 0.0034, 0.0018), 0, wy, fz + 0.0008), 0x8d9198));
  L.gloss.push(prep(place(plate(0.0356, 0.0122, 0.002, 0.001), 0, wy, fz + 0.0013), 0x0a0d11));
  // (Balken, Reflex und Schlitze sind millimeterklein: schlichte Quader, runde Kanten sähe dort niemand)
  const bit = (bw, bh, bd) => new THREE.BoxGeometry(bw, bh, bd);
  [0.0032, 0.0054, 0.0076].forEach((bh, i) => {
    L.led.push(prep(place(bit(0.0026, bh, 0.0006), 0.0048 + i * 0.0042, wy - 0.0042 + bh / 2, fz + 0.0014), 0x3fb7a4));
  });
  L.led.push(prep(place(bit(0.0105, 0.0011, 0.0006), -0.0098, wy + 0.0038, fz + 0.0014), 0x33404d));
  // Deckel: links das Lämpchen in seinem Zierring, rechts die drei Schlitze des Piepsers
  for (let i = 0; i < 3; i++) L.gloss.push(prep(place(bit(0.0105, 0.0012, 0.0017), 0.0145, top + 0.0003, -0.0055 + i * 0.0055), 0x090a0c));
  const lx = -0.0135;
  const ly = top - 0.0004;
  L.satin.push(prep(place(lathe([[0.0074, 0], [0.0102, 0], [0.0102, 0.0017, 0.0007], [0.009, 0.0026, 0.0007], [0.0074, 0.002]], 24), lx, ly, 0), 0xb6bac0));
  // Lämpchen: flache Kuppel, zur Mitte heller (aufgemalt), mit einem Glanzpunkt in der Farbe des Lichts
  const R = 0.0078;
  const flat = 0.8;
  const dome = new THREE.SphereGeometry(R, 22, 9, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, flat, 1);
  const dir = new THREE.Vector3(0.22, 0.8, 0.56).normalize();
  const out = new THREE.Vector3(dir.x, dir.y / flat, dir.z).normalize();
  const glint = new THREE.CircleGeometry(0.0015, 12);
  glint.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), out));
  glint.translate(dir.x * R + out.x * 0.00025, dir.y * R * flat + out.y * 0.00025, dir.z * R + out.z * 0.00025);
  const lampMat = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
  const lamp = meshOf([
    prep(place(dome, lx, ly + 0.0012, 0), 0xffffff, { shade: (p, n) => 0.5 + 0.5 * Math.max(0, n.y) ** 1.5 }),
    prep(place(glint, lx, ly + 0.0012, 0), 0xffffff, { shade: () => 2.4 }),
  ], lampMat);

  // Schein: Das rote Pünktchen allein ist im Bild kaum größer als ein Buchstabe. Eine Scheibe, die zum Rand hin
  // ausläuft (aufgemalt; additiv gemischt bleibt vom Rand nichts), dem Fahrer zugewandt.
  const glow = meshOf([prep(new THREE.RingGeometry(0, GLOW.r, 24, 3), 0xffffff, {
    shade: (p) => GLOW.gain * (1 - Math.hypot(p.x, p.y) / GLOW.r) ** 2,
  })], new THREE.MeshBasicMaterial({
    color: LAMP[2], vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
  }));
  glow.rotation.x = -GLOW.tilt;
  glow.position.set(lx, ly + 0.0045 + GLOW.out * Math.sin(GLOW.tilt), GLOW.out * Math.cos(GLOW.tilt));
  glow.renderOrder = 2;

  const group = new THREE.Group();
  for (const [k, list] of Object.entries(L)) group.add(meshOf(list, mats[k]));
  group.add(lamp);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.056, d + 0.05).rotateX(-Math.PI / 2), shadowMat);
  shadow.position.y = 0.0012;
  shadow.renderOrder = 1;
  group.add(shadow);
  group.add(glow);

  const up = new THREE.Vector3(0, 1, 0);
  const normal = new THREE.Vector3();
  const turn = new THREE.Quaternion();
  let state = -1;
  let since = 0;
  const radar = {
    group,
    /** Stellt das Kästchen an die Stelle (x, z) des Armaturenbretts: Es folgt dessen Wölbung, yaw dreht es zum Fahrer. */
    place(x, z, yaw) {
      const e = 0.01;
      normal.set(dashTopY(x - e, z) - dashTopY(x + e, z), 2 * e, dashTopY(x, z - e) - dashTopY(x, z + e)).normalize();
      group.position.set(x, dashTopY(x, z), z);
      group.quaternion.setFromUnitVectors(up, normal).multiply(turn.setFromAxisAngle(up, yaw));
    },
    /** Platz nach dem Bildformat (Breite/Höhe) der Cockpitkamera: quer SPOT, hochkant SPOT_TALL. */
    fit(aspect) {
      const k = smoothstep(0.6, 1.0, aspect);
      radar.place(SPOT_TALL.x + (SPOT.x - SPOT_TALL.x) * k, SPOT_TALL.z + (SPOT.z - SPOT_TALL.z) * k, SPOT_TALL.yaw + (SPOT.yaw - SPOT_TALL.yaw) * k);
    },
    update(alarm, t) {
      if (!alarm) since = t;
      // jede Warnung beginnt mit einem hellen Blinken
      const lit = alarm ? (((t - since) * BLINK_HZ) % 1 < 0.5 ? 2 : 1) : 0;
      if (lit !== state) {
        state = lit;
        lampMat.color.setHex(LAMP[lit]);
        glow.visible = lit === 2;
      }
    },
  };
  radar.place(SPOT.x, SPOT.z, SPOT.yaw);
  radar.update(false, 0);
  return radar;
}
