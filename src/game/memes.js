// Die Memes aus Wiki, Medien und Podcast (data-memes.js; der Besitzer, 27.11.2026: „Versuch alles zu verwenden“):
// reine Regeln, ohne Grafik und ohne DOM. Wie die Running Gags (gags.js) mit eigenem Zufall (mulberry32, je Stream neu
// gesät): Was hier geschieht, schreibt direkt in den Chat und zieht nie aus Math.random – so verläuft ein Stream mit
// den Memes so wie ohne sie. Geld bewegen nur die Memes, bei denen die Welt mitspielt (Walte am Brunnenplatz, der
// Übertragungswagen) oder der Spieler etwas tut; das Glücksrad nur im Spiel selbst (on, siehe Game).
import {
  MEME_CHAT, MEME_PAARE, ADAM_CHAT, ALTER_FRAGE, PI, LOL, ZOOM, FLEETBALL, GLUECKSRAD, WALTE, AMPEL, TOMBOLA, UEWAGEN,
  PIZZA, KNOELLCHEN, WISCHWASSER, ABBRUCH, INSELRADIO,
} from '../data-memes.js';
import { BOTS, BUSSGELD, viewerNameAt, fillTemplate } from '../data.js';
import { fmtCent, fmtEuro, mulberry32 } from '../util.js';
import { places } from '../map/graph.js';

/**
 * Takt der Memes (Sekunden Stream): chat eine Zeile aus MEME_CHAT, paar ein Frage-Antwort-Paar, adam Mini Adams eigene
 * Zeile ohne Anlass, alter die Frage nach dem Alter (höchstens alterMax je Stream), lol der Lach-Schwall (nur ab
 * Stimmung lolLevel). In einer Szene (Folge, Ladestopp) wartet, was fällig ist, wait Sekunden. echo: so oft
 * antwortet der Chat auf Mini Adam.
 */
export const MEMES = {
  chat: [70, 140], paar: [600, 1100], adam: [420, 780], alter: [700, 1300], alterMax: 2, lol: [360, 720], lolLevel: 2,
  wait: 6, echo: 0.55, pi: 0.4,
};

/**
 * Glücksrad (GLUECKSRAD): frühestens first Sekunden nach Streambeginn, danach alle every; nur während einer offenen
 * Runde mit einem Gebot von mindestens minBid Euro und einem Ziel, das noch mindestens drive Sekunden entfernt ist.
 * Gespendet wird share × Gebot (mindestens die Hälfte, wie im Live-Bereich). Das Rad läuft über slots Orte, steps
 * Schritte lang, jeder Schritt etwas langsamer (step0 … step1 Sekunden).
 */
export const RAD = { first: 420, every: [600, 1080], minBid: 20, drive: 90, share: [0.5, 0.8], slots: 6, steps: 14, step0: 0.09, step1: 0.42 };

/**
 * Wo ist Walte? (WALTE): in einer Folge mit der Wahrscheinlichkeit chance; der Chat fragt nach ask Sekunden, der
 * Hinweis kommt danach. Gefunden ist er, sobald die Drohnenansicht ihn zeigt (Game.onWalteSeen, main.js prüft das
 * Bild), dann spendet jemand reward Euro.
 */
export const WALTE_RULE = { chance: 0.35, ask: 2.5, reward: [2, 6] };

/** Streamabbruch (ABBRUCH): frühestens after Sekunden Stream, je Prüfung (alle check Sekunden) mit chance. */
export const ABBRUCH_RULE = { after: 7200, check: 600, chance: 0.25 };

/** Knöllchen am Ladepark (KNOELLCHEN): nach so vielen Ladestopps je mit chance, höchstens einmal je Stream. */
export const KNOELLCHEN_RULE = { chance: 0.3 };

/**
 * Wischwasser (WISCHWASSER): voll sind tank Wische; jeder Wisch des Wischers kostet einen. Leer, schmiert der
 * Wischer nur noch: der Chat merkt es (OMI sagt es einmal), bis der nächste Ladestopp nachfüllt.
 */
export const WISCH = { tank: 90 };

/**
 * Übertragungswagen (UEWAGEN): nur im Spiel selbst, auf der Autobahn, frühestens first Sekunden nach Streambeginn,
 * danach alle every; er steht ahead Meter voraus. Ab see Metern meldet ihn der Hinweis, hupen zählt bis near Meter.
 * Countdown-Ampel und Tombola-Zettel (layout.js plan.ampel): ab ampel Metern vor ihr kommentiert der Chat sie.
 */
export const WAGEN_RULE = { first: 540, every: [900, 1500], ahead: 1500, see: 260, near: 120, ampel: 70 };

export class Memes {
  /** game: das Spiel; reset(seed) sät den Zufall neu. on = false schaltet alle ab (Prüfstände). */
  constructor(game) {
    this.g = game;
    this.on = true;
    // Was in Gebote, Geld, Stimmen und Ende eingreift (Glücksrad, Streamabbruch, Knöllchen, Lachen und Wischwasser in
    // Studio und OMI), läuft nur im Spiel selbst (main.js setzt live) – in den Prüfständen mit festem Zufall schreiben
    // die Memes nur in den Chat, und der Stream verläuft Zeile für Zeile wie ohne sie
    this.live = false;
    this.reset(1);
  }

  /** An? Die Memes gehören zu den Running Gags: Sind die aus (gags.on), schweigen auch sie. */
  get active() {
    return this.on && this.g.gags.on;
  }

  reset(seed) {
    this.rnd = mulberry32((seed ^ 0x6d3e) >>> 0);
    const b = (a) => this.between(a[0], a[1]);
    this.T = { chat: b(MEMES.chat), paar: b(MEMES.paar), adam: b(MEMES.adam), alter: b(MEMES.alter), lol: b(MEMES.lol) };
    this.used = new Set();
    this.paareUsed = new Set();
    this.alterN = 0;
    this.zooms = 0;
    this.fleetN = 0;
    // Glücksrad: wann es wieder darf, der Lauf gerade ({ list, k, at, win, name })
    this.radT = RAD.first;
    this.rad = null;
    this.raeder = 0;
    // Walte in der laufenden Folge ({ found }) und wie oft er gefunden wurde
    this.walte = null;
    this.walteFound = 0;
    // Übertragungswagen am Rand ({ s, id, seen, honked }), Tombola-Zettel und Ampeln, die der Chat schon kommentiert hat
    this.wagen = null;
    this.wagenT = WAGEN_RULE.first;
    this.ampelT = 0;
    this.tvAuftritte = 0;
    this.seenProps = new Set();
    // Streamabbruch: nächste Prüfung, läuft er gerade?
    this.abbruchT = ABBRUCH_RULE.after;
    this.abbruch = false;
    this.knoellchen = 0;
    // Wischwasser: übrige Wische, gemeldet?
    this.wasser = WISCH.tank;
    this.wasserWarned = false;
    this.trierReached = false;
    this.inselradio = false;
    // das Knöllchen vom letzten Stream: weg (sein Abnehmen nach 30 s stand in der Warteschlange, die der Start leert)
    this.g?.cockpit?.setTicket?.(false);
  }

  /** Was Abrechnung und Abspann wissen (Game.end): Trier erreicht?, Glücksräder, Fernsehauftritte, Walte, Zooms. */
  report() {
    return { trier: this.trierReached, raeder: this.raeder, tv: this.tvAuftritte, walte: this.walteFound, zooms: this.zooms, abbruch: this.abbruch };
  }

  // --- Zufall ---------------------------------------------------------------------------------------------------
  pick(list) {
    return list[Math.floor(this.rnd() * list.length)];
  }

  chance(p) {
    return this.rnd() < p;
  }

  between(a, b) {
    return a + (b - a) * this.rnd();
  }

  name() {
    return viewerNameAt(Math.floor(this.rnd() * 997));
  }

  // --- Chat -----------------------------------------------------------------------------------------------------
  say(text, name = this.name(), opts = {}) {
    if (text) this.g.ui.chat({ name, text: fillTemplate(text), gag: true, ...opts });
  }

  /** Mini Adam schreibt selbst (ADAM_CHAT, mit 🙌 🌠 🙂), und manchmal erkennt ihn der Chat daran. */
  adam(kind) {
    if (!this.active) return;
    const A = ADAM_CHAT;
    this.say(this.pick(A[kind]), A.name, { badge: A.badge });
    if (this.chance(MEMES.echo)) {
      const text = this.pick(A.echo);
      const name = this.name();
      this.g.later(this.between(1.2, 2.4), () => this.say(text, name));
    }
  }

  /** James meldet etwas (wie in gags.js: direkt, ohne die Uhr des Chats zu schieben). */
  james(text) {
    const b = BOTS.james;
    this.g.ui.chat({ name: b.name, text, bot: 'james', icon: b.icon, gag: true });
  }

  /** Eine Zeile aus pool, die gerade stimmt (FACTS) und je Stream noch nicht dran war; sonst ''. */
  fresh(pool, used = this.used) {
    const fits = pool.filter((l) => !used.has(l) && this.g.fits(l));
    if (!fits.length) return '';
    const l = this.pick(fits);
    used.add(l);
    return l.charCodeAt(0) === 91 ? l.slice(l.indexOf(']') + 2) : l;
  }

  /** In einer Szene? (dort ruht das Geplauder der Memes) */
  scene() {
    return !!(this.g.tv || this.g.charging);
  }

  /** Einmal je Bild (Game.update). */
  update(dt) {
    if (!this.active) return;
    const g = this.g;
    const T = this.T;
    for (const k in T) T[k] -= dt;
    const wait = (k) => (T[k] = MEMES.wait);
    if (T.chat <= 0) {
      // (in der Folge nur, was zu ihr gehört: die Zeilen mit [tv]; beim Laden gar nichts)
      if (g.charging) wait('chat');
      else {
        T.chat = this.between(...MEMES.chat);
        this.say(this.fresh(g.tv ? MEME_CHAT.filter((l) => l.startsWith('[tv]')) : MEME_CHAT));
      }
    }
    if (T.paar <= 0) {
      if (this.scene() && !g.charging) wait('paar');
      else {
        T.paar = this.between(...MEMES.paar);
        this.pair();
      }
    }
    if (T.adam <= 0) {
      if (this.scene()) wait('adam');
      else {
        T.adam = this.between(...MEMES.adam);
        this.adam('sonst');
      }
    }
    if (T.alter <= 0) {
      if (this.scene() || this.alterN >= MEMES.alterMax) wait('alter');
      else {
        T.alter = this.between(...MEMES.alter);
        this.askAge();
      }
    }
    if (T.lol <= 0) {
      if (this.scene() || (g.eco?.level ?? 0) < MEMES.lolLevel || g.funkloch > 0) wait('lol');
      else {
        T.lol = this.between(...MEMES.lol);
        this.lol();
      }
    }
    this.updateRad();
    this.updateAbbruch();
    this.updateWagen();
    this.updateAmpel(dt);
  }

  /** Übertragungswagen einplanen (scenery.js 'uewagen'), melden, wenn er in Sicht kommt, und vorbeiziehen lassen. */
  updateWagen() {
    const g = this.g;
    const w = this.wagen;
    const p = g.player;
    if (w) {
      // die Autobahn verlassen, oder die Welt konnte ihn nicht aufstellen (oder hat neu begonnen): vergessen, ohne Kommentar
      if (g.offAutobahn || (w.id && (g.scenery?.blocked?.(w.id) || (g.scenery?.requests && !g.scenery.requests.some((q) => q.id === w.id))))) {
        g.ui.dropKey?.('uewagen');
        this.wagen = null;
      } else if (!w.seen && w.s - p.s < WAGEN_RULE.see && !this.scene()) {
        w.seen = true;
        g.ui.toast(fillTemplate(UEWAGEN.gesehen, { taste: g.hornKey ? g.hornKey() : 'Hupe' }), 'info', 'uewagen');
      } else if (p.s > w.s + 40) this.passWagen();
      return;
    }
    if (!this.live || g.offAutobahn || this.scene() || g.t < this.wagenT || !g.scenery?.landmarkSpot) return;
    this.wagenT = g.t + this.between(...WAGEN_RULE.every);
    const s = g.scenery.landmarkSpot(p.s + WAGEN_RULE.ahead);
    // keine Ausfahrt davor, die der Wagen nehmen könnte (wie bei Brunnen und Elsa am Rand)
    const nx = g.world?.trip?.()?.nextExit?.();
    if (nx && nx.dist < s - p.s + 200) return;
    this.wagen = { s, id: g.scenery.request('uewagen', s), seen: false, honked: false };
  }

  /** Countdown-Ampel mit Tombola-Zettel am Brunnenplatz des Orts (layout.js plan.ampel): der Chat entdeckt sie. */
  updateAmpel(dt) {
    const g = this.g;
    if ((this.ampelT -= dt) > 0) return;
    this.ampelT = 0.5;
    const trip = g.world?.trip?.();
    const sec = trip && trip.section;
    if (!sec || sec.kind !== 'stadt' || !g.world.town) return;
    const town = g.world.town();
    const a = town && town.sec === sec && town.plan && town.plan.ampel;
    if (!a) return;
    const d = sec.s0 + a.u - trip.s;
    if (d < 0 || d > WAGEN_RULE.ampel) return;
    const key = sec.place + '@' + sec.s0;
    this.sight('ampel', 'ampel:' + key);
    g.later(this.between(2.5, 4), () => this.sight('tombola', 'tombola:' + key));
  }

  /** Ein Frage-Antwort-Paar (MEME_PAARE): die Zeilen nacheinander, von verschiedenen Leuten. */
  pair() {
    const fits = MEME_PAARE.filter((p) => !this.paareUsed.has(p) && this.g.fits(p[0]));
    if (!fits.length) return;
    const p = this.pick(fits);
    this.paareUsed.add(p);
    p.forEach((line, i) => {
      const text = line.charCodeAt(0) === 91 ? line.slice(line.indexOf(']') + 2) : line;
      const name = this.name();
      this.g.later(i * this.between(1.4, 2.4), () => this.say(text, name));
    });
  }

  /** Wie alt bist du? – „Moment, ich rechne kurz 🙂“ (ALTER_FRAGE). */
  askAge() {
    this.alterN++;
    const A = ALTER_FRAGE;
    this.say(this.pick(A.frage));
    const answer = this.pick(A.antwort);
    const echo = this.pick(A.echo);
    const name = this.name();
    this.g.later(this.between(1.8, 3), () => {
      this.say(answer, ADAM_CHAT.name, { badge: ADAM_CHAT.badge });
      this.g.later(this.between(1.2, 2), () => this.say(echo, name));
    });
  }

  /** Der Lach-Schwall (LOL): der Chat schreibt LOL, kurz das Lachen vom Band, das Sprachstudio meldet es. */
  lol() {
    const g = this.g;
    const lines = LOL.lol.slice();
    const n = 4 + Math.floor(this.rnd() * 3);
    for (let i = 0; i < n; i++) {
      const text = lines.splice(Math.floor(this.rnd() * lines.length), 1)[0] || 'LOL';
      const name = this.name();
      g.later(i * this.between(0.18, 0.4), () => this.say(text, name));
    }
    g.later(0.9, () => g.audio.sitcomLaugh?.());
    const said = this.pick(LOL.studio);
    if (this.live) g.studio.remember(said, 15);
  }

  // --- Anlässe aus dem Spiel ----------------------------------------------------------------------------------------
  /** Die Kanalpunkte-Aktion „eine Zahl im Chat“ (ereignisse.js): Manchmal schreibt einer Pi. */
  numbers(delay) {
    if (!this.active || !this.chance(MEMES.pi)) return;
    const name = this.name();
    const echo = this.pick(PI.echo);
    const echoName = this.name();
    this.g.later(delay, () => {
      this.say(PI.zahl, name);
      this.g.later(this.between(1, 1.8), () => this.say(echo, echoName));
    });
  }

  /** Ein Zoom (Kamera gewechselt, Kofferraum-Kamera an): Der Chat zählt mit (ZOOM). */
  zoom() {
    if (!this.active) return;
    this.zooms++;
    // (nicht jeder Zoom wird gezählt – aber der erste und jeder runde immer)
    if (this.zooms === 1 || this.zooms % 5 === 0 || this.chance(0.55)) this.say(fillTemplate(this.pick(ZOOM), { n: this.zooms }));
  }

  /** Die Kofferraum-Kamera ist an (Aktion „Kofferraum öffnen“): das Fleetball-Set liegt darin (FLEETBALL). */
  trunk() {
    if (!this.active) return;
    this.zoom();
    this.fleetN++;
    const F = FLEETBALL;
    if (this.fleetN > 1 && !this.chance(0.5)) return;
    const a = this.pick(F.chat);
    const b = this.pick(F.streit);
    const nb = this.name();
    this.g.later(1.4, () => this.say(a));
    this.g.later(this.between(2.6, 3.6), () => this.say(b, nb));
  }

  /** König Knolli raidet (stream.js raid): Manchmal wird der Tigerangriff geprobt. */
  raid() {
    if (!this.active || !this.chance(0.5)) return;
    this.g.later(this.between(4.5, 6), () => this.say(this.fresh(MEME_CHAT.filter((l) => l.startsWith('[raid]')))));
  }

  /** Ein Navi-Ziel ist erreicht (ziel.js onArrive): Mini Adam bedankt sich; Trier merkt sich der Abspann. */
  arrive(t, key) {
    if (!this.active) return;
    const g = this.g;
    g.later(this.between(4.5, 6.5), () => this.adam('ziel'));
    if (key === 'Trier') this.trierReached = true;
    // in Nordfriesland grüßt das Inselradio (06.02.2020 Sylt: Interview bei Radio Nordfriesland), je Stream einmal
    const p = places[t.place];
    if (p && p.cc === 'DE' && p.lat > 54.3 && p.lon < 9.4 && !this.inselradio) {
      this.inselradio = true;
      g.later(this.between(8, 11), () => {
        g.ui.toast(`📻 ${INSELRADIO.name}: ${INSELRADIO.gruss}`, 'info', 'radio');
        for (let i = 0; i < 2; i++) g.later(1.5 + i * this.between(1, 2), () => this.say(this.pick(INSELRADIO.chat)));
      });
    }
  }

  /** Eine Folge BrunnenTV ist vorbei: Mini Adam schreibt in den Chat; Walte bleibt versteckt, wenn keiner ihn fand. */
  folgeEnde() {
    if (!this.active) return;
    this.g.later(this.between(2, 3.5), () => this.adam('folge'));
    if (this.walte && !this.walte.found) this.say(this.pick(WALTE.weg));
    this.walte = null;
  }

  /** Eine Folge beginnt: Steht Walte heute versteckt am Platz? (true: main.js stellt ihn auf) */
  folgeStart() {
    if (!this.active || !this.chance(WALTE_RULE.chance)) return false;
    this.walte = { found: false };
    this.g.later(WALTE_RULE.ask, () => this.walte && this.say(this.pick(WALTE.frage)));
    this.g.later(WALTE_RULE.ask + 1.5, () => this.walte && !this.walte.found && this.g.ui.toast(fillTemplate(WALTE.tipp, { taste: this.g.hornKey ? this.g.hornKey() : 'Hupe' }), 'info', 'walte'));
    return true;
  }

  /** Die Drohne zeigt Walte (main.js): gefunden! Jubel und eine kleine Spende. */
  walteSeen() {
    const w = this.walte;
    if (!w || w.found) return;
    w.found = true;
    this.walteFound++;
    const g = this.g;
    g.ui.dropKey?.('walte');
    this.say(this.pick(WALTE.gefunden));
    const name = this.name();
    const amount = Math.round(this.between(...WALTE_RULE.reward));
    g.later(1.2, () => g.donate(name, amount, 'Walte gefunden', { line: fillTemplate(WALTE.james, { name, betrag: fmtCent(amount) }) }));
  }

  /** Ein Ladestopp beginnt (akku.js): Pizzaautomat (defekt), Wischwasser nachfüllen, Physalis am Obststand. */
  chargeStart() {
    if (!this.active) return;
    const g = this.g;
    g.later(this.between(5, 8), () => this.say(this.pick(PIZZA)));
    if (this.wasser < WISCH.tank) {
      const leer = this.wasser <= 0;
      this.wasser = WISCH.tank;
      this.wasserWarned = false;
      g.windshield?.setSmear?.(0);
      if (leer) {
        g.later(3, () => g.ui.toast(WISCHWASSER.voll, 'good', 'wasser'));
        g.later(4, () => this.say(this.pick(WISCHWASSER.jubel)));
      }
    }
  }

  /** Ein Ladestopp ist vorbei: Selten klemmt ein Knöllchen unter dem Wischer (KNOELLCHEN, Verwarngeld). */
  chargeEnd() {
    if (!this.active || !this.live || this.knoellchen > 0 || !this.chance(KNOELLCHEN_RULE.chance)) return;
    const g = this.g;
    this.knoellchen++;
    g.cockpit?.setTicket?.(true);
    g.later(2, () => {
      g.ui.toast(fillTemplate(KNOELLCHEN.toast, { betrag: fmtEuro(BUSSGELD.verwarn) }), 'warn', 'knoellchen');
      g.fine(BUSSGELD.verwarn, 'Verwarngeld');
      this.say(this.pick(KNOELLCHEN.chat));
    });
    // (nach einer Weile weht es weg)
    g.later(30, () => g.cockpit?.setTicket?.(false));
  }

  /** Der Wischer hat gewischt (Game.onWiper): kostet Wischwasser; leer, schmiert er nur noch. */
  wiped() {
    if (!this.active || this.wasser <= 0) return;
    this.wasser--;
    if (this.wasser > 0) return;
    const g = this.g;
    g.windshield?.setSmear?.(1);
    if (this.wasserWarned) return;
    this.wasserWarned = true;
    if (this.live) g.say(WISCHWASSER.leer, 'worried', { priority: false });
    g.later(1.5, () => this.say(this.pick(WISCHWASSER.chat)));
  }

  /** Etwas am Weg (updateAmpel): die Countdown-Ampel oder der Tombola-Zettel an ihrem Mast – je Ort einmal. */
  sight(kind, key) {
    if (!this.active || this.seenProps.has(key) || this.scene()) return;
    this.seenProps.add(key);
    if (kind === 'ampel' && this.chance(0.6)) this.say(this.pick(AMPEL));
    else if (kind === 'tombola' && this.chance(0.4)) this.say(this.pick(TOMBOLA));
  }

  /** Gehupt (Game.honk): Steht ein Übertragungswagen nah genug, ist Mini Adam kurz im Fernsehen. */
  honk() {
    const w = this.wagen;
    const g = this.g;
    if (!this.active || !w || !w.seen || w.honked || Math.abs(w.s - g.player.s) > WAGEN_RULE.near) return false;
    w.honked = true;
    this.tvAuftritte++;
    g.ui.dropKey?.('uewagen');
    const lines = UEWAGEN.tv.slice();
    for (let i = 0; i < 3; i++) {
      const text = lines.splice(Math.floor(this.rnd() * lines.length), 1)[0];
      const name = this.name();
      g.later(0.4 + i * this.between(0.5, 0.9), () => this.say(text, name));
    }
    g.thrill?.('greet', 'einen Auftritt im Fernsehen');
    return true;
  }

  /** Am Übertragungswagen vorbei. */
  passWagen() {
    if (this.wagen.seen && !this.wagen.honked) this.say(this.pick(UEWAGEN.vorbei));
    this.g.ui.dropKey?.('uewagen');
    this.wagen = null;
  }

  // --- Glücksrad --------------------------------------------------------------------------------------------------
  updateRad() {
    const g = this.g;
    const r = this.rad;
    if (r) {
      if (g.t < r.at) return;
      // die Runde ist vorbei, ehe das Rad stand (Zuschlag, Ankunft): Es dreht aus, ohne etwas zu ändern
      const open = g.auction.phase === 'offen' && !g.navi.stopping && !g.tv;
      if (r.k >= r.steps || !open) {
        this.rad = null;
        if (open) this.radWin(r);
        else g.ui.dropKey('auktion');
        return;
      }
      r.k++;
      const name = r.k >= r.steps ? r.win.name : r.list[(r.start + r.k) % r.list.length].name;
      g.ui.toast(`🎡 Glücksrad: ${name}`, 'info', 'auktion', [['🎡', r.k >= r.steps ? 'rad' : 'rad rad-spin'], [' Glücksrad: '], [name, 'rad-name']]);
      g.audio.tick?.(r.k >= r.steps ? 1400 : 900, 0.04);
      const q = r.k / r.steps;
      r.at = g.t + RAD.step0 + (RAD.step1 - RAD.step0) * q * q;
      return;
    }
    if (!this.live || g.t < this.radT) return;
    const nv = g.navi;
    if (g.auction.phase !== 'offen' || !nv.target || nv.stopping || nv.bid < RAD.minBid || this.scene()) return;
    // (nicht mitten in einem Rennen: Chaos, Duell, BontanaBack)
    // (auch nicht, wenn gleich ein festes Gegengebot kommt: Siegen hält das nächste Gebot mit T.bid = 99 an)
    if (g.duel || ['chaos', 'duel', 'bontana'].includes(g.bidPlan?.kind) || g.T.bid > 90) return;
    if (nv.driveSecs() < RAD.drive) return;
    const pool = g.bidTargets().filter((t) => t !== nv.target);
    if (pool.length < 3) return;
    this.radT = g.t + this.between(...RAD.every);
    const list = [];
    while (list.length < Math.min(RAD.slots, pool.length)) {
      const t = pool[Math.floor(this.rnd() * pool.length)];
      if (!list.includes(t)) list.push(t);
    }
    const name = this.name();
    const amount = Math.round(nv.bid * this.between(...RAD.share) * 100) / 100;
    g.donate(name, amount, 'das Glücksrad', { line: fillTemplate(GLUECKSRAD.james, { name, betrag: fmtCent(amount) }) });
    for (let i = 0; i < 2; i++) {
      const text = this.pick(GLUECKSRAD.chat);
      const n = this.name();
      g.later(0.6 + i * 0.9, () => this.say(text, n));
    }
    // bis das Rad steht, wartet das nächste Gebot
    g.T.bid = Math.max(g.T.bid, 8);
    this.rad = { list, start: Math.floor(this.rnd() * list.length), k: 0, steps: RAD.steps, at: g.t + 1, win: this.pick(list), name };
  }

  /** Das Rad steht: Sein Ort ist das neue Ziel – mit der Navi-Durchsage wie bei jedem Gebot (ziel.js wheelTarget). */
  radWin(r) {
    this.raeder++;
    this.g.wheelTarget(r.name, r.win);
    const text = fillTemplate(this.pick(GLUECKSRAD.danach), { ort: r.win.name });
    this.g.later(1.6, () => this.say(text));
  }

  // --- Streamabbruch ----------------------------------------------------------------------------------------------
  updateAbbruch() {
    const g = this.g;
    if (!this.live || this.abbruch || g.t < this.abbruchT || g.sammel || this.scene()) return;
    this.abbruchT = g.t + ABBRUCH_RULE.check;
    if (!this.chance(ABBRUCH_RULE.chance)) return;
    if (g.startAbbruch?.()) this.abbruch = true;
  }
}

export { ABBRUCH, WISCHWASSER };
