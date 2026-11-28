// Rubriken von BrunnenTV: Manche Folgen haben ein eigenes Format (der Besitzer am 28.11.2026 zur Probe-Rubrik: „ja,
// gerne“). Die erste ist das Brunnen-Interview: Mini Adam stellt dem Brunnen durchs Megafon eine Frage, ruft wie in
// jeder Folge „Schöner Brunnen!“, dann antwortet der Brunnen – er plätschert –, und OMI übersetzt.
//
// Der Ruf „Schöner Brunnen!“ bleibt in jeder Rubrik, wie er ist (der Besitzer, 27.11.: „‚Schöner Brunnen‘ muss
// wirklich immer sein, sonst ist es kein BrunnenTV“): Eine Rubrik ersetzt nur den Gruß davor und OMIs Satz danach.
//
// Längen wie in brunnentexte.js: Die Frage ersetzt den Gruß und muss vor dem Ruf zu Ende sein (höchstens gut 38
// Zeichen), OMIs Übersetzung bleibt unter 91 Zeichen (tools/rubriken-test.mjs prüft beides an jedem Ort).
// Platzhalter wie in brunnentexte.js fuelle: {brunnen}, {ort}, {stein}, {n}.
// Reine Daten und Logik ohne Grafik (läuft unter Node).

/** Wann die Antwort des Brunnens kommt (Sekunden der Folge): nach dem Ruf, vor OMIs Übersetzung (TV.nomi). */
export const ANTWORT_T = 8.6;

export const INTERVIEW = {
  key: 'interview',
  name: 'Brunnen-Interview',
  // (in etwa jeder vierten Folge ab der zweiten; nie zweimal hintereinander)
  chance: 0.28,
  // q: die Frage durchs Megafon, a: was OMI daraus übersetzt (sie beginnt immer mit „Übersetzung:“)
  fragen: [
    {
      q: 'Lieber Brunnen, wie geht es dir?',
      a: ['Übersetzung: „Danke, gut. Nur die Tauben könnten mal anklopfen.“', 'Übersetzung: „Mir geht es fließend.“', 'Übersetzung: „Gut. Seit {n} Folgen wollte ich das schon sagen.“'],
    },
    {
      q: 'Brunnen, woraus bist du gemacht?',
      a: ['Übersetzung: „Aus {stein}. Und aus sehr viel Geduld.“', 'Übersetzung: „Außen {stein}, innen ein weicher Kern.“'],
    },
    {
      q: 'Brunnen, was ist dein Lieblingswetter?',
      a: ['Übersetzung: „Regen. Dann bin ich nicht der Einzige, der nass ist.“', 'Übersetzung: „Sonne. Dann kommen Kinder und halten die Hände rein.“'],
    },
    {
      q: 'Brunnen, hast du Hobbys?',
      a: ['Übersetzung: „Plätschern. Und Münzen zählen. Heute: drei Cent.“', 'Übersetzung: „Leute beobachten. Ich stehe ja den ganzen Tag hier.“'],
    },
    {
      q: 'Brunnen, was wünschst du dir?',
      a: ['Übersetzung: „Dass öfter mal jemand Schöner Brunnen ruft. Danke!“', 'Übersetzung: „Einen Kalkentferner. Und mehr Folgen BrunnenTV.“'],
    },
    {
      q: 'Brunnen, wie alt bist du eigentlich?',
      a: ['Übersetzung: „So alt, wie ich mich fühle. Also frisch.“', 'Übersetzung: „Das fragt man einen Brunnen nicht. Nächste Frage.“'],
    },
    {
      q: 'Brunnen, magst du {ort}?',
      a: ['Übersetzung: „{ort} ist meine Heimat. Ich würde nie wegfließen.“', 'Übersetzung: „Sehr. Und {ort} mag mich auch, glaube ich.“'],
    },
    {
      q: 'Brunnen, kennst du BrunnenTV?',
      a: ['Übersetzung: „Natürlich. Ich habe alle {n} Folgen gesehen.“', 'Übersetzung: „Ja. Meine Cousine war schon in Folge 1.“'],
    },
    {
      q: 'Brunnen, was machst du nachts?',
      a: ['Übersetzung: „Ich plätschere leiser. Die Nachbarn wollen schlafen.“', 'Übersetzung: „Ich träume vom Meer. Aber nur ein bisschen.“'],
    },
    {
      q: 'Brunnen, ein Gruß an den Chat?',
      a: ['Übersetzung: „Hallo Chat! Bleibt flüssig.“', 'Übersetzung: „Liebe Grüße an alle, die gerade nicht trinken.“'],
    },
  ],
  // was im Untertitel steht, während der Brunnen antwortet (er spricht nicht, er plätschert)
  blubb: ['Blubb … plätscher … gluck.', 'Plitsch. Platsch. Blubb blubb.', 'Gluck gluck … plätscher … blubb!', 'Plätscher, plätscher … blubb.'],
  // der Chat: zur Frage, zur Antwort des Brunnens, nach der Übersetzung
  chatFrage: ['EIN INTERVIEW! 🎤', 'Jetzt wird es investigativ 🎤', 'Brunnen-Interview, mein Lieblingsformat 🎙️', 'Ob er antwortet? 👀'],
  chatAntwort: ['ER ANTWORTET!! 😱', 'Was hat er gesagt? 👀', 'OMI, übersetzen bitte!', 'Ich verstehe nur Blubb 😂', 'Fließend Brunnisch 💦'],
  chatNach: ['Weise Worte 🙏', 'Das erklärt einiges 😂', 'Bester Interviewgast bisher', 'OMI spricht Brunnisch?! 😳', 'Der Brunnen hat mehr Charisma als ich'],
};

/** Alle Rubriken (eine zur Probe; weitere kommen hier dazu). */
export const RUBRIKEN = [INTERVIEW];

/**
 * Welche Rubrik Folge n hat (oder null für eine gewöhnliche Folge). R: der Zufall der Folge (game.js startBrunnenTV),
 * last: die Rubrik der Folge davor, abroad: im Ausland grüßt er mit eigenem Gag (data-memes.js MEGAFON_AUSLAND) – der
 * bleibt. force: eine Rubrik erzwingen (Debug, Prüfstände).
 */
export function rubrikFor(n, R, { last = null, abroad = false, force = null } = {}) {
  if (force) return RUBRIKEN.find((r) => r.key === force) ?? null;
  if (n < 2 || abroad) return null;
  const roll = R();
  for (const r of RUBRIKEN) if (r !== last && roll < r.chance) return r;
  return null;
}
