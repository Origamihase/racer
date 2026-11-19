// Orte der XXL-Welt aus dem Stadtbaukasten (src/world/kit): der eine Baukasten des Spiels und der Zielbrunnen auf der
// Insel des Brunnenplatzes (plan.js squareOf).
import { W, curvePoint } from '../../curve.js';
import { places } from '../../map/graph.js';
import { createCityKit } from '../kit/city.js';
import { goalKind, FOUNTAIN_R } from '../kit/layout.js';

let kit = null;
/**
 * Der Stadtbaukasten des Spiels: Materialien, Atlas und Geometrien gibt es nur einmal (auch für den Prüfstand,
 * __MA.city). Er entsteht beim ersten Gebrauch, seine Brunnenabfragen rechnen in der gebogenen Welt (curvePoint).
 */
export function cityKit() {
  if (!kit) kit = createCityKit(W, { bend: curvePoint });
  return kit;
}

// Hauptbrunnen von klein nach groß: Ausweichliste, falls einer nicht auf die Insel passt
const BY_SIZE = Object.keys(FOUNTAIN_R).sort((a, b) => FOUNTAIN_R[a] - FOUNTAIN_R[b]);

export class Towns {
  constructor() {
    this.kit = cityKit();
  }

  /**
   * Zielbrunnen eines Brunnenplatzes (Vertrag von XxlWorld.makeFountain): der Hauptbrunnen des Orts aus dem Baukasten
   * (layout.js goalKind: die Sonderbrunnen in Augsburg und Nürnberg, sonst nach Ortsgröße), Ursprung in der Mitte am
   * Boden, Vorderseite +z. userData.info = { name (Art), title, r, h, special, cam: { pos, look } … } in seinen
   * Koordinaten (cam: Nahaufnahme aus 2–4 m in 1,2 m Höhe), userData.dispose() räumt ihn ab.
   */
  fountain({ r, place }) {
    const K = this.kit;
    const p = places[place];
    let kind = p ? goalKind(p) : BY_SIZE[0];
    // die Insel richtet sich nach dem Brunnen (plan.js FOUNTAIN.radius); passt er trotzdem nicht, der größte, der passt
    if (FOUNTAIN_R[kind] > r + 1e-6) kind = BY_SIZE.filter((k) => !K.info(k).special && FOUNTAIN_R[k] <= r + 1e-6).pop() ?? BY_SIZE[0];
    const obj = K.fountains.build(kind);
    obj.userData.dispose = () => K.release(obj);
    return obj;
  }

  /** Einmal je Bild: Wasser aller Brunnen bewegen (t: Spielzeit in Sekunden, rain: Regen 0 … 1). */
  update(t, rain) {
    this.kit.setWater(t, rain);
  }
}
