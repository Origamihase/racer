// Freie Sicht: „Die Bildschirmmitte ist kein guter Ort für Einblendungen.“ Solange der Wagen gefahren werden kann,
// liegt nichts, was aufploppt, über der Bildmitte – dort sind die Straße, der Verkehr, die Schilder und in der
// Drohnenansicht der eigene Wagen. Dieses Modul gibt der Regel einen Körper, ganz ohne DOM: freeView() sagt für eine
// Fenstergröße und eine Ansicht, welches Rechteck frei bleibt; alles, was das HUD einblendet, wohnt an einem Rand
// darum herum (HOMES). ui.js und style.css bauen danach, tools/sicht-test.mjs prüft die Geometrie mit „npm test“,
// tools/sicht-check.js misst im Browser jede Einblendung gegen dasselbe Rechteck.

/**
 * Was der Chat kauft, um im Weg zu sein – die einzigen Einblendungen, die in die freie Sicht dürfen (RAHMEN in
 * data.js, jede höchstens so lange wie dort ihr dur): „Bildhälfte abdecken“, Elsa, die durchs Bild fliegt, und der
 * Pappkartonhaufen. Nichts sonst beruft sich auf diese Ausnahme, auch nicht, solange eine von ihnen im Bild ist.
 */
export const COVERS = ['haelfte', 'elsa', 'pappkarton'];

/** Wo jede Einblendung wohnt (für die Tabelle der Browser-Prüfung und als Inhaltsverzeichnis des Layouts). */
export const HOMES = {
  navi: 'Streifen oben: Zeile mit Ziel, Entfernung, Gebot und Bieter (neues Ziel und Ankunft sind ihr Zustand)',
  ansage: 'Streifen oben, zweite Reihe: Navi-Ansage der Ansichten ohne Mittelbildschirm',
  spur: 'Streifen oben, zweite Reihe: Balken der freigeschalteten linken Spur (Handy: weicht einem Hinweis)',
  akku: 'Streifen oben, zweite Reihe, nur wo der Mittelbildschirm aus dem Bild ragt: Akku-Karte als kleine Kopie (statt des Spur-Balkens, auf kleinen Formaten auch der Navi-Ansage)',
  hinweis: 'Streifen oben, letzte Reihe: ein Hinweis nach dem anderen',
  untertitel: 'Streifen unten: wer spricht (NOMI, Sprachstudio, Sprachdurchsage, Megafon-Wunsch), einer nach dem anderen',
  brunnentv: 'Streifen unten: Bauchbinde der Sendung, links neben dem Untertitel',
  kamera: 'Streifen unten: Schildchen der Kamera, solange dort niemand spricht',
  funkloch: 'im Chat-Feld (ohne Chat: als Hinweis im Streifen oben)',
  steuerung: 'Ecke unten links, wo sonst die Facecam steht (Touch: auf dem Chat-Feld)',
  foto: 'Ecke unten rechts unter dem Mittelbildschirm (Touch: auf dem Chat-Feld)',
  rahmen: 'Rand unten rechts: wer den Rahmen gekauft hat',
};

// Maße des HUD, wie style.css sie setzt (ändert sich dort eines, ändert es sich hier – die Browser-Prüfung merkt es)
const PAD = 14;
// Info-Feld: mit Jobliste höchstens 276 px breit, ohne (niedrige Fenster, schmale hochkant) 220 px; bis 760 px
// Fensterbreite auf 85 % verkleinert
const INFO = { jobs: 276, plain: 220, small: 0.85 };
// Höhe des oberen Streifens mit allen Reihen (Navi-Zeile, Ansage und Spur-Balken, ein Hinweis) samt Abstand zum
// Rand. wide: Zwischen den Feldern ist Platz für einzeilige Reihen (ab WIDE_MID); normal: Ansage und Hinweis brechen
// dort in zwei Zeilen um; compact: Ansage und Spur-Balken stehen untereinander, und einem Hinweis weicht der Balken;
// small: kleine Handys quer (bis SMALL_W breit), dort braucht die Ansage zwei und ein langer Hinweis drei Zeilen;
// narrow: wie compact, aber unter den Feldern und ab dort gemessen
const STRIP = { wide: 116, normal: 150, compact: 128, small: 142, narrow: 114 };
const WIDE_MID = 560;
const SMALL_W = 700;
// Höhe des unteren Streifens: ein Untertitel mit drei Zeilen samt Abstand zum Rand; auf kleinen Handys quer (small)
// ist zwischen den Knopfgruppen so wenig Platz, dass die längsten Sprachdurchsagen vier Zeilen brauchen; hochkant
// steht er über den Touch-Knöpfen (lift: so weit rückt er an sie heran)
const BAR = { normal: 86, compact: 73, small: 83, portrait: 66, lift: 4 };

/** Kompakte Maße: niedrige Fenster (Handy quer) und schmale (Handy hochkant) – wie die Media-Queries in style.css. */
export const isCompact = (W, H) => H <= 560 || W <= 480;

/** Breite des Chat-Felds (style.css .chat). */
export const chatWidth = (W, H) => (W <= 760 && H > W ? 0.42 * W : Math.min(310, 0.3 * W));

/** Unterkante des Chat-Felds bei voller Höhe (style.css .chat: max-height). */
export const chatBottom = (H) => Math.max(98, 0.23 * H);

/**
 * Hochkant bis zu dieser Breite (Handys und Tablets wie 768 × 1024 oder 820 × 1180) steht der Streifen unter den
 * Feldern, und die Jobs stehen im Pausenmenü statt im Info-Feld (style.css): Zwischen Info-Feld und Chat bliebe dort
 * nur eine schmale Säule, in der Navi-Zeile und Akku-Kopie abgeschnitten würden und die Navi-Ansage hoch in die Mitte
 * wüchse.
 */
export const PORTRAIT_W = 900;
export const portraitNarrow = (W, H) => H > W && W <= PORTRAIT_W;

/** Breite des Info-Felds, wie es höchstens wird. */
export function infoWidth(W, H) {
  const jobs = H > 560 && !portraitNarrow(W, H);
  return (jobs ? INFO.jobs : INFO.plain) * (W <= 760 ? INFO.small : 1);
}

/** Unter dieser Breite der Mitte rückt der Streifen unter die Felder. */
export const NARROW_MID = 200;

/** Breite der Facecam unten links (ui.js facecamTarget); auf kleinen Formaten gibt es sie nicht. */
export const facecamWidth = (W, H) => (isCompact(W, H) ? 0 : Math.min(0.22 * W, 0.5 * H, 440));

/** Platz zwischen Info-Feld und Chat für den oberen Streifen (mit den Höchstmaßen der Felder). */
export const stripWidth = (W, H) => W - 4 * PAD - infoWidth(W, H) - chatWidth(W, H);

/**
 * Passt der obere Streifen nicht zwischen Info-Feld und Chat (Handy und Tablet hochkant, sehr schmale Fenster), steht
 * er unter den beiden Feldern. ui.js misst das an den echten Feldern nach (layout); dies ist dieselbe Rechnung mit den
 * Höchstmaßen.
 */
export const isNarrow = (W, H) => stripWidth(W, H) < NARROW_MID || portraitNarrow(W, H);

/** Höhe der Touch-Knöpfe über dem unteren Rand samt Abstand (style.css --touch-top). */
export function touchTop(W, H) {
  if (W > H && H <= 500) return W / H <= 2.08 ? 152 : 170;
  if (W <= 480) return Math.min(84, 0.19 * W) * 1.14 + 96;
  return 202;
}

/**
 * Das Rechteck, das frei bleibt (CSS-Pixel), für Cockpit und Drohnenansicht. touch: Gerät mit Touch-Knöpfen ·
 * narrow: der obere Streifen steht unter den Feldern (Vorgabe: isNarrow).
 *
 * Seiten: links endet die Spalte von Info-Feld und Facecam, rechts beginnt die des Chats; im schmalen Format (Felder
 * oben, das Bild darunter) reicht die freie Sicht bis an die Rahmen-Streifen der Ränder. Oben und unten gehören feste
 * Streifen den Einblendungen (STRIP, BAR): auf 1280 × 720 die obersten 16 % und die untersten 12 % – im Cockpit
 * liegen unten Lenkrad und Armaturenbrett, in der Drohnenansicht die Straße hinter dem Wagen. Die Streifen wachsen
 * nicht mit dem Fenster, die freie Sicht schon. Hochkant steht der untere Streifen über den Touch-Knöpfen.
 * Beide Ansichten bekommen dasselbe Rechteck: Was im Cockpit die Straße bis zur Haube frei lässt, lässt in der
 * Drohnenansicht den Wagen frei (droneCar; auf Handys reicht dessen unterster Rand in den Streifen unten).
 */
export function freeView(W, H, { touch = false, narrow = isNarrow(W, H) } = {}) {
  const compact = isCompact(W, H);
  const edge = Math.ceil(0.075 * H) + 4;
  const left = narrow ? edge : PAD + Math.max(infoWidth(W, H), facecamWidth(W, H)) + PAD;
  const right = narrow ? W - edge : W - PAD - chatWidth(W, H) - PAD;
  const strip = compact ? (W <= SMALL_W ? STRIP.small : STRIP.compact) : stripWidth(W, H) >= WIDE_MID ? STRIP.wide : STRIP.normal;
  const top = narrow ? chatBottom(H) + 10 + STRIP.narrow : strip;
  const bar = !compact ? BAR.normal : touch && W <= SMALL_W ? BAR.small : BAR.compact;
  const bottom = touch && H > W ? H - touchTop(W, H) + BAR.lift - BAR.portrait : H - bar;
  // auf ganze Pixel nach innen gerundet: Was an einem Streifen endet, berührt das Rechteck nicht
  return { left: Math.ceil(left), top: Math.ceil(top), right: Math.floor(right), bottom: Math.floor(bottom) };
}

const DEG = Math.PI / 180;
/**
 * Bildpunkte je Tangens-Einheit der Hauptkamera bei gewünschtem senkrechtem Bildwinkel – wie setFov() in main.js:
 * waagerecht mindestens 86°, senkrecht zwischen 50° und 78°. Damit lässt sich ausrechnen, wo feste Teile des Bildes
 * (Innenspiegel, Mittelbildschirm, das eigene Auto) auf dem Schirm liegen, ohne die 3D-Szene zu kennen.
 */
function camScale(W, H, vfov) {
  const v = Math.min(78 * DEG, Math.max(50 * DEG, vfov * DEG, 2 * Math.atan(Math.tan(43 * DEG) / (W / H))));
  return H / 2 / Math.tan(v / 2);
}
const tanRect = (W, H, S, r) => ({ left: W / 2 + r.left * S, right: W / 2 + r.right * S, top: H / 2 + r.top * S, bottom: H / 2 + r.bottom * S });
// Cockpit (setFov(58), Modell aus src/cockpit/cockpit.js): Innenspiegel und Mittelbildschirm samt Rahmen als
// Tangens-Abstände von der Bildmitte (an einem Bild 1280 × 720 nachgemessen; das Kopfwackeln verschiebt sie um wenige
// Bildpunkte). Beides sind Instrumente: Auch sie deckt keine Einblendung zu, wo es einen anderen Platz gibt.
const MIRROR = { left: 0.318, right: 0.915, top: -0.275, bottom: -0.11 };
const SCREEN = { left: 0.253, right: 0.725, top: -0.045, bottom: 0.255 };
// Drohne (setFov(50)): das eigene Auto unter der Bildmitte, vom Dach bis zu den Rädern (auf vier Formaten nachgemessen)
const CAR = { left: -0.166, right: 0.166, top: 0.089, bottom: 0.39 };

/** Innenspiegel und Mittelbildschirm des Cockpits (CSS-Pixel). */
export function cockpitParts(W, H) {
  const S = camScale(W, H, 58);
  return { mirror: tanRect(W, H, S, MIRROR), screen: tanRect(W, H, S, SCREEN) };
}

/** Das eigene Auto der Drohnenansicht (CSS-Pixel). */
export function droneCar(W, H) {
  return tanRect(W, H, camScale(W, H, 50), CAR);
}

/** Überschneiden sich zwei Rechtecke (mit Abstand pad)? */
export const overlap = (a, b, pad = 0) => a.left < b.right + pad && a.right > b.left - pad && a.top < b.bottom + pad && a.bottom > b.top - pad;
