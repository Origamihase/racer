// Qualität „Auto“: die Regel, wann das Spiel spart und wann alles zurückkommt (main.js adaptResolution ruft tick in
// jedem Bild und setzt um, was sich ändert). Ohne Browser und three.js, damit ein Prüfstand sie durchspielen kann
// (tools/autoqualitaet-test.mjs).
//
// Gemessen wird die mittlere Dauer von 40 Bildern. Ist sie länger als 1/45 s, spart das Spiel zuerst, wo man es kaum
// sieht – die Welt im Rückspiegel nur jedes zweite, dann jedes dritte Bild (AUTO_MIRROR), ab Stufe 2 das Seitenfenster
// der Facecam gemalt statt gefilmt (main.js sideOn) –, und erst danach an der Schärfe des ganzen Bilds (pixelRatio, in
// Schritten von 0,12 bis hinab auf 0,55).
//
// Zurück kommt alles in umgekehrter Reihenfolge. Früher erst über 75 Bildern je Sekunde: Das erreicht ein Bildschirm
// mit 60 Hz nie, denn er zeigt höchstens 60, und wie viel Luft die Grafikkarte dabei noch hätte, verrät der Browser
// nicht. Wer einmal gespart hatte (dafür reichte eine Sekunde Nachladen), blieb bis zum Ende der Sitzung unscharf.
//
// Deshalb geht es jetzt auf Probe hinauf: Läuft das Bild flüssig (über 57 je Sekunde, also auf 60 Hz fast jedes Bild
// pünktlich), kommt ein Schritt zurück. Ist das Bild danach immer noch flüssig, gilt er und der nächste folgt. Ist es
// langsamer geworden, nimmt das Spiel ihn sofort zurück und versucht es später wieder: nach 30 Sekunden, nach jedem
// weiteren Fehlschlag doppelt so spät, höchstens alle 5 Minuten. Hält ein Schritt 20 Sekunden, zählt die Wartezeit
// wieder von vorn. Ein Schritt hinauf gilt also nur, wenn das Bild mit ihm flüssig bleibt.
//
// Auch nach einem Schritt hinab wartet der nächste Versuch 30 Sekunden: Was eben zu langsam war, ist es gleich darauf
// meist noch. Mit einer Ausnahme: Läuft das Bild danach über 75 je Sekunde (das zeigen nur schnellere Bildschirme),
// war der Schritt die Folge eines Rucklers und nicht der Dauerlast, denn ein einzelner Schritt macht aus „zu langsam“
// nicht „sicher Luft“. Dann kommt er ohne Wartezeit auf Probe zurück, wie früher (quick); gewartet wird dort erst,
// wenn eine Probe gescheitert ist.
//
// Eine Probe sagt das aber nur für die Art von Bild, in der sie gelaufen ist. Mit Cockpit zeichnet das Spiel mehr als
// ohne (Rückspiegel, Innenraum, Facecam mit Seitenfenster), und nur dort ändert die Sparstufe etwas. In der
// Drohnenansicht, im Titel oder in einer Szene von außen käme sonst alles zurück, weil es dort nichts kostet, und bei
// jeder Rückkehr ins Cockpit liefe das Bild erst einmal zu langsam. Deshalb hat jede der beiden Arten ihren eigenen
// Stand (AutoViews): Stufe, Schärfe und Wartezeit bleiben liegen, während die andere gezeigt wird. Und fehlt im Cockpit
// die Facecam, die beim Fahren dazugehört (Startszene, ein Hinweis liegt auf ihrem Platz), ist das Bild leichter als
// sonst (light): Dann wird gespart, wenn es nötig ist, aber nichts zurückgeholt und keine Probe bestätigt.
//
// Nur beim ersten Mal geht das Cockpit vom Stand von außen aus. Nach dem Start (oder einer neuen Einstellung) hat es
// selbst noch nichts gemessen, der Titel davor aber schon: Musste dort die Schärfe hinab, ist das Bild mit Cockpit
// erst recht zu viel, denn es zeichnet dieselbe Welt und mehr. Also beginnt es mit der Schärfe von außen und auf der
// letzten Sparstufe (die Regel spart immer erst an den Stufen), statt alles noch einmal Schritt für Schritt zu finden:
// Das dauerte auf einem langsamen Gerät am Anfang der ersten Fahrt bis zu 15 Sekunden länger als mit einem Stand für
// alles. War das zu vorsichtig, holt die erste flüssige Messung es auf Probe zurück. Später gilt das nicht mehr: Dann
// kennt das Cockpit seinen Stand, und ein Ruckler in der Drohnenansicht soll ihn nicht verschlechtern.
//
// Schärfer als beim Start (Bildschirme mit hoher Punktdichte, bis maxPR) wird das Bild wie bisher nur, wenn sicher
// Luft ist: über 75 Bildern je Sekunde, also auf Bildschirmen, die das zeigen können. Bildschirme unter 57 Hz (selten:
// 50 Hz, Stromsparmodus mit 48 Hz) erreichen „flüssig“ nicht; dort bleibt es beim Sparen wie früher.

/** Stufe 0, 1, 2: Die Welt im Rückspiegel wird in jedem, jedem zweiten, jedem dritten Bild neu gezeichnet. */
export const AUTO_MIRROR = [1, 2, 3];

export const AUTO = {
  frames: 40, // so viele Bilder je Messung
  slow: 1 / 45, // im Mittel länger: sparen
  smooth: 1 / 57, // ohne die zwei längsten Bilder im Mittel kürzer: flüssig, es darf wieder hinauf (bis zum Startwert)
  spare: 1 / 75, // im Mittel kürzer: Luft auch für mehr Schärfe als beim Start
  minPR: 0.55,
  down: 0.12, // Schritt der Schärfe hinab …
  up: 0.06, // … und hinauf
  settle: 1, // s nach jedem Schritt ohne Messung (neue Bildpuffer kosten einmal Zeit)
  start: 3, // s nach dem Start oder einer neuen Einstellung ohne Messung
  retry: 30, // s bis zum nächsten Versuch nach einem Schritt hinab oder zurück
  retryMax: 300,
  held: 20, // s, die ein Schritt hinauf halten muss, damit die Wartezeit wieder bei retry beginnt
};

/** Die Regel für eine Art von Bild. */
export class AutoQuality {
  /**
   * pr: die Schärfe, mit der „Auto“ beginnt (main.js qualityPreset). levels: so viele Sparstufen hat diese Art von
   * Bild (ohne Cockpit eine einzige: Dort bleibt nur die Schärfe).
   */
  constructor(pr = 1, levels = AUTO_MIRROR.length) {
    this.levels = levels;
    this.reset(pr);
  }

  /** Von vorn mit voller Qualität (Start, neue Einstellung). */
  reset(pr) {
    this.level = 0;
    this.pixelRatio = pr;
    this.base = pr;
    this.settle = AUTO.start;
    this.wait = 0; // s, bis wieder ein Schritt hinauf versucht wird
    this.retry = AUTO.retry; // die Wartezeit nach dem nächsten Fehlschlag
    this.trial = null; // Stand vor dem letzten Schritt hinauf, solange er noch nicht bestätigt ist
    this.held = -1; // s seit dem letzten Schritt hinauf, -1: keiner, der noch halten müsste
    this.quick = false; // der letzte Schritt hinab kam vom zu langsamen Bild, und seither ist keine Probe gescheitert
    this.fresh = true; // seit reset noch kein Bild dieser Art gesehen
    this.clear();
  }

  /** Die Messung beginnt neu. */
  clear() {
    this.acc = 0;
    this.n = 0;
    this.long1 = 0; // die zwei längsten Bilder der Messung
    this.long2 = 0;
    this.light = false; // in dieser Messung war ein Bild leichter als sonst
  }

  /**
   * Ein Bild der Dauer dt (s). maxPR: die größte sinnvolle Schärfe dieses Bildschirms. light: Diesem Bild fehlt etwas,
   * das sonst dazugehört (siehe oben). Gibt true zurück, wenn sich level oder pixelRatio geändert haben.
   */
  tick(dt, maxPR = this.base, light = false) {
    this.fresh = false;
    this.wait -= dt;
    // (ob ein Schritt hält, zeigt nur das volle Bild)
    if (this.held >= 0 && !light) {
      this.held += dt;
      if (this.held >= AUTO.held) {
        this.held = -1;
        this.retry = AUTO.retry;
      }
    }
    if (this.settle > 0) {
      this.settle -= dt;
      return false;
    }
    this.acc += dt;
    this.n++;
    if (light) this.light = true;
    if (dt > this.long1) {
      this.long2 = this.long1;
      this.long1 = dt;
    } else if (dt > this.long2) this.long2 = dt;
    if (this.n < AUTO.frames) return false;
    const avg = this.acc / this.n;
    // „flüssig“ ohne die zwei längsten Bilder: Ein einzelner Ruckler (ein Ort lädt nach) sagt nichts darüber, ob die
    // Grafikkarte mitkommt; fällt dagegen regelmäßig ein Bild aus, ist auch dieses Mittel zu lang
    const calm = (this.acc - this.long1 - this.long2) / (this.n - 2);
    const full = !this.light;
    this.clear();

    const trial = this.trial;
    if (trial && calm >= AUTO.smooth) {
      // der Schritt hinauf hat das Bild langsamer gemacht (erst recht, wenn es schon das leichtere ist): zurück damit
      this.trial = null;
      this.quick = false;
      this.back();
      return this.set(trial.level, trial.pixelRatio);
    }
    if (avg > AUTO.slow) {
      // (eine offene Probe ist hier schon zurückgenommen: Zu langsam und zugleich flüssig wäre eine Messung nur mit
      // Bildern, die mehr als 1/20 s zählen, und die lässt main.js nicht durch)
      this.trial = null;
      if (this.level < this.levels - 1) {
        this.back();
        this.quick = true;
        return this.set(this.level + 1, this.pixelRatio);
      }
      if (this.pixelRatio > AUTO.minPR) {
        this.back();
        this.quick = true;
        return this.set(this.level, Math.max(AUTO.minPR, this.pixelRatio - AUTO.down));
      }
      return false;
    }
    // Das leichtere Bild sagt nicht, ob es auch fürs volle reicht: Eine offene Probe bleibt offen, keine neue beginnt
    if (!full) return false;
    this.trial = null;
    // (mit sicher Luft nach einem Schritt hinab ohne Wartezeit, siehe oben)
    if (calm < AUTO.smooth && (this.wait <= 0 || (this.quick && avg < AUTO.spare))) {
      const top = avg < AUTO.spare ? maxPR : Math.min(maxPR, this.base);
      if (this.pixelRatio < top) return this.raise(this.level, Math.min(top, this.pixelRatio + AUTO.up));
      if (this.level > 0) return this.raise(this.level - 1, this.pixelRatio);
    }
    return false;
  }

  /** Ein Schritt hinauf, auf Probe: Die nächste Messung bestätigt ihn oder nimmt ihn zurück. */
  raise(level, pixelRatio) {
    this.trial = { level: this.level, pixelRatio: this.pixelRatio };
    this.held = 0;
    return this.set(level, pixelRatio);
  }

  /** Ein Schritt hinab oder zurück: Der nächste Versuch wartet, und länger, wenn gerade erst einer gescheitert ist. */
  back() {
    this.wait = this.retry;
    if (this.held >= 0) this.retry = Math.min(this.retry * 2, AUTO.retryMax);
    this.held = -1;
  }

  set(level, pixelRatio) {
    this.level = level;
    this.pixelRatio = pixelRatio;
    this.settle = AUTO.settle;
    this.clear();
    return true;
  }
}

/**
 * Qualität „Auto“ für beide Arten von Bild: mit Cockpit (inside) und ohne (outside: Drohne, Titel, Szenen von außen).
 * Jede hat ihren eigenen Stand; gemessen und verändert wird nur der des Bilds, das gerade gezeigt wird (siehe oben).
 */
export class AutoViews {
  constructor(pr = 1) {
    this.inside = new AutoQuality(pr);
    this.outside = new AutoQuality(pr, 1);
    this.now = this.outside;
  }

  /** Von vorn mit voller Qualität (Start, neue Einstellung). */
  reset(pr) {
    this.inside.reset(pr);
    this.outside.reset(pr);
  }

  /** Sparstufe für Rückspiegel und Seitenfenster: Beides gibt es nur mit Cockpit. */
  get level() {
    return this.inside.level;
  }

  /** Schärfe des Bilds, das gerade gezeigt wird. */
  get pixelRatio() {
    return this.now.pixelRatio;
  }

  /**
   * Ein Bild der Dauer dt (s), inside: mit Cockpit; maxPR und light wie AutoQuality.tick. Gibt true zurück, wenn
   * sich level oder pixelRatio geändert haben können (auch beim Wechsel der Ansicht).
   */
  tick(dt, maxPR, inside, light = false) {
    const q = inside ? this.inside : this.outside;
    const other = inside ? this.outside : this.inside;
    // die Ruhezeit nach dem Start ist Zeit seit dem Start: Sie läuft auch für die Ansicht ab, die nicht gezeigt wird
    if (other.settle > 0) other.settle -= dt;
    if (q !== this.now) {
      // Wechsel der Ansicht: Dieses Bild war das erste der neuen, noch in der Schärfe der alten gezeichnet. Die Messung
      // beginnt neu, und zwar erst, wenn die Bildpuffer in der Schärfe dieser Ansicht stehen
      this.now = q;
      q.clear();
      // das Cockpit zum ersten Mal: Was von außen schon zu viel war, ist es hier erst recht (siehe oben)
      if (inside && q.fresh && other.pixelRatio < q.pixelRatio) {
        q.level = q.levels - 1;
        q.pixelRatio = other.pixelRatio;
      }
      q.settle = Math.max(q.settle, AUTO.settle);
      return true;
    }
    return q.tick(dt, maxPR, light);
  }
}
