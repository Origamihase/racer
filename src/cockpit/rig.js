// Mini Adams Stream-Technik im Auto: Action-Cam am Saugnapf hinter der Frontscheibe (filmt die Straße),
// Facecam als Klemm-Webcam auf dem Mittelbildschirm und die gepolsterte Bonding-Box mit drei Netzen
// auf dem Armaturenbrett – samt Kabeln. Kleine, runde Geräte, jedes hält einen Blick aus der Nähe aus.
import * as THREE from 'three';
import { lerp } from '../util.js';
import { pillow, rbox, lathe, tube, place, prep, v3 } from './parts.js';
import { labelQuad, blob, dashTopY } from './cabin.js';

const BODY = 0x26282d;
const RUBBER = 0x1c1d20;
const SATIN = 0x9a9ea5;

// Lage der Geräte (Fahrzeug-Koordinaten): Die Action-Cam hängt links oben neben dem Spiegelgehäuse, knapp unter dem
// Dachrahmen und 8,5 cm hinter der Scheibe – so hoch, dass die Elsa am rechten Rand (6 m mit Krone) aus Mini Adams
// Sicht ganz unter ihr durchzieht, auch von der rechten Spur aus (dort steigt die Linie ihrer Krone am steilsten:
// Unterkante der Kamera rechts 2 cm darüber). Ihr Kabel läuft rechts neben dem Saugnapf (bei x = CAM_CABLE_X) an der
// Scheibe hoch. Die Bonding-Box steht rechts auf dem Armaturenbrett.
export const ACTION_CAM = v3(-0.27, 1.3, -0.141);
const CAM_CABLE_X = ACTION_CAM.x + 0.052;
/**
 * Umriss der Action-Cam um ACTION_CAM als Kästen [x0, y0, z0, x1, y1, z1]: Gehäuse (58 × 40 × 26 mm) samt Linse vorn,
 * Halter mit Rändelschraube bis zum Kugelgelenk. tools/sicht-test.mjs prüft damit, dass sie die Elsa am Rand nicht
 * verdeckt.
 */
export const CAM_HULL = [
  [-0.029, -0.02, -0.024, 0.029, 0.02, 0.013],
  [-0.008, 0.019, -0.007, 0.017, 0.034, 0.007],
];
const ENCODER = { x: 0.432, z: -0.7, yaw: -0.62 };

/** Linse nach −z (lokal): Tubus, dunkles Glas, kleiner Lichtreflex. */
function lens(S, m, r, depth, x = 0, y = 0, z = 0) {
  const barrel = lathe([[r * 0.72, 0], [r, 0], [r, depth * 0.7, 0.002], [r * 0.86, depth, 0.0015], [r * 0.72, depth * 0.8]], 24);
  S.gloss.push(prep(place(barrel, x, y, z, -Math.PI / 2).applyMatrix4(m), 0x17181b));
  const glass = new THREE.SphereGeometry(r * 1.6, 20, 6, 0, Math.PI * 2, 0, 0.47);
  glass.rotateX(-Math.PI / 2);
  glass.translate(x, y, z + r * 1.6 * Math.cos(0.47) - depth * 0.82);
  S.gloss.push(prep(glass.applyMatrix4(m), 0x0d1a2c));
  const glint = new THREE.CircleGeometry(r * 0.16, 10);
  glint.rotateY(Math.PI);
  glint.translate(x + r * 0.28, y + r * 0.3, z - depth * 0.86);
  S.led.push(prep(glint.applyMatrix4(m), 0xb8c6d8));
}

/**
 * Action-Cam: hängt links neben dem Kameragehäuse des Innenspiegels an einem Saugnapf an der Scheibe.
 * Gibt die Teile zurück, die sich ändern (REC-Lampe, Live-Display), und das Ende des Steckers rechts oben.
 */
function buildActionCam(S, W, P) {
  const m = new THREE.Matrix4().makeTranslation(P.x, P.y, P.z);
  const add = (slot, g, color, opts) => S[slot].push(prep(g.applyMatrix4(m), color, opts));
  // Gehäuse (gummiert), Rückwand mit Display-Rahmen und Schriftzug
  add('soft', rbox(0.058, 0.04, 0.026, 0.007, 4), BODY);
  add('label', place(labelQuad(0.05, 0.0333, 'kamera'), 0, 0, 0.01315), 0xffffff, { uv: 'keep' });
  add('gloss', place(rbox(0.0372, 0.0258, 0.0016, 0.0007), -0.0055, 0.003, 0.0129), 0x08090b);
  // Auslöser oben, Taste an der Seite, rechts oben der Stecker für das Kabel (es läuft an der Scheibe hoch)
  add('gloss', place(lathe([[0, 0], [0.0052, 0], [0.0052, 0.002, 0.001], [0.004, 0.0032, 0.001], [0, 0.0032]], 16), 0.017, 0.02, 0), 0xd4452f);
  add('satin', place(rbox(0.003, 0.009, 0.006, 0.0012), -0.029, 0.004, 0.002), SATIN);
  add('gloss', place(rbox(0.009, 0.007, 0.009, 0.002), 0.0315, 0.008, 0), 0x17181b);
  add('soft', place(new THREE.CylinderGeometry(0.0024, 0.0029, 0.007, 12).rotateZ(Math.PI / 2), 0.0395, 0.008, 0), RUBBER);
  lens(S, m, 0.0128, 0.011, -0.011, 0.003, -0.013);
  // Halter: zwei Laschen, Rändelschraube, kurzer Arm zum Kugelgelenk am Saugnapf
  for (const dx of [-0.0045, 0.0045]) add('soft', place(rbox(0.0034, 0.013, 0.012, 0.0015), dx, 0.0255, 0), RUBBER);
  add('satin', place(new THREE.CylinderGeometry(0.0042, 0.0042, 0.02, 12).rotateZ(Math.PI / 2), 0.003, 0.0275, 0), SATIN);
  add('gloss', place(new THREE.CylinderGeometry(0.0068, 0.0068, 0.005, 14).rotateZ(Math.PI / 2), 0.0142, 0.0275, 0), 0x17181b);
  // Saugnapf auf der Scheibe (Achse = Scheibennormale nach innen)
  const u = (P.y + 0.047 - W.base.y) / W.U.y;
  const G = W.base.clone().addScaledVector(W.U, u);
  G.x = P.x;
  const inward = W.N.clone().negate();
  const q = new THREE.Quaternion().setFromUnitVectors(v3(0, 1, 0), inward);
  const mc = new THREE.Matrix4().compose(G.clone().addScaledVector(inward, 0.0004), q, v3(1, 1, 1));
  const cup = lathe([[0, 0.0105], [0.0085, 0.0105, 0.003], [0.0115, 0.0055, 0.004], [0.0225, 0.0022, 0.004], [0.0265, 0, 0.001], [0, 0]], 28);
  S.soft.push(prep(cup.applyMatrix4(mc), 0x2b2d32));
  S.satin.push(prep(place(rbox(0.007, 0.003, 0.02, 0.0012), 0, 0.0075, 0.014, -0.25).applyMatrix4(mc), SATIN));
  const ball = G.clone().addScaledVector(inward, 0.0155);
  const sph = new THREE.SphereGeometry(0.0062, 14, 10);
  S.satin.push(prep(place(sph, ball.x, ball.y, ball.z), SATIN));
  const top = v3(P.x, P.y + 0.0295, P.z);
  S.soft.push(prep(tube([ball, ball.clone().lerp(top, 0.5).add(v3(0, 0, 0.002)), top], 0.0044, { radial: 8, step: 0.006 }), RUBBER));
  // REC-Lampe (blinkt, main.js blendet sie unter dem Chat aus) und das Live-Display auf der Rückwand
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.0027, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff2a1e, toneMapped: false }));
  led.position.set(P.x + 0.0218, P.y + 0.0128, P.z + 0.0137);
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 0.0236), liveMaterial());
  display.position.set(P.x - 0.0055, P.y + 0.003, P.z + 0.0139);
  return { led, display, port: v3(P.x + 0.041, P.y + 0.008, P.z) };
}

/** Material fürs Live-Display: zeigt das Weltbild verkleinert (über mehrere Abgriffe gemittelt, sonst flimmert es). */
function liveMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { tLive: { value: null }, uOn: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: /* glsl */ `
      uniform sampler2D tLive;
      uniform float uOn;
      varying vec2 vUv;
      void main() {
        vec2 fw = fwidth(vUv);
        vec3 c = vec3(0.0);
        for (int i = 0; i < 4; i++) for (int j = 0; j < 4; j++) c += texture2D(tLive, vUv + (vec2(float(i), float(j)) - 1.5) * 0.25 * fw).rgb;
        c *= 0.0625 * 0.82 * uOn;
        gl_FragColor = vec4(c + vec3(0.012, 0.014, 0.018), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
}

/** Facecam: kleine Webcam, die oben auf dem Mittelbildschirm klemmt und zum Fahrer schaut. */
function buildFaceCam(S, screenM, eye) {
  const sAdd = (slot, g, color, opts) => S[slot].push(prep(g.applyMatrix4(screenM), color, opts));
  const TOP = 0.113;
  // Klemme: liegt auf der Oberkante, greift vorn knapp über den Rahmen und hinten am Gehäuse hinunter
  sAdd('gloss', place(rbox(0.034, 0.0046, 0.027, 0.0018), 0, TOP + 0.0023, -0.0095), 0x1d1f23);
  sAdd('gloss', place(rbox(0.034, 0.0085, 0.0028, 0.0012), 0, TOP - 0.002, 0.0018), 0x1d1f23);
  sAdd('gloss', place(rbox(0.03, 0.04, 0.0036, 0.0015), 0, TOP - 0.0165, -0.0215), 0x1d1f23);
  sAdd('satin', place(new THREE.CylinderGeometry(0.004, 0.0048, 0.005, 12), 0, TOP + 0.0068, -0.0095), SATIN);
  // Kopf: runde Pille, zum Fahrer gedreht und leicht nach oben geneigt
  const c = v3(0, TOP + 0.0195, -0.0095).applyMatrix4(screenM);
  const dir = eye.clone().sub(c).normalize();
  const xAxis = v3().crossVectors(v3(0, 1, 0), dir).normalize();
  const yAxis = v3().crossVectors(dir, xAxis);
  const m = new THREE.Matrix4().makeBasis(xAxis, yAxis, dir).setPosition(c);
  const add = (slot, g, color, opts) => S[slot].push(prep(g.applyMatrix4(m), color, opts));
  const head = new THREE.CapsuleGeometry(0.0105, 0.03, 8, 18);
  head.rotateZ(Math.PI / 2);
  head.scale(1, 1, 0.92);
  add('gloss', head, 0x2a2c31);
  // Linse nach +z (zum Fahrer): Zierring, Glas, Reflex
  add('satin', place(lathe([[0.0062, 0], [0.0086, 0], [0.0086, 0.0022, 0.0008], [0.0072, 0.003, 0.0008], [0.0062, 0.0024]], 22), 0, 0, 0.0088, Math.PI / 2), SATIN);
  const glass = new THREE.SphereGeometry(0.011, 18, 6, 0, Math.PI * 2, 0, 0.6);
  glass.rotateX(Math.PI / 2);
  add('gloss', place(glass, 0, 0, 0.0108 - 0.011 * Math.cos(0.6) + 0.0002), 0x0d1a2c);
  const glint = new THREE.CircleGeometry(0.0011, 8);
  S.led.push(prep(place(glint, 0.002, 0.0022, 0.0116).applyMatrix4(m), 0xb8c6d8));
  // Tally-Licht (gedimmt) und Mikrofonloch
  const tally = new THREE.SphereGeometry(0.0013, 8, 6);
  S.led.push(prep(place(tally, 0.0165, 0.0005, 0.0094).applyMatrix4(m), 0xb8322a));
  add('gloss', place(new THREE.CylinderGeometry(0.0008, 0.0008, 0.0006, 8).rotateX(Math.PI / 2), -0.0165, 0.0005, 0.0096), 0x08090b);
  return { port: v3(0.006, TOP + 0.016, -0.02).applyMatrix4(screenM) };
}

/** Bonding-Box („Stream-Technik“): gepolstertes Kästchen mit drei Netz-Lämpchen und zwei Stummelantennen. */
function buildEncoder(S, x, z, yaw) {
  const y = dashTopY(x, z);
  const m = new THREE.Matrix4().makeRotationY(yaw).setPosition(x, y, z);
  const add = (slot, g, color, opts) => S[slot].push(prep(g.applyMatrix4(m), color, opts));
  add('cloth', place(pillow(0.105, 0.036, 0.07, 0.011, [0.0012, 0, 0.0012], 8), 0, 0.0195, 0), 0x34373d, { shade: (p) => 0.7 + 0.3 * Math.min(1, (p.y - y) / 0.02), uv: 34 });
  add('label', place(labelQuad(0.084, 0.035, 'box').rotateX(-Math.PI / 2), 0, 0.0378, 0), 0xffffff, { uv: 'keep' });
  // Frontblende mit drei gedimmten Lämpchen (zwei Netze grün, eines sucht noch)
  add('gloss', place(rbox(0.072, 0.017, 0.003, 0.0012), 0, 0.019, 0.0356), 0x15161a);
  add('label', place(labelQuad(0.068, 0.01275, 'boxFront'), 0, 0.0178, 0.0373), 0xffffff, { uv: 'keep' });
  [0x39b866, 0x39b866, 0xc49432].forEach((col, i) => {
    S.led.push(prep(place(new THREE.SphereGeometry(0.0016, 8, 6), (i - 1) * 0.0204, 0.0218, 0.0372).applyMatrix4(m), col));
  });
  // zwei Stummelantennen mit Gelenk
  for (const s of [-1, 1]) {
    add('gloss', place(rbox(0.011, 0.009, 0.011, 0.003), s * 0.04, 0.039, -0.024), 0x1d1f23);
    const rod = lathe([[0, 0], [0.0042, 0], [0.0046, 0.012], [0.0046, 0.05, 0.004], [0.0026, 0.056, 0.002], [0, 0.0565]], 12);
    add('soft', place(rod, s * 0.04, 0.041, -0.024, -0.22, 0, -s * 0.3), RUBBER);
  }
  blob(S, x, y, z, 0.085, 0.064, yaw);
  const back = (dx) => v3(dx, 0.014, -0.039).applyMatrix4(m);
  for (const dx of [-0.02, 0.02]) add('gloss', place(rbox(0.008, 0.006, 0.008, 0.002), dx, 0.014, -0.036), 0x1d1f23);
  return { ports: [back(-0.02), back(0.02)] };
}

/** Kabel, das mit kleinem Durchhang auf dem Armaturenbrett liegt (Punkte in x, z; y folgt der Oberseite). */
function onDash(x, z, lift = 0.0024) {
  return v3(x, dashTopY(x, z) + lift, z);
}

/**
 * Baut die ganze Stream-Technik. ctx: { W: WINDSHIELD, screenM: Matrix des Mittelbildschirms, eye: Augpunkt,
 * onPillar(t): Punkt auf der Innenseite der rechten A-Säule }. Gibt die Teile der Action-Cam zurück und, als
 * Rechtecke [x0, x1, v0, v1] in Scheibenkoordinaten (v längs ab der Unterkante), wo Technik am Glas liegt.
 */
export function buildRig(S, ctx) {
  const { W } = ctx;
  const cam = buildActionCam(S, W, ACTION_CAM);
  const face = buildFaceCam(S, ctx.screenM, ctx.eye);
  const enc = buildEncoder(S, ENCODER.x, ENCODER.z, ENCODER.yaw);
  const cable = (pts, r = 0.0021, step = 0.03) => S.soft.push(prep(tube(pts, r, { radial: 6, step }), RUBBER));
  const clip = (g, x, y, z) => S.gloss.push(prep(place(g, x, y, z), 0x2a2c30));
  // Kabel 1: Box → hinter dem Bildschirm entlang → an dessen Rückseite hoch zur Facecam
  const sBack = (x, y) => v3(x, y, -0.0235).applyMatrix4(ctx.screenM);
  cable([
    enc.ports[0], onDash(ENCODER.x - 0.06, ENCODER.z - 0.075), onDash(0.22, -0.78), onDash(0.1, -0.7), onDash(0.035, -0.6),
    onDash(0.024, -0.535), sBack(0.02, -0.07), sBack(0.014, 0.06), sBack(0.008, 0.1), face.port,
  ]);
  // Kabel 2 (dünner, ein USB-Kabel): Box → rechter Säulenfuß → an der A-Säule hoch → unter dem Dachrahmen entlang
  // → nach vorn an die Scheibe und an ihr hinunter in den Stecker der Action-Cam, verlegt wie bei einer Dashcam
  const pts = [enc.ports[1], onDash(ENCODER.x + 0.07, ENCODER.z - 0.085), onDash(0.6, -0.83), onDash(0.69, -0.86)];
  for (let i = 0; i <= 8; i++) pts.push(ctx.onPillar(0.1 + 0.84 * (i / 8)));
  const hy = (x) => 1.3665 + 0.012 * (1 - (x / 0.67) ** 2);
  let px = 0.58;
  pts.push(v3(px, hy(px) - 0.001, -0.056));
  for (const cx of [0.5, 0.26, 0.02, -0.17]) {
    // zwischen den Clips hängt das Kabel ein wenig durch
    const mid = (px + cx) / 2;
    pts.push(v3(mid, hy(mid) - 0.008, -0.05), v3(cx, hy(cx) - 0.0015, -0.056));
    clip(rbox(0.012, 0.007, 0.009, 0.002), cx, hy(cx) - 0.0018, -0.056);
    px = cx;
  }
  cable(pts, 0.0017, 0.015);
  // ab dem letzten Clip (er verdeckt die Naht) fein aufgelöst, wegen der engen Bögen: nach vorn an die Scheibe, an ihr
  // hinunter, kurz vor der Kamera vom Glas weg und von rechts in den Stecker
  // (v des Saugnapfs auf der Scheibe: Das Kabel verlässt das Glas 4,5 mm darüber)
  const cupV = (ACTION_CAM.y + 0.047 - W.base.y) / W.U.y;
  const P = cam.port;
  const onGlass = (v, d = 0.002) => W.base.clone().addScaledVector(W.U, v).addScaledVector(W.N, -d).setX(CAM_CABLE_X);
  const end = [pts[pts.length - 1], v3(CAM_CABLE_X + 0.004, hy(CAM_CABLE_X) - 0.003, -0.072), v3(CAM_CABLE_X, 1.3705, -0.094)];
  for (const v of [0.9, cupV + 0.0365, cupV + 0.0165]) end.push(onGlass(v));
  end.push(onGlass(cupV + 0.0045, 0.012), v3(CAM_CABLE_X, P.y + 0.018, P.z + 0.002), v3(P.x + 0.008, P.y + 0.004, P.z + 0.001));
  end.push(v3(P.x + 0.003, P.y + 0.0005, P.z), P);
  cable(end, 0.0017, 0.005);
  // ein Klebeclip hält es an der Scheibe
  const cq = new THREE.Matrix4().makeBasis(W.X, W.U, W.N.clone().negate()).setPosition(onGlass(cupV + 0.03, 0));
  S.gloss.push(prep(place(rbox(0.009, 0.012, 0.0062, 0.0022), 0, 0, 0.0031).applyMatrix4(cq), 0x2a2c30));
  // Clips an der Säule
  for (const t of [0.3, 0.6, 0.86]) {
    const p = ctx.onPillar(t);
    clip(rbox(0.009, 0.012, 0.009, 0.002), p.x, p.y, p.z);
  }
  // was am Glas liegt: Saugnapf der Action-Cam, ihr Kabel bis zum Dachrahmen
  const glass = [
    [ACTION_CAM.x - 0.04, ACTION_CAM.x + 0.04, cupV - 0.04, cupV + 0.04],
    [CAM_CABLE_X - 0.018, CAM_CABLE_X + 0.018, cupV - 0.004, W.length + 0.1],
  ];
  return { led: cam.led, display: cam.display, glass };
}

/** uv des Live-Displays so setzen, dass ein 3:2-Ausschnitt um die Bildmitte (knapp unter dem Horizont) erscheint. */
export function setLiveCrop(display, aspect) {
  const uv = display.geometry.attributes.uv;
  const want = 0.035 / 0.0236;
  let w = 1;
  let h = 1;
  if (aspect > want) w = want / aspect;
  else h = aspect / want;
  // nicht das ganze Bild: die Action-Cam zeigt den Blick nach vorn, leicht hineingezoomt
  w *= 0.86;
  h *= 0.86;
  const cy = lerp(0.5, 0.56, Math.min(1, Math.max(0, 1 - h)));
  const u0 = 0.5 - w / 2;
  const v0 = Math.min(1 - h, Math.max(0, cy - h / 2));
  uv.setXY(0, u0, v0 + h);
  uv.setXY(1, u0 + w, v0 + h);
  uv.setXY(2, u0, v0);
  uv.setXY(3, u0 + w, v0);
  uv.needsUpdate = true;
}
