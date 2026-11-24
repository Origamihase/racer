// Browser-Probe: lädt das gebaute Spiel (docs/index.html, so wie GitHub Pages es ausliefert) in einem echten Chromium
// und fährt es kurz an. Fällt durch, wenn die Seite einen Fehler wirft oder etwas davon nicht klappt:
//   Titelbild erscheint – Fahrt startet – die Spielschleife fährt den Wagen in Echtzeit vorwärts –
//   der Zwischenstand landet im Spielstand – Pause und Weiter – das Bild ist nicht leer –
//   ein verlorener Grafik-Kontext pausiert, nach der Wiederherstellung geht es weiter.
//
//   npm run smoke                     (braucht Playwright und Chromium: npm ci && npx playwright install chromium)
//   SMOKE_BILD=probe.png npm run smoke   legt zusätzlich ein Bildschirmfoto ab (der Fahrt, oder dort, wo es hakte)
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const seite = pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'index.html')).href + '?debug';
const fehler = [];
let schritt = '';
const pruefe = (ok, was) => {
  if (!ok) throw new Error(was);
};

let page;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  page.on('pageerror', (e) => fehler.push(`Seitenfehler: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') fehler.push(`Konsole: ${m.text()}`);
  });
  // Software-Grafik (SwiftShader) schafft nur wenige Bilder je Sekunde: auf Fortschritt warten statt auf eine feste Zeit.
  const faehrt = async (ab, was) => {
    try {
      await page.waitForFunction((km) => __MA.game.odometer > km, ab, { timeout: 30_000 });
    } catch {
      throw new Error(was);
    }
  };
  const lies = () => page.evaluate(() => ({ state: __MA.state, km: __MA.game.odometer, kmh: __MA.game.player.speed * 3.6 }));

  schritt = 'Laden bis zum Titelbild';
  let t0 = Date.now();
  await page.goto(seite);
  await page.waitForFunction(() => window.__MA && __MA.state === 'title', null, { timeout: 60_000 });
  pruefe(await page.isVisible('.screen-title'), 'Titelbild ist nicht sichtbar');
  console.log(`✓ Titelbild nach ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  // Shader-Programme nach dem Laden (boot übersetzt sie vorab; später darf keins mehr mitten in der Fahrt entstehen)
  const programme = () => page.evaluate(() => __MA.renderer.info.programs.map((p) => p.cacheKey));
  const geladen = new Set(await programme());

  schritt = 'Fahrt starten';
  await page.evaluate(() => {
    __MA.tips?.stop?.();
    __MA.start();
    __MA.skipIntro();
  });
  await page.waitForFunction(() => __MA.state === 'drive', null, { timeout: 30_000 });
  const a = await lies();
  console.log(`✓ Fahrt läuft (${a.kmh.toFixed(0)} km/h)`);

  schritt = 'Spielschleife in Echtzeit';
  t0 = Date.now();
  await faehrt(a.km + 5, `Wagen kommt nicht voran (${a.km.toFixed(1)} m)`);
  const b = await lies();
  pruefe(b.state === 'drive', `Zustand nach der Fahrt: ${b.state}`);
  console.log(`✓ Spielschleife fährt (5 m in ${((Date.now() - t0) / 1000).toFixed(1)} s)`);

  schritt = 'Shader vorgewärmt';
  // was es sonst erst beim ersten Mal gibt: Rempler (Aufkleber, Wölkchen), offenes Fahrerfenster, Polizei, Regen
  // auf der Scheibe (Vorpass), die Drohnensicht – je ein paar Bilder; danach kein neues Programm
  await page.evaluate(() => {
    __MA.game.player.damage.hit('front');
    __MA.tesla.setWindow(0.5);
    __MA.traffic.police(__MA.game.player.s, 'PROBE');
    __MA.rain(1);
    for (let i = 0; i < 4; i++) __MA.step(1 / 30);
    __MA.view = 'drone';
    for (let i = 0; i < 4; i++) __MA.step(1 / 30);
    __MA.view = 'cockpit';
    __MA.tesla.setWindow(0);
    __MA.rain(0);
  });
  const neu = (await programme()).filter((k) => !geladen.has(k));
  pruefe(!neu.length, `${neu.length} Shader erst in der Fahrt übersetzt: ${neu.map((k) => k.slice(-40)).join(' · ')}`);
  console.log('✓ alle Shader beim Laden übersetzt');

  schritt = 'Zwischenstand';
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  const offen = await page.evaluate(() => JSON.parse(localStorage.getItem('mini-adam-tesla-navi-v1') || '{}').pending);
  pruefe(offen && offen.distance > 0, `kein Zwischenstand im Spielstand: ${JSON.stringify(offen)}`);
  console.log(`✓ Zwischenstand gespeichert (${offen.distance.toFixed(0)} m)`);

  schritt = 'Bild';
  const farben = await page.evaluate(() => {
    const c = __MA.renderer.domElement;
    const k = document.createElement('canvas');
    k.width = 64;
    k.height = 36;
    const x = k.getContext('2d');
    __MA.step(1 / 30);
    x.drawImage(c, 0, 0, 64, 36);
    const d = x.getImageData(0, 0, 64, 36).data;
    const s = new Set();
    for (let i = 0; i < d.length; i += 4) s.add((d[i] >> 4) * 256 + (d[i + 1] >> 4) * 16 + (d[i + 2] >> 4));
    return s.size;
  });
  pruefe(farben > 20, `Bild wirkt leer (${farben} Farbtöne)`);
  console.log(`✓ Bild hat ${farben} Farbtöne`);
  if (process.env.SMOKE_BILD) await page.screenshot({ path: process.env.SMOKE_BILD });

  schritt = 'Pause und Weiter';
  await page.evaluate(() => __MA.pause());
  const p1 = await lies();
  await page.waitForTimeout(1500);
  const p2 = await lies();
  pruefe(p2.km === p1.km, `Wagen fährt in der Pause weiter: ${p1.km.toFixed(1)} → ${p2.km.toFixed(1)} m`);
  await page.evaluate(() => __MA.resume());
  await faehrt(p2.km, 'nach „Weiter“ fährt der Wagen nicht');
  console.log('✓ Pause hält an, Weiter fährt weiter');

  schritt = 'Grafik-Kontext verloren';
  const verloren = await page.evaluate(async () => {
    const ext = __MA.renderer.getContext().getExtension('WEBGL_lose_context');
    if (!ext) return null;
    ext.loseContext();
    await new Promise((r) => setTimeout(r, 300));
    const pausiert = __MA.menus.current === 'pause';
    ext.restoreContext();
    await new Promise((r) => setTimeout(r, 500));
    return { pausiert, verloren: __MA.renderer.getContext().isContextLost() };
  });
  if (verloren === null) console.log('– WEBGL_lose_context fehlt, Kontextverlust nicht geprüft');
  else {
    pruefe(verloren.pausiert, 'Kontextverlust öffnet die Pause nicht');
    pruefe(!verloren.verloren, 'Grafik-Kontext kommt nicht zurück');
    const k1 = await lies();
    await page.evaluate(() => __MA.resume());
    await faehrt(k1.km, 'nach dem Kontextverlust fährt der Wagen nicht weiter');
    console.log('✓ Kontextverlust pausiert, danach geht es weiter');
  }

  schritt = 'Seite ohne Fehler';
  pruefe(!fehler.length, `${fehler.length} Fehler`);
  console.log('\nBrowser-Probe grün');
} catch (e) {
  console.error(`✗ ${schritt}: ${e.message}`);
  if (fehler.length) console.error(`Fehler in der Seite:\n  ${fehler.join('\n  ')}`);
  if (process.env.SMOKE_BILD && page) await page.screenshot({ path: process.env.SMOKE_BILD }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}
