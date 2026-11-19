// Kleines Schadensmodell: vier Zonen (vorn, hinten, links, rechts) mit je drei Stufen, kosmetische Kratzer von der
// Leitplanke und Pflaster für reparierte Stellen. Rein (ohne three.js und DOM) und serialisierbar.
//
// Regeln: Ein zählender Rempler hebt die getroffene Zone um eine Stufe (Auffahren: vorn, von hinten: hinten, seitlich:
// diese Seite) und kostet einen Karosserie-Punkt; sind alle Punkte weg, geht es in die Werkstatt. Leitplanken-Schrammen
// zählen nicht, sie zeichnen nur die Seite. repair(n) nimmt die ältesten Schäden zuerst zurück und klebt dort ein
// Pflaster hin – eine kleine Chronik der Fahrt bis zum Ende der Runde. Wann repariert wird, entscheidet das Spiel.

export const ZONES = ['front', 'rear', 'left', 'right'];

/** Namen und Zustandswörter für Mittelbildschirm und NOMI („Stoßfänger vorn: verbeult“). */
export const ZONE_INFO = {
  front: { name: 'Stoßfänger vorn', wo: 'vorn', teil: 'der Stoßfänger vorn', steps: ['wie neu', 'verschrammt', 'verbeult', 'hängt schief'] },
  rear: { name: 'Heck', wo: 'hinten', teil: 'das Heck', steps: ['wie neu', 'verschrammt', 'verbeult', 'Klappe klemmt'] },
  left: { name: 'Seite links', wo: 'links', teil: 'die linke Seite', steps: ['wie neu', 'verschrammt', 'eingedellt', 'Spiegel hängt'] },
  right: { name: 'Seite rechts', wo: 'rechts', teil: 'die rechte Seite', steps: ['wie neu', 'verschrammt', 'eingedellt', 'Spiegel hängt'] },
};

/** NOMI und Chat: freundlich, nie über Verletzungen. {wo} („vorn“) und {teil} („der Stoßfänger vorn“) werden ersetzt. */
export const DAMAGE_LINES = {
  first: ['Kleine Delle, großes Herz. Weiter geht’s!', 'Huch! Nur eine Schramme {wo}. Ich puste mal.', 'Das war ein Küsschen, kein Unfall.'],
  more: ['Der Tesla sammelt Andenken, jetzt auch {wo}.', 'Ich notiere: {teil} braucht später eine Umarmung.', 'Kurz durchatmen. Wir fahren ganz entspannt weiter.'],
  last: ['Letzter Karosserie-Punkt! Ab jetzt fahren wir wie auf rohen Eiern.', 'Es dampft ein bisschen. Das ist nur die Aufregung.', 'Ganz vorsichtig jetzt, sonst ruft die Werkstatt an.'],
  repair: ['Pflaster drauf, schon viel besser!', 'Repariert! Die Stelle bekommt ein hübsches Pflaster.', 'Einmal Klebeband, einmal Liebe: geht wieder.'],
  scrape: ['Kratz, kratz – die Leitplanke wollte kuscheln.', 'Neue Zierlinie {wo}. Ganz modern.'],
  understeer: ['Huch, die Kurve war schneller als wir. Kurz vom Strom!', 'Die Reifen singen! Etwas langsamer, dann klappt die Kurve.', 'Uiii, wir schieben nach außen. Bremsen hilft!'],
};

const clampStep = (v) => Math.max(0, Math.min(3, v));

export class Damage {
  constructor(maxHits = 3) {
    this.reset(maxHits);
  }

  reset(maxHits = this.maxHits || 3) {
    this.maxHits = maxHits;
    this.zones = { front: 0, rear: 0, left: 0, right: 0 };
    this.scratches = { front: 0, rear: 0, left: 0, right: 0 };
    this.log = []; // zählende Treffer in ihrer Reihenfolge (Zone), für „älteste zuerst“
    this.patches = []; // reparierte Stellen: { zone, step, n } (n: die wievielte Reparatur)
    this.repairs = 0;
    // zählt jede Änderung, auch das Zurücksetzen (Anzeigen bauen nur dann neu); nie wieder bei 0 anfangen, sonst hätte
    // ein neuer Zustand nach gleich vielen Treffern dieselbe Nummer wie der alte
    this.version = (this.version || 0) + 1;
    return this;
  }

  get hits() {
    return this.log.length;
  }

  get left() {
    return Math.max(0, this.maxHits - this.log.length);
  }

  /** Ganz heil: keine Treffer, keine Kratzer, keine Pflaster. */
  get pristine() {
    return !this.log.length && !this.patches.length && ZONES.every((z) => !this.scratches[z] && !this.zones[z]);
  }

  /** Schlimmste Stufe über alle Zonen (0 … 3). */
  get worst() {
    return Math.max(...ZONES.map((z) => this.zones[z]));
  }

  /** Ein zählender Rempler an der Zone. Gibt die neue Stufe zurück. */
  hit(zone) {
    if (!(zone in this.zones)) zone = 'front';
    this.zones[zone] = clampStep(this.zones[zone] + 1);
    this.log.push(zone);
    this.version++;
    return this.zones[zone];
  }

  /** Leitplanke: kosmetische Kratzer an der Seite (kostet keinen Punkt). */
  scrape(side) {
    if (!(side in this.scratches)) return 0;
    if (this.scratches[side] < 3) {
      this.scratches[side]++;
      this.version++;
    }
    return this.scratches[side];
  }

  /** Repariert bis zu n Punkte, älteste Schäden zuerst. Gibt die Zahl der reparierten Punkte zurück. */
  repair(n = 1) {
    let done = 0;
    while (done < n && this.log.length) {
      const zone = this.log.shift();
      const step = this.zones[zone];
      this.zones[zone] = clampStep(step - 1);
      this.repairs++;
      this.patches.push({ zone, step, n: this.repairs });
      done++;
    }
    if (done) this.version++;
    return done;
  }

  /** „Stoßfänger vorn: verbeult“ */
  word(zone) {
    const I = ZONE_INFO[zone];
    return I.name + ': ' + I.steps[this.zones[zone]];
  }

  /** Die schlimmste Zone (bei Gleichstand die zuletzt getroffene) oder null. */
  worstZone() {
    let best = null;
    for (let i = this.log.length - 1; i >= 0; i--) {
      const z = this.log[i];
      if (!best || this.zones[z] > this.zones[best]) best = z;
    }
    return best;
  }

  toJSON() {
    return { maxHits: this.maxHits, zones: { ...this.zones }, scratches: { ...this.scratches }, log: [...this.log], patches: this.patches.map((p) => ({ ...p })), repairs: this.repairs };
  }

  static from(o) {
    const d = new Damage(o && o.maxHits > 0 ? o.maxHits : 3);
    if (!o) return d;
    for (const z of ZONES) {
      d.zones[z] = clampStep(+(o.zones && o.zones[z]) || 0);
      d.scratches[z] = clampStep(+(o.scratches && o.scratches[z]) || 0);
    }
    d.log = Array.isArray(o.log) ? o.log.filter((z) => ZONES.includes(z)) : [];
    d.patches = Array.isArray(o.patches) ? o.patches.filter((p) => p && ZONES.includes(p.zone)).map((p) => ({ zone: p.zone, step: clampStep(+p.step || 1), n: +p.n || 0 })) : [];
    d.repairs = +o.repairs || d.patches.length;
    d.version = 1;
    return d;
  }
}

/** Eine Zeile aus DAMAGE_LINES mit eingesetzter Zone. */
export function damageLine(kind, zone, rnd = Math.random) {
  const list = DAMAGE_LINES[kind] || DAMAGE_LINES.more;
  const s = list[Math.floor(rnd() * list.length) % list.length];
  const I = ZONE_INFO[zone] || ZONE_INFO.front;
  return s.replace('{wo}', I.wo).replace('{teil}', I.teil);
}
