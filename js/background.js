/* Workshop atmosphere on a 2D layer above the 3D world:
   - a few drifting embers and a ribbon of light that trails the cursor
   - welding sparks on every click: a white-hot flash, a shock ring, and a shower of sparks
     that streak, cool from white to the theme colour, fall under gravity, bounce and split
   - a targeting reticle that follows the cursor
   All of it is switched off for reduced-motion visitors. */
(function () {
  "use strict";
  var c = document.getElementById("fx");
  if (!c) return;
  var x = c.getContext("2d"), W, H, dpr = Math.min(window.devicePixelRatio || 1, 1.5), dirty = true;
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var embers = [], sparks = [], trail = [], blasts = [], running = true;

  /* colours come from the current colour version */
  var css = getComputedStyle(document.documentElement);
  function rgb(name, fallback) {
    var p = (css.getPropertyValue(name) || fallback).split(",").map(function (n) { return parseFloat(n); });
    return p.length === 3 && !isNaN(p[0]) ? p : fallback.split(",").map(Number);
  }
  var TINT = rgb("--gold-rgb", "230,191,122"), DEEP = rgb("--red-rgb", "200,20,30");
  var crimson = !document.documentElement.getAttribute("data-theme");
  var MID = crimson ? [255, 190, 70] : TINT;        /* real sparks glow yellow-orange; other themes use their own light */
  var tint = TINT.join(",");

  /* heat 1 = white hot, 0.5 = mid colour, 0 = deep colour */
  function heat(h) {
    var a, b, k;
    if (h > 0.5) { a = MID; b = [255, 255, 255]; k = (h - 0.5) * 2; } else { a = DEEP; b = MID; k = h * 2; }
    return Math.round(a[0] + (b[0] - a[0]) * k) + "," + Math.round(a[1] + (b[1] - a[1]) * k) + "," + Math.round(a[2] + (b[2] - a[2]) * k);
  }

  function size() {
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function ember(anywhere) {
    return { x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10, r: 0.5 + Math.random() * 1.7,
      v: 0.12 + Math.random() * 0.5, d: Math.random() * 6.28, a: 0.15 + Math.random() * 0.5 };
  }
  size();
  addEventListener("resize", size);
  /* with the 3D world running its dust does this job, so this layer stays idle until there is a click or cursor trail */
  var count = document.documentElement.classList.contains("gl") ? 0 : Math.min(50, Math.round(innerWidth / 22));
  for (var i = 0; i < count; i++) embers.push(ember(true));

  function spark(px, py, speed, angle, life, w, heavy) {
    return { x: px, y: py, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: life, max: life, w: w, heavy: heavy, split: heavy ? 1 : 0 };
  }

  function burst(px, py) {
    blasts.push({ x: px, y: py, t: 0 });
    var n = 90, lean = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;      /* the shower leans one way, like a real grind */
    for (var i = 0; i < n; i++) {
      var focused = Math.random() < 0.6;
      var a = focused ? lean + (Math.random() - 0.5) * 1.5 : Math.random() * 6.283;
      var v = Math.pow(Math.random(), 2.2) * 19 + 2.5;                 /* most are slow, a few fly far */
      var heavy = Math.random() < 0.22;
      sparks.push(spark(px, py, v, a, 26 + Math.random() * (heavy ? 80 : 46), heavy ? 2.3 : 0.7 + Math.random() * 1.1, heavy));
    }
    if (sparks.length > 900) sparks.splice(0, sparks.length - 900);
  }

  function draw() {
    /* nothing to show: clear once, then do no work at all until something happens */
    if (!embers.length && !sparks.length && !trail.length && !blasts.length) {
      if (dirty) { x.clearRect(0, 0, W, H); dirty = false; }
      if (running && !calm) requestAnimationFrame(draw);
      return;
    }
    dirty = true;
    x.globalCompositeOperation = "source-over";
    x.clearRect(0, 0, W, H);
    for (var i = 0; i < embers.length; i++) {
      var e = embers[i];
      if (!calm) { e.y -= e.v; e.d += 0.012; e.x += Math.sin(e.d) * 0.3; if (e.y < -10) embers[i] = ember(false); }
      x.fillStyle = "rgba(" + tint + "," + e.a + ")";
      x.beginPath(); x.arc(e.x, e.y, e.r, 0, 6.28); x.fill();
    }
    x.globalCompositeOperation = "lighter";
    x.lineCap = "round";

    /* ribbon of light behind the cursor */
    for (var q = 0; q < trail.length; q++) trail[q].l -= 0.04;
    while (trail.length && trail[0].l <= 0) trail.shift();
    for (q = 1; q < trail.length; q++) {
      x.strokeStyle = "rgba(" + tint + "," + (trail[q].l * 0.55).toFixed(3) + ")";
      x.lineWidth = trail[q].l * 2.6;
      x.beginPath(); x.moveTo(trail[q - 1].x, trail[q - 1].y); x.lineTo(trail[q].x, trail[q].y); x.stroke();
    }

    /* flash and shock ring at each click */
    for (var b = blasts.length - 1; b >= 0; b--) {
      var B = blasts[b]; B.t++;
      var f = 1 - B.t / 16;
      if (f > 0) {
        var R = 26 + B.t * 9, g = x.createRadialGradient(B.x, B.y, 0, B.x, B.y, R);
        g.addColorStop(0, "rgba(255,255,255," + (0.95 * f).toFixed(3) + ")");
        g.addColorStop(0.25, "rgba(" + heat(0.6) + "," + (0.6 * f).toFixed(3) + ")");
        g.addColorStop(1, "rgba(" + heat(0.1) + ",0)");
        x.fillStyle = g; x.beginPath(); x.arc(B.x, B.y, R, 0, 6.283); x.fill();
      }
      var rf = 1 - B.t / 30;
      if (rf > 0) {
        x.strokeStyle = "rgba(" + heat(0.7) + "," + (0.7 * rf * rf).toFixed(3) + ")";
        x.lineWidth = 2.5 * rf;
        x.beginPath(); x.arc(B.x, B.y, 8 + B.t * 5.5, 0, 6.283); x.stroke();
      } else blasts.splice(b, 1);
    }

    /* the sparks themselves */
    for (var k = sparks.length - 1; k >= 0; k--) {
      var s = sparks[k], px = s.x, py = s.y;
      s.vx *= 0.985; s.vy = s.vy * 0.985 + 0.3;
      s.x += s.vx; s.y += s.vy; s.life--;
      if (s.y > H - 2 && s.vy > 0) {                 /* hit the floor: bounce, lose energy, maybe split */
        s.y = H - 2; s.vy *= -(0.25 + Math.random() * 0.25); s.vx *= 0.7;
        if (s.split) {
          s.split = 0;
          for (var n = 0; n < 3; n++) sparks.push(spark(s.x, s.y, 2 + Math.random() * 5, -Math.PI / 2 + (Math.random() - 0.5) * 2.2, 14 + Math.random() * 18, 0.8, false));
        }
      }
      if (s.heavy && s.split && Math.random() < 0.012) {   /* a heavy spark bursts in mid-air */
        s.split = 0;
        for (var m = 0; m < 5; m++) sparks.push(spark(s.x, s.y, 1.5 + Math.random() * 4, Math.random() * 6.283, 10 + Math.random() * 14, 0.7, false));
      }
      var h = s.life / s.max, col = heat(Math.min(1, h * 1.25));
      x.strokeStyle = "rgba(" + col + "," + Math.min(1, h * 2.2).toFixed(3) + ")";
      x.lineWidth = s.w * (0.4 + h * 0.8);
      x.beginPath(); x.moveTo(px - s.vx * 0.9, py - s.vy * 0.9); x.lineTo(s.x, s.y); x.stroke();
      if (s.heavy) {                                 /* glowing head on the big ones */
        x.fillStyle = "rgba(" + col + "," + (0.35 * h).toFixed(3) + ")";
        x.beginPath(); x.arc(s.x, s.y, 4.5 * h + 1, 0, 6.283); x.fill();
      }
      if (s.life <= 0) sparks.splice(k, 1);
    }
    if (running && !calm) requestAnimationFrame(draw);
  }
  draw();
  if (calm) return;

  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(draw);
  });

  addEventListener("pointermove", function (e) {
    if (e.pointerType === "mouse") { trail.push({ x: e.clientX, y: e.clientY, l: 1 }); if (trail.length > 60) trail.shift(); }
  });
  addEventListener("pointerdown", function (e) { burst(e.clientX, e.clientY); });

  /* targeting reticle, mouse devices only */
  var ret = document.getElementById("reticle");
  if (ret && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var tx = -100, ty = -100, rx = -100, ry = -100;
    addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      ret.classList.add("live");
      ret.classList.toggle("lock", !!e.target.closest("a, button, .node"));
    });
    (function follow() {
      rx += (tx - rx) * 0.22; ry += (ty - ry) * 0.22;
      ret.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)";
      requestAnimationFrame(follow);
    })();
  }
})();
