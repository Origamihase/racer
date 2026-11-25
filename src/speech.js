// Sprachausgabe (Web Speech API, deutsche Stimme): eine Warteschlange für alle Stimmen – OMI, Sprachstudio,
// Sprachdurchsagen, Mini Adam, Herr Schönnbrun. Eine Folge BrunnenTV hat Vorrang vor allem (episode), OMI vor den
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

/**
 * Das Sprachstudio spricht mit zwei Stimmen (Besitzer, 21.11.2026: „Das Sprachstudio soll eine weibliche und eine
 * männliche Stimme verwenden.“), abwechselnd Satz für Satz: zuerst die bekannten deutschen Frauen- und Männerstimmen
 * (Edge/Windows, macOS, Android, Chrome), dann jede, die sich so nennt.
 */
const FEMALE = [/Katja/i, /Amala/i, /Seraphina/i, /Petra/i, /Marlene/i, /Vicki/i, /Hedda/i, /Helena/i, /Anna/i, /Google Deutsch/i, /\bfemale\b/i, /weiblich/i];
const MALE = [/Killian/i, /Florian/i, /Conrad/i, /Stefan/i, /Markus/i, /Yannick/i, /Bernd/i, /Ralf/i, /Klaus/i, /Christoph/i, /Viktor/i, /Kasper/i, /Jonas/i, /\bmale\b/i, /männlich/i];
const isMale = (v) => MALE.some((re) => re.test(v.name));
/** So viele Millisekunden nach cancel() wartet der nächste Satz (Chrome verschluckt sonst sein speak()). */
const CANCEL_GAP = 60;
/**
 * Eine Folge BrunnenTV gehört der Sprachausgabe allein (Besitzer, 21.11.2026: Sie beginnt sofort, ihre Sätze kommen der
 * Reihe nach und ohne Unterbrechung, alles andere wartet dahinter). polite: so viele Sekunden darf ein Satz, der beim
 * Beginn einer Folge spricht, noch zu Ende sprechen – dann endet er; stale: wer so lange (Sekunden seit say) hinter
 * einer Folge gewartet hat, ist veraltet und entfällt an ihrem Ende (opts.stale je Satz).
 */
export const EPISODE = { polite: 0.4, stale: 15 };
/** Tonhöhe der Studio-Stimmen, wenn das Gerät für eine von beiden keine passende Stimme hat: deutlich höher und tiefer. */
export const STUDIO_PITCH = { f: 1.0, m: 0.7 };

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
    // wann (Date.now) zuletzt ein Satz abgebrochen wurde: Chrome verschluckt ein speak() gleich nach cancel() (pump)
    this.cancelAt = -Infinity;
    this.deferred = false;
    // eine Folge BrunnenTV läuft (episode): nur ihre Sätze sprechen, alles andere wartet
    this.inEpisode = false;
    this.politeTimer = null;
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
    if (key === 'sprachstudio' || key === 'sprachstudioM') {
      const st = this.studioVoices();
      return key === 'sprachstudio' ? st.f : st.m;
    }
    const omi = key === 'board' ? null : this.pickVoice('board');
    const free = (v) => v !== omi || this.voices.length === 1;
    const pref = {
      board: [/Google Deutsch/i, /Anna/i, /Hedda/i, /Katja/i, /Petra/i, /Helena/i],
      kassandra: [/Anna/i, /Google Deutsch/i, /Katja/i, /Hedda/i],
      weronika: [/Hedda/i, /Petra/i, /Google Deutsch/i],
      karla: [/Katja/i, /Google Deutsch/i, /Anna/i],
      william: [/Stefan/i, /Markus/i, /Yannick/i, /Conrad/i, /Google Deutsch/i],
      // (die drei neuen Zuschauerstimmen: andere Stimmen als ihre Nachbarn, wo das Gerät welche hat; den Rest machen
      // Höhe, Tempo und Lautstärke, VOICES)
      turbo: [/Petra/i, /Marlene/i, /Vicki/i, /Katja/i, /Google Deutsch/i],
      fluester: [/Yannick/i, /Markus/i, /Conrad/i, /Stefan/i],
      amtlich: [/Conrad/i, /Killian/i, /Stefan/i, /Markus/i, /Google Deutsch/i],
      schoennbrun: [/Stefan/i, /Markus/i, /Yannick/i, /Conrad/i],
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
   * Die beiden Stimmen des Sprachstudios: die beste deutsche Frauenstimme (f, VOICES.sprachstudio) und die beste
   * Männerstimme (m, VOICES.sprachstudioM) des Geräts – nie OMIs und nie Mini Adams (seine tiefe Stimme bei BrunnenTV),
   * solange es andere gibt. Ist Mini Adams Stimme die einzige Männerstimme, leiht sie dem Studio-Mann ihre Stimme in
   * normaler Höhe (Mini Adam spricht viel tiefer, VOICES.adam); gibt es gar keine, spricht eine andere Stimme tiefer,
   * gibt es nur eine, spricht sie beide Rollen deutlich höher und tiefer (STUDIO_PITCH). Ergebnis: { f, m, pf, pm }
   * (Stimmen und ihre Tonhöhen).
   */
  studioVoices() {
    const pf0 = VOICES.sprachstudio.pitch;
    const pm0 = VOICES.sprachstudioM.pitch;
    if (!this.voices.length) return { f: null, m: null, pf: pf0, pm: pm0 };
    const omi = this.pickVoice('board');
    const adam = this.pickVoice('adam');
    let pool = this.voices.filter((v) => v !== omi && v !== adam);
    if (!pool.length) pool = this.voices.filter((v) => v !== omi);
    if (!pool.length) pool = this.voices;
    const find = (prefs, list) => {
      for (const re of prefs) {
        const v = list.find((x) => re.test(x.name));
        if (v) return v;
      }
      return null;
    };
    const women = pool.filter((v) => !isMale(v));
    const f = find(FEMALE, women) || women[0] || pool[0];
    const rest = pool.filter((v) => v !== f);
    const m = find(MALE, rest) || (adam !== f && isMale(adam) ? adam : null) || rest[0] || f;
    // dieselbe Stimme für beide, oder keine echte Frau / kein echter Mann: über die Tonhöhe getrennt
    const pf = m === f || isMale(f) ? STUDIO_PITCH.f : pf0;
    const pm = m === f || !isMale(m) ? STUDIO_PITCH.m : pm0;
    return { f, m, pf, pm };
  }

  /** Tonhöhe eines Sprechers (VOICES; das Sprachstudio je nach seinen Stimmen, studioVoices). */
  pitchFor(key) {
    if (key === 'sprachstudio') return this.studioVoices().pf;
    if (key === 'sprachstudioM') return this.studioVoices().pm;
    return (VOICES[key] || VOICES.board).pitch;
  }

  /**
   * Text sprechen. opts: { episode, priority, cut, stale, onStart, onEnd, onDrop }
   * Gibt die geschätzte Dauer zurück, 0, wenn der Satz gar nicht erst in die Warteschlange kommt. Untertitel zeigt der
   * Aufrufer mit onStart (dann spricht der Satz wirklich) und nimmt sie mit onDrop wieder weg: Der Satz wird nie oder
   * nicht zu Ende gesprochen (aus der Warteschlange geworfen, veraltet, beim Beginn einer Folge abgebrochen).
   * episode: ein Satz der laufenden Folge BrunnenTV (episode(true)) – vor allen anderen, unter sich der Reihe nach, nie
   * abgebrochen. priority: OMI drängelt sich vor die Zuschauer und das Studio. cut: sofort – was gerade spricht, endet
   * (nur kein Satz der Folge), die Warteschlange wartet dahinter.
   */
  say(text, voiceKey = 'board', opts = {}) {
    const v = VOICES[voiceKey] || VOICES.board;
    const dur = estimateSpeech(text, v.rate);
    const item = { text, voiceKey, opts, dur, at: Date.now() };
    const cur = this.current;
    // hinter die Sätze der Folge, die schon warten (ihre Reihenfolge bleibt)
    const front = () => {
      let i = 0;
      while (i < this.queue.length && this.queue[i].opts.episode) i++;
      return i;
    };
    if (opts.episode || opts.cut) {
      this.queue.splice(opts.episode || this.inEpisode ? front() : 0, 0, item);
      if (cur && !cur.opts.episode) this.cancelCurrent(true);
    } else if (opts.priority) {
      // OMI drängelt sich vor (laufende Zuschauer-Durchsage wird abgebrochen)
      // (unter sich in der Reihenfolge, in der sie kamen – wie ihre Untertitel; die Folge bleibt vorn)
      for (const q of this.queue) if (!q.opts.priority && !q.opts.episode) q.opts.onDrop?.();
      this.queue = this.queue.filter((q) => q.opts.priority || q.opts.episode);
      if (cur && !cur.opts.priority && !cur.opts.episode) this.cancelCurrent(true);
      this.queue.push(item);
    } else {
      if (this.queue.length > 2) return 0;
      this.queue.push(item);
    }
    this.pump();
    return dur;
  }

  /**
   * Eine Folge BrunnenTV beginnt (on) oder endet. Beginn: Was gerade spricht und kein Satz der Folge ist, endet höflich
   * – ist es in EPISODE.polite Sekunden fertig, darf es ausreden, sonst (und spätestens dann) endet es; was wartet,
   * bleibt hinten stehen. Ende: Veraltetes (EPISODE.stale) entfällt, der Rest kommt der Reihe nach.
   */
  episode(on) {
    if (!!on === this.inEpisode) return;
    this.inEpisode = !!on;
    clearTimeout(this.politeTimer);
    this.politeTimer = null;
    if (on) {
      const c = this.current;
      if (!c || c.opts.episode) return;
      const left = (c.start ?? Date.now()) + c.dur * 1000 - Date.now();
      if (left > EPISODE.polite * 1000) this.cancelCurrent(true);
      else {
        this.politeTimer = setTimeout(() => {
          this.politeTimer = null;
          if (this.current === c) this.cancelCurrent(true);
        }, Math.max(0, left));
      }
      return;
    }
    const now = Date.now();
    this.queue = this.queue.filter((q) => {
      const fresh = q.opts.episode || now - q.at <= (q.opts.stale ?? EPISODE.stale) * 1000;
      if (!fresh) q.opts.onDrop?.();
      return fresh;
    });
    this.pump();
  }

  /** Der laufende Satz endet jetzt (dropped: nicht zu Ende gesprochen – sein Untertitel geht mit, onDrop). */
  cancelCurrent(dropped = false) {
    // erst loslassen, dann abbrechen: Meldet die Sprachausgabe den Abbruch gleich (onerror), findet er den Satz nicht
    // mehr – sonst endete er dort ein zweites Mal und ginge an onDrop vorbei
    const c = this.current;
    if (c?.timer) clearTimeout(c.timer);
    this.current = null;
    this.busy = false;
    if (this.supported) {
      try {
        window.speechSynthesis.cancel();
        this.cancelAt = Date.now();
      } catch (e) {
        /* egal */
      }
    }
    if (dropped) c?.opts.onDrop?.();
    c?.opts.onEnd?.();
    this.pump();
  }

  pump() {
    if (this.busy || this.paused || !this.queue.length || this.deferred) return;
    // während einer Folge spricht nur sie: alles andere wartet hinter ihr (episode)
    if (this.inEpisode && !this.queue[0].opts.episode) return;
    // gleich nach cancel() verschluckt Chrome den nächsten Satz (kein Ton, oft auch kein onend): einen Augenblick warten
    if (this.supported && this.enabled && Date.now() - this.cancelAt < CANCEL_GAP) {
      this.deferred = true;
      setTimeout(() => {
        this.deferred = false;
        this.pump();
      }, CANCEL_GAP);
      return;
    }
    const item = this.queue.shift();
    this.busy = true;
    this.current = item;
    item.start = Date.now();
    const v = VOICES[item.voiceKey] || VOICES.board;
    item.opts.onStart?.(item.dur);
    const done = () => {
      if (this.current !== item) return;
      if (item.timer) clearTimeout(item.timer);
      this.current = null;
      this.busy = false;
      item.opts.onEnd?.();
      // eine kleine Pause zwischen zwei Sätzen – in einer Folge kommt ihr nächster Satz gleich (der Ruf, wenn der Gruß
      // etwas länger brauchte als geschätzt)
      setTimeout(() => this.pump(), this.queue[0]?.opts.episode ? 0 : 250);
    };
    if (this.supported && this.enabled && this.voices.length) {
      try {
        const u = new SpeechSynthesisUtterance(item.text);
        u.lang = 'de-DE';
        const voice = this.pickVoice(item.voiceKey);
        if (voice) u.voice = voice;
        u.pitch = this.pitchFor(item.voiceKey);
        u.rate = v.rate;
        u.volume = v.volume ?? 1;
        u.onend = done;
        u.onerror = done;
        // festhalten, bis er fertig ist: Sammelt Chrome den Satz vorher ein, kommt sein onend nie, und die Warteschlange
        // stünde bis zum Sicherheitsnetz (geschätzte Dauer + 4 s) – der nächste Satz käme Sekunden zu spät
        item.u = u;
        window.speechSynthesis.speak(u);
        // Sicherheitsnetz, falls onend nie kommt: Dann hängt die Sprachausgabe (Netzstimmen wie „Google Deutsch“), der
        // Satz steckt noch in ihr, und jeder weitere stellte sich stumm dahinter an, bis alle auf einmal kämen –
        // also abbrechen, nicht nur weiterzählen
        this.arm(item, () => this.current === item && this.cancelCurrent(), item.dur + 4);
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
    this.inEpisode = false;
    clearTimeout(this.politeTimer);
    this.politeTimer = null;
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
