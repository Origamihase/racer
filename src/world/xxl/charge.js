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
  kindStart: 'ladepark_start', // Startort und Ladeparks: Heldensäule ohne Stecker und Kabel (die bringt chargerig.js)
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

// --- Ladestopp in einem Park (Abschnitt 'park', src/map/parks.js) ---------------------------------------------------
// Der Wagen hält in der Spur ein Stück hinter der freien Heldenbucht (PARK.halt), legt R ein und setzt rückwärts hinein:
// derselbe Weg der Hinterachse wie beim Ausparken in Erlensee, nur rückwärts gefahren (die Ladeklappe sitzt links hinten,
// die Säulen stehen am Kopf der Buchten; so hängt der Stecker wie in Erlensee 0,33 m vom Halter). Am Ende des Stopps
// parkt er genau so aus wie zu Beginn jeder Fahrt (rollPose).
/**
 * Einparken: lead = gerades Stück in der Spur, auf dem schon eingeschlagen wird (im Stand nie), v = Rückwärtstempo
 * (m/s), up/down = Dauer des Anfahrens und des Bremsens bis zum Stand in der Bucht (s).
 */
export const DOCK = { lead: 1.2, v: 3.4, up: 1.0, down: 1.5 };

/**
 * Wagenmitte beim Halt in der Spur vor dem Einparken (Meter ab Abschnittsbeginn) für einen Park mit Mitte u: Hinterachse
 * lead hinter dem Bogen, der in die Bucht führt (src/map/parks.js PARK.halt ist diese Zahl für PARK.u).
 */
export const dockHalt = (u) => u - CHARGE.bay[0] + CHARGE.off + CHARGE.R + DOCK.lead + CHARGE.rear;

/**
 * Weg des Einparkens für einen Park mit Mitte u, wenn der Wagen mit seiner Mitte bei u0 und x0 (Ortskoordinaten) steht
 * (der Begrenzer hält ihn auf einige Zentimeter genau an): das Stück in der Spur wird um den Unterschied länger oder
 * kürzer, und die seitliche Abweichung von der Spurmitte läuft auf ihm aus. Ergebnis: { T (Sekunden bis zum Stand in der
 * Bucht), len (Meter der Hinterachse), pose(t, out) } mit pose wie rollPose ({ x, u, yaw, v, steer }; v ist negativ:
 * rückwärts).
 */
export function dockPath(u, u0, x0 = lane) {
  const yb = u - CHARGE.bay[0] + CHARGE.off;
  const R = CHARGE.R;
  const S = Math.atan(CHARGE.wheelbase / R);
  const lead = Math.max(0, u0 - CHARGE.rear - (yb + R));
  const turn = Math.max(lead, 0.3);
  const dx = x0 - lane;
  const len = lead + SB + SA;
  const { v, up, down } = DOCK;
  const T = up + down + (len - (v * (up + down)) / 2) / v;
  // gefahrene Meter nach t Sekunden: sanft anfahren (wie rollPose), gleichmäßig, sanft bis zum Stand bremsen
  const along = (t) => {
    if (t <= 0) return [0, 0];
    if (t >= T) return [len, 0];
    if (t < up) {
      const q = t / up;
      return [v * up * (q * q * q - (q * q * q * q) / 2), v * q * q * (3 - 2 * q)];
    }
    if (t > T - down) {
      const q = (T - t) / down;
      return [len - v * down * (q * q * q - (q * q * q * q) / 2), v * q * q * (3 - 2 * q)];
    }
    return [(v * up) / 2 + v * (t - up), v];
  };
  return {
    T,
    len,
    pose(t, out = {}) {
      const [d, sp] = along(t);
      let x;
      let y;
      let yaw;
      let steer;
      if (d <= lead) {
        x = lane + dx * (1 - smooth(d / turn));
        y = yb + R + lead - d;
        yaw = 0;
        steer = S * smooth(d / turn);
      } else if (d <= lead + SB) {
        const a = Math.PI / 2 - (d - lead) / R;
        x = XS - R * Math.sin(a);
        y = yb + R - R * Math.cos(a);
        yaw = -Math.PI / 2 + a;
        steer = S * (1 - smooth((d - lead - SB + 1.2) / 1.2));
      } else {
        x = XS + d - lead - SB;
        y = yb;
        yaw = -Math.PI / 2;
        steer = 0;
      }
      out.x = x + Math.sin(yaw) * CHARGE.rear;
      out.u = y + Math.cos(yaw) * CHARGE.rear;
      out.yaw = yaw;
      out.v = -sp;
      out.steer = steer;
      return out;
    },
  };
}

/**
 * Der Ladestopp im Park (main.js, Spiel: Game.startCharge) in Sekunden ab dem Einparken (Ende von dockPath().T, dock):
 * Klappe auf (flap), Stecker aus dem Halter in die Buchse (plug: rig.set 1 → 0), Zeitraffer, in dem sich der Akku füllt
 * (fill) und Mini Adam Popcorn macht (pop) und Bananensaft holt (juice), NOMIs Satz (nomi), dann ab unplug die Startszene
 * von Erlensee (SCENE, ihr t = 0): Stecker heraus, Klappe zu, Ausparken bis zur Übergabe in der Spur (end). shift: so
 * lange vor dem Anrollen liegt R schon drin.
 */
export const STOP = { shift: 0.4, flap: [0.15, 0.5], plug: [0.45, 1.55], fill: [1.6, 8.2], pop: [2.0, 7.8], juice: 4.6, nomi: 1.9, unplug: 8.4 };
STOP.roll = STOP.unplug + SCENE.roll;
STOP.end = STOP.unplug + SCENE.end;

/**
 * Fahrplan eines Ladestopps (Game.startCharge, main.js): Der Wagen steht in der Spur des Parks sec mit seiner Mitte bei
 * s (Meter der Fahrt) und x. Ergebnis: { u (Mitte des Parks im Abschnitt), dock (dockPath), d0 (Sekunden bis zum Stand
 * in der Bucht: R einlegen und einparken), at(k) (Zeitpunkt k aus STOP in Sekunden ab dem Halt), roll, end (Ausparken
 * und Übergabe in der Spur) }.
 */
export function stopPlan(sec, s, x) {
  const u = chargeOf(sec).u;
  const dock = dockPath(u, s - sec.s0, x);
  const d0 = STOP.shift + dock.T;
  return { u, dock, d0, at: (k) => d0 + k, roll: d0 + STOP.roll, end: d0 + STOP.end };
}

/** Übergabe am Ende des Stopps (Park mit Mitte u): Wagenmitte (u, x) in der Spur und Tempo, wie rollPose sie verlässt. */
export function stopEnd(u) {
  return rollPose(u, ROLL_T, {});
}

function smooth(k) {
  const q = Math.min(1, Math.max(0, k));
  return q * q * (3 - 2 * q);
}
