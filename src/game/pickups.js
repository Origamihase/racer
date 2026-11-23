// Koriander auf der Fahrbahn (nein!). Akku und Bananensaft gibt es im Ladepark (Akku.tickCharge).
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
 * Weicher Schein hinter dem Koriander. Läuft nach unten früher aus als nach oben: die Fläche steht
 * senkrecht und reicht unter die Fahrbahn, ein runder Schein würde dort mit harter Kante abgeschnitten.
 * Die Fahrbahn liegt etwa 14 % über der Unterkante der Fläche.
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

export class Pickups {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.name = 'Pickups';
    scene.add(this.group);
    this.items = [];
    this.pool = [];
    const glow = glowTexture();
    // Der Schein liegt in derselben Ebene wie das Teil davor: ein paar Tiefenstufen nach hinten geschoben,
    // damit er das Teil nie (je nach Rundung mal ja, mal nein) überstrahlt – sonst flimmert es und zeigt Streifen
    const BEHIND = { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 4 };
    this.mats = {
      koriander: W.basic({ map: corianderTexture(), transparent: true, alphaTest: 0.05, side: THREE.DoubleSide }),
      glow: W.basic({ ...BEHIND, map: glow, color: 0xff6040, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.35 }),
    };
    this.plane = new THREE.PlaneGeometry(1, 1);
  }

  make() {
    const g = new THREE.Group();
    const k = new THREE.Mesh(this.plane, this.mats.koriander);
    k.scale.setScalar(1.35);
    k.position.y = 0.85;
    const glow = new THREE.Mesh(this.plane, this.mats.glow);
    glow.scale.setScalar(2.4);
    glow.position.y = 0.85;
    g.add(glow, k);
    g.userData.face = [k, glow];
    this.group.add(g);
    return g;
  }

  spawn(s, lane) {
    let obj = this.pool.find((o) => !o.userData.inUse);
    if (!obj) {
      obj = this.make();
      this.pool.push(obj);
    }
    obj.userData.inUse = true;
    obj.visible = true;
    obj.scale.setScalar(1);
    const it = { s, x: ROAD.laneCenter(lane), lane, obj, taken: false, fade: 0, ahead: 0, phase: Math.random() * 6 };
    this.items.push(it);
    return it;
  }

  /** Koriander in einer Spur mit wenig Verkehr auslegen (nur, wo die Autobahn dort noch offene Fahrbahn hat). */
  spawnAhead(sPlayer, traffic, dist = 650) {
    const s = sPlayer + dist + rand(0, 120);
    const lanes = [0, 1, 2, 3].filter((l) => traffic.laneOpen(l, s) && traffic.laneFree(l, s, 26));
    if (!lanes.length) return null;
    return this.spawn(s, pick(lanes));
  }

  reset() {
    for (const it of this.items) {
      it.obj.visible = false;
      it.obj.userData.inUse = false;
    }
    this.items = [];
  }

  /** Die Teile liegen auf einer Autobahn mit Scherung {a, b} (world/xxl): nach update() seitlich verschieben. */
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
