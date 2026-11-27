// Das Autoradio (der Eigentümer, 27.11.2026: „Ja, bau bitte die Möglichkeit ein, diesen Sender zu hören“ – JAM FM,
// ein Sender, bei dem Adam war; „Wenn man den Radio umschaltet, sollte Bayern 1 kommen“; „Standardmäßig sollte das
// Radio aus sein“). Taste R (oder der Knopf in der Pause) schaltet weiter: aus → JAM FM → Bayern 1 → aus.
//
// Die Sender kommen als Webradio aus dem Netz (ein <audio>-Element, nicht über Web Audio: so braucht der Strom keine
// Freigabe für fremde Seiten). Klappt eine Adresse nicht, versucht es die nächste; klappt keine, zeigt das Radio
// „kein Empfang“. Während OMI oder das Sprachstudio sprechen, wird es leiser, ohne Ton (Einstellungen) ist es stumm.
// Bei jeder Fahrt und jedem Laden der Seite ist es zuerst aus.

/**
 * stations: Name, Kürzel fürs Display und Adressen der Streams (https: Die Seite läuft über https, http-Ströme würde
 * der Browser sperren). vol: Lautstärke des Radios (0…1), duck: Anteil davon, solange jemand spricht, fade: Sekunden
 * (Zeitkonstante) fürs Ein- und Ausblenden, wait: so viele Sekunden darf ein Sender zum Anlaufen brauchen.
 */
export const RADIO = {
  stations: [
    {
      id: 'jamfm',
      name: 'JAM FM',
      urls: ['https://stream.jam.fm/jamfm-live/mp3-128/', 'https://stream.jam.fm/jamfm-live/mp3-192/', 'https://stream.jam.fm/jamfm-live/aac-64/'],
    },
    {
      id: 'bayern1',
      name: 'Bayern 1',
      urls: ['https://dispatcher.rndfnk.com/br/br1/obb/mp3/mid', 'https://dispatcher.rndfnk.com/br/br1/obb/mp3/high', 'https://dispatcher.rndfnk.com/br/br1/obb/mp3/low'],
    },
  ],
  vol: 0.55,
  duck: 0.3,
  fade: 0.25,
  wait: 12,
};

export class Radio {
  /** make: baut das Abspielgerät (im Browser ein <audio>-Element; die Prüfstände geben eine Attrappe). */
  constructor(make = () => new window.Audio()) {
    this.make = make;
    this.el = null;
    this.index = -1; // -1: aus, sonst RADIO.stations[index]
    this.url = 0; // welche Adresse des Senders gerade versucht wird
    this.status = 'aus'; // 'aus' | 'sucht' | 'an' | 'kein Empfang'
    this.level = 0; // aktuelle Lautstärke (blendet weich)
    this.since = 0; // Sekunden seit dem Umschalten (für RADIO.wait)
    this.onChange = null; // (radio) => void: Sender oder Empfang hat sich geändert
    this.attempt = 0; // Nummer des Versuchs (play): Fehler eines älteren Versuchs zählen nicht
    this.failedAt = -1;
  }

  /** Der Sender, der läuft (oder null). */
  get station() {
    return this.index >= 0 ? RADIO.stations[this.index] : null;
  }

  /** Was das Display zeigt: Name und Empfang (oder null, wenn das Radio aus ist). */
  get label() {
    const S = this.station;
    if (!S) return null;
    return this.status === 'kein Empfang' ? S.name + ' · kein Empfang' : this.status === 'sucht' ? S.name + ' · sucht …' : S.name;
  }

  /** Weiterschalten: aus → erster Sender → zweiter → … → aus. Muss aus einer Nutzer-Geste kommen (Autoplay). */
  cycle() {
    this.tune(this.index + 1 < RADIO.stations.length ? this.index + 1 : -1);
    return this.station;
  }

  /** Einen Sender wählen (-1: aus). */
  tune(index) {
    this.index = index;
    this.url = 0;
    this.since = 0;
    if (index < 0) {
      this.stop();
      this.status = 'aus';
    } else this.play();
    this.onChange?.(this);
  }

  /** Seite im Hintergrund (on) oder wieder da: anhalten, danach wieder live einsteigen. */
  hold(on) {
    if (this.index < 0 || !this.el) return;
    if (on) this.el.pause?.();
    else if (this.status !== 'kein Empfang') this.play();
  }

  /** Aus (auch beim Verlassen der Seite). */
  off() {
    if (this.index >= 0) this.tune(-1);
  }

  play() {
    const S = this.station;
    if (!S) return;
    if (!this.el) {
      this.el = this.make();
      this.el.preload = 'none';
      // (für einen Live-Strom: nichts zwischenspeichern, was nicht gebraucht wird)
      // (ein Fehler kommt oft doppelt: als Ereignis und als abgelehntes play(); er zählt einmal je Versuch)
      this.el.addEventListener?.('error', () => this.failed(this.attempt));
      this.el.addEventListener?.('playing', () => {
        if (this.status !== 'an' && this.index >= 0) {
          this.status = 'an';
          this.onChange?.(this);
        }
      });
    }
    this.status = 'sucht';
    this.el.volume = this.level = 0;
    this.el.src = S.urls[this.url];
    const n = ++this.attempt;
    const p = this.el.play?.();
    if (p && p.catch) p.catch(() => this.failed(n));
  }

  /** Diese Adresse geht nicht: die nächste, sonst „kein Empfang“. */
  failed(n = this.attempt) {
    const S = this.station;
    if (!S || this.status === 'kein Empfang' || n !== this.attempt || this.failedAt === n) return;
    this.failedAt = n;
    if (this.url + 1 < S.urls.length) {
      this.url++;
      this.since = 0;
      this.play();
      return;
    }
    this.stop();
    this.status = 'kein Empfang';
    this.onChange?.(this);
  }

  stop() {
    if (!this.el) return;
    this.attempt++; // (was der alte Strom noch meldet, zählt nicht mehr)
    this.el.pause?.();
    this.el.removeAttribute?.('src');
    this.el.load?.();
    this.level = 0;
  }

  /**
   * Jedes Bild: Lautstärke (sound: Ton an, duck: gerade spricht jemand), und wer zu lange sucht, versucht die nächste
   * Adresse.
   */
  update(dt, { sound = true, duck = false } = {}) {
    if (this.index < 0 || !this.el) return;
    this.since += dt;
    if (this.status === 'sucht' && this.since > RADIO.wait) {
      this.failed();
      return;
    }
    const want = sound && this.status === 'an' ? RADIO.vol * (duck ? RADIO.duck : 1) : 0;
    this.level += (want - this.level) * Math.min(1, dt / RADIO.fade);
    this.el.volume = Math.max(0, Math.min(1, this.level));
  }
}
