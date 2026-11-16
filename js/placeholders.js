/* Draws things that have no picture yet: placeholder thumbnails and the hero gear set. */
(function () {
  "use strict";

  function seeded(seed) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  /* Outline of a gear. A tooth is centred on angle 0. internal = teeth point inward. */
  function gearPath(teeth, r, m, internal) {
    var p = (2 * Math.PI) / teeth;
    var tip = internal ? r - 0.9 * m : r + 0.9 * m;
    var root = internal ? r + 1.1 * m : r - 1.1 * m;
    var d = "";
    for (var i = 0; i < teeth; i++) {
      var a = i * p;
      var pts = [[root, a - 0.5 * p], [root, a - 0.28 * p], [tip, a - 0.14 * p], [tip, a + 0.14 * p], [root, a + 0.28 * p]];
      for (var k = 0; k < pts.length; k++) {
        d += (d ? "L" : "M") + (pts[k][0] * Math.cos(pts[k][1])).toFixed(1) + " " + (pts[k][0] * Math.sin(pts[k][1])).toFixed(1);
      }
    }
    return d + "Z";
  }

  var shapes = [
    function gear(r) {
      var teeth = 10 + Math.floor(r() * 9), s = "";
      s += '<path d="' + gearPath(teeth, 56, 8) + '"/><circle r="14"/><circle r="30" stroke-dasharray="3 5"/>';
      for (var i = 0; i < 5; i++) {
        var a = (i / 5) * Math.PI * 2;
        s += '<circle cx="' + (30 * Math.cos(a)).toFixed(1) + '" cy="' + (30 * Math.sin(a)).toFixed(1) + '" r="5"/>';
      }
      return s;
    },
    function linkage(r) {
      var x = -70, y = 50, a = -1.2 + r() * 0.4, s = '<path d="M-95 58H-45"/><path d="M-90 58l-8 10M-74 58l-8 10M-58 58l-8 10"/>';
      var lens = [62, 54, 34];
      for (var i = 0; i < 3; i++) {
        var nx = x + lens[i] * Math.cos(a), ny = y + lens[i] * Math.sin(a);
        s += '<path d="M' + x.toFixed(1) + " " + y.toFixed(1) + "L" + nx.toFixed(1) + " " + ny.toFixed(1) + '" stroke-width="9" stroke-linecap="round" opacity=".35"/>';
        s += '<path d="M' + x.toFixed(1) + " " + y.toFixed(1) + "L" + nx.toFixed(1) + " " + ny.toFixed(1) + '"/>';
        s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6"/>';
        x = nx; y = ny; a += 0.7 + r() * 0.6;
      }
      return s + '<path d="M' + x.toFixed(1) + " " + y.toFixed(1) + 'l14 -6m-14 6l12 10"/>';
    },
    function block(r) {
      var w = 50 + r() * 30, d = 34 + r() * 20, h = 30 + r() * 30;
      var c = 0.866, q = 0.5;
      function P(x, y, z) { return ((x - y) * c).toFixed(1) + " " + ((x + y) * q - z + 20).toFixed(1); }
      return '<path d="M' + P(0, 0, h) + "L" + P(w, 0, h) + "L" + P(w, d, h) + "L" + P(0, d, h) + 'Z"/>' +
        '<path d="M' + P(w, 0, h) + "L" + P(w, 0, 0) + "L" + P(w, d, 0) + "L" + P(w, d, h) + '"/>' +
        '<path d="M' + P(w, d, 0) + "L" + P(0, d, 0) + "L" + P(0, d, h) + '"/>' +
        '<ellipse cx="' + ((w / 2 - d / 2) * c).toFixed(1) + '" cy="' + ((w / 2 + d / 2) * q - h + 20).toFixed(1) + '" rx="13" ry="7.5"/>';
    },
    function chassis(r) {
      var w = 120 + r() * 30, h = 70 + r() * 16;
      var s = '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="12"/>';
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (k) {
        s += '<rect x="' + (k[0] * (w / 2 - 22) - 14) + '" y="' + (k[1] * (h / 2 + 7) - 6) + '" width="28" height="12" rx="3"/>';
      });
      return s + '<circle r="16"/><circle r="4"/><path d="M' + (w / 2 - 18) + " -14v28\" stroke-dasharray=\"2 4\"/>";
    }
  ];

  var count = 0;

  /* A blueprint-style picture for anything that has no real media yet. */
  /* h = drawing height for a 400-wide sheet: 250 (16:10), 300 (4:3), 500 (4:5 portrait). */
  function placeholder(seed, title, tag, h) {
    h = h || 250;
    var r = seeded(seed || "x"), id = "pg" + (count++);
    var shape = shapes[Math.floor(r() * shapes.length)](r);
    var dy = h - 44;
    return '<svg class="ph" viewBox="0 0 400 ' + h + '" role="img" aria-label="Placeholder for ' + esc(title) + '">' +
      '<defs><pattern id="' + id + '" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-width=".5" opacity=".22"/></pattern></defs>' +
      '<rect width="400" height="' + h + '" fill="url(#' + id + ')"/>' +
      '<g fill="none" stroke="currentColor" stroke-width="1.4" transform="translate(200 ' + Math.round(h * 0.46) + ')">' + shape + "</g>" +
      '<g fill="none" stroke="currentColor" stroke-width="1" opacity=".6"><path d="M96 ' + dy + "H304M96 " + (dy - 6) + "v12M304 " + (dy - 6) + 'v12"/></g>' +
      '<text x="16" y="28" class="ph-t">' + esc(String(title).slice(0, 34).toUpperCase()) + "</text>" +
      '<text x="16" y="' + (h - 16) + '" class="ph-g">' + esc(tag || "AWAITING MEDIA") + "</text></svg>";
  }

  /* Hero: a working planetary gear set. Ring fixed, 48 / 24 / 12 teeth, so the motion is true. */
  function gearset() {
    var m = 10, s = '<svg class="gearset" viewBox="-290 -290 580 580" aria-hidden="true"><g fill="none" stroke="currentColor">';
    s += '<g class="g-ring"><circle r="276" stroke-width="1" opacity=".5"/><path stroke-width="1.5" d="' + gearPath(48, 240, m, true) + '"/>';
    for (var t = 0; t < 72; t++) {
      var a = (t / 72) * Math.PI * 2, r1 = t % 6 ? 264 : 258;
      s += '<path opacity=".5" d="M' + (r1 * Math.cos(a)).toFixed(1) + " " + (r1 * Math.sin(a)).toFixed(1) + "L" + (270 * Math.cos(a)).toFixed(1) + " " + (270 * Math.sin(a)).toFixed(1) + '"/>';
    }
    s += '</g><g class="g-sunwrap"><g class="g-sun"><path stroke-width="1.5" d="' + gearPath(24, 120, m) + '"/><circle r="34"/><circle r="70" stroke-dasharray="4 7" opacity=".6"/><path d="M-34 0H34M0 -34V34" opacity=".6"/></g></g>';
    s += '<g class="g-carrier"><path class="g-tri" stroke-dasharray="6 8" d="M180 0L-90 155.9L-90 -155.9Z"/>';
    [0, 120, 240].forEach(function (deg) {
      /* position comes from CSS (--a), so the scroll "exploded view" can push planets outward */
      s += '<g class="g-arm" style="--a:' + deg + 'deg"><g class="g-planet"><path stroke-width="1.5" transform="rotate(15)" d="' + gearPath(12, 60, m) + '"/><circle r="16"/><circle r="5"/></g></g>';
    });
    return s + "</g></g></svg>";
  }

  /* A plain gear as a small standalone picture (nav icon, rack pinion). */
  function gear(teeth, r, m, size) {
    var v = r + m + 2;
    return '<svg viewBox="' + -v + " " + -v + " " + 2 * v + " " + 2 * v + '" width="' + size + '" height="' + size + '" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="' + (v / 22).toFixed(2) + '"><path d="' + gearPath(teeth, r, m) + '"/><circle r="' + (r * 0.3).toFixed(1) + '"/></g></svg>';
  }

  /* The big project ring: a gear rim with one node per project. */
  function ring(items, step) {
    /* drawn as an energy reactor: a band of coil blocks between two rings, with light racing round it */
    function pt(r, a) { return (r * Math.cos(a)).toFixed(1) + " " + (r * Math.sin(a)).toFixed(1); }
    var s = '<svg viewBox="-520 -520 1040 1040"><g class="ring-g" fill="none" stroke="currentColor">';
    s += '<circle r="442" opacity=".6"/><circle r="424" stroke-width="3"/><circle r="368" stroke-width="2"/><circle r="330" stroke-dasharray="3 9" opacity=".6"/><circle r="250" stroke-width="7" opacity=".22"/><circle r="236" opacity=".4"/>';
    var N = 30, p = (2 * Math.PI) / N;
    for (var c = 0; c < N; c++) {
      var a0 = c * p + 0.03, a1 = (c + 1) * p - 0.03;
      s += '<path class="coil" d="M' + pt(376, a0) + "A376 376 0 0 1 " + pt(376, a1) + "L" + pt(416, a1) + "A416 416 0 0 0 " + pt(416, a0) + 'Z"/>';
    }
    for (var k = 0; k < 24; k++) s += '<path opacity=".35" transform="rotate(' + k * 15 + ')" d="M250 0H330M442 0h10"/>';
    s += '<circle class="pulse" r="396"/><circle class="pulse b" r="350"/>';
    items.forEach(function (p, i) {
      s += '<g class="node" data-i="' + i + '" transform="rotate(' + i * step + ')"><path d="M411 0H452" /><circle cx="466" cy="0" r="13"/><circle class="node-dot" cx="466" cy="0" r="5"/>' +
        '<text x="352" y="5" text-anchor="end">' + esc(p.mark + "  " + (p.codename || p.title).toUpperCase()) + "</text></g>";
    });
    return s + "</g></svg>";
  }

  window.Draw = { placeholder: placeholder, gearset: gearset, gear: gear, ring: ring, esc: esc };
})();
