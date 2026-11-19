// Dinge auf der Fahrbahn: Lade-Ringe (Akku), Bananensaft (ja!) und Koriander (nein!).
import * as THREE from 'three';
import { W, curveAt, curvePoint } from '../curve.js';
import { ROAD, roundRect } from '../textures.js';
import { rand, pick, lerp, smoothstep } from '../util.js';

// Eingesammelt: so lange hüpft das Teil vor der Motorhaube hoch und schrumpft weg
const TAKE_TIME = 0.4;
const FRAME = { x: 0, z: 0, th: 0, y: 0, k: 0, dk: 0, xr: 0, g: 0 };
const SPOT = new THREE.Vector3();

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function bottleTexture() {
  return canvasTexture(256, 384, (ctx, w, h) => {
    ctx.translate(w / 2, 0);
    // Flasche
    ctx.beginPath();
    ctx.moveTo(-26, 40);
    ctx.lineTo(26, 40);
    ctx.lineTo(26, 92);
    ctx.quadraticCurveTo(84, 120, 84, 180);
    ctx.lineTo(84, 340);
    ctx.quadraticCurveTo(84, 370, 54, 370);
    ctx.lineTo(-54, 370);
    ctx.quadraticCurveTo(-84, 370, -84, 340);
    ctx.lineTo(-84, 180);
    ctx.quadraticCurveTo(-84, 120, -26, 92);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#3a2a10';
    ctx.stroke();
    // Saft
    ctx.save();
    ctx.clip();
    const g = ctx.createLinearGradient(-84, 0, 84, 0);
    g.addColorStop(0, '#f2c419');
    g.addColorStop(0.5, '#ffe45c');
    g.addColorStop(1, '#e8b30e');
    ctx.fillStyle = g;
    ctx.fillRect(-90, 150, 180, 230);
    ctx.restore();
    // Deckel
    ctx.fillStyle = '#2e7d32';
    roundRect(ctx, -32, 14, 64, 32, 8);
    ctx.fill();
    // Etikett mit Banane
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, -70, 205, 140, 110, 14);
    ctx.fill();
    ctx.strokeStyle = '#3a2a10';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-44, 228);
    ctx.quadraticCurveTo(-30, 292, 46, 270);
    ctx.quadraticCurveTo(-6, 270, -26, 226);
    ctx.closePath();
    ctx.fillStyle = '#ffd21f';
    ctx.fill();
    ctx.strokeStyle = '#6b4a00';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#3a2a10';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BANANENSAFT', 0, 306, 124); // so schmal, dass es im Etikett bleibt
    // Glanz
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    roundRect(ctx, -70, 140, 14, 190, 7);
    ctx.fill();
  });
}

function corianderTexture() {
  return canvasTexture(320, 320, (ctx, w, h) => {
    ctx.translate(w / 2, h / 2 + 30);
    // Stiele
    ctx.strokeStyle = '#4f8a2b';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    const tips = [];
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.32;
      const len = 95 + (i % 3) * 18;
      const x = Math.cos(a) * len;
      const y = Math.sin(a) * len;
      ctx.beginPath();
      ctx.moveTo(0, 110);
      ctx.quadraticCurveTo(x * 0.3, 20, x, y);
      ctx.stroke();
      tips.push([x, y]);
    }
    // gezackte Blätter
    const leaf = (x, y, r, rot) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let k = 0; k <= 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        const rr = r * (k % 2 ? 0.62 : 1);
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.9);
      }
      ctx.closePath();
      ctx.fillStyle = '#3f9b2f';
      ctx.fill();
      ctx.strokeStyle = '#215c18';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    };
    tips.forEach(([x, y], i) => {
      leaf(x, y, 34, i);
      leaf(x * 0.7 + 18, y * 0.7, 22, i + 1);
    });
    // Banderole: breit genug für das ganze Wort (es ist gut 120 px breit), maxWidth hält es sicher darin
    ctx.fillStyle = '#c62828';
    roundRect(ctx, -64, 82, 128, 34, 9);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KORIANDER', 0, 106, 114);
  });
}

/**
 * Weicher Schein hinter den Teilen. Läuft nach unten früher aus als nach oben: die Fläche steht
 * senkrecht und reicht unter die Fahrbahn, ein runder Schein würde dort mit harter Kante abgeschnitten.
 * Bei allen drei Teilen liegt die Fahrbahn etwa 14 % über der Unterkante der Fläche.
 */
function glowTexture() {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(S, S);
  const smooth = (a, b, v) => {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  for (let y = 0; y < S; y++) {
    // v: 0 an der Unterkante, 1 oben (Canvas-Zeile 0 ist oben)
    const v = 1 - (y + 0.5) / S;
    const fade = smooth(0.2, 0.45, v);
    for (let x = 0; x < S; x++) {
      const r = Math.hypot((x + 0.5) / S - 0.5, v - 0.5) * 2;
      // wie softDotTexture: 1 in der Mitte, 0,4 auf halbem Weg, 0 am Rand
      const base = r < 0.5 ? 1 - 1.2 * r : Math.max(0, 0.4 * (1 - (r - 0.5) / 0.5));
      const k = (y * S + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 255;
      img.data[k + 3] = Math.round(255 * base * fade);
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function boltTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    ctx.translate(w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(18, -110);
    ctx.lineTo(-62, 14);
    ctx.lineTo(-8, 14);
    ctx.lineTo(-24, 110);
    ctx.lineTo(62, -22);
    ctx.lineTo(8, -22);
    ctx.closePath();
    ctx.fillStyle = '#eaffef';
    ctx.shadowColor = '#4dff9a';
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1faa5a';
    ctx.stroke();
  });
}

export const PICKUP_TYPES = ['charge', 'banana', 'koriander'];

export class Pickups {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.name = 'Pickups';
    scene.add(this.group);
    this.items = [];
    this.pool = { charge: [], banana: [], koriander: [] };
    const glow = glowTexture();
    // Der Schein liegt in derselben Ebene wie das Teil davor: ein paar Tiefenstufen nach hinten geschoben,
    // damit er das Teil nie (je nach Rundung mal ja, mal nein) überstrahlt – sonst flimmert es und zeigt Streifen
    const BEHIND = { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 4 };
    this.mats = {
      ring: W.basic({ color: new THREE.Color(0.25, 2.2, 0.9), toneMapped: true }),
      bolt: W.basic({ map: boltTexture(), transparent: true, depthWrite: false, side: THREE.DoubleSide }),
      bottle: W.basic({ map: bottleTexture(), transparent: true, alphaTest: 0.05, side: THREE.DoubleSide }),
      koriander: W.basic({ map: corianderTexture(), transparent: true, alphaTest: 0.05, side: THREE.DoubleSide }),
      glowG: W.basic({ ...BEHIND, map: glow, color: 0x55ff99, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 }),
      glowY: W.basic({ ...BEHIND, map: glow, color: 0xffd34d, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.6 }),
      glowR: W.basic({ ...BEHIND, map: glow, color: 0xff6040, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.35 }),
    };
    this.geo = {
      ring: new THREE.TorusGeometry(0.95, 0.09, 10, 40),
      plane: new THREE.PlaneGeometry(1, 1),
    };
  }

  make(type) {
    const g = new THREE.Group();
    const M = this.mats;
    if (type === 'charge') {
      const ring = new THREE.Mesh(this.geo.ring, M.ring);
      ring.position.y = 1.15;
      const bolt = new THREE.Mesh(this.geo.plane, M.bolt);
      bolt.scale.setScalar(1.1);
      bolt.position.y = 1.15;
      const glow = new THREE.Mesh(this.geo.plane, M.glowG);
      glow.scale.setScalar(3.2);
      glow.position.y = 1.15;
      g.add(glow, ring, bolt);
      g.userData.spin = ring;
      g.userData.face = [bolt, glow];
    } else if (type === 'banana') {
      const b = new THREE.Mesh(this.geo.plane, M.bottle);
      b.scale.set(0.95, 1.42, 1);
      b.position.y = 0.95;
      const glow = new THREE.Mesh(this.geo.plane, M.glowY);
      glow.scale.setScalar(2.6);
      glow.position.y = 0.95;
      g.add(glow, b);
      g.userData.face = [b, glow];
    } else {
      const k = new THREE.Mesh(this.geo.plane, M.koriander);
      k.scale.setScalar(1.35);
      k.position.y = 0.85;
      const glow = new THREE.Mesh(this.geo.plane, M.glowR);
      glow.scale.setScalar(2.4);
      glow.position.y = 0.85;
      g.add(glow, k);
      g.userData.face = [k, glow];
    }
    this.group.add(g);
    return g;
  }

  spawn(type, s, lane) {
    const list = this.pool[type];
    let obj = list.find((o) => !o.userData.inUse);
    if (!obj) {
      obj = this.make(type);
      list.push(obj);
    }
    obj.userData.inUse = true;
    obj.visible = true;
    obj.scale.setScalar(1);
    const it = { type, s, x: ROAD.laneCenter(lane), lane, obj, taken: false, fade: 0, ahead: 0, phase: Math.random() * 6 };
    this.items.push(it);
    return it;
  }

  /** Spur mit wenig Verkehr für ein neues Teil suchen (XXL: nur, wo die Autobahn dort noch offene Fahrbahn hat). */
  spawnAhead(type, sPlayer, traffic, dist = 650) {
    const s = sPlayer + dist + rand(0, 120);
    const lanes = [0, 1, 2, 3].filter((l) => traffic.laneOpen(l, s) && traffic.laneFree(l, s, 26));
    if (!lanes.length) return null;
    return this.spawn(type, s, pick(lanes));
  }

  reset() {
    for (const it of this.items) {
      it.obj.visible = false;
      it.obj.userData.inUse = false;
    }
    this.items = [];
  }

  /** XXL-Welt: die Teile liegen auf einer Autobahn mit Scherung {a, b}; nach update() seitlich verschieben. */
  applyShear(sh, sPlayer) {
    for (const it of this.items) it.obj.position.x += sh.a + sh.b * (it.s - sPlayer);
  }

  /** Gibt eingesammelte Teile zurück. */
  update(dt, t, player, camera, collect = true) {
    const got = [];
    const keep = [];
    for (const it of this.items) {
      if (!it.taken && collect && Math.abs(it.s - player.s) < 2.7 && Math.abs(it.x - player.x) < 1.55) {
        it.taken = true;
        // nie hinter der Stoßstange bleiben (bei hohem Tempo liegt zwischen zwei Bildern gut ein Meter). Was
        // direkt vor dem Auto lag, rückt gleich nach vorne; seitlich neben den Türen eingesammelte Teile gleiten
        // erst nach vorne, statt mit einem Satz vor der Haube zu stehen
        it.from = it.s - player.s;
        it.ahead = Math.max(it.from, 2.5);
        if (Math.abs(it.x - player.x) < 1) it.from = it.ahead;
        got.push(it);
      } else if (it.taken) it.fade += dt;
      if (it.taken) {
        // fährt mit dem Auto mit (bleibt vor der Motorhaube), statt stehen zu bleiben und
        // durch Cockpit bzw. Drohnenkamera zu fliegen
        const k = Math.min(1, it.fade / TAKE_TIME);
        it.s = player.s + lerp(it.from, it.ahead, smoothstep(0, 0.4, k)) + 1.2 * k;
      }
      const rel = it.s - player.s;
      if (rel < -30 || (it.taken && it.fade > TAKE_TIME)) {
        it.obj.visible = false;
        it.obj.userData.inUse = false;
        continue;
      }
      keep.push(it);
      const o = it.obj;
      let x = it.x;
      let y = Math.sin(t * 2.2 + it.phase) * 0.08;
      if (it.taken) {
        // hüpft hoch, rückt zur Wagenmitte und schrumpft dabei weg
        const k = Math.min(1, it.fade / TAKE_TIME);
        x = lerp(it.x, player.x, k);
        y += 1.4 * (1 - (1 - k) * (1 - k));
        o.scale.setScalar(Math.max(0.001, (1 - k) * (1 + 0.25 * Math.sin(k * Math.PI))));
      }
      o.position.set(x, y, -rel);
      if (o.userData.spin) o.userData.spin.rotation.y = t * 1.8 + it.phase;
      // zur Kamera drehen (nur um die Hochachse): Richtung zur Kamera in der gebogenen Welt, abzüglich der
      // Drehung, die die Biegung dem Gegenstand an dieser Stelle ohnehin gibt
      const th = curveAt(rel, FRAME).th;
      curvePoint(SPOT.set(x, y, -rel));
      const yaw = Math.atan2(camera.position.x - SPOT.x, camera.position.z - SPOT.z) - th;
      for (const f of o.userData.face) f.rotation.y = yaw;
    }
    this.items = keep;
    return got;
  }
}
