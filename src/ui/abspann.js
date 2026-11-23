// Abspann, „Danke an“ (menus.js render_over): alle, die in diesem Stream etwas gegeben haben, nach Art getrennt –
// Spenden und Navi-Gebote mit der Summe je Name, verschenkte Abos mit ihrer Anzahl, die neuen VIPs und die Raids mit
// den Leuten, die mitkamen. Die Namen sind die des Spiels (ausgedachte Zuschauer und die Parodienamen wie BontanaBack
// und König Knolli); Game.supporters liefert sie. Ohne DOM: tools/menues-test.mjs prüft an einem simulierten Stream,
// dass jeder Name mit seiner Summe dasteht.
import { fmtBetrag } from '../data.js';
import { fmtNum } from '../util.js';

const plural = (n, one, many) => fmtNum(n) + ' ' + (n === 1 ? one : many);
const total = (list, k) => list.reduce((a, x) => a + x[k], 0);

/**
 * Die Gruppen in ihrer Reihenfolge: { id, title, sub (Summe der Gruppe), names: [{ name, what }] } – what ist Summe
 * oder Anzahl des Namens („12,50 €“, „3“), bei den VIPs leer. Leere Gruppen fallen weg; die Reihenfolge der Namen ist
 * die von Game.supporters (höchste Summe zuerst).
 */
export function thanksGroups(F) {
  if (!F) return [];
  const donors = F.donors || [];
  const bidders = F.bidders || [];
  const gifters = F.gifters || [];
  const vips = F.vips || [];
  const raids = F.raids || [];
  // gerundet auf den Cent, wie die Summen je Name
  const money = (list) => fmtBetrag(Math.round(total(list, 'sum') * 100) / 100);
  const groups = [
    { id: 'spenden', title: 'Spenden', sub: `${plural(donors.length, 'Name', 'Namen')} · ${money(donors)}`, names: donors.map((x) => ({ name: x.name, what: fmtBetrag(x.sum) })) },
    { id: 'gebote', title: 'Navi-Gebote', sub: `${plural(total(bidders, 'n'), 'Gebot', 'Gebote')} · ${money(bidders)}`, names: bidders.map((x) => ({ name: x.name, what: fmtBetrag(x.sum) })) },
    { id: 'abos', title: 'Abos verschenkt', sub: plural(total(gifters, 'count'), 'Abo', 'Abos'), names: gifters.map((x) => ({ name: x.name, what: fmtNum(x.count) })) },
    { id: 'vips', title: 'Neue VIPs', sub: plural(vips.length, 'VIP', 'VIPs'), names: vips.map((name) => ({ name, what: '' })) },
    { id: 'raids', title: 'Raids', sub: `${plural(total(raids, 'n'), 'Raid', 'Raids')} · ${plural(total(raids, 'sum'), 'Gast', 'Gäste')}`, names: raids.map((x) => ({ name: x.name, what: `${plural(x.n, 'Raid', 'Raids')}, ${plural(x.sum, 'Gast', 'Gäste')}` })) },
    // der Verein des Streams (game/gags.js) steht nicht im Abspann (Eigentümer, 23.11.2026), nur seine Zahl in der
    // Abrechnung; BontanaBack und die anderen Großbieter stehen wie alle bei den Navi-Geboten
  ];
  return groups.filter((g) => g.names.length);
}
