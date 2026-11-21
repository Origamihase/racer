// Sprachausgabe (Web Speech API, deutsche Stimme). OMI hat Vorrang vor den
// Sprachdurchsagen der Zuschauer und vor dem Sprachstudio. Ohne Sprachausgabe läuft alles mit geschätzter Dauer weiter.
import { VOICES } from './data.js';

/** Geschätzte Sprechdauer in Sekunden (rate: Tempo der Stimme, VOICES) – auch ohne Sprachausgabe und in Node. */
export function estimateSpeech(text, rate = 1) {
  return Math.max(1.2, text.length / 14 / rate);
}
/**
 * Mini Adam (BrunnenTV): die tiefste deutsche Männerstimme, die das Gerät hat – zuerst die bekannten tiefen
 * (Edge/Windows, macOS), dann jede, die sich männlich nennt; sonst die erste deutsche (tief gestimmt, VOICES).
 */
const DEEP_MALE = [
  /Conrad/i, /Stefan/i, /Markus/i, /Christoph/i, /Bernd/i, /Ralf/i, /Klaus/i, /Killian/i, /Florian/i, /Yannick/i, /Viktor/i,
  /Kasper/i, /Jonas/i, /\bmale\b/i, /männlich/i,
];

export class Speech {
  constructor() {
    this.supported = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
    this.enabled = true;
    this.voices = [];
    this.queue = [];
    this.busy = false;
    this.current = null;
    // angehalten (Pause): Sicherheitsnetz des laufenden Satzes steht, der nächste wartet (pause)
    this.paused = false;
    if (this.supported) {
      const load = () => {
        const all = window.speechSynthesis.getVoices();
        this.voices = all.filter((v) => /^de(-|_|$)/i.test(v.lang));
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  /**
   * Die Stimme zu einem Sprecher (VOICES). Wer nicht OMI ist, klingt nie wie sie (der Eigentümer: „Man sieht das
   * Megafon, hört aber OMI.“): Hat das Gerät mehr als eine deutsche Stimme, bekommt OMI ihre, und alle anderen nehmen
   * eine andere – auch Mini Adam, wenn keine tiefe Männerstimme da ist.
   */
  pickVoice(key) {
    if (!this.voices.length) return null;
    const omi = key === 'board' ? null : this.pickVoice('board');
    const free = (v) => v !== omi || this.voices.length === 1;
    const pref = {
      board: [/Google Deutsch/i, /Anna/i, /Hedda/i, /Katja/i, /Petra/i, /Helena/i],
      kassandra: [/Anna/i, /Google Deutsch/i, /Katja/i, /Hedda/i],
      weronika: [/Hedda/i, /Petra/i, /Google Deutsch/i],
      karla: [/Katja/i, /Google Deutsch/i, /Anna/i],
      william: [/Stefan/i, /Markus/i, /Yannick/i, /Conrad/i, /Google Deutsch/i],
      schoennbrun: [/Stefan/i, /Markus/i, /Yannick/i, /Conrad/i],
      sprachstudio: [/Katja/i, /Petra/i, /Hedda/i, /Anna/i, /Google Deutsch/i],
      adam: DEEP_MALE,
      brunnen: DEEP_MALE,
    }[key] || [];
    for (const re of pref) {
      const v = this.voices.find((x) => re.test(x.name) && free(x));
      if (v) return v;
    }
    return this.voices.find(free) || this.voices[0];
  }

  /**
   * Text sprechen. opts: { priority, onStart, onEnd, onDrop }
   * Gibt die geschätzte Dauer zurück, 0, wenn der Satz gar nicht erst in die Warteschlange kommt. onDrop: ein Satz
   * mit Vorrang hat ihn aus der Warteschlange geworfen, er wird nie gesprochen.
   */
  say(text, voiceKey = 'board', opts = {}) {
    const v = VOICES[voiceKey] || VOICES.board;
    const dur = estimateSpeech(text, v.rate);
    const item = { text, voiceKey, opts, dur };
    if (opts.priority) {
      // OMI drängelt sich vor (laufende Zuschauer-Durchsage wird abgebrochen)
      // (unter sich in der Reihenfolge, in der sie kamen – wie ihre Untertitel)
      for (const q of this.queue) if (!q.opts.priority) q.opts.onDrop?.();
      this.queue = this.queue.filter((q) => q.opts.priority);
      if (this.current && !this.current.opts.priority) this.cancelCurrent();
      this.queue.push(item);
    } else {
      if (this.queue.length > 2) return 0;
      this.queue.push(item);
    }
    this.pump();
    return dur;
  }

  cancelCurrent() {
    if (this.supported) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        /* egal */
      }
    }
    if (this.current?.timer) clearTimeout(this.current.timer);
    const c = this.current;
    this.current = null;
    this.busy = false;
    c?.opts.onEnd?.();
  }

  pump() {
    if (this.busy || this.paused || !this.queue.length) return;
    const item = this.queue.shift();
    this.busy = true;
    this.current = item;
    const v = VOICES[item.voiceKey] || VOICES.board;
    item.opts.onStart?.(item.dur);
    const done = () => {
      if (this.current !== item) return;
      if (item.timer) clearTimeout(item.timer);
      this.current = null;
      this.busy = false;
      item.opts.onEnd?.();
      setTimeout(() => this.pump(), 250);
    };
    if (this.supported && this.enabled && this.voices.length) {
      try {
        const u = new SpeechSynthesisUtterance(item.text);
        u.lang = 'de-DE';
        const voice = this.pickVoice(item.voiceKey);
        if (voice) u.voice = voice;
        u.pitch = v.pitch;
        u.rate = v.rate;
        u.volume = 1;
        u.onend = done;
        u.onerror = done;
        window.speechSynthesis.speak(u);
        // Sicherheitsnetz, falls onend nie kommt
        this.arm(item, done, item.dur + 4);
        return;
      } catch (e) {
        /* weiter ohne Ton */
      }
    }
    this.arm(item, done, item.dur);
  }

  /** Uhr eines Satzes: done nach sec Sekunden (die Pause hält sie an). */
  arm(item, done, sec) {
    item.done = done;
    item.due = Date.now() + sec * 1000;
    item.timer = setTimeout(done, sec * 1000);
  }

  stopAll() {
    this.queue = [];
    // Neustart oder Ende aus der Pause: cancel() hebt die Pause der Sprachausgabe nicht auf, sonst bliebe sie stumm
    if (this.paused) this.pause(false);
    this.cancelCurrent();
  }

  /**
   * Pause (p true) oder weiter: Die Sprachausgabe hält mitten im Satz an, sein Sicherheitsnetz auch – sonst gälte er
   * während einer langen Pause als fertig, und der nächste Satz liefe in die angehaltene Sprachausgabe.
   */
  pause(p) {
    if (!!p === this.paused) return;
    this.paused = !!p;
    const c = this.current;
    if (c?.timer) {
      clearTimeout(c.timer);
      if (p) c.left = Math.max(0, c.due - Date.now()) / 1000;
      else this.arm(c, c.done, c.left ?? 0);
    }
    if (!p) this.pump();
    if (!this.supported) return;
    try {
      if (p) window.speechSynthesis.pause();
      else window.speechSynthesis.resume();
    } catch (e) {
      /* egal */
    }
  }
}
