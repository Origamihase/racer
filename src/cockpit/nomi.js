// OMI – der Boardcomputer. Eine kleine schwarze Kugel auf dem Armaturenbrett mit rundem
// Display und zwei weißen, abgerundeten Augen. Dreht sich beim Sprechen zum Fahrer.
import * as THREE from 'three';
import { damp, clamp } from '../util.js';

const S = 256;

export class Nomi {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'OMI';
    this.canvas = document.createElement('canvas');
    this.canvas.width = S;
    this.canvas.height = S;
    this.ctx = this.canvas.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;

    const R = 0.066;
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.042, 0.03, 24),
      new THREE.MeshStandardMaterial({ color: 0x15161a, metalness: 0.6, roughness: 0.35 }),
    );
    base.position.y = 0.015;
    this.group.add(base);

    this.head = new THREE.Group();
    this.head.position.y = 0.03 + R * 0.92;
    this.group.add(this.head);
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(R, 40, 28),
      new THREE.MeshPhysicalMaterial({ color: 0x07080a, metalness: 0.3, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.6 }),
    );
    this.head.add(orb);

    // Display als Kugelkappe mit planar projizierten UVs
    const a = 0.72;
    const cap = new THREE.SphereGeometry(R * 1.004, 32, 24, Math.PI / 2 - a, 2 * a, Math.PI / 2 - a, 2 * a);
    const pos = cap.attributes.position;
    const uv = cap.attributes.uv;
    const span = R * Math.sin(a) * 2;
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, pos.getX(i) / span + 0.5, pos.getY(i) / span + 0.5);
    }
    // Kappe zeigt nach +z: SphereGeometry-Mitte (phi = π/2) liegt bei +z? → x = -cos(phi) sin(theta), z = sin(phi) sin(theta)
    // transparent: nur das runde Display deckt die Kugel ab (die Ecken der Leinwand bleiben frei)
    this.faceMat = new THREE.MeshBasicMaterial({ map: this.tex, toneMapped: false, transparent: true });
    const face = new THREE.Mesh(cap, this.faceMat);
    this.head.add(face);

    // Leuchtring an der Basis
    this.ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.036, 0.003, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0x66ccff, toneMapped: false, transparent: true, opacity: 0.6 }),
    );
    this.ring.rotation.x = Math.PI / 2;
    this.ring.position.y = 0.031;
    this.group.add(this.ring);

    this.mood = 'idle';
    this.moodTimer = 0;
    this.talk = 0;
    this.talkTimer = 0;
    this.yaw = 0;
    this.targetYaw = 0;
    this.lookX = 0;
    this.lookTarget = 0;
    this.blink = 0;
    this.nextBlink = 2;
    this.idleYaw = -0.06;
    this.bounce = 0;
    this.lastDraw = -1;
    this.draw(0);
  }

  /** Stimmung für eine Weile setzen: idle, happy, talk, surprised, dizzy, love, worried, sleep, think, wink */
  setMood(m, dur = 2.5) {
    this.mood = m;
    this.moodTimer = dur;
    this.bounce = 1;
  }

  /** OMI spricht (dreht sich zum Fahrer, Augen hüpfen). */
  speak(dur = 2.5) {
    this.talkTimer = Math.max(this.talkTimer, dur);
    this.bounce = 1;
  }

  /** Kurz in eine Richtung schauen (-1 links … 1 rechts). */
  glance(dir, dur = 1.5) {
    this.lookTarget = clamp(dir, -1, 1);
    this.glanceTimer = dur;
  }

  update(dt, t, driverYaw) {
    if (this.moodTimer > 0) {
      this.moodTimer -= dt;
      if (this.moodTimer <= 0) this.mood = 'idle';
    }
    if (this.glanceTimer > 0) {
      this.glanceTimer -= dt;
      if (this.glanceTimer <= 0) this.lookTarget = 0;
    }
    this.talkTimer = Math.max(0, this.talkTimer - dt);
    this.talk = damp(this.talk, this.talkTimer > 0 ? 1 : 0, 8, dt);
    this.targetYaw = this.talkTimer > 0 ? driverYaw : this.idleYaw + this.lookTarget * 0.7 + Math.sin(t * 0.37) * 0.06;
    this.yaw = damp(this.yaw, this.targetYaw, 5, dt);
    this.lookX = damp(this.lookX, this.talkTimer > 0 ? 0 : this.lookTarget, 6, dt);
    this.bounce = Math.max(0, this.bounce - dt * 2.2);
    this.head.rotation.y = this.yaw;
    this.head.rotation.x = -0.24 + Math.sin(t * 9) * 0.03 * this.talk - Math.sin(this.bounce * Math.PI) * 0.12;
    this.head.position.y = 0.03 + 0.066 * 0.92 + Math.sin(this.bounce * Math.PI * 2) * 0.006;
    this.ring.material.opacity = 0.35 + 0.4 * this.talk + 0.15 * Math.sin(t * 2);

    // Blinzeln
    this.nextBlink -= dt;
    if (this.nextBlink <= 0) {
      this.blink = 1;
      this.nextBlink = 2.5 + Math.random() * 4;
    }
    this.blink = Math.max(0, this.blink - dt * 7);

    // ~30 fps neu zeichnen
    if (t - this.lastDraw > 1 / 30) {
      this.lastDraw = t;
      this.draw(t);
      this.tex.needsUpdate = true;
    }
  }

  draw(t) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, S, S);
    // rundes Display
    const g = ctx.createRadialGradient(S * 0.42, S * 0.36, 10, S / 2, S / 2, S * 0.5);
    g.addColorStop(0, '#16202a');
    g.addColorStop(0.7, '#06080b');
    g.addColorStop(1, '#030405');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, S * 0.49, 0, Math.PI * 2);
    ctx.fill();

    const mood = this.mood;
    const cx = S / 2 + this.lookX * 34;
    const cy = S / 2 + 4 + Math.sin(t * 10) * 4 * this.talk;
    const dx = 46;
    ctx.save();
    ctx.shadowColor = 'rgba(160,220,255,0.9)';
    ctx.shadowBlur = 14;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const blink = mood === 'idle' || mood === 'talk' ? this.blink : 0;
    for (const s of [-1, 1]) {
      const x = cx + s * dx;
      this.drawEye(ctx, mood, x, cy, s, blink, t);
    }
    ctx.restore();

    // Glanzlicht auf dem Glas
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.ellipse(S * 0.38, S * 0.26, S * 0.22, S * 0.09, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawEye(ctx, mood, x, y, s, blink, t) {
    const w = 38;
    let h = 70;
    switch (mood) {
      case 'happy':
        ctx.beginPath();
        ctx.arc(x, y + 12, 24, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
        return;
      case 'love':
        this.heart(ctx, x, y, 26 + Math.sin(t * 8) * 3);
        return;
      case 'dizzy': {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 5; a += 0.2) {
          const r = 3 + a * 2.6;
          const px = x + Math.cos(a + t * 6 * s) * r;
          const py = y + Math.sin(a + t * 6 * s) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.lineWidth = 7;
        ctx.stroke();
        return;
      }
      case 'surprised':
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        return;
      case 'sleep':
        ctx.beginPath();
        ctx.moveTo(x - 22, y + 6);
        ctx.lineTo(x + 22, y + 6);
        ctx.stroke();
        return;
      case 'worried':
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(s * -0.35);
        roundRectPath(ctx, -w / 2, -h / 2 + 8, w, h - 16, 18);
        ctx.stroke();
        ctx.restore();
        return;
      case 'think':
        if (s < 0) {
          ctx.beginPath();
          ctx.moveTo(x - 20, y);
          ctx.lineTo(x + 20, y);
          ctx.stroke();
        } else {
          roundRectPath(ctx, x - w / 2, y - h / 2, w, h, 18);
          ctx.stroke();
        }
        return;
      case 'wink':
        if (s > 0) {
          ctx.beginPath();
          ctx.arc(x, y + 12, 22, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
          return;
        }
        break;
      default:
        break;
    }
    h = Math.max(8, h * (1 - blink * 0.92));
    roundRectPath(ctx, x - w / 2, y - h / 2, w, h, Math.min(18, h / 2));
    ctx.stroke();
  }

  heart(ctx, x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y + r * 0.9);
    ctx.bezierCurveTo(x - r * 1.4, y - r * 0.1, x - r * 0.6, y - r * 1.1, x, y - r * 0.35);
    ctx.bezierCurveTo(x + r * 0.6, y - r * 1.1, x + r * 1.4, y - r * 0.1, x, y + r * 0.9);
    ctx.fill();
  }
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
