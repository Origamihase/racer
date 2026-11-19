// Legt zwischengespeicherte Kartenausschnitte (2D-Leinwand, nordausgerichtet) mit WebGL schräg aufs Bild: genau
// perspektivisch und mit Mipmaps, damit dünne Linien in der Ferne nicht flimmern. Ein Dreieck über das ganze Bild, je
// Bildpunkt rückwärts: Bild → Boden (Persp) → Ausschnitt. Zwei Ausschnitte: 0 = der vordere im Maßstab der Ansicht,
// 1 = die Reserve im gröberen Maßstab, auf den die Ansicht hinauszoomt (sie deckt, wo der vordere endet; an seinem
// Rand blenden beide weich über). Oben geht der Boden in Dunst über.
// Ohne WebGL (oder nach Kontextverlust) liefert create() null bzw. draw() null; das Navi zeichnet dann flach.

const VS = `attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
const FS = `precision highp float;
uniform sampler2D T0;
uniform sampler2D T1;
uniform vec4 C;   // ox, oy, cos(tilt), sin(tilt)/F
uniform vec4 V;   // Bildhöhe, Bildpunkte je Einheit der Rechnung, Dunst ganz bis y, Dunst frei ab y
uniform vec4 P;   // Auto in Ausschnitt 0 (xy) und 1 (zw), in dessen Bildpunkten
uniform vec4 A0;  // Ausschnitt 0 je Bezugs-Bildpunkt gx (xy) und gz (zw)
uniform vec4 A1;  // dasselbe für Ausschnitt 1
uniform vec4 TS;  // Größe der Ausschnitte 0 (xy) und 1 (zw)
uniform vec2 ON;  // Ausschnitt 0 / 1 vorhanden (1) oder nicht (0)
uniform vec3 FOG;
// 1 innen, 0 am Rand: weich über 12 Bildpunkte des Ausschnitts
float inside(vec2 q, vec2 ts) {
  vec2 d = min(q, 1.0 - q) * ts;
  return clamp((min(d.x, d.y) - 2.0) / 12.0, 0.0, 1.0);
}
void main() {
  vec2 sp = vec2(gl_FragCoord.x, V.x - gl_FragCoord.y) / V.y;
  float u = C.y - sp.y;
  float den = C.z - u * C.w;
  // über dem Horizont und im vollen Dunst nur Dunst (ohne frühes Ende: die Mipmap-Stufe braucht die Nachbarn)
  float vis = den > 0.0001 ? smoothstep(V.z, V.w, sp.y) : 0.0;
  den = max(den, 0.0001);
  float gz = u / den;
  float gx = (sp.x - C.x) * C.z / den;
  vec2 q0 = (P.xy + A0.xy * gx + A0.zw * gz) / TS.xy;
  vec2 q1 = (P.zw + A1.xy * gx + A1.zw * gz) / TS.zw;
  vec3 c0 = texture2D(T0, q0).rgb;
  vec3 c1 = texture2D(T1, q1).rgb;
  vec3 c = mix(FOG, c1, inside(q1, TS.zw) * ON.y);
  c = mix(c, c0, inside(q0, TS.xy) * ON.x);
  gl_FragColor = vec4(mix(FOG, c, vis), 1.0);
}`;

export class Warp {
  /** Neue Zeichenfläche w × h (Bildpunkte) mit WebGL, oder null. */
  static create(w, h) {
    if (typeof document === 'undefined' && typeof OffscreenCanvas === 'undefined') return null;
    try {
      const cv = typeof document !== 'undefined' ? document.createElement('canvas') : new OffscreenCanvas(w, h);
      const opt = { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false };
      const gl2 = cv.getContext('webgl2', opt);
      const gl = gl2 || cv.getContext('webgl', opt);
      if (!gl) return null;
      const W = new Warp(cv, gl, !!gl2);
      W.resize(w, h);
      return W.ok ? W : null;
    } catch (e) {
      return null;
    }
  }
  constructor(canvas, gl, gl2) {
    this.canvas = canvas;
    this.gl = gl;
    this.gl2 = gl2;
    this.ok = false;
    this.tex = [null, null];
    this.size = [0, 0]; // Größe je Ausschnitt (0 = leer)
    this.lost = false;
    if (canvas.addEventListener) {
      canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        this.lost = true;
      });
      canvas.addEventListener('webglcontextrestored', () => {
        this.lost = false;
        this.init();
      });
    }
    this.init();
  }
  init() {
    const gl = this.gl;
    this.ok = false;
    this.tex = [null, null];
    this.size = [0, 0];
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = sh(gl.VERTEX_SHADER, VS);
    const fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const pr = gl.createProgram();
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {};
    for (const n of ['T0', 'T1', 'C', 'V', 'P', 'A0', 'A1', 'TS', 'ON', 'FOG']) this.u[n] = gl.getUniformLocation(pr, n);
    for (let i = 0; i < 2; i++) {
      gl.uniform1i(this.u['T' + i], i);
      gl.activeTexture(gl.TEXTURE0 + i);
      const t = (this.tex[i] = gl.createTexture());
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      // 1 × 1 Platzhalter, damit ein leerer Ausschnitt gültig bleibt (er wird mit ON = 0 nicht gezeigt)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    }
    this.ok = !gl.isContextLost();
  }
  resize(w, h) {
    if (this.canvas.width !== w) this.canvas.width = w;
    if (this.canvas.height !== h) this.canvas.height = h;
  }
  get ready() {
    return this.ok && !this.lost && !this.gl.isContextLost();
  }
  /** Ausschnitt i (0 vorn, 1 Reserve) aus einer quadratischen Leinwand, mit Mipmaps wo möglich. */
  upload(i, src) {
    if (!this.ready) return false;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, this.tex[i]);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    this.size[i] = src.width;
    const pot = (n) => (n & (n - 1)) === 0;
    if (this.gl2 || pot(src.width)) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    } else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    return true;
  }
  /**
   * Zeichnet: cam (Persp, in Einheiten der Rechnung), ps = Bildpunkte je Einheit, L = [vorn, Reserve], je null oder
   * {p0: Auto im Ausschnitt, a, b: Ausschnitt-Bildpunkte je gx bzw. gz}; fog = [r, g, b] (0…1), fogY = [ganz, frei]
   * (Bild-y). Liefert die Leinwand oder null.
   */
  draw(cam, ps, L, fog, fogY) {
    if (!this.ready) return null;
    const on = L.map((l, i) => (l && this.size[i] ? 1 : 0));
    if (!on[0] && !on[1]) return null;
    const gl = this.gl;
    const cv = this.canvas;
    const z = { p0: [0, 0], a: [0, 0], b: [0, 0] };
    const [l0, l1] = L.map((l, i) => (on[i] ? l : z));
    gl.viewport(0, 0, cv.width, cv.height);
    gl.uniform4f(this.u.C, cam.ox, cam.oy, cam.c, cam.k);
    gl.uniform4f(this.u.V, cv.height, ps, fogY[0], fogY[1]);
    gl.uniform4f(this.u.P, l0.p0[0], l0.p0[1], l1.p0[0], l1.p0[1]);
    gl.uniform4f(this.u.A0, l0.a[0], l0.a[1], l0.b[0], l0.b[1]);
    gl.uniform4f(this.u.A1, l1.a[0], l1.a[1], l1.b[0], l1.b[1]);
    gl.uniform4f(this.u.TS, this.size[0] || 1, this.size[0] || 1, this.size[1] || 1, this.size[1] || 1);
    gl.uniform2f(this.u.ON, on[0], on[1]);
    gl.uniform3f(this.u.FOG, fog[0], fog[1], fog[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return cv;
  }
}
