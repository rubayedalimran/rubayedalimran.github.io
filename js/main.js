/* Reads content/data.js and builds the page. Nothing here needs editing to add content. */
(function () {
  "use strict";
  var D = window.PORTFOLIO, esc = Draw.esc;
  var $ = function (id) { return document.getElementById(id); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* A real picture if one is given, otherwise a drawn placeholder. */
  function media(src, seed, title, tag, h) {
    var ph = Draw.placeholder(seed, title, tag, h);
    if (!src) return ph;
    return '<img src="' + esc(src) + '" alt="' + esc(title) + '" loading="lazy" data-ph="' + esc(ph) + '">';
  }
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t.tagName === "IMG" && t.dataset.ph) t.outerHTML = t.dataset.ph;
  }, true);

  var sampleTag = function (x) { return x.sample ? '<span class="tag">Sample</span>' : ""; };
  var TYPES = { all: "All", robotics: "Robotics", aircraft: "Aircraft", cad: "CAD", software: "Software", other: "Other" };
  var stat = function (p, big) {
    return p.keyStat && p.keyStat.value ? '<p class="build-stat' + (big ? " big" : "") + '"><b>' + esc(p.keyStat.value) + "</b> " + esc(p.keyStat.label) + "</p>" : "";
  };

  /* ---------- boot sequence: once per visit, skippable ---------- */
  var boot = $("boot");
  function endBoot() {
    if (!boot) return;
    boot.remove(); boot = null;
    try { sessionStorage.setItem("booted", "1"); } catch (e) {}
  }
  if (calm || document.documentElement.classList.contains("no-boot")) endBoot();
  else {
    setTimeout(endBoot, 2300);
    addEventListener("keydown", endBoot, { once: true });
    boot.addEventListener("click", endBoot);
  }

  /* ---------- owner ---------- */
  var o = D.owner;
  document.querySelectorAll("[data-fill]").forEach(function (el) { el.textContent = o[el.dataset.fill]; });
  document.title = o.name + " — " + o.title;
  $("gear").innerHTML = Draw.gearset();
  $("bar-gear").innerHTML = Draw.gear(10, 9, 2.6, 22);
  $("photo").innerHTML = media(o.photo, "portrait", o.name, "AWAITING PORTRAIT", 500);
  $("bio").innerHTML = o.bio.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
    (o.motto ? '<p class="motto">' + esc(o.motto) + "</p>" : "");
  $("facts").innerHTML = Object.keys(o.facts).map(function (k) {
    return "<div><dt>" + esc(k) + "</dt><dd>" + esc(o.facts[k]) + "</dd></div>";
  }).join("");
  $("resume-dl").href = o.resume;
  $("mail").textContent = o.email;
  $("mail").href = "mailto:" + o.email;
  $("links").innerHTML = Object.keys(o.links).map(function (k) {
    return '<li><a href="' + esc(o.links[k]) + '" target="_blank" rel="noopener">' + esc(k) + "</a></li>";
  }).join("");
  $("foot-name").textContent = o.name + " · " + new Date().getFullYear();
  var th = document.documentElement.getAttribute("data-theme") || "crimson";
  [].forEach.call(document.querySelectorAll(".themes a"), function (a) { if (a.dataset.th === th) a.setAttribute("aria-current", "true"); });
  $("copy").addEventListener("click", function () {
    var b = this;
    (navigator.clipboard ? navigator.clipboard.writeText(o.email) : Promise.reject()).then(function () {
      b.textContent = "Copied";
    }, function () {
      b.textContent = "Select the address to copy";
    });
    setTimeout(function () { b.textContent = "Copy address"; }, 2200);
  });

  /* ---------- the hangar: projects ride a gear ring that scrolling turns ---------- */
  var STEP = 22, hangar = $("builds"), ringG = null;
  var filter = "all", list = [], active = -1;

  function span() { return hangar.offsetHeight - innerHeight; }
  function hangarTop() { return hangar.getBoundingClientRect().top + scrollY; }
  function goTo(i) {
    i = clamp(i, 0, list.length - 1);
    scrollTo({ top: hangarTop() + (list.length > 1 ? i / (list.length - 1) : 0) * span(), behavior: calm ? "auto" : "smooth" });
  }

  function renderBay() {
    var p = list[active];
    $("bay").innerHTML =
      '<div class="frame bay-media">' + media(p.thumb, p.id, p.title) + "</div>" +
      '<div class="bay-text">' +
      '<p class="build-meta"><span>' + esc(p.mark) + "</span><span>" + esc(TYPES[p.type] || p.type) + "</span>" + sampleTag(p) + "</p>" +
      '<h3 class="codename">' + esc(p.codename || p.title) + "</h3>" +
      (p.codename ? '<p class="bay-title">' + esc(p.title) + "</p>" : "") +
      '<p class="bay-sum">' + esc(p.summary) + "</p>" +
      stat(p) +
      '<a class="btn btn-go" href="#/project/' + esc(p.id) + '">Open dossier</a></div>';
    if (typeof scramble === "function") scramble(document.querySelector("#bay .codename"));
    $("count").textContent = (active + 1) + " / " + list.length;
    $("prev").disabled = active === 0;
    $("next").disabled = active === list.length - 1;
    document.querySelectorAll("#ring .node").forEach(function (n) { n.classList.toggle("on", +n.dataset.i === active); });
  }

  function buildHangar() {
    list = D.projects.filter(function (p) { return filter === "all" || p.type === filter; });
    hangar.style.height = "calc(100svh + " + (list.length - 1) * 70 + "vh)";
    $("ring").innerHTML = Draw.ring(list, STEP);
    ringG = document.querySelector("#ring .ring-g");
    $("hangar-lede").textContent = list.length + (list.length === 1 ? " build" : " builds") + " on the ring. Scroll to turn it.";
    $("filters").innerHTML = Object.keys(TYPES).map(function (t) {
      var n = t === "all" ? D.projects.length : D.projects.filter(function (p) { return p.type === t; }).length;
      return n ? '<button type="button" data-type="' + t + '" aria-pressed="' + (t === filter) + '">' + TYPES[t] + " <span>" + n + "</span></button>" : "";
    }).join("");
    active = -1;
    turnRing();
  }

  function turnRing() {
    var s = span(), p = s > 0 ? clamp(-hangar.getBoundingClientRect().top / s, 0, 1) : 0;
    var pos = p * (list.length - 1), i = Math.round(pos);
    if (ringG) ringG.style.transform = "rotate(" + (-pos * STEP).toFixed(2) + "deg)";
    if (i !== active) { active = i; renderBay(); }
  }

  $("filters").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    filter = b.dataset.type;
    buildHangar();
    scrollTo({ top: hangarTop(), behavior: "auto" });
  });
  $("ring").addEventListener("click", function (e) {
    var n = e.target.closest(".node");
    if (n) goTo(+n.dataset.i);
  });
  $("prev").addEventListener("click", function () { goTo(active - 1); });
  $("next").addEventListener("click", function () { goTo(active + 1); });
  buildHangar();

  /* ---------- project dossier ---------- */
  var dlg = $("dossier");
  var STORY = { problem: "The problem", design: "The design", build: "The build", result: "The result" };

  function openDossier(p) {
    var specs = Object.keys(p.specs).map(function (k) {
      return "<div><dt>" + esc(k) + "</dt><dd>" + esc(p.specs[k]) + "</dd></div>";
    }).join("");
    var story = Object.keys(STORY).filter(function (k) { return p.story[k]; }).map(function (k) {
      return "<div><h4>" + STORY[k] + "</h4><p>" + esc(p.story[k]) + "</p></div>";
    }).join("");
    var gallery = (p.gallery || []).map(function (g, i) {
      return '<figure class="frame">' + media(g, p.id + i, p.title + " " + (i + 1)) + "</figure>";
    }).join("");
    var links = Object.keys(p.links || {}).map(function (k) {
      return '<a class="btn" href="' + esc(p.links[k]) + '" target="_blank" rel="noopener">' + esc(k) + "</a>";
    }).join("");

    $("dossier-in").innerHTML =
      '<header class="dossier-head"><p class="build-meta"><span>' + esc(p.mark) + "</span><span>" + esc(TYPES[p.type] || p.type) + "</span>" + sampleTag(p) + "</p>" +
      '<button class="btn" type="button" id="dossier-close">Close</button></header>' +
      '<div class="dossier-top"><div><h2 id="dossier-title">' + esc(p.codename || p.title) + "</h2>" +
      (p.codename ? '<p class="bay-title">' + esc(p.title) + "</p>" : "") +
      '<p class="lede">' + esc(p.summary) + "</p>" +
      stat(p, true) + "</div>" +
      '<figure class="frame">' + media(p.thumb, p.id, p.title) + "</figure></div>" +
      '<dl class="titleblock">' + specs + "</dl>" +
      '<div class="story">' + story + "</div>" +
      (gallery ? '<h3>Gallery</h3><div class="gallery">' + gallery + "</div>" : "") +
      (links ? '<div class="actions">' + links + "</div>" : "");
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    $("dossier-close").addEventListener("click", function () { dlg.close(); });
  }

  function route() {
    var m = location.hash.match(/^#\/project\/(.+)$/);
    var p = m && D.projects.filter(function (x) { return x.id === decodeURIComponent(m[1]); })[0];
    if (p) openDossier(p);
    else if (dlg.open) dlg.close();
  }
  dlg.addEventListener("close", function () {
    if (location.hash.indexOf("#/project/") === 0) history.replaceState(null, "", "#builds");
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  addEventListener("hashchange", route);
  route();

  /* ---------- arsenal: tools hanging on a pegboard ---------- */
  /* a honeycomb of modules; pointing at one loads it into the read-out panel */
  var CAPS = [], capsEl = $("caps");
  Object.keys(D.skills).forEach(function (g) { D.skills[g].forEach(function (s) { CAPS.push({ name: s.name, cat: g, note: s.usedIn }); }); });
  var pad2 = function (n) { return ("0" + n).slice(-2); };
  capsEl.innerHTML = CAPS.map(function (c, i) {
    return '<button class="hex" type="button" data-i="' + i + '" style="--i:' + i + '"><span>' + esc(c.name) + "</span><small>" + esc(c.cat) + "</small></button>";
  }).join("");
  $("cap-filters").innerHTML = ["all"].concat(Object.keys(D.skills)).map(function (g) {
    return '<button type="button" data-cat="' + esc(g) + '" aria-pressed="' + (g === "all") + '">' + (g === "all" ? "All" : esc(g)) + "</button>";
  }).join("");
  var capOn = -1;
  function showCap(i) {
    if (i === capOn) return;
    capOn = i;
    var c = CAPS[i], bars = "";
    for (var b = 0; b < 26; b++) bars += '<i style="--i:' + ((b * 7) % 11) + '"></i>';
    $("cap-read").innerHTML = '<p class="rd-cat">' + esc(c.cat) + '</p><p class="rd-name">' + esc(c.name) + '</p><p class="rd-note">' +
      esc(c.note || "Module online.") + '</p><div class="rd-wave" aria-hidden="true">' + bars + '</div><p class="rd-idx">' + pad2(i + 1) + " / " + pad2(CAPS.length) + "</p>";
    scramble($("cap-read").querySelector(".rd-name"));
    [].forEach.call(capsEl.children, function (h) { h.classList.toggle("on", +h.dataset.i === i); });
  }
  function pickCap(e) { var h = e.target.closest(".hex"); if (h && !h.classList.contains("dim")) showCap(+h.dataset.i); }
  capsEl.addEventListener("pointerover", pickCap);
  capsEl.addEventListener("focusin", pickCap);
  capsEl.addEventListener("click", pickCap);
  capsEl.addEventListener("pointerenter", function () { $("loadout").classList.add("ready"); }, { once: true });
  $("cap-filters").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    $("loadout").classList.add("ready");
    [].forEach.call(this.children, function (x) { x.setAttribute("aria-pressed", x === b); });
    var first = -1;
    [].forEach.call(capsEl.children, function (h) {
      var hit = b.dataset.cat === "all" || CAPS[+h.dataset.i].cat === b.dataset.cat;
      h.classList.toggle("dim", !hit);
      if (hit && first < 0) first = +h.dataset.i;
    });
    if (first >= 0) showCap(first);
  });
  showCap(0);

  /* ---------- hall of proof ---------- */
  $("wall").innerHTML = D.achievements.map(function (a, i) {
    return '<li data-rv><figure><div class="frame">' +
      media(a.type === "video" ? "" : a.media, "ach" + i + a.title, a.title, a.type === "video" ? "AWAITING VIDEO" : "AWAITING MEDIA", 300) +
      "</div><figcaption><b>" + esc(a.title) + "</b><span>" + esc([a.issuer, a.date].filter(Boolean).join(" · ")) + "</span>" + sampleTag(a) + "</figcaption></figure></li>";
  }).join("");
  var proof = $("proof");
  proof.addEventListener("pointermove", function (e) {
    var r = proof.getBoundingClientRect();
    proof.style.setProperty("--mx", e.clientX - r.left + "px");
    proof.style.setProperty("--my", e.clientY - r.top + "px");
  });

  /* ---------- flight log: a pinion rolls down a rack as you scroll ---------- */
  $("timeline").innerHTML = D.timeline.map(function (t) {
    return "<li data-rv><time>" + esc(t.when) + "</time><div><h3>" + esc(t.what) + "</h3><p class=\"where\">" + esc(t.where) + "</p><p>" + esc(t.detail) + "</p></div></li>";
  }).join("");
  var rack = $("rack"), pinion = $("pinion"), PIN = 76;
  pinion.innerHTML = Draw.gear(12, 28, 4.6, PIN);
  var PITCH_R = 28 * (PIN / (2 * (28 + 4.6 + 2)));   /* pitch radius in screen pixels */
  rack.style.setProperty("--tooth", ((2 * Math.PI * PITCH_R) / 12).toFixed(3) + "px");
  rack.style.setProperty("--mesh", (PIN / 2 + PITCH_R).toFixed(1) + "px");

  /* ---------- hero status line, typed out like a console ---------- */
  var term = $("term"), lines = ["all systems nominal", D.projects.length + " builds in the hangar",
    (o.facts.Status || "").toLowerCase(), o.facts.Based ? "based in " + o.facts.Based : ""].filter(Boolean);
  if (calm) term.textContent = lines[0];
  else (function type(li, ci, dir) {
    term.textContent = lines[li].slice(0, ci);
    if (dir > 0 && ci === lines[li].length) return setTimeout(type, 1700, li, ci, -1);
    if (dir < 0 && ci === 0) return setTimeout(type, 250, (li + 1) % lines.length, 0, 1);
    setTimeout(type, dir > 0 ? 38 : 16, li, ci + dir, dir);
  })(0, 0, 1);

  /* ---------- giant outlined words that drift behind each section ---------- */
  var GHOSTS = { about: "Origin", arsenal: "Arsenal", proof: "Proof", log: "Flight log", contact: "Transmit" }, ghosts = [];
  Object.keys(GHOSTS).forEach(function (id) {
    var s = document.createElement("span");
    s.className = "ghost"; s.setAttribute("aria-hidden", "true"); s.textContent = GHOSTS[id];
    $(id).insertBefore(s, $(id).firstChild);
    ghosts.push(s);
  });

  /* ---------- cockpit read-outs: sector, depth, local time, position on the page ---------- */
  var SECT = [["top", "Core"], ["about", "Origin"], ["builds", "Hangar"], ["arsenal", "Arsenal"], ["proof", "Proof"], ["log", "Log"], ["contact", "Transmit"]];
  var rail = $("hud-rail"), mark = $("hud-mark");
  $("hud-place").textContent = o.coords || "";
  function clock() { $("hud-time").textContent = "Local " + new Date().toTimeString().slice(0, 8); }
  clock(); setInterval(clock, 1000);
  function ticks() {
    var max = document.documentElement.scrollHeight - innerHeight;
    [].slice.call(rail.querySelectorAll("i")).forEach(function (i) { i.remove(); });
    SECT.forEach(function (s) {
      var i = document.createElement("i");
      i.style.top = clamp(($(s[0]).getBoundingClientRect().top + scrollY) / max, 0, 1) * 100 + "%";
      rail.appendChild(i);
    });
  }
  ticks();
  addEventListener("resize", ticks);
  addEventListener("load", ticks);

  /* ---------- everything that follows the scroll position ---------- */
  var bar = $("progress"), barGear = $("bar-gear"), core = $("core"), ticking = false;
  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
    mark.style.top = (max > 0 ? scrollY / max : 0) * 100 + "%";
    var sector = SECT[0][1];
    SECT.forEach(function (s) { if ($(s[0]).getBoundingClientRect().top < innerHeight * 0.5) sector = s[1]; });
    $("hud-sector").textContent = "Sector " + sector;
    $("hud-depth").textContent = "Depth " + ("000" + Math.round(scrollY / 30)).slice(-4) + " m";
    ghosts.forEach(function (g) {
      g.style.transform = "translateX(" + ((g.parentNode.getBoundingClientRect().top / innerHeight) * -16).toFixed(2) + "%)";
    });
    barGear.style.transform = "rotate(" + (scrollY * 0.4).toFixed(1) + "deg)";
    core.style.setProperty("--ex", calm ? 0 : clamp(scrollY / (innerHeight * 0.75), 0, 1).toFixed(3));
    turnRing();
    var r = rack.getBoundingClientRect();
    var y = clamp((innerHeight * 0.55 - r.top) / r.height, 0, 1) * (r.height - PIN);
    pinion.style.transform = "translateY(" + y.toFixed(1) + "px) rotate(" + (-y / PITCH_R).toFixed(3) + "rad)";
    /* things assemble as they enter the screen */
    for (var i = rv.length - 1; i >= 0; i--) {
      if (calm || rv[i].getBoundingClientRect().top < innerHeight * 0.92) {
        var h = rv[i].matches("h2") ? rv[i] : rv[i].querySelector("h2");
        if (h) scramble(h);
        rv[i].classList.add("in"); rv.splice(i, 1);
      }
    }
  }

  /* headings decode themselves from machine symbols into words */
  function scramble(el) {
    if (calm) return;
    var txt = el.textContent, n = txt.length, t0 = performance.now(), G = "<>/[]{}=+*#01";
    (function step(now) {
      var k = (now - t0) / (350 + n * 40), out = "";
      for (var i = 0; i < n; i++) out += txt[i] === " " || i / n < k ? txt[i] : G[Math.floor(Math.random() * G.length)];
      el.textContent = k >= 1 ? txt : out;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* picture frames tilt in 3D toward the cursor, with a moving glare */
  if (!calm && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var lastFrame = null;
    document.addEventListener("pointermove", function (e) {
      var f = e.target.closest ? e.target.closest(".frame") : null;
      if (lastFrame && lastFrame !== f) { lastFrame.style.removeProperty("--tx"); lastFrame.style.removeProperty("--ty"); }
      if (f) {
        var r = f.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        f.style.setProperty("--ty", ((x - 0.5) * 16).toFixed(1) + "deg");
        f.style.setProperty("--tx", ((0.5 - y) * 14).toFixed(1) + "deg");
        f.style.setProperty("--gx", (x * 100).toFixed(0) + "%");
        f.style.setProperty("--gy", (y * 100).toFixed(0) + "%");
      }
      lastFrame = f;
    });
  }
  var rv = [].slice.call(document.querySelectorAll("[data-rv]"));
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  onScroll();

  /* ---------- hero gear leans toward the cursor ---------- */
  if (!calm && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $("top").addEventListener("pointermove", function (e) {
      core.style.setProperty("--ry", ((e.clientX / innerWidth - 0.5) * 22).toFixed(1) + "deg");
      core.style.setProperty("--rx", ((0.5 - e.clientY / innerHeight) * 18).toFixed(1) + "deg");
    });
  }
})();
