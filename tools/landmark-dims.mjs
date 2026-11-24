// Maße der Wahrzeichen ohne Bauen (src/world/kit/landmark-dims.js): Der Ortsplan fragt nach Breite, Tiefe und Höhe,
// und ohne diese Tabelle müsste der Baukasten dafür die ganze nahe Fassung bauen – bei Frankfurt rund 40–70 ms am Stück,
// mitten in der Fahrt, auch wenn man nur an der Ausfahrt vorbeifährt. tools/citykit-test.mjs prüft, dass die Tabelle zu
// den gebauten Wahrzeichen passt; nach einer Änderung an landmarks.js neu schreiben:
//
//   node tools/landmark-dims.mjs
import { writeFileSync } from 'node:fs';

const ctx = new Proxy({}, {
  get(t, k) {
    if (k === 'measureText') return (s) => ({ width: String(s).length * 10 });
    if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
    if (k === 'getImageData') return (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) });
    if (k in t) return t[k];
    return () => {};
  },
  set(t, k, v) {
    t[k] = v;
    return true;
  },
});
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };

const { W } = await import('../src/curve.js');
const { createLandmarkKit, landmarkDims } = await import('../src/world/kit/landmarks.js');
const kit = createLandmarkKit(W);
const rows = kit.list('landmark').map((n) => `  ${JSON.stringify(n)}: ${JSON.stringify(landmarkDims(kit.geo(n).info))},`);
const file = new URL('../src/world/kit/landmark-dims.js', import.meta.url);
writeFileSync(file, `// Erzeugt von tools/landmark-dims.mjs – nicht von Hand ändern. Maße der nahen Fassung jedes Wahrzeichens (wie make sie
// meldet), damit der Ortsplan sie kennt, ohne zu bauen.
export const LANDMARK_DIMS = {
${rows.join('\n')}
};
`);
console.log(`${rows.length} Wahrzeichen → src/world/kit/landmark-dims.js`);
