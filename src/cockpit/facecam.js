// Facecam: Mini Adam live im Stream-Overlay (unten links in der Cockpit-Ansicht), wie bei einem echten IRL-Stream.
// Ein eigenes kleines Studio in Adams Körperkoordinaten (Füße y = 0, Blick +z, +x = Fahrertür): Fahrersitz mit
// Kopfstütze, Beifahrersitz, Rückbank, B-Säule und Seitenfenster der Fahrerseite (im Bild rechts: draußen die echte
// Welt aus der Seitenkamera, bei Regen mit Tropfen), Glasdach und Heckscheibe mit dem Bild der Rückspiegel-Kamera.
// Die Figur bekommt dieselben Gesten wie Mini Adam im Auto (auch das Megafon) – gefilmt von einer kleinen Kamera
// oben am Armaturenbrett. Gerendert wird nur, solange die Facecam zu sehen ist, und nur jedes zweite oder dritte Bild
// in ein kleines Ziel (wie eine echte Webcam); aufs fertige Bild kommt es nach dem Post-Pass als Rechteck mit runden
// Ecken – Tonemapping und sRGB wie beim Hauptbild, die Ecken im Shader geglättet, genau passend zum Rahmen aus ui.js.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { buildMiniAdam } from '../models/miniAdam.js';
import { plush } from '../models/plushMaterial.js';
import { GAZE } from '../models/adamMimic.js';
import { rayBall, spacing, toGeometry, sell, ell, smin, smax } from '../models/softMesh.js';

// Kamera: dort, wohin Mini Adam beim „In die Kamera schauen“ blickt (GAZE.camera), etwas über Augenhöhe; im Bild
// Gesicht und Schultern, unten der Lenkradkranz
const CAM_LOOK = new THREE.Vector3(0.015, 0.69, 0);
const CAM_FOV = 54;
// Breite des Zielbilds in Bildpunkten je Qualitätsstufe (die Höhe folgt dem Seitenverhältnis des Rahmens)
const RT_WIDTH = { hoch: 448, mittel: 384, niedrig: 320 };

/** Abgerundeter Quader, gedreht (Euler x, y, z) und verschoben. */
function rbox(w, h, d, r, x, y, z, rx = 0, ry = 0, rz = 0) {
  const g = new RoundedBoxGeometry(w, h, d, 3, r);
  g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz)));
  g.translate(x, y, z);
  return g;
}

/** Rechteck mit Mitte c und den halben Kanten u und v (UV 0 … 1 entlang u und v). */
function pane(c, u, v) {
  const g = new THREE.BufferGeometry();
  const p = [];
  for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) p.push(c.x + u.x * a + v.x * b, c.y + u.y * a + v.y * b, c.z + u.z * a + v.z * b);
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  g.computeVertexNormals();
  return g;
}
const vec = (x, y, z) => new THREE.Vector3(x, y, z);
// RoundedBoxGeometry ist ohne Index, die übrigen Formen mit: zum Zusammenfassen alle ohne
const merge = (list) => mergeGeometries(list.map((g) => (g.index ? g.toNonIndexed() : g)));

/** Senkrechter Verlauf als kleine Textur (Glasdach). stops: [[0 … 1 von unten, '#rrggbb'], …] */
function gradientTexture(stops) {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 128, 0, 0);
  for (const [k, col] of stops) g.addColorStop(k, col);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Kleiner Zufallsgenerator mit festem Startwert (die Landschaft sieht jedes Mal gleich aus). */
function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Zeichnet fn dreimal waagerecht versetzt (−W, 0, +W): so bleibt die Kachel an den Rändern nahtlos. */
function wrapDraw(W, fn) {
  for (const dx of [-W, 0, W]) fn(dx);
}

/**
 * Blick aus dem Seitenfenster in zwei Ebenen, die verschieden schnell vorbeiziehen (Parallaxe): hinten Himmel mit
 * Wolken, Hügel und ferner Waldrand, vorn Wiese, Büsche, Bäume und Weidezaun. Die Webcam belichtet aufs Gesicht,
 * draußen ist alles hell und weich. Beide Ebenen sind waagerecht kachelbar.
 */
function windowTextures() {
  const W = 512;
  const H = 128;
  const canvas = () => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    return c;
  };
  // --- hinten ---
  const far = canvas();
  let ctx = far.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.62);
  sky.addColorStop(0, '#a9c8ea');
  sky.addColorStop(1, '#e6eef4');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  let rnd = rng(11);
  ctx.filter = 'blur(4px)';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  for (let i = 0; i < 6; i++) {
    const x = rnd() * W;
    const y = H * (0.1 + rnd() * 0.22);
    const r = 10 + rnd() * 14;
    wrapDraw(W, (dx) => {
      for (let k = 0; k < 4; k++) {
        ctx.beginPath();
        ctx.ellipse(dx + x + (k - 1.5) * r * 0.9, y + Math.abs(k - 1.5) * r * 0.18, r, r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
  ctx.filter = 'blur(2px)';
  // Hügel: zwei Reihen, die hintere bläulich
  const hills = [
    ['#a7bcb9', 0.5, 0.05, 3, 0.4],
    ['#8fae7f', 0.56, 0.04, 5, 1.7],
  ];
  for (const [col, base, amp, f, ph] of hills) {
    ctx.fillStyle = col;
    wrapDraw(W, (dx) => {
      ctx.beginPath();
      ctx.moveTo(dx, H);
      for (let x = 0; x <= W; x += 8) ctx.lineTo(dx + x, H * (base - amp * Math.sin((x / W) * Math.PI * 2 * f + ph) - amp * 0.4 * Math.sin((x / W) * Math.PI * 2 * (f * 2 + 1) + ph * 2)));
      ctx.lineTo(dx + W, H);
      ctx.fill();
    });
  }
  // ferner Waldrand: kleine runde Kronen dicht an dicht
  rnd = rng(23);
  for (let i = 0; i < 90; i++) {
    const x = rnd() * W;
    const r = 3 + rnd() * 5;
    const y = H * 0.58 - rnd() * 4;
    ctx.fillStyle = rnd() > 0.5 ? '#5f8455' : '#6b8f5c';
    wrapDraw(W, (dx) => {
      ctx.beginPath();
      ctx.ellipse(dx + x, y, r, r * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.fillStyle = '#88a86b';
  ctx.fillRect(0, H * 0.6, W, H * 0.4);
  ctx.filter = 'none';
  // --- vorn (durchsichtig über dem Himmel) ---
  const near = canvas();
  ctx = near.getContext('2d');
  rnd = rng(5);
  ctx.filter = 'blur(1.5px)';
  const grass = ctx.createLinearGradient(0, H * 0.66, 0, H);
  grass.addColorStop(0, '#9cbc72');
  grass.addColorStop(1, '#6f9550');
  ctx.fillStyle = grass;
  ctx.fillRect(0, H * 0.66, W, H * 0.34);
  // Bäume mit Stamm und Krone, dazwischen Büsche
  for (let i = 0; i < 7; i++) {
    const x = (i + 0.2 + rnd() * 0.6) * (W / 7);
    const big = rnd() > 0.45;
    const r = big ? 15 + rnd() * 9 : 8 + rnd() * 5;
    const top = big ? H * (0.3 + rnd() * 0.08) : H * (0.56 + rnd() * 0.04);
    const hue = rnd();
    wrapDraw(W, (dx) => {
      if (big) {
        ctx.fillStyle = '#5b4a3b';
        ctx.fillRect(dx + x - 2, top + r, 4, H * 0.7 - top - r);
      }
      const g = ctx.createRadialGradient(dx + x - r * 0.35, top + r * 0.5, r * 0.15, dx + x, top + r * 0.9, r * 1.25);
      g.addColorStop(0, hue > 0.5 ? '#86ad5f' : '#78a35a');
      g.addColorStop(1, '#46703b');
      ctx.fillStyle = g;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.ellipse(dx + x + (k - 1) * r * 0.55, top + r * (0.9 - 0.25 * (k === 1)), r * 0.75, r * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
  // Weidezaun: Pfosten und zwei Latten
  ctx.fillStyle = 'rgba(232, 226, 212, 0.95)';
  for (let x = 0; x < W; x += 64) {
    wrapDraw(W, (dx) => ctx.fillRect(dx + x, H * 0.62, 5, H * 0.3));
  }
  ctx.fillRect(0, H * 0.68, W, 3);
  ctx.fillRect(0, H * 0.78, W, 3);
  ctx.filter = 'none';
  return [far, near].map((c) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    return t;
  });
}

// --- Sitze als weiche Polster (Abstandsfunktionen wie bei der Figur, Stoff mit Nähten) ------------------------------
/** Rückenlehne (ohne Kopfstütze) mit Seitenwangen, um 0,2 rad nach hinten geneigt; Mitte x0, Unterkante y0, Fläche z0 */
function backrest(x0, y0, z0, w = 0.25) {
  const c = Math.cos(0.2);
  const s = Math.sin(0.2);
  return (x, y, z) => {
    const ly = (y - y0) * c - (z - z0) * s;
    const lz = (y - y0) * s + (z - z0) * c;
    const lx = x - x0;
    let d = sell(lx, ly, lz, 0, 0.31, -0.06, w, 0.32, 0.065, 3.2);
    // Wangen: seitlich etwas dicker und weiter vorn
    d = smin(d, sell(Math.abs(lx), ly, lz, w - 0.035, 0.27, -0.035, 0.06, 0.26, 0.06, 2.6), 0.035);
    return d;
  };
}
function headrest(x0, y0, z0) {
  return (x, y, z) => sell(x - x0, y - y0, z - z0, 0, 0, 0, 0.125, 0.075, 0.05, 2.7);
}
/** Polsterteil als Netz: Strahlen von der Mitte c, Stofffarbe, Steppnähte entlang |x − x0| = Abstand */
function cushion(sdf, c, color, { seamsX = null, rmax = 0.6, nT = 26, nP = 40 } = {}) {
  const p = rayBall(sdf, c, { thetas: spacing(0, Math.PI, nT), phis: spacing(-Math.PI, Math.PI, nP, [], true), rmax });
  p.flat(color, 0.55);
  if (seamsX) {
    const [x0, gap] = seamsX;
    p.seams((x, y, z, o) => {
      o[0] = Math.abs(Math.abs(x - x0) - gap) < 0.05 ? Math.abs(x - x0) - gap : 1;
    });
  }
  p.occlude(sdf, 0.3, [0.01, 0.03]);
  return p;
}

export class Facecam {
  constructor() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x15161a);
    this.scene = scene;

    // --- Mini Adam (eigene Figur, ungebogen; Mimik mit gleichem Startwert wie die im Auto) ---
    this.adam = buildMiniAdam({ curved: false });
    this.adam.setPose('drive');
    scene.add(this.adam.root);

    // --- Sitze: Fahrersitz hinter ihm, Beifahrersitz, Rückbank ---
    const seatCol = new THREE.Color(0x2b2c32);
    const parts = [];
    for (const [x, w] of [[0, 0.25], [-0.66, 0.24]]) {
      const back = backrest(x, 0.12, -0.24, w);
      parts.push(cushion(back, [x, 0.43, -0.32], seatCol, { seamsX: [x, 0.11], rmax: 0.7 }));
      parts.push(cushion(headrest(x, 0.93, -0.38), [x, 0.93, -0.38], seatCol, { rmax: 0.3, nT: 16, nP: 28 }));
    }
    const bench = (x, y, z) => {
      let d = sell(x + 0.31, y, z, 0, 0.47, -1.26, 0.72, 0.27, 0.075, 4);
      // zwei Mulden für die äußeren Plätze
      for (const s of [-1, 1]) d = smax(d, -ell(x + 0.31 - s * 0.38, y, z, 0, 0.42, -1.16, 0.2, 0.2, 0.04), 0.03);
      return d;
    };
    parts.push(cushion(bench, [-0.31, 0.47, -1.3], seatCol, { seamsX: [-0.31, 0.19], rmax: 1 }));
    for (const x of [-0.86, -0.31, 0.24]) parts.push(cushion(headrest(x, 0.8, -1.34), [x, 0.8, -1.34], seatCol, { rmax: 0.3, nT: 14, nP: 24 }));
    this.seatMat = plush(0xffffff, false, { paint: { logo: null } });
    scene.add(new THREE.Mesh(toGeometry(parts), this.seatMat));

    // Verkleidung: B-Säule und Türen der Fahrerseite, Fensterrahmen, Heckablage, Kopfstützen-Stangen
    const trim = new THREE.MeshStandardMaterial({ color: 0x1d1e23, roughness: 0.66 });
    const tp = [];
    const DOOR = 0.56; // Innenseite der Fahrertür (x)
    tp.push(rbox(0.07, 0.62, 0.13, 0.03, DOOR + 0.01, 0.72, -0.44, 0, 0, -0.08)); // B-Säule
    tp.push(rbox(0.08, 0.46, 1.0, 0.035, DOOR + 0.01, 0.22, 0.12)); // Türverkleidung vorn
    tp.push(rbox(0.08, 0.46, 0.8, 0.035, DOOR + 0.01, 0.22, -0.86)); // hinten
    tp.push(rbox(0.12, 0.05, 2.0, 0.022, DOOR - 0.01, 0.47, -0.36)); // Fensterbrüstung
    tp.push(rbox(1.66, 0.05, 0.36, 0.02, -0.31, 0.64, -1.5)); // Heckablage
    for (const [x, y, z] of [[0, 0.82, -0.36], [-0.66, 0.82, -0.36]]) {
      for (const s of [-1, 1]) {
        const post = new THREE.CylinderGeometry(0.0065, 0.0065, 0.09, 8);
        post.translate(x + s * 0.06, y, z);
        tp.push(post);
      }
    }
    // Rahmen um die Heckscheibe (unten und seitlich; oben schließt der Dachhimmel an)
    for (const [w, h, x, y] of [[1.62, 0.05, -0.31, 0.68], [0.06, 0.34, -1.1, 0.84], [0.06, 0.34, 0.48, 0.84]]) tp.push(rbox(w, h, 0.05, 0.02, x, y, -1.55));
    scene.add(new THREE.Mesh(merge(tp), trim));
    // Dachhimmel: ein durchgehendes Glasdach wie beim Tesla, gefasst von breiten, weichen Stoffkanten, die zu den Türen
    // hin abfallen, und hinten über der Heckscheibe. Bewusst ohne Quer- oder Längsholm mitten im Bild: dünne dunkle
    // Stangen vor dem hellen Glas wirken wie ein Überrollbügel
    const lp = [];
    lp.push(rbox(0.24, 0.045, 2.3, 0.022, DOOR - 0.07, 1.03, -0.45, 0, 0, -0.32)); // Fahrerseite
    lp.push(rbox(0.24, 0.045, 2.3, 0.022, -1.11, 1.03, -0.45, 0, 0, 0.32)); // Beifahrerseite
    lp.push(rbox(1.7, 0.045, 0.3, 0.022, -0.31, 1.025, -1.47, -0.5, 0, 0)); // hinten über der Heckscheibe
    // Licht bekommt der Dachhimmel fast nur indirekt (von Sitzen, Armaturenbrett, Adam): als gleichmäßiges Leuchten
    this.linerMat = new THREE.MeshStandardMaterial({ color: 0x3b3c43, roughness: 0.95, emissive: 0x383940 });
    scene.add(new THREE.Mesh(merge(lp), this.linerMat));

    // Glasdach: Himmel von unten durch das getönte Glas gesehen (dunkler als das Seitenfenster), zur Mitte hin heller
    this.roofMat = new THREE.MeshBasicMaterial({ map: gradientTexture([[0, '#6f88a3'], [0.5, '#5a7799'], [1, '#4b6990']]), side: THREE.DoubleSide, toneMapped: true });
    scene.add(new THREE.Mesh(pane(vec(-0.31, 1.055, -0.5), vec(0.87, 0, 0), vec(0, 0, -1.08)), this.roofMat));
    // Seitenfenster vorn und hinten: draußen die echte Welt – das Bild der Seitenkamera am Kopf des Fahrers (setSideView:
    // Autobahn, Ort, Ladepark, Brunnen, dasselbe Wetter); ohne sie (Qualität „niedrig“) zieht eine gemalte Landschaft
    // vorbei (zwei Ebenen, die vordere schneller). Bei Regen sitzen Tropfen auf dem Glas, und es wird matt.
    const [far, near] = windowTextures();
    this.winMat = new THREE.ShaderMaterial({
      uniforms: {
        tFar: { value: far }, tNear: { value: near }, uScroll: { value: new THREE.Vector2() }, uLight: { value: 1 },
        tWorld: { value: null }, uWorld: { value: 0 }, uRain: { value: 0 }, uDrift: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D tFar;
        uniform sampler2D tNear;
        uniform sampler2D tWorld;
        uniform vec2 uScroll;
        uniform float uLight;
        uniform float uWorld;
        uniform float uRain;
        uniform float uDrift;
        varying vec2 vUv;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
          // Tropfen: Zellen auf der Scheibe (Meter: x längs, y hoch), bei Fahrt wandern sie langsam nach hinten; jeder
          // bricht das Bild dahinter ein wenig, je mehr Regen, desto mehr Zellen tragen einen
          vec2 g = vec2(-1.2 * vUv.x + uDrift, vUv.y * 0.52) * vec2(24.0, 30.0);
          vec2 id = floor(g);
          vec2 dv = (fract(g) - 0.5 - (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.4) * vec2(1.0, 1.3);
          float r = 0.2 + 0.14 * hash(id + 1.3);
          float drop = step(1.0 - 0.8 * uRain, hash(id)) * smoothstep(r, r * 0.55, length(dv));
          vec2 bend = dv * drop * 0.04;
          // u läuft in Fahrtrichtung nach hinten: die Landschaft wandert mit wachsendem uScroll nach hinten
          vec3 c = texture2D(tFar, vec2(vUv.x * 0.6 - uScroll.x, vUv.y) + bend).rgb;
          vec4 n = texture2D(tNear, vec2(vUv.x - uScroll.y, vUv.y) + bend);
          vec3 col = mix(c, n.rgb, n.a) * uLight;
          if (uWorld > 0.5) {
            // die Seitenkamera: links im Bild hinten, rechts vorn; die Scheiben reichen von z = 0,7 (vorn) bis −0,9,
            // y von 0,76 bis 1,02 – leicht getöntes Glas
            vec2 w = vec2((0.9 - 1.2 * vUv.x) / 1.6, (vUv.y * 0.52 - 0.26) / 0.26);
            col = texture2D(tWorld, clamp(w + bend * vec2(0.6, 2.0), 0.0, 1.0)).rgb * 0.9;
          }
          // Regen: das Glas wird matt und grauer, die Tropfen dunkeln ab und glänzen am Rand
          col = mix(col, vec3(dot(col, vec3(0.3, 0.59, 0.11))) * 0.92 + 0.02, 0.3 * uRain);
          col = col * (1.0 - 0.18 * drop) + drop * smoothstep(0.3, 1.0, length(dv) / r) * 0.12;
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
      side: THREE.DoubleSide,
    });
    const win = [];
    win.push(pane(vec(DOOR + 0.02, 0.76, 0.14), vec(0, 0, 0.56), vec(0, 0.26, 0)));
    win.push(pane(vec(DOOR + 0.02, 0.76, -0.9), vec(0, 0, 0.42), vec(0, 0.26, 0)));
    const winGeo = merge(win);
    // u entlang der Fahrtrichtung (eine Kachel der vorderen Ebene je 1,2 m Scheibe): beide Scheiben zeigen denselben
    // Streifen, als wäre es ein Fenster
    const pos = winGeo.attributes.position;
    const uv = winGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, -pos.getZ(i) / 1.2, (pos.getY(i) - 0.5) / 0.52);
    scene.add(new THREE.Mesh(winGeo, this.winMat));
    // Heckscheibe: zeigt, was die Rückspiegel-Kamera sieht (Blick nach hinten wie diese Kamera, also ungespiegelt)
    this.rearMat = new THREE.MeshBasicMaterial({ color: 0x9aa7b8 });
    const rear = pane(vec(-0.31, 0.84, -1.53), vec(0.78, 0, 0), vec(0, 0.155, 0.02));
    // die Scheibe ist flacher (≈ 5 : 1) als das Bild (768 × 226 ≈ 3,4 : 1): oben und unten etwas abschneiden statt
    // zu verzerren
    const k = (768 / 226 / (0.78 / Math.hypot(0.155, 0.02))) / 2;
    rear.attributes.uv.array.set([0, 0.5 - k, 1, 0.5 - k, 1, 0.5 + k, 0, 0.5 + k]);
    scene.add(new THREE.Mesh(rear, this.rearMat));

    // Lenkrad (von vorn gesehen): Kranz, zwei Speichen, Nabe, Lenksäule; dreht mit wie Adams Hände
    const wheelGeo = [];
    wheelGeo.push(new THREE.TorusGeometry(0.17, 0.021, 14, 72));
    for (const a of [0, Math.PI]) {
      const sp = new THREE.BoxGeometry(0.11, 0.032, 0.02);
      sp.translate(0.1, 0, -0.01);
      sp.rotateZ(a);
      wheelGeo.push(sp);
    }
    const hub = new THREE.CylinderGeometry(0.058, 0.064, 0.05, 32);
    hub.rotateX(Math.PI / 2);
    hub.translate(0, 0, -0.02);
    wheelGeo.push(hub);
    const column = new THREE.CylinderGeometry(0.034, 0.042, 0.26, 20);
    column.rotateX(Math.PI / 2);
    column.translate(0, 0, -0.17);
    wheelGeo.push(column);
    this.wheelPivot = new THREE.Group();
    this.wheelPivot.matrixAutoUpdate = false;
    this.wheel = new THREE.Mesh(merge(wheelGeo), new THREE.MeshStandardMaterial({ color: 0x18191d, roughness: 0.5 }));
    this.wheelPivot.add(this.wheel);
    scene.add(this.wheelPivot);

    // --- Licht: Sonne durch die Frontscheibe (warm, von vorn links), Himmel durchs Seitenfenster (kühl), Kante von
    // hinten oben durchs Glasdach, dazu weiches Umgebungslicht ---
    this.hemi = new THREE.HemisphereLight(0xdbe6ff, 0x2a2420, 0.95);
    this.key = new THREE.DirectionalLight(0xfff0dc, 2.2);
    this.key.position.set(-0.7, 1.7, 1.5);
    this.fill = new THREE.DirectionalLight(0xcfe0ff, 0.75);
    this.fill.position.set(1.6, 0.9, 0.2);
    this.rim = new THREE.DirectionalLight(0xfff6ea, 1.6);
    this.rim.position.set(0.35, 2.0, -1.2);
    for (const l of [this.key, this.fill, this.rim]) {
      l.target.position.set(0, 0.68, 0);
      scene.add(l, l.target);
    }
    scene.add(this.hemi);

    this.camera = new THREE.PerspectiveCamera(CAM_FOV, 16 / 9, 0.05, 6);
    this.camera.position.fromArray(GAZE.camera);
    this.camera.lookAt(CAM_LOOK);
    this.camQ = this.camera.quaternion.clone();
    this.shakeE = new THREE.Euler();
    this.shakeQ = new THREE.Quaternion();

    // --- Zielbild und Anzeige ---
    this.rt = new THREE.WebGLRenderTarget(384, 216, { type: THREE.HalfFloatType, samples: 2 });
    this.ready = false;
    // Spielzeit der letzten Aufnahme (vom Aufrufer gesetzt)
    this.shotT = -1;
    this.quadMat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: this.rt.texture },
        uRect: { value: new THREE.Vector4() },
        uBox: { value: new THREE.Vector4() },
        uRadius: { value: 0 },
        uAlpha: { value: 1 },
        uGlitch: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        uniform vec4 uRect;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(mix(uRect.xy, uRect.zw, uv), 0.0, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D map;
        uniform vec4 uBox;
        uniform float uRadius;
        uniform float uAlpha;
        uniform float uGlitch;
        uniform float uTime;
        varying vec2 vUv;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
          // abgerundetes Rechteck als Abstandsfeld in Bildpunkten: 1 px weiche Kante wie beim CSS-Rahmen
          vec2 q = abs(gl_FragCoord.xy - uBox.xy) - uBox.zw + uRadius;
          float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
          vec2 uv = vUv;
          // Funkloch: die Verbindung reißt ab – Zeilen verrutschen, Rauschen, Farbe weg
          float g = uGlitch;
          if (g > 0.0) {
            float n = hash(vec2(floor(uv.y * 34.0), floor(uTime * 24.0)));
            uv.x += (n - 0.5) * 0.09 * g * step(0.55, n);
          }
          vec3 c = texture2D(map, uv).rgb;
          if (g > 0.0) {
            float grain = hash(floor(gl_FragCoord.xy * 0.5) + fract(uTime * 7.31) * 113.0);
            c = mix(c, vec3(dot(c, vec3(0.3, 0.59, 0.11))), 0.65 * g) * (1.0 - 0.25 * g) + (grain - 0.5) * 0.3 * g;
          }
          // leichte Webcam-Vignette
          vec2 v = (vUv - 0.5) * vec2(1.0, 0.7);
          c *= 1.0 - 0.32 * dot(v, v);
          gl_FragColor = vec4(c, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          gl_FragColor.a = clamp(0.5 - d, 0.0, 1.0) * uAlpha;
        }`,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.quadMat);
    quad.frustumCulled = false;
    this.quadScene = new THREE.Scene();
    this.quadScene.add(quad);
    this.quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.size = new THREE.Vector2();
  }

  /** Lenkrad wie im Auto (Matrix Lenkrad → Körper, Kranzradius); Adams Hände greifen daran. */
  setWheel(m, r) {
    this.adam.setWheel(m, r);
    this.wheelPivot.matrix.copy(m);
    this.wheelPivot.matrixWorldNeedsUpdate = true;
    this.wheel.scale.setScalar(r / 0.17);
  }

  /**
   * Seitenfenster: Bild der Seitenkamera am Kopf des Fahrers (Blick zum Fahrerfenster hinaus, links hinten, rechts
   * vorn) – oder null: dann zieht die gemalte Landschaft vorbei. Gefilmt wird sie nur, wenn update world meldet.
   */
  setSideView(tex) {
    this.winMat.uniforms.tWorld.value = tex;
  }

  /** Heckscheibe: Bild der Rückspiegel-Kamera (oder null: nur getöntes Glas). */
  setRearView(tex) {
    this.rearMat.map = tex;
    this.rearMat.color.set(tex ? 0xd2d8de : 0x9aa7b8);
    this.rearMat.needsUpdate = true;
  }

  /**
   * Pro Bild: Lenkrad mitdrehen, Licht ans Wetter anpassen, Landschaft vorbeiziehen lassen, die Kamera zittert kaum
   * merklich mit der Fahrbahn. rain 0 … 1: Regen auf den Seitenscheiben (dieselbe Stärke wie auf der Frontscheibe);
   * world: das Seitenfenster zeigt das Bild der Seitenkamera (setSideView), sonst die gemalte Landschaft.
   * @param {{t:number, dt?:number, steer?:number, overcast?:number, sun?:number, speed?:number, shake?:number, rain?:number, world?:boolean}} s speed in m/s
   */
  update({ t, dt = 0, steer = 0, overcast = 0, sun = 1, speed = 0, shake = 0, rain = 0, world = false }) {
    // gleiche Drehung wie Adams Griff (handTarget: 0,5 rad bei vollem Einschlag, rechts = im Uhrzeigersinn)
    this.wheel.rotation.z = -steer * 0.5;
    const o = overcast;
    this.key.intensity = 2.2 * (1 - o * 0.75) * sun; // sun: Anteil der Sonne unter Wolkenschatten
    this.rim.intensity = 1.6 * (1 - o * 0.5);
    this.fill.intensity = 0.75 * (1 - o * 0.3);
    this.hemi.intensity = 0.95 - o * 0.15;
    const sky = 1 - o * 0.45;
    this.roofMat.color.setScalar(sky);
    this.linerMat.emissiveIntensity = sky;
    const U = this.winMat.uniforms;
    U.uLight.value = 1.3 * sky;
    U.uWorld.value = world && U.tWorld.value ? 1 : 0;
    U.uRain.value = Math.min(1, Math.max(0, rain));
    // die Tropfen kriechen im Fahrtwind langsam nach hinten
    U.uDrift.value = (U.uDrift.value + Math.min(speed, 40) * dt * 0.004) % 100;
    // die Landschaft im Seitenfenster zieht nach hinten: die nahe Ebene etwa eine Kachel (1,2 m Scheibe) je Sekunde
    // bei Autobahntempo, die ferne kaum
    const sc = this.winMat.uniforms.uScroll.value;
    sc.set((sc.x + speed * dt * 0.0035) % 1, (sc.y + speed * dt * 0.03) % 1);
    const v = Math.min(1, speed / 40) * 0.0012 + shake * 0.01;
    this.shakeE.set(Math.sin(t * 23.1) * v + Math.sin(t * 7.3) * v * 0.6, Math.sin(t * 17.7 + 1) * v * 0.7, Math.sin(t * 13.3 + 2) * v * 0.5);
    this.camera.quaternion.copy(this.camQ).multiply(this.shakeQ.setFromEuler(this.shakeE));
  }

  /**
   * Studio ins Zielbild rendern (nur wenn nötig – der Aufrufer bestimmt den Takt).
   * box: Lage auf dem Schirm in CSS-Pixeln { x, y, w, h, r }; quality: 'hoch' | 'mittel' | 'niedrig'
   */
  render(renderer, box, quality = 'mittel') {
    renderer.getDrawingBufferSize(this.size);
    // nie mehr Bildpunkte als auf dem Schirm zu sehen sind; in 32er-Stufen, damit das Ziel nicht bei jeder kleinen
    // Größenänderung (Gleiten des Rahmens) neu angelegt wird. Der Rahmen ist immer 16 : 9.
    const shown = (box.w * this.size.x) / window.innerWidth;
    const w = Math.min(RT_WIDTH[quality] || RT_WIDTH.mittel, Math.max(192, Math.ceil(shown / 32) * 32));
    const h = Math.round((w * 9) / 16);
    if (this.rt.width !== w || this.rt.height !== h) {
      this.rt.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
    const clear = renderer.autoClear;
    renderer.autoClear = true;
    renderer.setRenderTarget(this.rt);
    renderer.render(this.scene, this.camera);
    renderer.setRenderTarget(null);
    renderer.autoClear = clear;
    this.ready = true;
  }

  /**
   * Das zuletzt gerenderte Bild als abgerundetes Rechteck aufs fertige Bild legen (nach dem Post-Pass; autoClear
   * muss aus sein). Die Kante liegt 0,75 CSS-Pixel innerhalb des Rahmens, also unter dessen Linie.
   * @param {{x:number, y:number, w:number, h:number, r:number}} box Rahmen in CSS-Pixeln
   */
  draw(renderer, box, { alpha = 1, glitch = 0, t = 0 } = {}) {
    if (!this.ready) return;
    renderer.getDrawingBufferSize(this.size);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const sx = this.size.x / W;
    const sy = this.size.y / H;
    const u = this.quadMat.uniforms;
    u.uRect.value.set((box.x / W) * 2 - 1, 1 - ((box.y + box.h) / H) * 2, ((box.x + box.w) / W) * 2 - 1, 1 - (box.y / H) * 2);
    const inset = 0.75;
    u.uBox.value.set((box.x + box.w / 2) * sx, this.size.y - (box.y + box.h / 2) * sy, (box.w / 2 - inset) * sx, (box.h / 2 - inset) * sy);
    u.uRadius.value = (box.r - inset) * sx;
    u.uAlpha.value = alpha;
    u.uGlitch.value = glitch;
    u.uTime.value = t;
    renderer.render(this.quadScene, this.quadCam);
  }
}
