// Elsa – das Heringsmaskottchen aus Kassel und Spirit-Animal von SkylineTV LIVE:
// tiefblaue Schuppen mit weißen Schuppen dazwischen, große runde Fischaugen,
// nach oben gezogener Mund und eine goldene, offene Lilienkrone mit sechs Zacken.
import * as THREE from 'three';
import { curve } from '../curve.js';
import { mulberry32 } from '../util.js';

let scaleTex = null;
function scalesTexture() {
  if (scaleTex) return scaleTex;
  const S = 512;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#123a8e';
  ctx.fillRect(0, 0, S, S);
  const rnd = mulberry32(1887);
  const r = 22;
  for (let row = 0; row < S / (r * 0.8) + 2; row++) {
    for (let col = 0; col < S / (r * 1.6) + 2; col++) {
      const x = col * r * 1.6 + (row % 2) * r * 0.8;
      const y = row * r * 0.8;
      const white = rnd() < 0.16;
      const g = ctx.createRadialGradient(x, y - r * 0.3, 2, x, y, r);
      if (white) {
        g.addColorStop(0, '#ffffff');
        g.addColorStop(1, '#cfd8e6');
      } else {
        const l = 0.85 + rnd() * 0.3;
        g.addColorStop(0, `rgb(${40 * l},${95 * l},${200 * l})`);
        g.addColorStop(1, `rgb(${14 * l},${46 * l},${130 * l})`);
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'rgba(5,20,60,0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0.1, Math.PI - 0.1);
      ctx.stroke();
    }
  }
  scaleTex = new THREE.CanvasTexture(c);
  scaleTex.colorSpace = THREE.SRGBColorSpace;
  scaleTex.wrapS = scaleTex.wrapT = THREE.RepeatWrapping;
  scaleTex.repeat.set(2, 1);
  return scaleTex;
}

/** Elsa, Höhe ≈ 1 Einheit, schaut nach +z. */
export function buildElsa({ curved = true } = {}) {
  const k = (m) => (curved ? curve(m) : m);
  const g = new THREE.Group();
  g.name = 'Elsa';
  const bodyMat = k(new THREE.MeshStandardMaterial({ map: scalesTexture(), roughness: 0.45, metalness: 0.15 }));
  const finMat = k(new THREE.MeshStandardMaterial({ color: 0x1d4fb0, roughness: 0.5, side: THREE.DoubleSide }));
  const white = k(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 }));
  const black = k(new THREE.MeshStandardMaterial({ color: 0x0b0b10, roughness: 0.2 }));
  const gold = k(new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: 0.9, roughness: 0.25, emissive: 0x3a2800, emissiveIntensity: 0.3 }));
  const lip = k(new THREE.MeshStandardMaterial({ color: 0xd8344a, roughness: 0.4 }));
  const belly = k(new THREE.MeshStandardMaterial({ color: 0xe9eef6, roughness: 0.5 }));

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 24), bodyMat);
  body.scale.set(1.0, 1.45, 0.8);
  body.position.y = 0.48;
  g.add(body);
  const bellyM = new THREE.Mesh(new THREE.SphereGeometry(0.29, 24, 18, -0.9, 1.8, 0.9, 1.6), belly);
  bellyM.scale.set(1.0, 1.42, 0.82);
  bellyM.position.y = 0.46;
  bellyM.position.z = 0.012;
  g.add(bellyM);

  // Schwanzflosse als „Füße“
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0, 0.12);
  tailShape.quadraticCurveTo(-0.12, 0.02, -0.26, -0.08);
  tailShape.quadraticCurveTo(-0.12, -0.03, 0, -0.04);
  tailShape.quadraticCurveTo(0.12, -0.03, 0.26, -0.08);
  tailShape.quadraticCurveTo(0.12, 0.02, 0, 0.12);
  const tail = new THREE.Mesh(new THREE.ExtrudeGeometry(tailShape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 }), finMat);
  tail.position.set(0, 0.08, -0.03);
  g.add(tail);

  // Seitenflossen (winken gerne)
  const finGeo = new THREE.SphereGeometry(0.09, 14, 10);
  finGeo.scale(0.35, 1, 0.7);
  const finL = new THREE.Mesh(finGeo, finMat);
  const finR = new THREE.Mesh(finGeo, finMat);
  finL.position.set(-0.3, 0.42, 0.02);
  finR.position.set(0.3, 0.42, 0.02);
  finL.rotation.z = 0.7;
  finR.rotation.z = -0.7;
  g.add(finL, finR);
  // Rückenflosse
  const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 3), finMat);
  dorsal.scale.set(0.3, 1, 1.4);
  dorsal.position.set(0, 0.62, -0.23);
  dorsal.rotation.x = -0.6;
  g.add(dorsal);

  // Große runde Fischaugen
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 14), white);
    eye.position.set(s * 0.13, 0.7, 0.17);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), black);
    pupil.position.set(s * 0.145, 0.7, 0.24);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), white);
    glint.position.set(s * 0.13 + 0.02, 0.72, 0.28);
    g.add(eye, pupil, glint);
  }
  // Lächelnder Mund (Mundwinkel nach oben)
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.016, 8, 20, Math.PI), lip);
  mouth.rotation.z = Math.PI;
  mouth.position.set(0, 0.56, 0.235);
  g.add(mouth);

  // Goldene, offene Lilienkrone mit sechs Zacken
  const crown = new THREE.Group();
  crown.position.y = 0.9;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.14, 0.07, 24, 1, true), gold);
  crown.add(band);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const spike = new THREE.Group();
    spike.position.set(Math.sin(a) * 0.145, 0.035, Math.cos(a) * 0.145);
    spike.rotation.y = a;
    const petalC = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.12, 6), gold);
    petalC.position.y = 0.06;
    const petalL = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.08, 5), gold);
    petalL.position.set(-0.03, 0.04, 0);
    petalL.rotation.z = 0.6;
    const petalR = petalL.clone();
    petalR.position.x = 0.03;
    petalR.rotation.z = -0.6;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), gold);
    ball.position.y = 0.125;
    spike.add(petalC, petalL, petalR, ball);
    crown.add(spike);
  }
  g.add(crown);

  g.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  g.userData = { finL, finR, crown, body };
  return g;
}

/** Kleine Animation: Flossen winken, Körper wippt. */
export function animateElsa(elsa, t, wobble = 0) {
  const u = elsa.userData;
  u.finL.rotation.z = 0.7 + Math.sin(t * 6) * 0.35;
  u.finR.rotation.z = -0.7 - Math.sin(t * 6 + 1) * 0.2;
  elsa.rotation.z = Math.sin(t * 2.2) * 0.04 + wobble;
}
