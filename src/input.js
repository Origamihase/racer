// Eingabe: Tastatur (Pfeile/WASD), Gamepad und Touch-Knöpfe.
export class Input {
  constructor() {
    this.keys = new Set();
    this.pressed = new Set();
    this.touch = { left: false, right: false, gas: false, brake: false };
    this.steer = 0;
    this.throttle = 0;
    this.brake = 0;
    this.anyKey = false;
    // bis zur ersten Eingabe: Handy und Tablet spielen mit den Touch-Knöpfen
    this.lastDevice = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches ? 'touch' : 'keyboard';
    const map = {
      ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'gas', KeyW: 'gas',
      ArrowDown: 'brake', KeyS: 'brake', Space: 'horn', KeyE: 'wiper', KeyH: 'megafon', Escape: 'pause', KeyP: 'pause',
      KeyV: 'camera', KeyM: 'mute', Enter: 'confirm', KeyC: 'chat',
    };
    this.map = map;
    window.addEventListener('keydown', (e) => {
      const a = map[e.code];
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      this.anyKey = true;
      this.lastDevice = 'keyboard';
      if (a) {
        if (!this.keys.has(a)) this.pressed.add(a);
        this.keys.add(a);
        // Fahrtasten nicht scrollen lassen, aber Leertaste/Pfeile auf Menü-Knöpfen dem Browser überlassen
        const onButton = e.target && e.target.tagName === 'BUTTON' && e.target.offsetParent !== null;
        if (['left', 'right', 'gas', 'brake', 'horn'].includes(a) && !onButton) e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      const a = map[e.code];
      if (a) this.keys.delete(a);
    });
    window.addEventListener('blur', () => this.keys.clear());
    this.padPrev = {};
  }

  bindTouch(el, action) {
    const on = (e) => {
      e.preventDefault();
      this.lastDevice = 'touch';
      if (action in this.touch) this.touch[action] = true;
      else this.pressed.add(action);
    };
    const off = (e) => {
      e.preventDefault();
      if (action in this.touch) this.touch[action] = false;
    };
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerup', off);
    el.addEventListener('pointercancel', off);
    el.addEventListener('pointerleave', off);
  }

  poll() {
    let steer = 0;
    let gas = 0;
    let brake = 0;
    if (this.keys.has('left') || this.touch.left) steer -= 1;
    if (this.keys.has('right') || this.touch.right) steer += 1;
    if (this.keys.has('gas') || this.touch.gas) gas = 1;
    if (this.keys.has('brake') || this.touch.brake) brake = 1;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p) continue;
      const ax = p.axes[0] || 0;
      if (Math.abs(ax) > 0.15) {
        steer = ax;
        this.lastDevice = 'gamepad';
      }
      const rt = p.buttons[7]?.value || 0;
      const lt = p.buttons[6]?.value || 0;
      if (rt > 0.05) gas = Math.max(gas, rt);
      if (lt > 0.05) brake = Math.max(brake, lt);
      if (p.buttons[12]?.pressed) gas = 1;
      if (p.buttons[13]?.pressed) brake = 1;
      const btn = (i, action) => {
        // pro Gamepad merken, sonst löst ein zweites Pad den Knopf in jedem Bild neu aus
        const key = p.index + ':' + i;
        const down = !!p.buttons[i]?.pressed;
        if (down && !this.padPrev[key]) {
          this.pressed.add(action);
          this.anyKey = true;
        }
        this.padPrev[key] = down;
      };
      btn(0, 'horn');
      btn(2, 'wiper');
      btn(3, 'megafon');
      btn(9, 'pause');
      btn(1, 'camera');
    }
    this.steer = Math.max(-1, Math.min(1, steer));
    this.throttle = gas;
    this.brake = brake;
  }

  /** Wurde die Aktion seit dem letzten Bild gedrückt? */
  take(action) {
    if (this.pressed.has(action)) {
      this.pressed.delete(action);
      return true;
    }
    return false;
  }

  endFrame() {
    this.pressed.clear();
    this.anyKey = false;
  }
}
