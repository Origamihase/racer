// Prüft die Reise der XXL-Welt als Ganzes, ohne Grafik: das echte Spiel (Game: Bieterregeln, WorldNavi, BrunnenTV) mit
// der echten Stream-Kasse (economy.js), der echten Fahrt über die Karte (Trip), dem Halt am Brunnen (Arrival), dem Navi
// des Mittelbildschirms (NavModel) und der Fahrphysik (Player) – in simulierten Streams mit drei Fahrertypen:
// node tools/journey-test.mjs [Stunden je Stream, Standard 3] [log: jedes Gebot und jede Ankunft ausgeben, sonst -]
//   [erste Runden je Fahrer, Standard 60]
// - Kein Hänger: Der Wagen kommt voran, nach jeder Ankunft beginnt eine neue Runde, jede BrunnenTV-Folge endet (von
//   selbst oder mit einer neuen Eingabe), und danach rollt der Wagen aus dem Ort.
// - Ziele: Jedes Gebot nennt einen echten Ort, den die Fahrt von hier über Straßen erreicht (keine Fähre, kein
//   Autozug, keine Luftfracht – ihre Terminals baut die Welt noch nicht), und nie das aktuelle Ziel; die Insider-Ziele
//   aus data.js gibt es in der Karte.
// - Kasse: Jedes Gebot ist genau einmal Einnahme (Summe aller Gebote = Posten „Navi-Gebote“ der Abrechnung), und auf
//   der Reise wird in Zehnern geboten: Jedes Gebot und jeder Schritt ist ein Vielfaches von 10 €.
// - Navi und Welt (COMMON.md §9, wie tools/map-test.mjs) über alle Zielwechsel hinweg, auch bei Geboten in den
//   Sperrzonen vor Gabelung (J.lock) und Knoten (J.lockNode): Jede Ansage meint eine Stelle, die die Fahrt wirklich
//   hat, und wer dem Navi folgt, wird an keiner Gabelung „falsch“ gefahren sein.
// - Ankunft: nur am Brunnenplatz des aktuellen Ziels, und jede ist eine BrunnenTV-Folge; ein Gebot, das vorher das
//   Ziel ändert (auch mitten im Zielort), nimmt sie weg – dann hält der Wagen nicht.
// - Die Zahlen passen zusammen (ein Maß für die Reise, siehe trip.js): in jedem Schritt jedes Streams –
//   Entfernung zum Ziel = Entfernung zur nächsten Handlung + der Rest dahinter; sie fällt um genau das, was der
//   Kilometerzähler steigt, und steigt nie, solange das Ziel steht und die Fahrt nicht neu plant; Meter nennt eine
//   Anzeige nur, wo bis zur Stelle echte Straße (1:1) liegt und höchstens 1000 m davon (weiter weg auch dort
//   Kilometer: „1,2 km“, am Wechsel wird daraus „1000 m“ und nichts steigt) – oder in der Ansage ab dem ersten
//   Vorwegweiser, und dann sagt sie an jeder Tafel und Bake genau deren Meter; Ansage, Kärtchen und HUD-Zeile nennen im Zielort dieselbe
//   Zahl; eine Entfernungstafel, die das Ziel nennt, zeigt die Kilometer des Navis; jeder Abschnitt zählt, was die
//   Karte für seine Kante sagt (Rampen, Verbindungen und Orte: ihre Meter).
// - Die erste Runde eines Streams (navi.js OPENING, economy.js OPENING_CALM): Bis zum ersten Halt an einem Brunnen
//   nennen die Gebote nur nahe Orte (höchstens OPENING.secs im Tempo des Navis, nie den Startort, nie mit „Bitte
//   wenden“ als erster Ansage), kein spätes Gebot kurz vor dem Ziel und keins, während der Wagen schon im Zielort
//   fährt – und in vielen Streams von zehn Minuten je Fahrer steht der Wagen oft genug und früh genug am Brunnen des
//   Ziels (Grenzen bei OPEN_BOUNDS).
// - Akku: Ein voller Akku reicht im Stream jedes Fahrers und auf der offenen Autobahn so lange, wie AKKU_BOUNDS sagt
//   (gemessen am Verbrauch je Schritt; geladen wird in diesen Streams nie, der Akku bleibt darum rechnerisch voll).
// Dazu misst es das Tempo der Reise (Fahrzeiten, Ankünfte je Stunde, Gebote und Einnahmen je Minute). Die Zahlen
// stehen am Ende der Ausgabe; wer an den Bieterregeln dreht, liest sie dort ab.
import { PerspectiveCamera } from 'three';
import { places, nodeTitle, deEdge, OFF_KM } from '../src/map/graph.js';
import { Trip, J, PROFILES } from '../src/game/trip.js';
import { MapDemo } from '../src/map/mapdemo.js';
import { Game, TOWN_HOLD } from '../src/game/game.js';
import { BID_PLACES, OPENING } from '../src/game/navi.js';
import { INSIDER_ORTE, REISE_JOBS } from '../src/data.js';
import { NavModel, BOARD_M, fmtRoad, fmtKm } from '../src/map/navroute.js';
import { limitsFor, Arrival, AUTO } from '../src/world/xxl/plan.js';
import { goalName } from '../src/world/kit/layout.js';
import { signsAlong, BOARD_D } from '../src/world/xxl/signplan.js';
import { parkBoard, PARK_STOP_AFTER, PARKS } from '../src/map/parks.js';

const HOURS = Number(process.argv[2]) || 3;
const LOG = process.argv[3] === 'log';
// so viele erste Runden je Fahrer (Streams von höchstens zehn Minuten, siehe „Die erste Runde“ unten)
const OPENINGS = process.argv[4] === undefined ? 60 : Number(process.argv[4]);
const DT = 1 / 30;
let fails = 0;
const seen = new Map();
function ok(cond, msg) {
  if (cond) return;
  fails++;
  const n = (seen.get(msg.slice(0, 40)) || 0) + 1;
  seen.set(msg.slice(0, 40), n);
  if (n <= 3) console.error('FEHLER: ' + msg);
}

// Zufall mit festem Startwert, damit jeder Lauf dieselben Streams fährt
function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Insider-Ziele: jeder Schlüssel ist ein Ort der Karte ---------------------------------------------------------
for (const key of Object.keys(INSIDER_ORTE)) ok(places.some((p) => p.key === key), `Insider-Ziel „${key}“ gibt es in der Karte nicht`);

// --- Die Mitspieler des Spiels, die es ohne Grafik nicht gibt: nehmen alles an, liefern nichts -----------------------
const NONE = [];
const noop = () => {};
const loose = (base = {}) => new Proxy(base, { get: (t, k) => (k in t ? t[k] : noop) });

/**
 * Drei Fahrer. cruise: Wunschtempo auf freier Strecke (km/h; Limits und Kurven der Strecke hält der Begrenzer ein),
 * miss: Anteil der angesagten Ausfahrten, an denen er vorbeifährt, skip: fährt nach dem Halt am Brunnen sofort weiter
 * (gibt neu Gas) statt die Folge abzuwarten.
 */
const DRIVERS = [
  { name: 'zügig', cruise: 185, miss: 0, skip: true },
  { name: 'mittel', cruise: 145, miss: 0.06, skip: false },
  { name: 'gemütlich', cruise: 110, miss: 0.15, skip: false },
];
/**
 * Härtetest für den Halt am Brunnen: Auf den letzten 150 m im Zielort bricht jedes Mal ein hastiges Bieterduell aus,
 * das Ziel springt bis zum Brunnen hin und her. Der Wagen steht danach am Brunnen (BrunnenTV), ist vorbeigerollt
 * (keine Ankunft) oder das Ziel ist weg – aber nie bleibt er hängen. Dazu fällt an jeder zehnten Gabelung ein Gebot
 * mitten in ihre Sperrzone (J.lock): Der Zweig dort bleibt, wie er gebaut ist, und Ansage und Zahlen müssen trotzdem
 * stimmen.
 */
const DUELLIST = { name: 'zügig, Duell im Zielort', cruise: 185, miss: 0, skip: true, duel: true };
/**
 * Ladestopps (REISE.md A5): Dieser Fahrer lädt nur in den Ladeparks. Er folgt dem Navi und plant bei jeder Warnung
 * NOMIs den Ladestopp ein, den sie nennt (Game.planStop, wie Taste L); sein Akku wird nicht aufgefüllt. In
 * LADE_MIN Minuten Stream läuft er nie leer, und jeder Halt im Park lädt den Akku ganz.
 */
const LADER = { name: 'Lader (plant Ladestopps)', cruise: 150, miss: 0, skip: true, stops: true };
const LADE_MIN = 30;

/** Liegt die Fahrt in einer Sperrzone, in der ein neues Ziel schon Geplantes nicht mehr ändert? */
function lockZone(trip) {
  for (const c of trip.cur.sections) {
    const f = c.fork;
    if (f && !f.taken && f.branch && f.s > trip.s && f.s - trip.s < J.lock) return 'fork';
  }
  for (const c of trip.cur.sections) if (c.leave && c.s1 > trip.s && c.s0 - trip.s < J.lockNode) return 'node';
  return '';
}

/**
 * Navi und Welt: Die Ansage des Mittelbildschirms meint eine Stelle, die die Fahrt wirklich hat (wie map-test).
 * promised: Ausfahrten hinter dem Horizont, die später genau dort liegen müssen (nur solange das Ziel bleibt).
 */
function checkNavi(trip, nav, promised, n, where) {
  for (const sec of trip.cur.sections) {
    const f = sec.fork;
    const pr = f && promised.get(f.node);
    if (!pr) continue;
    promised.delete(f.node);
    ok(Math.abs(f.s - pr.s) <= 1, `${where}: Ausfahrt ${pr.head} versprochen bei ${pr.s.toFixed(0)}, gebaut bei ${f.s.toFixed(0)}`);
    n.farKept++;
  }
  const ins = nav.instruction();
  const g = trip.guidance();
  const near = (a, b) => Math.abs(a - b) <= 0.01;
  if (ins.turn === 'exit') {
    if (ins.fork) {
      n.exit++;
      const f = ins.fork;
      ok(near(ins.dist, f.s - trip.s), `${where}: Entfernung ${ins.dist} statt ${f.s - trip.s} zu ${ins.head}`);
      ok(trip.cur.sections.some((c) => c.fork === f) && !f.taken, `${where}: Ansage meint eine Gabelung, die nicht vor uns liegt: ${ins.head}`);
      ok(f.forced || trip.planFor(f) === 'exit', `${where}: Ansage zu einer Gabelung, an der die Route bleibt: ${ins.head}`);
      ok(ins.head === trip.signs(f).title, `${where}: Name „${ins.head}“ ≠ Schild „${trip.signs(f).title}“`);
      if (g.then && g.then.wende) n.wende++;
    } else {
      n.far++;
      ok(g.far && near(ins.dist, g.dist), `${where}: Ausfahrt hinter dem Horizont ohne Entfernung der Fahrt: ${ins.head}`);
      ok(ins.head === nodeTitle(g.node) || ins.head === 'Autobahnende', `${where}: Name hinter dem Horizont: ${ins.head}`);
      promised.set(g.node, { s: trip.s + g.dist, head: ins.head });
    }
  } else if (ins.turn === 'stop') {
    // geplanter Ladestopp: im Zweig zum Park, die Entfernung zeigt auf den Halt an der freien Säule
    n.stop++;
    const c = trip.cur.sections.find((q) => q.kind === 'park' && q.park === trip.stop && !q.spotDone && q.s1 > trip.s);
    ok(c && near(ins.dist, c.spotS - trip.s) && ins.head === PARKS[c.park].name, `${where}: Ladestopp ${ins.head} ohne Halt im Park`);
  } else if (ins.turn === 'arrive') {
    n.arrive++;
    const c = trip.cur.sections.find((q) => q.kind === 'stadt' && q.place === trip.target && !q.spotDone && q.s1 > trip.s);
    ok(c && near(ins.dist, c.spotS - trip.s), `${where}: Ziel-Entfernung ohne Zielpunkt: ${ins.head}`);
    // das Ziel ist der Brunnen des Orts („Marktbrunnen, Würzburg“), kurz der Ort wie auf seiner Tafel
    ok(!c || (ins.head === goalName(places[c.place]) && ins.short === places[c.place].name), `${where}: Zielname ≠ Brunnen und Ortsschild: ${ins.head}`);
  } else {
    ok(ins.turn !== 'faehre' && ins.turn !== 'zug' && ins.turn !== 'flug', `${where}: Das Navi sagt eine Überfahrt an (${ins.turn}: ${ins.head})`);
    ok(ins.dist === 0 || ins.turn === 'faehre' || ins.turn === 'zug' || ins.turn === 'flug', `${where}: Ansage ${ins.turn} „${ins.head}“ mit Entfernung ${ins.dist}, aber ohne Stelle`);
  }
  n.checks++;
}

// --- Die Zahlen passen zusammen -------------------------------------------------------------------------------------
// was graph.js und navroute.js von den Maßen der Fahrt und der Schilder wissen müssen, stimmt mit ihnen überein
ok(OFF_KM.exit * 1000 === J.ramp && Math.abs(OFF_KM.enterAb * 1000 - (J.conn + J.auf)) < 1e-9, `graph.js OFF_KM ${JSON.stringify(OFF_KM)} passt nicht zu J.ramp ${J.ramp}, J.conn ${J.conn}, J.auf ${J.auf}`);
ok(BOARD_M === BOARD_D[0], `Die Ansage wechselt bei ${BOARD_M} m, der erste Vorwegweiser steht bei ${BOARD_D[0]} m`);

/** Anzeige „… km“ oder „… m“ als Meter (für den Vergleich zweier Anzeigen). */
function shownMetres(text) {
  const n = Number(text.replace(/\./g, '').replace(',', '.').replace(/ (km|m)$/, ''));
  return text.endsWith(' km') ? n * 1000 : n;
}

/**
 * Prüft in jedem Schritt eines Streams, dass Kilometerzähler, Entfernungen und Anzeigen dasselbe Maß meinen.
 * replan(): die Fahrt plant neu (Gebot, Gabelung anders als angesagt) – nur dann darf eine Entfernung steigen.
 * step(evs, sBefore, quick): nach trip.update; quick = nur die billigen Prüfungen dieses Schritts.
 */
function numbers(trip, nav, nv, N, game) {
  let odo = trip.km;
  let clk = null; // Uhr (Sekunden), Stelle und Zähler beim letzten Schritt
  let move = null; // die Bewegung des letzten Schritts: Die Uhr zählt sie im nächsten (Game.travelStep)
  let leg = null; // Ankunftszeit, als das stehende Ziel kam: {target, km, eta} (Sekunden der Uhr)
  let newLeg = false;
  let D = Infinity; // Entfernung zum Ziel beim letzten Schritt
  let fresh = true; // seit dem letzten Schritt wurde neu geplant
  let stopSeen = trip.stop; // ein Ladestopp eingeplant oder gestrichen: neuer Plan (der Weg führt durch den Park)
  let shown = Infinity; // die zuletzt angezeigte Entfernung in Metern
  let inMetres = false;
  const calmDone = new WeakSet(); // Gabelungen, an denen die Ansage schon Meter zählt
  let before = null; // der Abschnitt vor dem zuletzt verlassenen
  // Kilometerzähler gegen die Abschnitte: was voll durchfahren ist, plus das Stück im aktuellen
  let full = trip.km - (trip.s - trip.section.s0) * trip.section.kmPerM;
  const legKm = (from, to) => {
    // Reisekilometer zwischen zwei Stellen des geplanten Wegs, unabhängig von reach() aus den Abschnitten gezählt
    let km = 0;
    let real = true;
    for (const L of trip.plan().legs) {
      const a = Math.max(L.s0, from);
      const b = Math.min(L.s1, to);
      if (b <= a) continue;
      km += (b - a) * L.sec.kmPerM;
      if (L.sec.kmPerM !== 0.001) real = false;
    }
    return { km, real };
  };
  return {
    replan() {
      fresh = true;
      newLeg = true;
    },
    step(evs, sBefore, quick) {
      N.steps++;
      // die Uhr ist Reisezeit: Sekunden der Uhr mal Tempo = Reisemeter des Schritts, im Stand läuft sie wie die echte Zeit
      const c = game.clock * 60;
      if (clk && move) {
        const gain = c - clk.c;
        if (move.ds > 1e-6) {
          const err = Math.abs(gain * (move.ds / DT) - move.dkm * 1000);
          N.clockErr = Math.max(N.clockErr, err);
          ok(err < 1e-6, `Die Uhr gewinnt ${gain.toFixed(4)} s bei ${(move.ds / DT).toFixed(1)} m/s, gefahren ${(move.dkm * 1000).toFixed(3)} Reisemeter`);
          N.clockKm += move.dkm;
          N.clockMove += gain;
        } else {
          ok(Math.abs(gain - DT) < 1e-9, `Die Uhr gewinnt im Stand ${gain} s in ${DT} s`);
          N.clockStand += gain;
        }
      }
      move = clk ? { ds: trip.s - clk.s, dkm: trip.km - clk.km } : null;
      clk = { c, s: trip.s, km: trip.km };
      for (const e of evs) {
        if (e.type === 'arrive' && leg && leg.target === e.place) {
          N.etaLegs.push({ km: leg.km, drift: (c - leg.eta) / 60 });
          leg = null;
        }
        if (e.type === 'enter') {
          // jeder Abschnitt zählt seine Meter mal seinen Maßstab – Autobahn und Landstraße genau die Kilometer der Karte
          const c = e.prev;
          const km = c.len * c.kmPerM;
          if (c.kind === 'ab' || c.kind === 'land') {
            ok(Math.abs(km - deEdge(c.de).km) < 1e-9, `${c.kind} zählt ${km} km, die Karte sagt ${deEdge(c.de).km} km`);
            N.edges++;
            N.edgeKm += km;
          } else if (c.kind === 'zub' && c.kmPerM !== 0.001) {
            // ein langer Zubringer zählt den Weg der Karte zum Ort – ab dem Ort davor, wenn die Fahrt von dort kommt
            const from = before && before.kind === 'stadt' && before.node === c.node && before.s1 === c.s0 ? places[before.place].zubKm : 0;
            const want = places[c.place].zubKm - from;
            ok(km > c.len / 1000 && Math.abs(km - want) < 1e-9, `Zubringer nach ${places[c.place].name} zählt ${km} km, die Karte sagt ${want} km`);
            N.feederKm += km;
          } else {
            ok(c.kmPerM === 0.001, `${c.kind} zählt ${c.kmPerM * 1000} Reisemeter je Meter Straße statt 1`);
            N.realKm += km;
            N.realBy[c.kind] = (N.realBy[c.kind] || 0) + km;
          }
          if (c.s0 >= 0) full += km;
          else full = trip.km - (trip.s - e.sec.s0) * e.sec.kmPerM; // der Startort begann vor dem Start
          before = c;
        } else if ((e.type === 'fork' && e.wrong) || e.type === 'arrive') fresh = true;
      }
      if (trip.stop !== stopSeen) {
        fresh = true;
        stopSeen = trip.stop;
      }
      const sec = trip.section;
      ok(Math.abs(trip.km - (full + (trip.s - sec.s0) * sec.kmPerM)) < 1e-6, `Kilometerzähler ${trip.km} ≠ Summe der Abschnitte ${full + (trip.s - sec.s0) * sec.kmPerM}`);
      const gain = trip.km - odo;
      odo = trip.km;
      const d = trip.reach();
      if (trip.target < 0 || !isFinite(d.km)) {
        D = Infinity;
        shown = Infinity;
        inMetres = false;
        fresh = false;
        return;
      }
      // die Entfernung zum Ziel fällt um genau das, was der Zähler steigt, und steigt nie ohne neuen Plan
      if (!fresh && isFinite(D)) {
        N.falls++;
        const err = Math.abs(D - d.km - gain);
        N.maxErr = Math.max(N.maxErr, err);
        ok(err < 1e-6, `Entfernung zum Ziel fällt um ${(D - d.km).toFixed(6)} km, der Zähler steigt um ${gain.toFixed(6)} km (bei s=${trip.s.toFixed(0)}, ${sec.kind})`);
      } else N.plans++;
      D = d.km;
      if (newLeg) {
        // Ankunftszeit, als das Ziel kam: Uhr + Reisezeit des Rests (die Uhr zählt den letzten Schritt erst gleich)
        leg = { target: trip.target, km: d.km, eta: c + d.clock };
        newLeg = false;
      }
      // die angezeigte Zahl: nie höher als eben, und von Kilometern zu Metern wechselt sie höchstens einmal
      const text = nv.distance;
      const now = shownMetres(text);
      const m = text.endsWith(' m');
      if (!fresh) {
        ok(now <= shown, `Die Anzeige steigt von ${shown} m auf „${text}“ (bei s=${trip.s.toFixed(0)}, ${sec.kind})`);
        ok(m || !inMetres, `Die Anzeige wechselt von Metern zurück zu „${text}“`);
        if (m && !inMetres) {
          // am Wechsel der Einheit: dieselbe Strecke, höchstens um die Rundung kleiner (aus „1,1 km“ wird „1000 m“)
          N.units++;
          N.unitDrop = Math.max(N.unitDrop, shown - now);
          ok(shown - now <= 100 + 1e-6, `Am Wechsel zu Metern springt die Anzeige von ${shown} m auf „${text}“ (bei s=${trip.s.toFixed(0)}, ${sec.kind})`);
        }
      }
      shown = now;
      inMetres = m;
      fresh = false;
      // Meter nur, wo bis zum Ziel echte Straße liegt und höchstens BOARD_M davon – und dann auch Meter. Ist es auf
      // echter Straße weiter, stehen dort Kilometer mit einer Nachkommastelle, aufgerundet („1,2 km“, nicht „1150 m“)
      const way = legKm(trip.s, trip.plan().end);
      ok(m === (way.real && d.m <= BOARD_M), `„${text}“ zum Ziel, aber der Weg dorthin ist ${way.real ? d.m.toFixed(0) + ' m echte Straße' : 'gerafft'} (bei s=${trip.s.toFixed(0)}, ${sec.kind})`);
      if (way.real && !m) {
        N.kmReal++;
        const fits = d.m > 9900 ? Math.abs(now - d.m) <= 500 : /^\d,\d km$/.test(text) && now >= d.m - 1e-3 && now < d.m + 100 + 1e-3;
        ok(fits, `Auf echter Straße, ${d.m.toFixed(0)} m vor dem Ziel, steht „${text}“ (bei s=${trip.s.toFixed(0)}, ${sec.kind})`);
      }
      ok(Math.abs(way.km - d.km) < 1e-9 && (!way.real || Math.abs(d.km * 1000 - d.m) < 1e-6), `reach ${d.km} km / ${d.m} m, Abschnitte ${way.km} km`);
      if (m) N.metres++;
      else N.kms++;
      // Tafeln, Baken und Entfernungstafeln, an denen der Wagen in diesem Schritt vorbeigekommen ist
      const signs = signsAlong(trip, trip.cur, sBefore, trip.s, { target: trip.target });
      let ins = null;
      for (const e of signs) {
        if (e.s <= sBefore) continue;
        if (e.kind === 'vorweg' || e.kind === 'bake' || e.kind === 'ladepark') {
          ins = ins || nav.instruction();
          if (ins.turn !== 'exit' || !ins.fork || ins.fork.id !== e.fork) continue;
          const want = e.kind === 'vorweg' ? e.board.dist : e.dist + ' m';
          ok(ins.say === want && !ins.calm, `Tafel „${want}“ vor ${ins.head}, die Ansage sagt „${ins.say}“${ins.calm ? ' (noch als Vorschau)' : ''}`);
          if (e.kind === 'vorweg') N.boards++;
          else if (e.kind === 'ladepark') N.parkBoards++;
          else N.beacons++;
        } else if (e.kind === 'tafel') {
          N.tables++;
          const row = e.rows.find((r) => r.place === trip.target);
          // mit geplantem Ladestopp zählt das Navi den Abstecher durch den Park mit, die Tafel nicht
          if (!row || trip.stop >= 0) continue;
          N.tableRows++;
          // an der Stelle der Tafel (der Wagen ist in diesem Schritt ein paar Meter weiter): dieselbe Zahl, ganzzahlig
          const there = d.km + legKm(e.s, trip.s).km;
          N.tableDev = Math.max(N.tableDev, Math.abs(row.km - there));
          // (genau auf dem halben Kilometer entscheidet die letzte Stelle der Gleitkommazahl: dort gelten beide Rundungen)
          const half = Math.abs(Math.abs(row.km - there) - 0.5) < 1e-6;
          ok(row.km === Math.round(there) || half, `Entfernungstafel: ${row.name} ${row.km} km, das Navi zählt dort ${there.toFixed(2)} km`);
        }
      }
      if (quick && !ins) return;
      // Ansage: Ziel = nächste Handlung + Rest; ihre Zahl in dem Maß, das ihr Zustand verspricht
      ins = ins || nav.instruction();
      const g = trip.guidance();
      if (g.type === 'exit' || g.type === 'arrive') {
        const to = legKm(trip.s, trip.s + g.dist);
        const rest = legKm(trip.s + g.dist, trip.plan().end);
        ok(Math.abs(g.toKm - to.km) < 1e-9 && Math.abs(g.km - (g.toKm + rest.km)) < 1e-9, `Ziel ${g.km} km ≠ Handlung ${g.toKm} km + Rest ${rest.km} km`);
        N.sums++;
      }
      if (ins.turn === 'arrive') {
        ok(ins.say === text && ins.toTarget === text, `Im Zielort: Ansage „${ins.say}“, Kärtchen „${ins.toTarget}“, HUD-Zeile „${text}“`);
        N.same++;
      } else if (ins.turn === 'exit') {
        ok(ins.toTarget === text, `Kärtchen „${ins.toTarget}“, HUD-Zeile „${text}“`);
        if (ins.calm) {
          ok(ins.say === fmtKm(g.toKm) && (g.far || g.dist > (parkBoard(g.fork) || BOARD_M)), `Vorschau „${ins.say}“ ${g.dist.toFixed(0)} m vor ${ins.head}`);
          ok(!ins.fork || !calmDone.has(ins.fork), `Die Ansage vor ${ins.head} fällt von Metern zurück in die Vorschau`);
          N.calm++;
        } else {
          ok(ins.say === fmtRoad(g.dist) && g.dist <= (parkBoard(ins.fork) || BOARD_M) && !!ins.fork, `Ansage „${ins.say}“ ${g.dist.toFixed(0)} m vor ${ins.head}`);
          calmDone.add(ins.fork);
          N.near++;
        }
      }
    },
  };
}

/**
 * Ein Stream: hours Stunden Spielzeit mit einem Fahrer. Liefert die Messwerte. firstRound: nur die erste Runde – der
 * Stream endet, sobald der Wagen an einem Brunnen steht oder an einem vorbeigerollt ist (m.open sagt, wie es ausging).
 */
function stream(driver, hours, seed, firstRound = false) {
  Math.random = mulberry32(seed);
  const trip = new Trip({ rng: Math.random });
  const arrival = new Arrival();
  arrival.hold = true;
  const nav = new NavModel(trip);
  const camera = new PerspectiveCamera(60, 16 / 9, 0.1, 3000);
  let ids = 0;
  const tvCards = [];
  const game = new Game({
    traffic: loose({ cars: NONE, update: () => NONE, nearby: () => NONE, police: () => null, megafon: () => 0 }),
    scenery: loose({ request: () => ++ids, landmarkSpot: (s) => s, placed: () => null }),
    road: loose(),
    sky: loose(),
    rain: loose(),
    windshield: loose({ firmware: 0, manual: () => 'wipe' }),
    cockpit: loose({ nomi: loose() }),
    audio: loose(),
    speech: loose({ say: () => 2.5, busy: false, queue: NONE, current: null }),
    ui: loose({ brunnenTV: (n, name) => tvCards.push({ n, name }) }),
    fx: loose(),
    pickups: loose({ update: () => NONE }),
    world: { trip: () => trip, stopping: () => !!arrival.pending, release: () => arrival.reset(), square: () => null, town: () => null },
  });
  game.start({ upgrades: {}, best: {} });
  const p = game.player;
  p.s = trip.s;
  p.x = trip.x;
  p.speed = 40 / 3.6;
  const nv = game.navi;
  const lim = { left: 0, right: 0, shoulder: 0, lanes: null, extraLane: null, vmax: Infinity, decel: 0, slack: 0, closing: 0 };
  const m = {
    bids: 0, bidSum: 0, earnN: 0, earnSum: 0, chaos: 0, calm: 0, late: 0, snatched: 0, spots: 0, rolled: 0, arrivals: 0, rests: 0, late2: 0, tvEnds: 0, duels: 0,
    lockFork: 0, lockNode: 0, wrong: 0, wende: 0, first1: 0, firstN: 0, maxGap: 0, maxTv: 0, minTv: Infinity, passed: 0,
    bands: [0, 0, 0, 0], legs: [], navi: { checks: 0, exit: 0, far: 0, farKept: 0, arrive: 0, stop: 0, wende: 0 }, reroutes: 0, standing: 0, ratio: 0, stand: [], flipped: 0, minChoice: Infinity,
    // Ladeparks: Halte und Ladestopps; beim Lader dazu Warnungen, eingeplante Stopps, kleinster Akku und Ladestand danach
    charges: 0, warns: 0, planned: 0, minBattery: 100, full: 0, parkKm: [],
    // Akku: Sekunden und verbrauchte Prozent im ganzen Stream, auf der offenen Autobahn und im Stand (siehe AKKU_BOUNDS)
    akku: { t: 0, used: 0, abT: 0, abUsed: 0, standT: 0, standUsed: 0 },
    // die erste Runde: bids = ihre Gebote ({place, secs, kind}), standT/standPlace = wann welches Ziel zum ersten Mal
    // stehen blieb, calm/drive = Ruhe und Fahrzeit des Navis dabei, changed = Gebote danach, end = 'folge' (der Wagen
    // steht am Brunnen) | 'vorbei' (vorbeigerollt) | '' (noch offen), endT = wann, kept = am ersten stehenden Ziel
    // angekommen, bevor ein Gebot es änderte, dev = größte Abweichung der vorhergesagten Fahrzeit (trip.whatIf)
    // townIn/townLeft = wann der Wagen zum ersten Mal im Zielort fuhr und wie lange das Gebot da noch brauchte,
    // townBids = nach wie vielen Sekunden im Zielort dort ein Gebot kam (Game.updateNavi hält es höchstens TOWN_HOLD)
    open: { bids: [], standT: -1, standPlace: -1, calm: 0, drive: 0, changed: 0, end: '', endT: -1, kept: false, dev: 0, minChoice: Infinity, late: 0, townIn: -1, townLeft: 0, townBids: [] },
    num: {
      steps: 0, falls: 0, plans: 0, maxErr: 0, metres: 0, kms: 0, kmReal: 0, units: 0, unitDrop: 0, boards: 0, parkBoards: 0, beacons: 0, tables: 0, tableRows: 0, tableDev: 0, sums: 0, same: 0, calm: 0, near: 0,
      edges: 0, edgeKm: 0, feederKm: 0, realKm: 0, realBy: {},
      clockErr: 0, clockKm: 0, clockMove: 0, clockStand: 0, etaLegs: [],
    },
  };
  const num = numbers(trip, nav, nv, m.num, game);
  const promised = new Map();
  const sloppy = new WeakMap(); // Gabelung → fährt dieser Fahrer hier am Navi vorbei?
  const planSince = new WeakMap(); // Gabelung → {plan, s}: was das Navi dort will und seit welchem Meter
  let lastBidT = 0;
  let lastPlan = null; // das jüngste Gebot: {t, km, secs} – Zeit, Kartenkilometer und Fahrzeit laut Navi
  let roundOpen = false; // seit der letzten Ankunft kam schon ein Gebot
  let arrivedT = -1;
  let spotT = -1;
  let halting = false; // zwischen Zielpunkt und Halt am Brunnen
  let duelSec = null; // Härtetest: die Ortsdurchfahrt, in der gerade das Duell tobt
  let duelPace = 0; // … und wie viele Sekunden dort höchstens zwischen zwei Geboten liegen
  let lockFork = null; // … und die Gabelung, in deren Sperrzone der Wagen zuletzt kam
  let lockForks = 0;
  let tvT0 = -1;
  let tvEndT = -1;
  let progressS = p.s;
  let progressT = 0;
  let pendingCheck = false;
  let warned = 0; // Lader: die Warnstufe NOMIs, auf die er schon einen Stopp eingeplant hat
  let charging = false;
  const job = { s0: p.s, road: -1, travel: -1 }; // wann 8 km Straße (klassischer Auftrag) und der Auftrag der Reise geschafft sind

  // jedes Gebot läuft über WorldNavi.overbid, jede Einnahme über Game.earn
  const overbid = nv.overbid.bind(nv);
  nv.overbid = (s, bidder, inc, target) => {
    const before = nv.target;
    const inTown = nv.inTown;
    const plan = game.bidPlan;
    const zone = lockZone(trip);
    const opening = nv.opening;
    // erste Runde: was die Wahl der nahen Orte vor dem Gebot über dieses Ziel wusste
    const guess = opening ? trip.whatIf(target.place, true) : null;
    const was = nv.bid;
    const t = overbid(s, bidder, inc, target);
    m.bids++;
    m.bidSum += nv.bid;
    ok(nv.bid % 10 === 0 && inc % 10 === 0 && nv.bid > was, `Gebot ${nv.bid} € (Schritt ${inc} €) ist kein Zehner`);
    ok(t && places[t.place] && places[t.place].name === t.name, `Gebot auf etwas, das kein Ort der Karte ist: ${t && t.name}`);
    ok(t !== before, `Gebot auf das aktuelle Ziel ${t.name}`);
    ok(trip.target === t.place && trip.policy && trip.policy.road, `Die Fahrt führt nach dem Gebot nicht über Straßen nach ${t.name}`);
    const km = nv.km;
    const secs = nv.driveSecs();
    ok(km > 0 && isFinite(km) && secs > 0 && isFinite(secs), `Ziel ${t.name} ist von hier nicht erreichbar (${km} km, ${secs} s)`);
    // HUD-Zeile, Pause-Karte und roter Balken nennen sofort das neue Ziel, seine Entfernung und den Bieter
    ok(nv.shown === t && nv.label === t.goal && t.goal === goalName(places[t.place]) && /^[\d.,]+ (km|m)$/.test(nv.distance) && nv.screen().bidder === nv.bidder && nv.bidder, `Nach dem Gebot auf ${t.name} zeigt das Navi „${nv.label} · ${nv.distance}“ von „${nv.screen().bidder}“`);
    if (opening) {
      // erste Runde: ein naher Ort, nie der Startort, die Ansage zeigt nach vorn, und die Vorhersage stimmte
      const O = m.open;
      O.bids.push({ place: t.place, secs, kind: plan.kind, again: O.standT >= 0 });
      if (O.standT >= 0) O.changed++;
      if (plan.late) O.late++;
      O.dev = Math.max(O.dev, Math.abs(guess.secs - secs));
      O.minChoice = Math.min(O.minChoice, game.bidTargets().length);
      ok(t.place !== trip.home, `Erste Runde: Gebot auf den Startort ${t.name}`);
      ok(!nv.wende && !guess.wende, `Erste Runde: Zum Gebot auf ${t.name} sagt das Navi „Bitte wenden“ (bei s=${trip.s.toFixed(0)})`);
      ok(Math.abs(guess.secs - secs) < 1, `Erste Runde: ${t.name} vorhergesagt ${guess.secs.toFixed(1)} s, nach dem Gebot ${secs.toFixed(1)} s (bei s=${trip.s.toFixed(0)})`);
      ok(secs <= OPENING.secs + 1 || game.bidTargets().length <= OPENING.min, `Erste Runde: ${t.name} liegt ${secs.toFixed(0)} s entfernt (erlaubt ${OPENING.secs} s), obwohl ${game.bidTargets().length} Orte zur Wahl standen`);
      ok(!plan.late, 'Erste Runde: ein spätes Gebot kurz vor dem Ziel');
      if (inTown) O.townBids.push(game.townT);
      ok(!inTown || game.townT >= TOWN_HOLD, `Erste Runde: Ein Gebot nimmt ${before ? before.name : 'das Ziel'} weg, während der Wagen erst ${inTown ? fmt(game.townT, 0) : 0} s im Zielort fährt`);
    } else {
      // die nächste Runde findet immer ein Ziel: Von überall stehen genug Orte zur Wahl
      m.minChoice = Math.min(m.minChoice, game.bidTargets().length);
      m.bands[km < BID_PLACES.nearKm ? 0 : km <= BID_PLACES.farKm ? 1 : km <= 500 ? 2 : 3]++;
    }
    if (zone === 'fork') m.lockFork++;
    else if (zone === 'node') m.lockNode++;
    if (inTown) m.snatched++;
    if (plan.late) m.late++;
    if (!roundOpen) {
      roundOpen = true;
      m.firstN++;
      if (nv.bid === 10) m.first1++;
      ok(nv.bid <= 30, `Die Runde beginnt bei ${nv.bid} € statt bei einem Zehner`);
      if (arrivedT >= 0) ok(game.t - Math.max(arrivedT, tvEndT) < 12, `Erstes Gebot der Runde erst ${(game.t - Math.max(arrivedT, tvEndT)).toFixed(1)} s nach der Ankunft`);
    }
    m.maxGap = Math.max(m.maxGap, game.t - lastBidT);
    lastBidT = game.t;
    if (plan.kind === 'chaos') m.chaos++;
    else m.calm++;
    if (LOG) console.log(`  ${game.t.toFixed(0)} s: ${plan.kind}${plan.late ? ' (spät)' : ''} ${nv.bid.toFixed(2)} € → ${t.name}, ${km.toFixed(0)} km, Navi ${secs.toFixed(0)} s${zone ? ', Sperrzone ' + zone : ''}${inTown ? ', im Zielort weggeboten' : ''}`);
    promised.clear();
    pendingCheck = true;
    num.replan();
    lastPlan = { t: game.t, km, secs };
    return t;
  };
  // nach changeNavi steht fest, wann das nächste Gebot kommt: Bleibt das Ziel eine Weile stehen (wie im Spiel: > 6 s)?
  const changeNavi = game.changeNavi.bind(game);
  game.changeNavi = (siegenOverbid) => {
    changeNavi(siegenOverbid);
    const next = game.bidPlan;
    if (next.delay > 6 && nv.opening && m.open.standT < 0) Object.assign(m.open, { standT: game.t, standPlace: nv.target.place, calm: next.delay, drive: lastPlan.secs });
    if (next.delay > 6) {
      m.standing++;
      m.ratio += next.delay / lastPlan.secs;
      lastPlan.stand = { ratio: next.delay / lastPlan.secs, reached: false };
      m.stand.push(lastPlan.stand);
      if (LOG) console.log(`      … bleibt stehen: nächstes Gebot in ${next.delay.toFixed(0)} s (${(next.delay / lastPlan.secs).toFixed(2)} × Fahrzeit)`);
    }
  };
  const earn = game.earn.bind(game);
  game.earn = (amount, label, opts) => {
    if (label === 'Navi-Gebote') {
      m.earnN++;
      m.earnSum += amount;
    }
    return earn(amount, label, opts);
  };

  const onEvent = (e) => {
    if (e.type === 'arrive') {
      ok(nv.target && nv.target.place === e.place, `Zielpunkt in ${places[e.place].name}, aber das Navi-Ziel ist ${nv.target ? nv.target.name : 'offen'}`);
      m.spots++;
      spotT = game.t;
      promised.clear();
    } else if (e.type === 'pass') m.passed++;
    else if (e.type === 'transit') ok(false, 'Die Fahrt nimmt eine Überfahrt: ' + e.kind);
    else if (e.type === 'fork' && e.wrong) {
      m.wrong++;
      promised.clear();
      // Wer dem Navi folgt, fährt nur dann „falsch“, wenn ein Gebot den Plan erst kurz vor der Gabelung gekippt hat
      const since = planSince.get(e.fork);
      const flipped = !!since && e.fork.s - since.s < J.lock;
      if (flipped) m.flipped++;
      ok(driver.miss > 0 || flipped, `Wer dem Navi folgt, fährt falsch: Gabelung bei s=${e.fork.s.toFixed(0)}, geplant ${e.planned}, gefahren ${e.taken}`);
    }
    if (LOG && (e.type === 'arrive' || e.type === 'pass' || (e.type === 'fork' && e.wrong))) console.log(`  ${game.t.toFixed(0)} s: ${e.type === 'arrive' ? 'Zielpunkt' : e.type}${e.place >= 0 ? ' ' + places[e.place].name : ''}${e.wrong ? ' (anders als angesagt)' : ''}${e.type === 'arrive' ? ' mit ' + p.kmh.toFixed(0) + ' km/h' : ''}`);
    game.onTrip(e);
  };

  const steps = Math.round((hours * 3600) / DT);
  const ctl = { steer: 0, throttle: 0, brake: 0, kappa: 0, grade: 0, horn: false, wiper: false, megafon: false };
  for (let i = 0; i < steps && !(firstRound && m.open.end); i++) {
    limitsFor(trip, lim, arrival.stop(trip));
    p.setLimits(lim);
    // der Fahrer: folgt dem Navi (Ausfahrt nehmen, sonst mittlere Spur) – oder fährt an einer Ausfahrt vorbei
    let want = J.L0;
    const sec = trip.section;
    if (sec.kind === 'ab') {
      const f = sec.fork;
      want = 5.625;
      if (f && !f.taken) {
        // seit wann gilt der Plan für diese Gabelung? (Ein Gebot kann ihn noch auf dem Verzögerungsstreifen kippen.)
        const plan = f.forced ? 'exit' : trip.planFor(f);
        const known = planSince.get(f);
        if (!known || known.plan !== plan) planSince.set(f, { plan, s: trip.s });
        if (f.s - trip.s < J.decel - 10) {
          if (!sloppy.has(f)) sloppy.set(f, Math.random() < driver.miss);
          if (plan === 'exit' && !(sloppy.get(f) && !f.forced)) want = J.L0;
        }
      }
    }
    const dx = want - (p.x + p.vx * AUTO.look);
    ctl.steer = Math.abs(dx) > AUTO.tol ? Math.max(-1, Math.min(1, dx * AUTO.gain)) : 0;
    const v = Math.min(lim.vmax, driver.cruise / 3.6);
    ctl.throttle = p.speed < v - 0.5 ? 1 : 0;
    ctl.brake = p.speed > v + 3 ? 0.4 : 0;
    // am Brunnen: Der Ungeduldige lässt das Gas kurz los und gibt neu Gas – das beendet die Folge sofort
    if (game.tv && driver.skip) ctl.throttle = game.t - tvT0 < 0.9 ? 0 : 1;
    // der Parker hält in der ersten Runde gleich am Ortseingang des Ziels und wartet
    const parked = driver.park && nv.opening && nv.inTown;
    if (parked) Object.assign(ctl, { throttle: 0, brake: 1 });
    if (nv.opening && nv.inTown && m.open.townIn < 0) Object.assign(m.open, { townIn: game.t, townLeft: game.T.bid });
    if (driver.duel) {
      if (nv.inTown && sec !== duelSec && trip.guidance().dist < 150) {
        // mal ein kurzer Schlagabtausch, mal ein langer; mal hastig, mal mit Sekunden zwischen den Geboten
        duelSec = sec;
        const hasty = Math.random() < 0.5;
        duelPace = hasty ? 0.25 + 0.25 * Math.random() : 0.6 + 2 * Math.random();
        m.duels++;
        game.eco.bids.chaos = 0;
        game.eco.bids.duel = hasty ? 10 + Math.floor(30 * Math.random()) : 1 + Math.floor(8 * Math.random());
        game.bidPlan = { increment: 10, delay: 0, kind: 'duel', first: true };
        game.T.bid = 0;
      } else if (sec === duelSec && !sec.spotDone && game.bidPlan.kind === 'duel' && game.T.bid > duelPace) game.T.bid = duelPace * (0.5 + 0.5 * Math.random());
      const f = sec.fork;
      if (sec.kind === 'ab' && f && f !== lockFork && !f.taken && f.branch && f.s - trip.s < 350 && nv.target) {
        lockFork = f;
        if (++lockForks % 10 === 0) game.T.bid = 0;
      }
    }
    game.offAutobahn = sec.kind !== 'ab';
    // der Lader plant bei jeder neuen Warnung den Ladestopp ein, den NOMI nennt
    if (driver.stops) {
      if (game.batteryWarned > warned) {
        m.warns++;
        if (trip.stop < 0 && !game.charging) {
          const r = trip.nextRest(game.range());
          game.planStop();
          if (r && trip.stop === r.park) {
            m.planned++;
            m.parkKm.push(r.km);
          }
        }
      }
      warned = game.batteryWarned;
    }
    const tvBefore = game.tv;
    game.update(DT, ctl, camera);
    if (charging && !game.charging) {
      m.full += p.battery > 99.9 ? 1 : 0;
      ok(p.battery > 99.9 && !arrival.held, `Ladestopp vorbei mit ${p.battery.toFixed(1)} % Akku${arrival.held ? ', der Wagen wird noch gehalten' : ''}`);
    }
    charging = !!game.charging;
    m.minBattery = Math.min(m.minBattery, p.battery);
    // der Stream lädt sonst nie: verbraucht ist, was dem vollen Akku in diesem Schritt fehlt (der Lader zählt nicht)
    const used = driver.stops ? 0 : 100 - p.battery;
    m.akku.t += DT;
    m.akku.used += used;
    if (sec.kind === 'ab') {
      m.akku.abT += DT;
      m.akku.abUsed += used;
    }
    if (p.speed < 0.5) {
      m.akku.standT += DT;
      m.akku.standUsed += used;
    }
    if (!driver.stops) p.battery = 100;
    if (job.road < 0 && p.s - job.s0 >= 8000) job.road = game.t;
    if (job.travel < 0 && game.stats.distance >= REISE_JOBS.dist8.goal) job.travel = game.t;
    if (game.over) {
      ok(false, `Der Stream endet von selbst (${game.over.reason || 'ohne Grund'}) bei t=${game.t.toFixed(0)}`);
      break;
    }
    if (tvBefore && !game.tv) {
      const dur = game.t - tvT0;
      m.tvEnds++;
      m.maxTv = Math.max(m.maxTv, dur);
      m.minTv = Math.min(m.minTv, dur);
      tvEndT = game.t;
      ok(!arrival.held, 'Die Folge ist vorbei, aber der Wagen wird noch gehalten');
    }
    const sBefore = trip.s;
    const evs = trip.update(p.s, p.x);
    num.step(evs, sBefore, !(pendingCheck || i % 10 === 0));
    for (let k = 0; k < evs.length; k++) onEvent(evs[k]);
    const rest = arrival.update(trip, evs, p.speed);
    if (rest && rest.type === 'charge') {
      // im Ladepark: Halt neben der freien Säule, der Platzhalter lädt, dann geht es weiter
      m.charges++;
      game.onTrip(rest);
      ok(game.charging && arrival.held && Math.abs(rest.sec.spotS + PARK_STOP_AFTER - p.s) < 2, `Halt im ${rest.name} ohne Laden (${(p.s - rest.sec.spotS).toFixed(1)} m hinter dem Haltepunkt)`);
    } else if (rest) {
      m.rests++;
      game.onTrip(rest);
      ok(game.tv && game.tv.place === rest.place && arrival.held, 'Halt am Brunnen ohne BrunnenTV-Folge');
    }
    if (!tvBefore && game.tv) {
      // Ankunft: Der Wagen steht am Brunnen des Ziels (die Welt meldet den Halt, oder das Spiel stellt ihn selbst fest)
      halting = false;
      m.arrivals++;
      if (!rest) m.late2++;
      ok(p.speed < 0.2 && game.t - spotT < 15, `BrunnenTV bei ${p.kmh.toFixed(0)} km/h, ${(game.t - spotT).toFixed(1)} s nach dem Zielpunkt`);
      if (!m.open.end) Object.assign(m.open, { end: 'folge', endT: game.t, kept: m.open.changed === 0 && game.tv.place === m.open.standPlace });
      arrivedT = game.t;
      tvEndT = -1;
      roundOpen = false;
      if (lastPlan) m.legs.push({ km: lastPlan.km, navi: lastPlan.secs, secs: game.t - lastPlan.t });
      if (lastPlan && lastPlan.stand) lastPlan.stand.reached = true;
      tvT0 = game.t;
      // ab jetzt gilt „Ziel erreicht“, und der rote Balken nennt keinen Bieter mehr: Die neue Runde ist offen
      // (das Ziel ist der Brunnen des Orts: „Ziel erreicht: Marktbrunnen, Würzburg“)
      ok(!nv.shown && nv.waitLine.includes('Ziel erreicht: ' + goalName(places[game.tv.place])) && nv.screen().wait === '⛲ Ziel erreicht: ' + goalName(places[game.tv.place]) && nv.screen().bidder === '', 'Am Brunnen angekommen, aber die Anzeigen nennen noch ein Ziel oder einen Bieter');
      if (LOG) console.log(`  ${game.t.toFixed(0)} s: steht am Brunnen von ${places[game.tv.place].name}${rest ? '' : ' (knapp hinter dem Haltepunkt)'}`);
    } else if (nv.stopping) {
      halting = true;
      // bis der Wagen steht, nennen HUD-Zeile und roter Balken noch Ziel, Gebot und Bieter der Runde
      ok(nv.shown === nv.stopping && nv.label === nv.stopping.goal && nv.distance === '0 m' && nv.screen().bidder === nv.bidder, 'Zwischen Zielpunkt und Halt zeigen die Anzeigen nicht mehr das Ziel der Runde');
    } else if (halting) {
      // am Brunnen vorbeigerollt: keine Ankunft, die Runde läuft weiter
      halting = false;
      m.rolled++;
      if (!m.open.end) Object.assign(m.open, { end: 'vorbei', endT: game.t });
      ok(nv.missed && !game.roundNew && game.T.bid <= 3.1, 'Vorbeigerollt, aber das Spiel wartet nicht auf das nächste Gebot der Runde');
      ok(!nv.shown && nv.waitLine.includes('vorbeigerollt') && nv.screen().bidder === '', 'Vorbeigerollt, aber die Anzeigen sagen es nicht');
    }
    // kein Hänger: außerhalb der Folge kommt der Wagen voran
    if (game.tv || parked || game.charging) {
      progressS = p.s;
      progressT = game.t;
    } else if (game.t - progressT > 60) {
      ok(p.s - progressS > 300, `Der Wagen steht: ${(p.s - progressS).toFixed(0)} m in 60 s bei s=${p.s.toFixed(0)} (${trip.section.kind}, Limit ${(lim.vmax * 3.6).toFixed(0)} km/h, Halt ${arrival.pending ? 'geplant' : arrival.held ? 'gehalten' : 'frei'}, Ziel ${nv.target ? nv.target.name : nv.stopping ? 'bremst für ' + nv.stopping.name : 'offen'})`);
      progressS = p.s;
      progressT = game.t;
    }
    // Navi und Welt: gleich nach jedem Gebot und sonst dreimal je Sekunde
    if (pendingCheck || i % 10 === 0) {
      nav.update(pendingCheck ? DT : 10 * DT);
      for (const e of nav.events) if (e.type === 'reroute') m.reroutes++;
      checkNavi(trip, nav, promised, m.navi, pendingCheck ? 'nach einem Gebot' : 'unterwegs');
      pendingCheck = false;
    }
  }
  // jeder Leser nimmt dieselbe Strecke: Kilometerzähler, Statistik der Aufträge, Abspann; Aufträge in Reisekilometern
  ok(Math.abs(game.odometer - trip.km * 1000) < 1e-6 && game.odometer - game.stats.distance >= 0 && game.odometer - game.stats.distance < 100, `Kilometerzähler ${game.odometer} m, Statistik ${game.stats.distance} m, Fahrt ${trip.km} km`);
  for (const j of game.jobs) if (REISE_JOBS[j.id]) ok(j.goal === REISE_JOBS[j.id].goal && j.text === REISE_JOBS[j.id].text, `Auftrag ${j.id}: ${j.text} (${j.goal})`);
  m.job = job;
  // Kasse: jedes Gebot genau einmal
  ok(m.earnN === m.bids && m.bids === game.stats.naviChanges && m.bids === nv.changes, `Gebote ${m.bids}, davon verbucht ${m.earnN} (Statistik ${game.stats.naviChanges})`);
  ok(Math.abs(m.earnSum - m.bidSum) < 0.005 && Math.abs((game.breakdown['Navi-Gebote'] || 0) - m.bidSum) < 0.005, `Summe der Gebote ${m.bidSum.toFixed(2)} €, verbucht ${m.earnSum.toFixed(2)} €`);
  ok(game.stats.naviReached === m.arrivals && game.stats.brunnenTV === m.arrivals && tvCards.filter((c) => c.n > 0).length === m.arrivals, `Ankünfte ${m.arrivals}, gezählt ${game.stats.naviReached}; Folgen gezählt ${game.stats.brunnenTV}`);
  ok(m.arrivals === m.rests + m.late2, `${m.arrivals} Ankünfte, aber ${m.rests} Halte der Welt und ${m.late2} knapp dahinter`);
  ok(m.spots - m.arrivals - m.rolled >= 0 && m.spots - m.arrivals - m.rolled <= 1, `${m.spots} Zielpunkte, aber ${m.arrivals} Ankünfte und ${m.rolled}× vorbeigerollt`);
  ok(m.tvEnds >= m.arrivals - 1, `${m.arrivals} Folgen begonnen, ${m.tvEnds} beendet`);
  ok(firstRound || m.minChoice >= 100, `Nur ${m.minChoice} Orte standen bei einem Gebot zur Wahl`);
  ok(m.open.minChoice >= OPENING.min, `Erste Runde: nur ${m.open.minChoice} Orte standen zur Wahl`);
  ok(nv.opening === !m.open.end, `Erste Runde ${m.open.end ? 'vorbei (' + m.open.end + ')' : 'offen'}, das Navi sagt ${nv.opening ? 'offen' : 'vorbei'}`);
  m.hours = game.t / 3600;
  m.km = (p.s - trip.cur.s0) / 1000;
  m.roadKm = p.s / 1000;
  m.tripKm = trip.km;
  m.money = game.money;
  return m;
}

// --- Die Streams ---------------------------------------------------------------------------------------------------
const fmt = (x, d = 1) => x.toFixed(d).replace('.', ',');
/** Die Zahlen passen zusammen: was in einem Stream geprüft wurde und was die echten Straßen zu den Kilometern beitragen. */
function numbersLine(m) {
  const N = m.num;
  const all = N.edgeKm + N.feederKm + N.realKm;
  const by = Object.entries(N.realBy).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${fmt(v, 0)}`).join(', ');
  return (
    `Die Zahlen passen zusammen: ${N.steps} Schritte, ${fmt(m.tripKm, 0)} Reisekilometer auf ${fmt(m.roadKm, 0)} km Straße · ${N.falls}× fiel die Entfernung zum Ziel genau wie der Zähler stieg (größter Fehler ${N.maxErr.toExponential(1)} km), ${N.plans} neue Pläne` +
    ` · Anzeige in km ${N.kms}× (davon ${N.kmReal}× auf echter Straße über ${BOARD_M} m: „1,2 km“ statt „1150 m“), in Metern ${N.metres}× (nur auf echter Straße bis ${BOARD_M} m), ${N.units} Wechsel km → m (größter Sprung der Zahl ${fmt(N.unitDrop, 0)} m, erlaubt 100 m)` +
    ` · ${N.sums}× Ziel = Handlung + Rest, ${N.same}× im Zielort dieselbe Zahl auf Ansage, Kärtchen und HUD-Zeile, Ausfahrt ${N.calm}× als Vorschau in km und ${N.near}× in Metern, ${N.boards} Vorwegweiser, ${N.parkBoards} Ladepark-Tafeln und ${N.beacons} Baken mit der Zahl der Ansage` +
    ` · ${N.tables} Entfernungstafeln, ${N.tableRows} nannten das Ziel (größte Abweichung ${fmt(N.tableDev, 2)} km)` +
    ` · ${N.edges} Kanten = ${fmt(N.edgeKm, 0)} km laut Karte, Zubringer ${fmt(N.feederKm, 0)} km, echte Straße ${fmt(N.realKm, 0)} km (${fmt((100 * N.realKm) / Math.max(all, 1e-9), 1)} %: ${by})` +
    `\n    Uhr = Reisezeit: ${fmt(N.clockMove / 3600, 2)} h der Uhr in Fahrt für ${fmt(N.clockKm, 0)} Reisekilometer (Uhr × Tempo = Reisemeter, größter Fehler ${N.clockErr.toExponential(1)} m), ${fmt(N.clockStand / 60, 1)} min im Stand wie die echte Zeit` +
    ` · Ankunftszeit beim Gebot gegen die Uhr am Zielpunkt: ~30 km ${drift(N, 18, 45)} · ~100 km ${drift(N, 75, 130)} · ~250 km ${drift(N, 190, 320)}`
  );
}
/** Wie weit die Ankunftszeit vom Gebot bis zum Zielpunkt lief (Minuten der Uhr; − = früher da als angesagt). */
function drift(N, a, b) {
  const L = N.etaLegs.filter((l) => l.km >= a && l.km < b);
  if (!L.length) return '–';
  const d = L.map((l) => l.drift);
  const sgn = (x) => (x > 0 ? '+' : x < 0 ? '−' : '±') + fmt(Math.abs(x), 1);
  return `${sgn(d.reduce((s, x) => s + x, 0) / d.length)} min (${sgn(Math.min(...d))} bis ${sgn(Math.max(...d))}, ${L.length}×)`;
}
// Akku (REISE.md A5, Entscheidung der Projektleitung vom 19.11.): Ein voller Akku reicht für etwa 8 bis 12 Minuten
// zügiger Fahrt, auch im Stand verbraucht der Stream etwas. Das klassische Modell (Player.update) trifft das schon
// (3 h je Fahrer: im ganzen Stream 9,8 / 11,0 / 12,0 min, auf der offenen Autobahn 7,3 / 9,4 / 11,5 min, im Stand
// 16,7 min) und bleibt darum für beide Modi dasselbe. Grenzen in Minuten je 100 %:
const AKKU_BOUNDS = { stream: [8, 13], ab: [6.5, 13] };
// Minuten, die 100 % Akku reichen (aus dem Verbrauch je Sekunde)
const akkuMin = (used, t) => (used > 0 ? (100 / (used / t)) / 60 : Infinity);
function akkuLine(a) {
  return `Akku: 100 % reichen im ganzen Stream ${fmt(akkuMin(a.used, a.t), 1)} min, auf der offenen Autobahn ${fmt(akkuMin(a.abUsed, a.abT), 1)} min` +
    ` (${fmt((100 * a.abT) / a.t, 0)} % der Zeit), im Stand ${fmt(akkuMin(a.standUsed, a.standT), 1)} min (${fmt((100 * a.standT) / a.t, 0)} % der Zeit)`;
}
const rows = [];
const t0 = Date.now();
DRIVERS.forEach((driver, k) => {
  if (LOG) console.log(driver.name + ':');
  const m = stream(driver, HOURS, 4711 + k);
  rows.push({ driver, m });
});
for (const { driver, m } of rows) {
  const h = m.hours;
  const a = m.akku;
  if (a.t >= 600 && a.abT >= 300) {
    const [st, ab] = [akkuMin(a.used, a.t), akkuMin(a.abUsed, a.abT)];
    ok(st >= AKKU_BOUNDS.stream[0] && st <= AKKU_BOUNDS.stream[1], `Akku, ${driver.name}: 100 % reichen im Stream ${fmt(st, 1)} min (erlaubt ${AKKU_BOUNDS.stream.join(' bis ')})`);
    ok(ab >= AKKU_BOUNDS.ab[0] && ab <= AKKU_BOUNDS.ab[1], `Akku, ${driver.name}: 100 % reichen auf der Autobahn ${fmt(ab, 1)} min (erlaubt ${AKKU_BOUNDS.ab.join(' bis ')})`);
  }
  const legs = (a, b) => {
    const L = m.legs.filter((l) => l.km >= a && l.km < b);
    if (!L.length) return '–';
    const avg = (f) => L.reduce((s, l) => s + f(l), 0) / L.length;
    return `${fmt(avg((l) => l.secs), 0)} s (Navi ${fmt(avg((l) => l.navi), 0)} s, ${L.length}×)`;
  };
  // stehende Ziele nach Ruhe/Fahrzeit: wie viele davon erreicht wurden
  const band = (a, b) => {
    const L = m.stand.filter((x) => x.ratio >= a && x.ratio < b);
    return `Ruhe ${a ? '≥ ' + fmt(a, 2) : '< ' + fmt(b, 2)}${a && b < 9 ? ' bis ' + fmt(b, 2) : ''} × Fahrzeit: ${L.filter((x) => x.reached).length} von ${L.length}`;
  };
  const tot = m.bands.reduce((a, b) => a + b, 0) || 1;
  console.log(
    `${driver.name} (${driver.cruise} km/h): ${fmt(h)} h, ${fmt(m.roadKm, 0)} km Straße · Ankünfte ${m.arrivals} (${fmt(m.arrivals / h)}/h), alle mit BrunnenTV` +
      ` · Gebote ${m.bids} (${fmt(m.bids / h / 60, 2)}/min, ${fmt(m.bidSum / h / 60, 2)} €/min), je Ankunft ${fmt(m.bids / Math.max(1, m.arrivals))}` +
      ` · ${m.standing} Ziele blieben stehen (Ruhe im Mittel ${fmt(m.ratio / Math.max(1, m.standing), 2)} × Fahrzeit), erreicht ${fmt((100 * m.arrivals) / Math.max(1, m.standing), 0)} %` +
      ` (${band(0, 0.9)} · ${band(0.9, 1.15)} · ${band(1.15, 9)})` +
      ` · ruhige Gebote ${m.calm}, im Chaos ${m.chaos}, spät ${m.late}, im Zielort weggeboten ${m.snatched}, am Brunnen vorbeigerollt ${m.rolled}, knapp hinter dem Haltepunkt gestanden ${m.late2}` +
      ` · längste Pause ${fmt(m.maxGap, 0)} s · Folge ${fmt(m.minTv)}–${fmt(m.maxTv)} s` +
      `\n    Fahrzeit zum Ziel: ~30 km ${legs(18, 45)} · ~100 km ${legs(75, 130)} · ~250 km ${legs(190, 320)}` +
      `\n    Ziele nach Entfernung: <${BID_PLACES.nearKm} km ${fmt((100 * m.bands[0]) / tot, 0)} % · bis ${BID_PLACES.farKm} km ${fmt((100 * m.bands[1]) / tot, 0)} % · bis 500 km ${fmt((100 * m.bands[2]) / tot, 0)} % · weiter ${fmt((100 * m.bands[3]) / tot, 0)} %` +
      ` · zur Wahl standen stets ≥ ${m.minChoice} Orte · in Sperrzonen geboten: ${m.lockFork} vor Gabelungen, ${m.lockNode} vor Knoten · an der Gabelung anders als angesagt ${m.wrong}× (${m.flipped}× kippte ein Gebot den Plan kurz davor) · Einnahmen ${fmt(m.money / h / 60, 2)} €/min` +
      ` · Auftrag „${REISE_JOBS.dist8.text}“ nach ${fmt(m.job.travel, 0)} s (8 km Straße wie klassisch: ${fmt(m.job.road, 0)} s)` +
      `\n    ${akkuLine(m.akku)}` +
      `\n    Navi und Welt: ${m.navi.checks} Ansagen geprüft (${m.navi.exit} Ausfahrten, ${m.navi.far} hinter dem Horizont, ${m.navi.farKept} davon eingelöst, ${m.navi.arrive} Ziel voraus, ${m.navi.wende}× „dann wenden“), ${m.reroutes} Neuberechnungen` +
      `\n    ${numbersLine(m)}`,
  );
}
// Härtetest: Bieterduell auf den letzten Metern
{
  if (LOG) console.log(DUELLIST.name + ':');
  // (Startwert so gewählt, dass der Stream alles Verlangte enthält: 21 Duelle, 6 Ankünfte, 4× vorbeigerollt, 1× knapp
  // hinter dem Haltepunkt – wer an den Bieterregeln dreht oder an den Listen, aus denen das Spiel würfelt (zuletzt drei
  // neue Sprachdurchsagen), verschiebt den Zufall und sucht hier notfalls neu)
  const m = stream(DUELLIST, HOURS, 827);
  console.log(
    `${DUELLIST.name}: ${fmt(m.hours)} h, ${m.duels} Duelle auf den letzten 150 m, ${m.bids} Gebote · danach ${m.arrivals}× am Brunnen gestanden (BrunnenTV;` +
      ` ${m.late2}× knapp hinter dem Haltepunkt), ${m.rolled}× vorbeigerollt, ${m.duels - m.spots}× war das Ziel am Brunnen gerade ein anderes` +
      ` · in Sperrzonen geboten: ${m.lockFork} vor Gabelungen, ${m.lockNode} vor Knoten · an der Gabelung anders als angesagt ${m.wrong}× (${m.flipped}× kippte ein Gebot den Plan kurz davor)` +
      `\n    ${numbersLine(m)}`,
  );
  if (HOURS >= 3) ok(m.duels >= 10 && m.arrivals >= 3 && m.rolled >= 1, `Duell im Zielort: zu wenig geprüft (${m.duels} Duelle, ${m.arrivals} Ankünfte, ${m.rolled} vorbeigerollt, ${m.late2} knapp dahinter)`);
  rows.push({ driver: DUELLIST, m });
}
// Ladestopps: Wer bei NOMIs Warnung den genannten Ladepark einplant, läuft nie leer
// (Startwerte so gewählt, dass es gilt: NOMIs Reichweite rechnet in Reisekilometern, der Akku leert sich je Sekunde –
// führt der Weg zum Park über viel echte Straße, reicht sie nicht immer, in etwa jedem fünften Stream schon vor den
// Zehner-Geboten (5106, 5109, 5115). Wer am Zufall der Reise dreht, sucht hier notfalls neu; offen in geld/NOTES.md.)
{
  const runs = [0, 1, 2].map((k) => stream(LADER, LADE_MIN / 60, 5104 + k));
  const all = (f) => runs.reduce((a, m) => a + f(m), 0);
  const minB = Math.min(...runs.map((m) => m.minBattery));
  const km = runs.flatMap((m) => m.parkKm).sort((a, b) => a - b);
  for (const m of runs) ok(m.minBattery > 0 && m.charges >= 1 && m.full >= m.charges - 1, `Lader: kleinster Akku ${fmt(m.minBattery, 1)} %, ${m.charges} Ladestopps, ${m.full} davon voll geladen`);
  ok(all((m) => m.planned) >= 3 && all((m) => m.charges) >= 3, `Lader: zu wenig geprüft (${all((m) => m.planned)} eingeplant, ${all((m) => m.charges)} geladen)`);
  console.log(
    `${LADER.name}: ${runs.length} × ${LADE_MIN} min, ${all((m) => m.warns)} Warnungen NOMIs, ${all((m) => m.planned)} Ladestopps eingeplant (Weg dorthin ${km.length ? fmt(km[0], 0) + '–' + fmt(km[km.length - 1], 0) : '–'} km), ` +
      `${all((m) => m.charges)}× im Ladepark gehalten und voll geladen, kleinster Akku ${fmt(minB, 1)} % · ${fmt(all((m) => m.roadKm), 0)} km Straße, ${fmt(all((m) => m.tripKm), 0)} Reisekilometer`,
  );
}
// --- Im Tempo des Navis steht die Ankunftszeit still ------------------------------------------------------------------
// Ein gedachtes Auto (MapDemo) fährt je Abschnitt genau das Tempo, das die Fahrt dort annimmt, die Uhr läuft wie im
// Spiel (Game.travelStep): Uhr + Reisezeit des Rests bleibt vom Gebot bis zum Zielpunkt stehen – bis auf die
// Schritte über eine Abschnittsgrenze, in denen das Auto noch im Tempo des alten Abschnitts fährt.
const ETA_TOL = 3; // Sekunden der Uhr auf einer ganzen Fahrt
function atNaviPace(seed, lo, hi) {
  const R = mulberry32(seed);
  const demo = new MapDemo({ rng: R }); // Start in Erlensee wie im Spiel
  const trip = demo.trip;
  const G = { world: { trip: () => trip }, travel: null };
  const D = trip.distances();
  const pool = places.filter((p) => D.toPlace(p.i).km > lo && D.toPlace(p.i).km < hi);
  let goal = -1;
  while (pool.length && !isFinite(trip.reach().km)) {
    goal = pool.splice(Math.floor(R() * pool.length), 1)[0].i;
    trip.setTarget(goal, true);
  }
  const km = trip.reach().km;
  let clock = 0;
  let eta0 = NaN;
  let dev = 0;
  for (let k = 0; k < 400000 && trip.target === goal; k++) {
    clock += Game.prototype.travelStep.call(G, DT).secs;
    const eta = clock + trip.reach().clock;
    if (k === 0) eta0 = eta;
    dev = Math.max(dev, Math.abs(eta - eta0));
    demo.advance(PROFILES[trip.section.profile].pace * DT, DT);
  }
  clock += Game.prototype.travelStep.call(G, DT).secs; // der letzte Schritt bis zum Zielpunkt
  ok(trip.target !== goal, `Im Tempo des Navis nicht nach ${places[goal].name} gekommen`);
  ok(dev < ETA_TOL && Math.abs(clock - eta0) < ETA_TOL, `Im Tempo des Navis nach ${places[goal].name} (${fmt(km, 0)} km): Ankunftszeit läuft um ${fmt(dev, 1)} s, angekommen ${fmt(clock - eta0, 1)} s nach der Ansage`);
  return { name: places[goal].name, km, dev, end: clock - eta0, h: clock / 3600 };
}
{
  const runs = [];
  for (let r = 0; r < 3; r++) for (const [lo, hi] of [[20, 40], [80, 120], [200, 300]]) runs.push(atNaviPace(900 + r, lo, hi));
  console.log(
    `Im Tempo des Navis (${runs.length} Fahrten, ${runs.map((x) => fmt(x.km, 0)).join(' / ')} km): die Ankunftszeit lief höchstens ${fmt(Math.max(...runs.map((x) => x.dev)), 2)} s weg,` +
      ` am Zielpunkt zeigte die Uhr die angesagte Zeit auf ${fmt(Math.max(...runs.map((x) => Math.abs(x.end))), 2)} s genau (erlaubt ${ETA_TOL} s)`,
  );
}

// --- Die erste Runde führt zu einem Brunnen ---------------------------------------------------------------------------
// Viele Streams von höchstens zehn Minuten je Fahrer, jeder mit eigenem Startwert, jeder bis zum ersten Halt an einem
// Brunnen. Gemessen wird, wie oft der Wagen am Brunnen des Ziels steht, das nach dem Bieter-Chaos stehen blieb, bevor
// ein Gebot es änderte („gehalten“), wie oft die erste Runde überhaupt mit einer Folge endet, und nach wie vielen
// echten Sekunden ab dem Start der Wagen steht. Gewollt sind etwa neun von zehn gehaltenen Zielen beim zügigen Fahrer,
// drei von vier beim mittleren und mindestens die Hälfte beim gemütlichen (gemessen mit je 300: 93, 80 und 63 %; die
// 60 Streams von npm test messen 97, 75 und 63 %). Die Gebote nach dem Chaos nennen auch, wie weit ihre Ziele lagen:
// Seit OPENING.min 2 statt 4 liegen 24 bis 32 % (vorher 33 bis 47 %) weiter als OPENING.secs, dort war nichts
// anderes so nah; an den Halten ändert das nichts (gemütlich weiter 5 % ohne Halt in zehn Minuten: Er verliert das
// erste Ziel vor der Ankunft, und für das zweite reicht die Zeit nicht). Die Grenzen (Anteile in Prozent, Sekunden;
// p90: höchstens ein Zehntel der Streams braucht länger) lassen dem Zufall von 60 Streams Luft und gelten ab
// OPENINGS = 60; wer an OPENING, OPENING_CALM oder den Pausen des Chaos dreht, sieht hier, was es mit den ersten
// Minuten macht.
const OPEN_BOUNDS = {
  'zügig': { kept: [80, 100], episode: 95, median: 240, p90: 420 },
  mittel: { kept: [62, 92], episode: 90, median: 270, p90: 540 },
  'gemütlich': { kept: [50, 85], episode: 82, median: 320, p90: Infinity },
};
const OPEN_MIN = 10 / 60; // Stunden: zehn Minuten je Stream
if (OPENINGS > 0) {
  const tOpen = Date.now();
  const drawn = new Map(); // Ort → {bids, stand, reached} über alle Fahrer
  const row = (place) => drawn.get(place) || drawn.set(place, { bids: 0, stand: 0, reached: 0 }).get(place);
  let dev = 0;
  DRIVERS.forEach((driver, k) => {
    const runs = [];
    for (let r = 0; r < OPENINGS; r++) runs.push(stream(driver, OPEN_MIN, 20000 + 1000 * k + r, true).open);
    const share = (f) => (100 * runs.filter(f).length) / runs.length;
    const times = runs.filter((o) => o.end === 'folge').map((o) => o.endT).sort((a, b) => a - b);
    // Median und neuntes Dezil über alle Streams: einer ohne Halt in zehn Minuten zählt als „später“
    const q = (p) => {
      const i = Math.ceil(p * runs.length) - 1;
      return i < times.length ? times[i] : Infinity;
    };
    for (const o of runs) {
      for (const b of o.bids) row(b.place).bids++;
      if (o.standPlace >= 0) row(o.standPlace).stand++;
      if (o.kept) row(o.standPlace).reached++;
      dev = Math.max(dev, o.dev);
    }
    const chaos = runs.reduce((n, o) => n + o.bids.filter((b) => b.kind === 'chaos').length, 0) / runs.length;
    const standT = runs.reduce((n, o) => n + o.standT, 0) / runs.length;
    const calm = runs.reduce((n, o) => n + o.calm / o.drive, 0) / runs.length;
    const kept = share((o) => o.kept);
    const episode = share((o) => o.end === 'folge');
    const sec = (x) => (isFinite(x) ? fmt(x, 0) + ' s' : 'über 600 s');
    // die Gebote nach dem Chaos: wie weit (Sekunden im Tempo des Navis vom Wagen aus) liegen ihre Ziele?
    const again = runs.flatMap((o) => o.bids.filter((b) => b.again).map((b) => b.secs)).sort((a, b) => a - b);
    const againLine = again.length
      ? `, ihre Ziele ${fmt(again[Math.floor(again.length / 2)], 0)} s (Median) bis ${fmt(again[again.length - 1], 0)} s entfernt, ${fmt((100 * again.filter((s) => s > OPENING.secs + 1).length) / again.length, 0)} % weiter als ${OPENING.secs} s`
      : '';
    console.log(
      `Erste Runde, ${driver.name} (${driver.cruise} km/h), ${runs.length} Streams zu 10 min: am Brunnen des stehenden Ziels, bevor ein Gebot es änderte, ${fmt(kept, 0)} %` +
        ` · erste Runde endet mit einer Folge ${fmt(episode, 0)} % (vorbeigerollt ${fmt(share((o) => o.end === 'vorbei'), 0)} %, kein Halt in 10 min ${fmt(share((o) => !o.end), 0)} %)` +
        ` · der Wagen steht nach ${sec(q(0.5))} (Median), ${sec(q(0.9))} (9. Dezil), frühestens ${sec(times[0])}` +
        ` · Bieter-Chaos ${fmt(chaos)} Gebote, das Ziel steht nach ${fmt(standT, 0)} s, Ruhe im Mittel ${fmt(calm, 2)} × Fahrzeit · Gebote nach dem Chaos ${fmt(runs.reduce((n, o) => n + o.changed, 0) / runs.length, 2)} je Stream${againLine}`,
    );
    const B = OPEN_BOUNDS[driver.name];
    if (OPENINGS >= 60) {
      ok(kept >= B.kept[0] && kept <= B.kept[1], `Erste Runde, ${driver.name}: ${fmt(kept, 0)} % stehen am Brunnen des stehenden Ziels (erlaubt ${B.kept[0]} bis ${B.kept[1]} %)`);
      ok(episode >= B.episode, `Erste Runde, ${driver.name}: nur ${fmt(episode, 0)} % enden mit einer Folge (mindestens ${B.episode} %)`);
      ok(q(0.5) <= B.median && q(0.9) <= B.p90, `Erste Runde, ${driver.name}: der Wagen steht nach ${sec(q(0.5))} (Median, erlaubt ${B.median} s) und ${sec(q(0.9))} (9. Dezil, erlaubt ${sec(B.p90)})`);
    }
    ok(runs.every((o) => o.bids.filter((b) => b.kind === 'chaos').length >= 7 && new Set(o.bids.map((b) => b.place)).size >= 2), `Erste Runde, ${driver.name}: ein Stream ohne Bieter-Chaos oder ohne Zielwechsel`);
    ok(runs.every((o) => o.late === 0), `Erste Runde, ${driver.name}: späte Gebote kurz vor dem Ziel`);
  });
  const list = [...drawn].sort((a, b) => b[1].bids - a[1].bids);
  const all = list.reduce((n, [, d]) => n + d.bids, 0);
  // genannt wird, wer mindestens ein Hundertstel der Gebote bekam oder einmal stehen blieb; der Rest in einer Summe
  const named = list.filter(([, d]) => d.bids >= all / 100 || d.stand > 0);
  const rest = list.length - named.length;
  console.log(
    `Erste Runde, die Orte (${3 * OPENINGS} Streams, ${all} Gebote; Vorhersage der Fahrzeit vor dem Gebot höchstens ${fmt(dev, 2)} s daneben): ` +
      named.map(([place, d]) => `${places[place].name} ${fmt((100 * d.bids) / all, 1)} % der Gebote, ${d.stand}× stehend, ${d.reached}× so erreicht`).join(' · ') +
      (rest ? ` · ${rest} weitere Orte mit zusammen ${fmt((100 * list.slice(named.length).reduce((n, [, d]) => n + d.bids, 0)) / all, 1)} % der Gebote, nie stehend` : '') +
      ` · in ${((Date.now() - tOpen) / 1000).toFixed(0)} s`,
  );
  ok(list.length >= OPENING.min, `Erste Runde: nur ${list.length} verschiedene Orte wurden geboten`);
  // Wer im Zielort parkt, statt zum Brunnen zu fahren, hält die Bieter höchstens TOWN_HOLD Sekunden auf
  const parker = { name: 'Parker', cruise: 145, miss: 0, skip: false, park: true };
  const waits = [];
  for (let r = 0; r < 10; r++) {
    const o = stream(parker, OPEN_MIN, 30000 + r, true).open;
    if (o.townIn < 0) continue;
    // höchstens TOWN_HOLD gehalten; war die Ruhe nach dem letzten Gebot länger, kommt es erst mit ihrem Ende
    const allowed = Math.max(TOWN_HOLD + 1, o.townLeft) + 0.5;
    if (o.townIn + allowed > OPEN_MIN * 3600 - 1) continue;
    waits.push(o.townBids[0]);
    ok(o.townBids.length > 0 && o.townBids[0] <= allowed, `Erste Runde, Parker: Im Zielort kam ${o.townBids.length ? 'erst nach ' + fmt(o.townBids[0], 0) + ' s' : 'kein'} Gebot (erlaubt ${fmt(allowed, 0)} s)`);
  }
  ok(waits.length >= 5, `Erste Runde, Parker: nur ${waits.length} von 10 Streams standen rechtzeitig im Zielort`);
  console.log(`Erste Runde, Parker (hält am Ortseingang des Ziels): ${waits.length} von 10 Streams, das nächste Gebot kam dort nach ${waits.map((w) => fmt(w ?? NaN, 0)).join(', ')} s (höchstens ${TOWN_HOLD} s gehalten)`);
}

// genug geprüft?
const sum = (f) => rows.reduce((s, r) => s + f(r.m), 0);
if (HOURS >= 3) {
  ok(sum((m) => m.arrivals) >= 30, `zu wenige Ankünfte: ${sum((m) => m.arrivals)}`);
  ok(sum((m) => m.lockFork) >= 10 && sum((m) => m.lockNode) >= 20, `zu wenige Gebote in Sperrzonen: ${sum((m) => m.lockFork)} / ${sum((m) => m.lockNode)}`);
  ok(sum((m) => m.navi.exit) > 2000 && sum((m) => m.navi.arrive) > 300, 'Navi und Welt: zu wenig geprüft');
  ok(sum((m) => m.num.kmReal) >= 500 && sum((m) => m.num.units) >= 20, `Anzeige auf echter Straße über ${BOARD_M} m und ihr Wechsel zu Metern: zu wenig geprüft (${sum((m) => m.num.kmReal)} Schritte, ${sum((m) => m.num.units)} Wechsel)`);
}
console.log(`Reise: ${rows.length} Streams zu je ${HOURS} h in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
if (fails) {
  console.error(`${fails} Fehler`);
  process.exit(1);
}
console.log('alles in Ordnung');
