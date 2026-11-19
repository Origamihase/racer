// Freie Sicht, der Browser-Teil der Prüfung: löst im laufenden Spiel jede Einblendung aus, misst ihren Kasten gegen
// die freie Sicht (src/ui/sicht.js) und gegen die übrigen Teile des HUD und gibt eine Tabelle zurück.
//
// So läuft sie: docs/index.html?debug öffnen (für die Reise ?debug&xxl), eine Fahrt starten, dann diese Datei in der
// Seite ausführen (Konsole oder der Bild-Treiber: „js:tools/sicht-check.js“) und __sichtCheck() rufen – in jeder
// Ansicht (__MA.view = 'cockpit' | 'drone') und Fenstergröße, die geprüft werden soll. Der Hinweis des ersten Starts
// wird mitgemessen, solange er steht (dazu vor dem Start localStorage.removeItem('mini-adam-so-steuerst-du')).
// Rückgabe: { format, view, free, rows: [{ was, platz, kasten, frei, andere, instrumente }], fehler }.
// „frei“: berührt die freie Sicht nicht (die gekauften Abdeckungen dürfen es, mit Namen). „andere“: was der Kasten
// sonst überdeckt (leer = nichts). „instrumente“: Innenspiegel, Mittelbildschirm (Cockpit) oder der eigene Wagen
// (Drohne) unter dem Kasten – kein Fehler, aber es steht da.
(() => {
  const M = window.__MA;
  const { ui, game: g, sicht: S } = M;
  const $ = (sel, root = document) => root.querySelector(sel);
  const shown = (e) => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const box = (e) => {
    const r = e.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
  };
  const fmt = (r) => [r.left, r.top, r.right, r.bottom].map(Math.round).join(',');
  // Animationen ans Ende (Einfliegen, Aufploppen), endlose bleiben stehen: gemessen wird die Ruhelage
  const settle = () => {
    for (const a of document.getAnimations()) {
      try {
        if (a.effect.getComputedTiming().iterations === Infinity) a.currentTime = 0;
        else if (a.animationName === 'elsafly') a.currentTime = 2500;
        else a.finish();
      } catch (e) {
        /* läuft schon nicht mehr */
      }
    }
  };
  // Die längsten Sätze, die das Spiel spricht (tools/sicht-test.mjs prüft, dass in den Daten keiner länger ist), und
  // die Sprachdurchsage, die am meisten Zeilen braucht: BREIT bricht ungünstiger um als die längste
  const LONG = {
    nomi: 'Entschuldigung. Der automatische Scheibenwischer ist noch in der Beta. Bitte nicht wundern.',
    studio: 'Ruhige Lage. Der Chat hält schon ein paar Dreien bereit, falls wieder nach einer Zahl gefragt wird.',
    durchsage: 'Treffen sich zwei Scheibenwischer. Fragt der eine: Na, wie läuft’s? Sagt der andere: Hin und her.',
    megafon: 'Achtung! Hier fährt ein Plüschtier. Bitte nicht streicheln!',
  };
  const BREIT = 'Achtung, Achtung. Der automatische Scheibenwischer befindet sich weiterhin in der Beta-Phase.';
  const TIPP = '🤑 Bieterduell: Bananensaftkönig gegen Satelliten_FFM';
  const RAHMEN = { rosen: 9, pappkarton: 8, haelfte: 3.5, elsa: 6, kuerbis: 8, lego: 8 };

  window.__sichtCheck = () => {
    const W = innerWidth;
    const H = innerHeight;
    const drone = document.body.classList.contains('drone');
    const touch = matchMedia('(pointer: coarse)').matches;
    const narrow = ui.hud.classList.contains('hud-narrow');
    const free = S.freeView(W, H, { touch, narrow });
    const parts = drone ? { 'der eigene Wagen': S.droneCar(W, H) } : (({ mirror, screen }) => ({ Innenspiegel: mirror, Mittelbildschirm: screen }))(S.cockpitParts(W, H));
    const rows = [];
    let fehler = 0;
    // feste Teile, auf denen nichts liegen darf (die Facecam nur, wo sie stehen könnte)
    const fixed = () => {
      const f = { 'Info-Feld': box(ui.infoEl) };
      if (shown(ui.chatEl)) f.Chat = box(ui.chatEl);
      const fc = !drone && ui.facecamTarget();
      if (fc) f.Facecam = { left: fc.x, top: fc.y, right: fc.x + fc.w, bottom: fc.y + fc.h };
      document.querySelectorAll('.touch button, .touch .tc-hint').forEach((b, i) => {
        if (shown(b)) f['Touch-Knopf ' + (b.textContent.trim() || i)] = box(b);
      });
      return f;
    };
    /**
     * Misst die Kästen list = [[Name, Platz, Element, { on: worauf er liegen darf · cover: gekaufte Abdeckung · edge:
     * Rahmen am Rand (liegt unter dem HUD, zählt nur gegen die freie Sicht) · optional: darf fehlen }]].
     */
    const measure = (szene, list) => {
      ui.layout();
      settle();
      const fix = fixed();
      const live = list.filter(([, , e]) => shown(e)).map(([was, platz, e, o = {}]) => ({ was, platz, r: box(e), o }));
      for (const x of live) {
        const frei = !S.overlap(x.r, free);
        const andere = [];
        const under = (o) => o.cover || o.edge;
        if (!under(x.o)) {
          for (const [name, r] of Object.entries(fix)) if (!(x.o.on || []).includes(name) && S.overlap(x.r, r)) andere.push(name);
          for (const y of live) if (y !== x && !under(y.o) && S.overlap(x.r, y.r)) andere.push(y.was);
        }
        const instrumente = Object.entries(parts).filter(([, r]) => S.overlap(x.r, r)).map(([n]) => n);
        const ok = (frei || !!x.o.cover) && !andere.length && x.r.left >= -0.5 && x.r.top >= -0.5 && x.r.right <= W + 0.5 && x.r.bottom <= H + 0.5;
        if (!ok && !x.o.cover) fehler++;
        rows.push({ szene, was: x.was, platz: x.platz, kasten: fmt(x.r), frei: x.o.cover ? 'Abdeckung' : frei, andere, instrumente, ok: ok || !!x.o.cover });
      }
      for (const [was, , e, o = {}] of list) if (!shown(e) && !o.optional) (fehler++, rows.push({ szene, was, platz: 'NICHT ZU SEHEN', kasten: '', frei: false, andere: [], instrumente: [], ok: false }));
    };
    const clear = () => {
      ui.reset();
      ui.jobs(g.jobs);
      g.left.open = false;
      ui.setTurn(null);
      ui.update(0.11, g);
    };
    const hint = shown(ui.hintEl);
    if (hint) measure('erster Start', [['So steuerst du', S.HOMES.steuerung, ui.hintEl, { on: ['Facecam', 'Chat'] }]]);
    ui.hintEl.classList.add('hidden');

    // 1) Streifen oben, volle Belegung: neues Ziel, Ansage, linke Spur (letzte Sekunden), dann dazu ein Hinweis –
    // auf kleinen Formaten weicht ihm der Spur-Balken
    const compact = S.isCompact(W, H);
    clear();
    ui.naviNews();
    ui.setTurn({ turn: 'right', dist: 300, say: '300 m', head: 'Ausfahrt Frankfurt am Main-Höchst', calm: false });
    Object.assign(g.left, { open: true, timer: 8.4, dur: 60 });
    ui.update(0.11, g);
    const navi = [
      ['Navi-Zeile (neues Ziel)', S.HOMES.navi, ui.naviEl],
      ['Navi-Ansage', S.HOMES.ansage, ui.turnEl, { optional: !drone && !narrow }],
    ];
    measure('Streifen oben, Navi und Spur', [...navi, ['Spur-Balken', S.HOMES.spur, ui.leftLaneEl]]);
    ui.toast(TIPP, 'info');
    ui.toast('🚓 Rechtsfahrgebot missachtet: 10 € Verwarngeld', 'bad');
    ui.update(0.11, g);
    measure('Streifen oben, voll', [...navi, ['Spur-Balken', S.HOMES.spur, ui.leftLaneEl, { optional: compact }], ['Hinweis', S.HOMES.hinweis, $('.toast', ui.noticeEl)]]);
    const first = $('.toast', ui.noticeEl).textContent;
    ui.update(1.3, g);
    const second = $('.toast', ui.noticeEl).textContent;
    // die Warnung wartet nicht hinter dem Tipp: Sie steht nach gut einer Sekunde da
    const order = first.startsWith('🤑') && second.startsWith('🚓');
    if (!order) fehler++;
    rows.push({ szene: 'Reihenfolge', was: 'Warnung löst Tipp ab', platz: first + ' → ' + second, kasten: '', frei: true, andere: [], instrumente: [], ok: order });
    measure('Streifen oben, Warnung', [...navi, ['Spur-Balken', S.HOMES.spur, ui.leftLaneEl, { optional: compact }], ['Hinweis (Warnung)', S.HOMES.hinweis, $('.toast', ui.noticeEl)]]);

    // 2) der längste Hinweis des Spiels unter der Navi-Zeile
    clear();
    ui.toast('📡 Verbindung verloren – alle Handynetze werden neu gebündelt …', 'info');
    measure('langer Hinweis', [['Hinweis', S.HOMES.hinweis, $('.toast', ui.noticeEl)], ['Navi-Zeile', S.HOMES.navi, ui.naviEl]]);

    // 3) Streifen unten: jeder Sprecher mit seinem längsten Satz, BrunnenTV, Kamera
    for (const [who, text] of [...Object.entries(LONG), ['durchsage, die breiteste', BREIT]]) {
      clear();
      if (who.startsWith('durchsage')) ui.durchsage('Fräulein Kassandra', text, 9, 'Bananensaftkönig');
      else if (who === 'megafon') ui.megafon(text, 6, 'Bananensaftkönig');
      else ui[who](text, 6);
      measure('Untertitel ' + who, [['Untertitel ' + who, S.HOMES.untertitel, ui.subEl]]);
    }
    clear();
    ui.brunnenTV(12, 'Rothenburg ob der Tauber');
    measure('BrunnenTV', [['BrunnenTV', S.HOMES.brunnentv, ui.tvEl]]);
    ui.nomi('Sie haben Ihr Ziel erreicht.', 4);
    measure('BrunnenTV und NOMI', [['BrunnenTV', S.HOMES.brunnentv, ui.tvEl, { optional: true }], ['Untertitel nomi', S.HOMES.untertitel, ui.subEl]]);
    clear();
    ui.cameraLabel(drone ? '🎥 Drohne' : '🎥 Cockpit');
    measure('Kamera', [['Kamera-Schildchen', S.HOMES.kamera, ui.cameraHint]]);
    ui.cameraHint.classList.add('hidden');

    // 4) Funkloch, Blitzerfoto
    clear();
    ui.funkloch(true);
    measure('Funkloch', [['Funkloch', S.HOMES.funkloch, shown(ui.chatEl) ? ui.funklochEl : $('.toast', ui.noticeEl), { on: ['Chat'] }]]);
    ui.funkloch(false);
    ui.photo('data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAACAkQBADs=', 137, '14:32');
    ui.photos.pop();
    measure('Blitzerfoto', [['Blitzerfoto', S.HOMES.foto, ui.photoEl, { on: touch || H <= 560 ? ['Chat'] : [] }]]);
    clear();

    // 5) Rahmen: Hinweis und Streifen an den Rändern; die gekauften Abdeckungen mit Untertitel darüber
    for (const [id, dur] of Object.entries(RAHMEN)) {
      clear();
      const cover = S.COVERS.includes(id);
      ui.rahmen({ id, name: id === 'elsa' ? 'Elsa auf den Bildschirm zaubern' : 'Pappkartonhaufen', price: 2.9, dur }, 'Bananensaftkönig');
      const list = [['Rahmen-Hinweis ' + id, S.HOMES.rahmen, $('.rahmen-caption', ui.rahmenEl)]];
      for (const e of ui.rahmenEl.querySelectorAll('.strip')) if (!e.closest('.corner-only') || e.classList.contains('strip-bottom')) list.push(['Rahmen ' + id + ' ' + e.className.replace(/strip |lego /g, ''), 'Rand', e, { edge: true }]);
      for (const e of ui.rahmenEl.querySelectorAll('.half, .elsa-fly, .boxes')) list.push(['Abdeckung ' + id, 'gekauft, ' + dur + ' s', e, { cover: id }]);
      measure('Rahmen ' + id, list);
      if (id === 'rosen') {
        ui.durchsage('Fräulein Kassandra', LONG.durchsage, 9, 'Bananensaftkönig');
        // (in Fenstern unter 1240 px Breite macht die Facecam dem Untertitel Platz, solange ein Rahmen sie nach
        // innen schiebt – dort darf er an ihrer Stelle stehen)
        measure('Rahmen und Durchsage', [['Rahmen-Hinweis ' + id, S.HOMES.rahmen, $('.rahmen-caption', ui.rahmenEl), { optional: touch }], ['Untertitel durchsage', S.HOMES.untertitel, ui.subEl, { on: W < 1240 ? ['Facecam'] : [] }]]);
      }
      if (cover) {
        ui.nomi('Akku schwach. Bitte bald laden.', 4);
        measure('Abdeckung ' + id + ' mit Untertitel', [['Untertitel nomi', S.HOMES.untertitel, ui.subEl]]);
        // zweite Regel: nie zwei zugleich, keine länger als ihr dur
        ui.rahmen({ id, name: 'x', price: 1, dur }, 'y');
        const one = ui.rahmenEl.querySelectorAll('.rahmen').length === 1;
        ui.update(dur + 0.01, null);
        const gone = ui.rahmenEl.querySelectorAll('.rahmen').length === 0;
        const z = +getComputedStyle(ui.subEl.parentNode).zIndex > +getComputedStyle(ui.rahmenEl).zIndex;
        if (!(one && gone && z)) fehler++;
        rows.push({ szene: 'Abdeckung ' + id, was: 'einzeln, endet nach ' + dur + ' s, Streifen liegen darüber', platz: [one, gone, z].join(' '), kasten: '', frei: 'Abdeckung', andere: [], instrumente: [], ok: one && gone && z });
      }
    }
    clear();
    if (hint) ui.hintEl.classList.remove('hidden');
    return { format: W + '×' + H + (touch ? ' Touch' : ''), view: drone ? 'Drohne' : 'Cockpit', narrow, free: fmt(free), rows, fehler };
  };
  return 'sicht-check bereit';
})()
