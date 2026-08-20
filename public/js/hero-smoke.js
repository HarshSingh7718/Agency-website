/* ============================================================
   GAP3 — hero-smoke.js
   Lightweight WebGL flowing-smoke shader for the hero background.
   Domain-warped noise in the brand greens; the flow warps toward
   the cursor. Self-contained, no dependencies.
   Degrades gracefully: if WebGL/JS is unavailable or reduced-motion
   is requested, the canvas stays empty and the CSS gradient shows.
   ============================================================ */
(function () {
  "use strict";
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var VERT = "attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos,0.0,1.0); }";
    var FRAG = [
      "precision highp float;",
      "uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse; uniform float u_mstr;",
      "float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }",
      "float noise(vec2 p){ vec2 i=floor(p), f=fract(p);",
      "  float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));",
      "  vec2 u=f*f*(3.0-2.0*f); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }",
      "float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.0+vec2(37.0,17.0); a*=0.5; } return v; }",
      "void main(){",
      "  vec2 uv = gl_FragCoord.xy / u_res.xy;",
      "  float aspect = u_res.x / u_res.y;",
      "  vec2 p = vec2(uv.x*aspect, uv.y);",
      "  vec2 m = vec2(u_mouse.x*aspect, 1.0 - u_mouse.y);",
      "  float t = u_time * 0.026;",
      "  vec2 toM = p - m; float dm = length(toM);",
      "  vec2 flow = normalize(toM + 1e-4) * exp(-dm*3.2) * u_mstr * 0.22;",
      "  vec2 q = vec2( fbm(p*2.1 + vec2(0.0,t)), fbm(p*2.1 + vec2(5.2,-t)) );",
      "  vec2 r = vec2( fbm(p*2.1 + 2.3*q + flow + vec2(1.7,9.2) + t*0.4),",
      "                 fbm(p*2.1 + 2.3*q - flow + vec2(8.3,2.8) - t*0.3) );",
      "  float d = fbm(p*2.1 + 2.3*r + flow*1.4);",
      "  float dens = smoothstep(0.12, 0.78, d) + exp(-dm*3.0)*u_mstr*0.20;",
      "  dens = clamp(dens, 0.0, 1.0);",
      "  vec3 lime = vec3(0.102,0.816,0.043);",   
      "  vec3 mid  = vec3(0.275,0.886,0.208);",   
      "  vec3 col = mix(mid, lime, smoothstep(0.4,1.0,d));",
      "  gl_FragColor = vec4(col, dens * 0.55);",
      "}"
    ].join("\n");

    document.querySelectorAll(".hero-smoke").forEach(function (canvas) {
      var hero = canvas.closest(".hero"); if (!hero) return;
      var gl;
      try { gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, depth: false }); }
      catch (e) { gl = null; }
      if (!gl) { canvas.style.display = "none"; return; }

      function sh(type, src) {
        var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { return null; } return s;
      }
      var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) { canvas.style.display = "none"; return; }
      var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = "none"; return; }
      gl.useProgram(prog);

      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
      var aPos = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      var uRes = gl.getUniformLocation(prog, "u_res"),
          uTime = gl.getUniformLocation(prog, "u_time"),
          uMouse = gl.getUniformLocation(prog, "u_mouse"),
          uMstr = gl.getUniformLocation(prog, "u_mstr");
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      var SCALE = 0.72, PX = Math.min(window.devicePixelRatio || 1, 1.25);
      var W = 1, H = 1;
      function resize() {
        var r = hero.getBoundingClientRect();
        W = Math.max(1, Math.round(r.width * PX * SCALE));
        H = Math.max(1, Math.round(r.height * PX * SCALE));
        canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H);
      }
      resize(); window.addEventListener("resize", resize, { passive: true });

      var mouse = { x: 0.6, y: 0.4 }, target = { x: 0.6, y: 0.4 }, mstr = 0;
      window.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        if (x < -0.1 || y < -0.1 || x > 1.1 || y > 1.1) return;
        target.x = x; target.y = y; mstr = Math.min(1, mstr + 0.13);
      }, { passive: true });

      var start = performance.now(), raf = null, visible = true;
      function frame(now) {
        if (!visible) { raf = null; return; }
        mouse.x += (target.x - mouse.x) * 0.045;
        mouse.y += (target.y - mouse.y) * 0.045;
        mstr *= 0.97;
        gl.uniform2f(uRes, W, H);
        gl.uniform1f(uTime, (now - start) / 1000);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uMstr, mstr);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(frame);
      }
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (en) { visible = en.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); });
        }, { threshold: 0 }).observe(hero);
      }
      raf = requestAnimationFrame(frame);
    });
  });
})();
