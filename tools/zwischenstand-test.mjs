// Prüft den Zwischenstand eines Streams (Game.interim, für save.js settleStream): Er bucht genau, was der Abspann
// (Game.end) in diesem Moment gebucht hätte – Geld samt aller offenen Schäden, Strecke, Zuschauerspitze, Ziele,
// Rempler –, auch mit einer Werkstatt-Rechnung unterwegs (zwischen Ankunft und payBill) und mit Remplern der
// laufenden Runde. Und interim() ändert nichts am Spiel.
// node tools/zwischenstand-test.mjs
import { makeStream, DRIVERS } from './stream-sim.mjs';

let fails = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) {
    fails++;
    console.error('FEHLER: ' + msg);
  }
}
const cent = (v) => Math.round(v * 100);

/** Zwischenstand und Abspann im selben Moment vergleichen (der Stream ist danach vorbei). */
function compare(sim, what) {
  const g = sim.game;
  const before = { money: g.money, tally: { ...g.tally }, bill: g.billDue && { ...g.billDue } };
  const a = g.interim();
  const b = g.interim();
  ok(JSON.stringify(a) === JSON.stringify(b), `${what}: interim() ist nicht wiederholbar`);
  ok(g.money === before.money && JSON.stringify(g.tally) === JSON.stringify(before.tally) && JSON.stringify(g.billDue && { ...g.billDue }) === JSON.stringify(before.bill), `${what}: interim() verändert das Spiel`);
  g.end('quit');
  const o = g.over;
  ok(cent(a.money) === cent(o.money), `${what}: Zwischenstand ${a.money} €, Abspann ${o.money} €`);
  ok(a.distance === o.distance, `${what}: Strecke ${a.distance} statt ${o.distance}`);
  ok(a.peakViewers === o.peakViewers && a.naviReached === o.stats.naviReached && a.crashes === o.stats.crashes, `${what}: Zuschauer, Ziele oder Rempler weichen ab`);
  return { a, o, before };
}

let withBill = 0;
let withHits = 0;
for (const [i, dk] of ['zuegig', 'mittel', 'gemuetlich'].entries()) {
  for (const seed of [3, 8]) {
    // 1. mitten in der Fahrt, mit zwei Remplern und Kratzern in der laufenden Runde
    {
      const sim = makeStream({ driver: DRIVERS[dk], seed, endless: true });
      sim.step(90 + 40 * i);
      sim.game.tally.hits += 2;
      sim.p.damage.scraped = (sim.p.damage.scraped || 0) + 3;
      const { a, before } = compare(sim, `${dk}/${seed} unterwegs mit Remplern`);
      // (die offenen Schäden stehen im Zwischenstand: weniger Geld als in der Kasse)
      if (a.money < before.money - 1) withHits++;
    }
    // 2. gleich nach einer Ankunft: Die Rechnung der Runde ist unterwegs (payBill kommt 3,2 s später)
    {
      const sim = makeStream({ driver: DRIVERS[dk], seed, endless: true });
      sim.game.tally.hits += 1;
      let found = false;
      for (let k = 0; k < 20 * 60 * 30 && !found; k++) {
        sim.step(1 / 30);
        found = !!sim.game.billDue;
      }
      if (found) {
        withBill++;
        compare(sim, `${dk}/${seed} mit Rechnung unterwegs`);
      }
    }
  }
}
ok(withBill >= 4, `nur ${withBill} Streams mit einer Rechnung unterwegs geprüft`);
ok(withHits === 6, `nur ${withHits} Streams mit offenen Schäden geprüft`);
console.log(`Zwischenstand: ${withHits} Streams mit offenen Schäden, ${withBill} mit Rechnung unterwegs – Zwischenstand gleich Abspann`);
console.log(fails ? `zwischenstand-test: ${fails} von ${checks} Prüfungen FEHLGESCHLAGEN` : `zwischenstand-test: alles grün (${checks} Prüfungen)`);
process.exit(fails ? 1 : 0);
