// Bezugsrahmen der XXL-Welt (siehe ENGINE.md 2.2 und trip.shears()): Jede Autobahn und jedes Straßenstück abseits
// ist ein Rahmen. Seine Gruppe trägt als Matrix eine Scherung: Ein Punkt mit Rahmenkoordinate x, der d Meter vor dem
// Spieler liegt, erscheint bei x + a + b·d. Darin hängt die Spur-Gruppe (position.z = s), in der Statisches einmal an
// seinem Platz z = −s steht. Damit auch nach hunderten Kilometern nichts zittert, steht jedes Bauteil selbst bei
// z = −sRef und hat nur kleine Eckpunkt-Koordinaten (die Matrizen rechnet three.js in doppelter Genauigkeit).
import * as THREE from 'three';

export class FrameView {
  constructor(parent) {
    this.group = new THREE.Group();
    this.group.name = 'XXL-Rahmen';
    this.group.matrixAutoUpdate = false;
    this.track = new THREE.Group();
    this.track.name = 'XXL-Spur';
    this.group.add(this.track);
    this.group.visible = false;
    parent.add(this.group);
    this.id = -1;
    this.a = 0;
    this.b = 0;
    // Bewuchs des Rahmens (world.js): Instanzen (PropSet), Schlüssel der Stücke, aus denen er gefüllt ist, und sein
    // Bezugspunkt s (bleibt beim Neufüllen stehen, siehe XxlWorld.sync)
    this.props = null;
    this.propSig = null;
    this.propRef = null;
  }

  /** Scherung {a, b} des Rahmens und Spielerposition s. */
  set(a, b, s) {
    this.a = a;
    this.b = b;
    // Kameraraum: x' = x + a − b·z (z = −d)
    this.group.matrix.set(1, 0, -b, a, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    this.group.matrixWorldNeedsUpdate = true;
    this.track.position.z = s;
  }
}

/** Pool der Rahmenansichten: eine je Rahmen-ID, die gerade etwas zu zeigen hat. */
export class FramePool {
  constructor(parent) {
    this.parent = parent;
    this.byId = new Map();
    this.free = [];
    this.onRelease = null; // fn(view): vor dem Zurücklegen in den Pool (z. B. Bewuchs leeren)
  }

  get(id) {
    return this.byId.get(id) || null;
  }

  /** Ansicht für Rahmen id (legt sie bei Bedarf an). */
  acquire(id) {
    let v = this.byId.get(id);
    if (v) return v;
    v = this.free.pop() || new FrameView(this.parent);
    v.id = id;
    v.group.visible = true;
    this.byId.set(id, v);
    return v;
  }

  /** Ansichten freigeben, deren Rahmen nicht mehr in keep steht (ihre Kinder müssen vorher umgehängt sein). */
  releaseExcept(keep) {
    for (const [id, v] of this.byId) {
      if (keep.has(id)) continue;
      if (this.onRelease) this.onRelease(v);
      v.group.visible = false;
      v.id = -1;
      this.byId.delete(id);
      this.free.push(v);
    }
  }
}
