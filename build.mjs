// Baut src/ zu docs/game.js (ein einziges klassisches Script, damit das Spiel
// auch per Doppelklick auf docs/index.html im Chrome läuft – ganz ohne Server). docs/game.js liegt nicht im Repo
// (.gitignore): Für GitHub Pages baut die CI es bei jedem Stand von main selbst.
import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const options = {
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  target: ['chrome110'],
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  legalComments: 'none',
  outfile: 'docs/game.js',
  banner: {
    // (die erste Anweisung: ab hier läuft das Script; die Ladezeit-Marken ma:… davor messen Laden und Übersetzen)
    js: '/* Mini Adam – Navi ferngesteuert BrunnenTV XXL – gebaut aus src/ (npm run build). Enthält three.js (MIT). */\nself.performance && performance.mark && performance.mark(\'ma:run\');',
  },
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('Beobachte src/ … (Strg+C zum Beenden)');
} else {
  await esbuild.build(options);
}
