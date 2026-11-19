// Der Ladepark in Erlensee: Hier beginnt jede Fahrt, am Supercharger, an dem Adams Streams begannen. Rein rechnerisch
// (ohne three.js, auch für die Node-Tests): wo der Park im Ort steht, wo der Straßenbau davor den Bordstein zur Einfahrt
// absenkt und auf welchem Weg der Wagen in der Startszene aus seiner Bucht in die Spur rollt.
//
// Ortskoordinaten wie im Stadtbaukasten (kit/layout.js): u = Meter ab Ortsbeginn, x seitlich wie im Profil „stadt“
// (eigene Spur 9,0, Bordstein rechts 11,0, Häuserflucht 16,0). Der Park (kit/rest.js ladepark, 24 × 11 m) steht rechts
// mit der Vorderkante an der Häuserflucht und ist zur Straße gedreht wie die Häuser: in seinem Rahmen zeigt +z zur
// Straße (−x im Ort), sein x läuft gegen u (u = Mitte − x). Der Wagen steht rückwärts eingeparkt in der Heldenbucht 3,
// die Säule 1 an seiner linken hinteren Ecke, wo die Ladeklappe sitzt.
import { STREET } from '../kit/layout.js';
import { places } from '../../map/graph.js';
import { PARK } from '../../map/parks.js';

export const CHARGE = {
  place: 'Erlensee',
  kind: 'ladepark',
  kindStart: 'ladepark_start', // im Startort: die Heldensäule ohne Stecker und Kabel (die hat die Startszene, chargerig.js)
  front: STREET.curbR + STREET.pave, // Vorderkante des Parks auf der Häuserflucht
  half: 12, // halbe Breite des Parks längs der Straße
  bay: [-1.3, -3.3], // Mitte der Heldenbucht im Rahmen des Parks (rest.js BAYS[3], Tiefe der Buchtmitte)
  post: [0, -5.3], // Säule 1 neben ihr (rest.js POSTS[1])
  off: 0.15, // so weit steht der Wagen in der Bucht von der Säule weg: Platz für Stecker und Kabel
  wheelbase: 2.875, // Model 3 (models/tesla.js TESLA): Radstand
  rear: 1.37, // Hinterachse hinter der Wagenmitte
  R: 7, // Bogen der Hinterachse beim Ausparken (Lenkeinschlag vorne atan(2,875 / 7) = 0,39 rad)
  v1: 5, // Tempo im Bogen (18 km/h)
  vEnd: 40 / 3.6, // so rollt jede Fahrt los (main.js xxlStart): die Übergabe an das Spiel
  acc: 5, // höchste Beschleunigung in der Spur
  pass: 70, // Mitte des Parks in Orten, durch die eine Fahrt nur führt (am Ortsanfang, fern vom Brunnenplatz)
  drop: 0.04, // Höhe des abgesenkten Bordsteins an der Einfahrt
  ramp: 1, // Übergang des Bordsteins auf beiden Seiten der Einfahrt
  keep: 1, // so weit über den Park hinaus bleiben Streifen und Gehweg leer
};

const lane = STREET.lane;
// Weg der Hinterachse (Fahrradmodell, nichts rutscht seitlich): gerade aus der Bucht zur Straße (−x), ein Viertelkreis
// R nach rechts in die Spur, gerade in der Spur bis zur Übergabe
const X0 = CHARGE.front - CHARGE.bay[1] + CHARGE.rear; // Hinterachse in der Bucht
const XS = lane + CHARGE.R; // Beginn des Bogens
const SA = X0 - XS;
const SB = (Math.PI / 2) * CHARGE.R;
// Zeiten: sanft anfahren bis v1 (Weg = v1 · T / 2), Bogen mit v1, sanft beschleunigen bis vEnd (höchstens acc)
const TA = (2 * SA) / CHARGE.v1;
const TB = SB / CHARGE.v1;
const TC = (1.5 * (CHARGE.vEnd - CHARGE.v1)) / CHARGE.acc;
const SC = (TC * (CHARGE.v1 + CHARGE.vEnd)) / 2;
// Mitte des Parks, gemessen vom Startpunkt: die Übergabe (Wagenmitte am Startpunkt, Spur, geradeaus) liegt genau am
// Ende des Wegs
const PARK_FROM_START = -(CHARGE.rear + SC + CHARGE.R + CHARGE.off - CHARGE.bay[0]);

/** Dauer des Ausparkens in Sekunden (von Stillstand in der Bucht bis zur Übergabe). */
export const ROLL_T = TA + TB + TC;

/**
 * Die Startszene der Reise (main.js, Zustand 'charge') in Sekunden ab ihrem Beginn: Der Stecker verlässt die Buchse und
 * kehrt in seinen Halter zurück (plug), die Klappe schließt (flap), der Wagen rollt an (roll, ROLL_T später ist er dem
 * Spiel übergeben: end), NOMI gongt und Mini Adam winkt, sobald der Stecker hängt (chime, wave), das Sprachstudio
 * meldet sich (live; NOMI grüßt, wenn es ausgeredet hat), und die Kamera geht ins Cockpit (inside, wie beim
 * Kameraschwenk des klassischen Starts 1,45 s vor dem Ende). Überspringen geht ab skip.
 */
export const SCENE = { plug: [0.9, 2], flap: [1.25, 1.6], roll: 1.6, chime: 2, wave: [2, 3.3], live: 2.5, skip: 0.3 };
SCENE.end = SCENE.roll + ROLL_T;
SCENE.inside = SCENE.end - 1.45;

/** Boden unter dem Wagen, dessen Mitte bei x (Ortskoordinaten) steht: Hof des Parks (0,05 m) über die Einfahrt zur Fahrbahn. */
export function groundAt(x) {
  return 0.05 * smooth((x - STREET.curbR) / (CHARGE.front + 0.5 - STREET.curbR));
}

/**
 * Ladepark eines Abschnitts oder null: Ortsdurchfahrten von Erlensee und die Abschnitte 'park' hinter den Ausfahrten
 * (src/map/parks.js, Mitte bei PARK.u). u = Mitte des Parks (Ortskoordinaten), am Start so weit vor dem Startpunkt,
 * dass das Ausparken genau dort in der Spur endet; drive = abgesenkter Bordstein (s0 … s1 in Metern der Fahrt, voll
 * abgesenkt; ramp davor und dahinter), start: der Abschnitt, in dem die Fahrt beginnt.
 */
export function chargeOf(sec) {
  if (!sec) return null;
  const park = sec.kind === 'park';
  if (!park && (sec.kind !== 'stadt' || !places[sec.place] || places[sec.place].key !== CHARGE.place)) return null;
  const u = park ? PARK.u : sec.start ? -sec.s0 + PARK_FROM_START : CHARGE.pass;
  // Einfahrt: über die Räder hinaus, die den Bordstein beim Ausparken kreuzen (Bucht bis Ende des Bogens, je 1,2 m Rand)
  const y = u - CHARGE.bay[0] + CHARGE.off;
  const d0 = y - 0.79 - 1.2;
  const d1 = y + CHARGE.R - Math.sqrt((CHARGE.R - 0.79) ** 2 - (XS - STREET.curbR) ** 2) + 1.2;
  return { u, start: !!sec.start, drive: { s0: sec.s0 + d0, s1: sec.s0 + d1, ramp: CHARGE.ramp } };
}

/** Höhe des Bordsteins rechts bei s vor einer Einfahrt dw (chargeOf().drive): h außerhalb, CHARGE.drop darin. */
export function kerbAt(dw, s, h) {
  const k = Math.min(1, Math.max(0, (dw.s0 - s) / dw.ramp, (s - dw.s1) / dw.ramp));
  return Math.min(h, CHARGE.drop + (h - CHARGE.drop) * k);
}

/**
 * Lage des Wagens beim Ausparken t Sekunden nach dem Anfahren (0 … ROLL_T), in Ortskoordinaten des Parks mit Mitte u:
 * { x, u (Wagenmitte), yaw (0 = in Fahrtrichtung, −π/2 = zur Straße), v (m/s), steer (Lenkwinkel vorne, rad) }.
 * out wird gefüllt und zurückgegeben.
 */
export function rollPose(u, t, out = {}) {
  const yb = u - CHARGE.bay[0] + CHARGE.off;
  const R = CHARGE.R;
  let x;
  let y;
  let yaw;
  let v;
  let steer = 0;
  if (t <= TA) {
    const q = Math.max(0, t / TA);
    const d = CHARGE.v1 * TA * (q * q * q - (q * q * q * q) / 2);
    v = CHARGE.v1 * q * q * (3 - 2 * q);
    x = X0 - d;
    y = yb;
    yaw = -Math.PI / 2;
    // eingeschlagen wird kurz vor dem Bogen, im Stand nie
    steer = Math.atan(CHARGE.wheelbase / R) * smooth((d - SA + 1.2) / 1.2);
  } else if (t <= TA + TB) {
    const a = ((t - TA) * CHARGE.v1) / R;
    x = XS - R * Math.sin(a);
    y = yb + R - R * Math.cos(a);
    yaw = -Math.PI / 2 + a;
    v = CHARGE.v1;
    steer = Math.atan(CHARGE.wheelbase / R) * (1 - smooth((a - Math.PI / 2 + 1.2 / R) / (1.2 / R)));
  } else {
    const q = Math.min(1, (t - TA - TB) / TC);
    const d = TC * (CHARGE.v1 * q + (CHARGE.vEnd - CHARGE.v1) * (q * q * q - (q * q * q * q) / 2));
    x = lane;
    y = yb + R + d;
    yaw = 0;
    v = CHARGE.v1 + (CHARGE.vEnd - CHARGE.v1) * q * q * (3 - 2 * q);
  }
  // Wagenmitte vor der Hinterachse
  out.x = x + Math.sin(yaw) * CHARGE.rear;
  out.u = y + Math.cos(yaw) * CHARGE.rear;
  out.yaw = yaw;
  out.v = v;
  out.steer = steer;
  return out;
}

function smooth(k) {
  const q = Math.min(1, Math.max(0, k));
  return q * q * (3 - 2 * q);
}
