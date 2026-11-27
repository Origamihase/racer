// Stammzuschauer mit Gedächtnis (der Eigentümer, 27.11.2026: „Ein Chat mit Erinnerung gefällt mir!“). Ein Dutzend
// erfundene Stammgäste (data.js STAMM) bleiben im Spielstand (save.stamm): Wie viele Streams sie dabei waren, wie viele
// Abo-Monate sie haben, wie viele Folgen BrunnenTV sie mit angesehen haben und in welchen Orten sie mit dabei waren. In
// jedem Stream schauen ein paar von ihnen vorbei, grüßen mit dem, was sie noch wissen, freuen sich über Orte, in denen
// sie schon mit Mini Adam waren, und zählen die gemeinsamen Brunnen mit. Manche Spende und manche Abo-Verlängerung
// des Streams kommt dann von ihnen – Geld bringen sie nicht mehr als sonst jemand (die Stream-Kasse würfelt wie immer,
// sie nennen sich nur).
//
// Eigener Zufall (mulberry32, je Stream neu gesät): Die Stammgäste ziehen nie aus Math.random, der Stream verläuft
// sonst genauso wie ohne sie. Die Namen sind frei erfunden.
import { STAMM, STAMM_LINES, fillTemplate } from '../data.js';
import { mulberry32 } from '../util.js';

/**
 * So viele schauen je Stream vorbei (come), wann sie grüßen (Sekunden nach dem Start: first, dann je gap), wie oft eine
 * Spende oder Abo-Verlängerung von einem von ihnen kommt (donor, resub), wie viele Orte sie sich merken (towns), wie
 * gern einer nach einer Folge etwas sagt (talk) und bei welchen gemeinsamen Folgen sie feiern (milestones).
 */
export const STAMM_CFG = {
  come: [3, 5], first: 14, gap: [10, 26], donor: 0.14, resub: 0.6, towns: 16, talk: 0.55, delay: [5.5, 8],
  milestones: [5, 10, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000],
};

/** Der Spielstand der Stammgäste: { Name: { n: Streams, m: Abo-Monate, b: Folgen, towns: [Orte, der letzte zuletzt] } }. */
export function cleanStamm(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  const int = (v) => (Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);
  for (const name of STAMM.map((s) => s.name)) {
    const e = raw[name];
    if (!e || typeof e !== 'object') continue;
    const towns = Array.isArray(e.towns) ? e.towns.filter((t) => typeof t === 'string' && t).slice(-STAMM_CFG.towns) : [];
    out[name] = { n: int(e.n), m: int(e.m), b: int(e.b), towns };
  }
  return out;
}

export class Stammgaeste {
  /** g: das Spiel (Game): Spielzeit, später, Chat, Spielstand. */
  constructor(g) {
    this.g = g;
    this.here = [];
    this.rnd = mulberry32(1);
  }

  /** Neuer Stream: wer heute vorbeischaut (die Treuesten eher), und wann sie grüßen. */
  reset(seed) {
    const g = this.g;
    this.rnd = mulberry32(seed >>> 0);
    const save = g.save;
    save.stamm = cleanStamm(save.stamm);
    const pool = STAMM.map((s) => ({ s, w: 1 + Math.min(6, (save.stamm[s.name]?.n || 0) / 3) }));
    const n = this.int(STAMM_CFG.come[0], STAMM_CFG.come[1]);
    this.here = [];
    while (this.here.length < n && pool.length) {
      const sum = pool.reduce((a, p) => a + p.w, 0);
      let r = this.rnd() * sum;
      let i = 0;
      while (i < pool.length - 1 && (r -= pool[i].w) > 0) i++;
      this.here.push(pool.splice(i, 1)[0].s);
    }
    let at = STAMM_CFG.first;
    for (const s of this.here) {
      const e = save.stamm[s.name] || (save.stamm[s.name] = { n: 0, m: 0, b: 0, towns: [] });
      // ein Stream mehr, und das Abo läuft einen Monat länger (wer zum ersten Mal da ist, hat gerade erst abonniert)
      e.n++;
      e.m++;
      const first = e.n === 1;
      const vars = { n: e.n, m: e.m, last: e.towns[e.towns.length - 1] || '', ort: this.pick(e.towns) || '' };
      const pools = first ? ['erst'] : e.towns.length ? ['wieder', 'letzter', 'orte', 'eigen'] : ['wieder', 'eigen'];
      const kind = this.pick(pools);
      const line = kind === 'eigen' ? s.spruch : this.pick(STAMM_LINES.hallo[kind]);
      g.later(at, () => this.say(s.name, line, vars));
      at += this.between(STAMM_CFG.gap[0], STAMM_CFG.gap[1]);
    }
  }

  /** Eine Zeile eines Stammgasts im Chat, mit seinem Abzeichen (★ und die Abo-Monate). */
  say(name, line, vars = {}) {
    const e = this.g.save.stamm[name];
    this.g.chat(fillTemplate(line, vars), name, { badge: `★${e ? e.m : 1}` });
  }

  /**
   * Eine Spende des Streams: Kommt sie von einem Stammgast? Dann sein Name, sonst null (es bleibt beim gewürfelten).
   */
  donor() {
    if (!this.here.length || this.rnd() >= STAMM_CFG.donor) return null;
    return this.pick(this.here).name;
  }

  /** Eine Abo-Verlängerung des Streams: von einem Stammgast? Dann { name, months }, sonst null. */
  resub() {
    if (!this.here.length || this.rnd() >= STAMM_CFG.resub) return null;
    const s = this.pick(this.here);
    return { name: s.name, months: this.g.save.stamm[s.name].m };
  }

  /** Abzeichen für einen Namen im Chat: ★ und die Monate bei Stammgästen, sonst nichts. */
  badge(name) {
    const e = this.here.some((s) => s.name === name) && this.g.save.stamm[name];
    return e ? { badge: `★${e.m}` } : {};
  }

  /**
   * Eine Folge BrunnenTV in town (Name des Orts): Alle, die da sind, zählen sie mit. Danach sagt meist einer etwas dazu –
   * in einem Ort, in dem er schon mit Mini Adam war, freut er sich über das Wiedersehen; bei einer runden Zahl
   * gemeinsamer Folgen feiert er sie. Dann merkt sich jeder den Ort.
   */
  episode(town) {
    const g = this.g;
    if (!this.here.length) return;
    const st = g.save.stamm;
    const known = [];
    const round = [];
    for (const s of this.here) {
      const e = st[s.name];
      e.b++;
      if (town && e.towns.includes(town)) known.push(s);
      if (STAMM_CFG.milestones.includes(e.b)) round.push(s);
      if (town) {
        e.towns = e.towns.filter((t) => t !== town);
        e.towns.push(town);
        if (e.towns.length > STAMM_CFG.towns) e.towns.shift();
      }
    }
    let who = null;
    let line = null;
    if (round.length) {
      who = this.pick(round);
      line = this.pick(STAMM_LINES.folge.rund);
    } else if (known.length && this.rnd() < 0.8) {
      who = this.pick(known);
      line = this.pick(STAMM_LINES.folge.wieder);
    } else if (this.rnd() < STAMM_CFG.talk) {
      who = this.pick(this.here);
      line = this.pick(STAMM_LINES.folge.zaehlt);
    }
    if (!who) return;
    const e = st[who.name];
    const vars = { b: e.b, ort: town || 'hier', n: e.n };
    g.later(this.between(STAMM_CFG.delay[0], STAMM_CFG.delay[1]), () => this.say(who.name, line, vars));
  }

  pick(list) {
    return list.length ? list[Math.floor(this.rnd() * list.length)] : undefined;
  }

  between(a, b) {
    return a + (b - a) * this.rnd();
  }

  int(a, b) {
    return a + Math.floor(this.rnd() * (b - a + 1));
  }
}
