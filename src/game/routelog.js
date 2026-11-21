// Die Route eines Streams der Reise für den Abspann: welche Abschnitte der Fahrt der Wagen genommen hat (in der
// Reihenfolge des Fahrens, mit den Reisekilometern, die der Kilometerzähler auf jedem zählte) und wo unterwegs etwas
// war – jede BrunnenTV-Folge und jeder Ladestopp. Game.travelStep gibt jedem Schritt genau die Reisemeter, die der
// Zähler steigt; finish() schließt am Ende den letzten Schritt ab, also ist die Summe der Abschnitte der Zähler.
// Wo das auf der Karte liegt, trägt main.js nach (Lage des Navis bei jeder Marke, dazu der gefahrene Weg). Ohne Grafik,
// läuft auch unter Node (tools/album-test.mjs).
export class RouteLog {
  constructor() {
    this.secs = []; // [{ kind, place, km }]: genommene Abschnitte, aufeinanderfolgend gleiche zusammen
    this.marks = []; // [{ type: 'brunnen' | 'laden', km, … }]
    this.m = 0; // gezählte Reisemeter
    this.sec = null; // Abschnitt der Fahrt, auf dem zuletzt gezählt wurde
  }

  /** Reisemeter m eines Schritts auf dem Abschnitt sec der Fahrt ({ kind, place, id }) zählen. */
  add(sec, m) {
    if (sec !== this.sec || !this.secs.length) {
      this.sec = sec;
      this.secs.push({ kind: sec.kind, place: sec.place ?? -1, km: 0 });
    }
    if (m > 0) {
      this.secs[this.secs.length - 1].km += m / 1000;
      this.m += m;
    }
  }

  /**
   * Eine Marke auf der Route (type 'brunnen' mit n und place, 'laden' mit park oder post – dem Ort der Ladesäule), beim
   * aktuellen Zählerstand.
   */
  mark(type, data = {}) {
    const mk = { type, ...data, km: this.m / 1000 };
    this.marks.push(mk);
    return mk;
  }

  /**
   * Am Ende des Streams: Was der Zähler (Reisemeter, odometerM) noch mehr zeigt – der letzte Schritt, den die Fahrt
   * erst nach game.update gemacht hat –, kommt auf den letzten Abschnitt. Ergebnis: { secs, marks, km }.
   */
  finish(odometerM) {
    const rest = odometerM - this.m;
    if (rest > 0 && this.secs.length) {
      this.secs[this.secs.length - 1].km += rest / 1000;
      this.m = odometerM;
    }
    return { secs: this.secs, marks: this.marks, km: this.m / 1000 };
  }
}
