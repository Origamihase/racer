// Sprachausgabe (Web Speech API, deutsche Stimme). NOMI hat Vorrang vor den
// Sprachdurchsagen der Zuschauer. Ohne Sprachausgabe läuft alles mit geschätzter Dauer weiter.
import { VOICES } from './data.js';

export class Speech {
  constructor() {
    this.supported = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
    this.enabled = true;
    this.voices = [];
    this.queue = [];
    this.busy = false;
    this.current = null;
    if (this.supported) {
      const load = () => {
        const all = window.speechSynthesis.getVoices();
        this.voices = all.filter((v) => /^de(-|_|$)/i.test(v.lang));
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  pickVoice(key) {
    if (!this.voices.length) return null;
    const pref = {
      board: [/Google Deutsch/i, /Anna/i, /Hedda/i, /Katja/i, /Petra/i, /Helena/i],
      kassandra: [/Anna/i, /Google Deutsch/i, /Katja/i, /Hedda/i],
      weronika: [/Hedda/i, /Petra/i, /Google Deutsch/i],
      karla: [/Katja/i, /Google Deutsch/i, /Anna/i],
      william: [/Stefan/i, /Markus/i, /Yannick/i, /Conrad/i, /Google Deutsch/i],
      schoennbrun: [/Stefan/i, /Markus/i, /Yannick/i, /Conrad/i],
    }[key] || [];
    for (const re of pref) {
      const v = this.voices.find((x) => re.test(x.name));
      if (v) return v;
    }
    return this.voices[0];
  }

  /** Geschätzte Sprechdauer in Sekunden. */
  estimate(text, rate = 1) {
    return Math.max(1.2, (text.length / 14) / rate);
  }

  /**
   * Text sprechen. opts: { priority, onStart, onEnd }
   * Gibt die geschätzte Dauer zurück.
   */
  say(text, voiceKey = 'board', opts = {}) {
    const v = VOICES[voiceKey] || VOICES.board;
    const dur = this.estimate(text, v.rate);
    const item = { text, voiceKey, opts, dur };
    if (opts.priority) {
      // NOMI drängelt sich vor (laufende Zuschauer-Durchsage wird abgebrochen)
      this.queue = this.queue.filter((q) => q.opts.priority);
      if (this.current && !this.current.opts.priority) this.cancelCurrent();
      this.queue.unshift(item);
    } else {
      if (this.queue.length > 2) return dur;
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
    if (this.busy || !this.queue.length) return;
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
        item.timer = setTimeout(done, (item.dur + 4) * 1000);
        return;
      } catch (e) {
        /* weiter ohne Ton */
      }
    }
    item.timer = setTimeout(done, item.dur * 1000);
  }

  stopAll() {
    this.queue = [];
    this.cancelCurrent();
  }

  pause(p) {
    if (!this.supported) return;
    try {
      if (p) window.speechSynthesis.pause();
      else window.speechSynthesis.resume();
    } catch (e) {
      /* egal */
    }
  }
}
