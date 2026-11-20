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
    /* a PDF (a certificate): show the placeholder now, draw its first page in later, and link to the file */
    if (/\.pdf$/i.test(src)) return '<a class="doc" href="' + esc(src) + '" target="_blank" rel="noopener" data-pdf="' + esc(src) + '" aria-label="Open ' + esc(title) + '">' + ph + "</a>";
    /* a video: plays in place, silent until the visitor turns the sound on */
    if (/\.(mp4|webm)$/i.test(src)) return '<video src="' + esc(src) + '#t=0.1" controls muted loop playsinline preload="metadata" aria-label="' + esc(title) + '"></video>';
    return '<img src="' + esc(src) + '" alt="' + esc(title) + '" loading="lazy" decoding="async" data-ph="' + esc(ph) + '">';
  }
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t.tagName === "IMG" && t.dataset.ph) t.outerHTML = t.dataset.ph;
  }, true);
  /* small pictures are shown at their own size on white instead of being stretched */
  document.addEventListener("load", function (e) {
    var t = e.target;
    if (t.tagName === "IMG" && t.naturalWidth && t.naturalWidth < 420) t.classList.add("small");
  }, true);

  /* click any project picture in a dossier to see it full size */
  var zoom = $("zoom");
  document.addEventListener("click", function (e) {
    var im = e.target.closest ? e.target.closest(".dossier .frame img") : null;
    if (im && zoom) { zoom.querySelector("img").src = im.src; zoom.querySelector("img").alt = im.alt; zoom.showModal(); }
  });
  if (zoom) zoom.addEventListener("click", function () { zoom.close(); });

  /* draw the first page of each PDF into its frame (loads the PDF reader only if needed) */
  function drawPdfs() {
    var slots = [].slice.call(document.querySelectorAll("a.doc[data-pdf]"));
    if (!slots.length) return;
    function go() {
      var lib = window.pdfjsLib;
      if (!lib) return;
      lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      /* one certificate at a time, each in an idle moment, so drawing them never stalls scrolling */
      var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 60); };
      var queue = slots.slice();
      (function next() {
        var a = queue.shift();
        if (!a) return;
        idle(function () { renderOne(a).then(next, next); });
      })();
      function renderOne(a) {
        return lib.getDocument(a.dataset.pdf).promise.then(function (d) { return d.getPage(1); }).then(function (pg) {
          var v = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: 1000 / v.width }), cv = document.createElement("canvas");
          cv.width = vp.width; cv.height = vp.height;
          return pg.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise.then(function () {
            a.innerHTML = '<img src="' + cv.toDataURL("image/jpeg", 0.85) + '" alt="' + esc(a.getAttribute("aria-label").replace(/^Open /, "")) + '" decoding="async">';
          });
        }).catch(function () {});
      }
    }
    var sc = document.createElement("script");
    sc.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    sc.onload = go;
    document.head.appendChild(sc);
  }

  var sampleTag = function (x) { return x.sample ? '<span class="tag">Sample</span>' : ""; };

  /* Only projects that have at least one real picture are shown, strongest (lowest rank) first. */
  var pics = function (p) { return (p.gallery || []).filter(Boolean); };
  D.projects = D.projects.filter(function (p) { return p.thumb || pics(p).length; })
    .sort(function (a, b) { return (a.rank || 99) - (b.rank || 99); });
  var builtTag = function (p) { return p.built ? '<span class="tag-built">Built</span>' : '<span class="tag-cad">CAD design</span>'; };
  var projLinks = function (ids, label) {
    var ps = (ids || []).map(function (id) { return D.projects.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    return ps.length ? '<p class="used-in"><span>' + label + "</span>" + ps.map(function (p) { return '<a href="#/project/' + esc(p.id) + '">' + esc(p.title) + "</a>"; }).join("") + "</p>" : "";
  };
  var chips = function (p) {
    return p.shows && p.shows.length ? '<ul class="chips">' + p.shows.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" : "";
  };
  var TYPES = { all: "All", robotics: "Robotics", mechanisms: "Mechanisms", machines: "Machines", parts: "Parts", software: "Software", other: "Other" };
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
  if (!boot || calm || document.documentElement.classList.contains("no-boot")) endBoot();
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
  /* no portrait yet: leave the frame out rather than show an empty one */
  if (o.photo) $("photo").innerHTML = media(o.photo, "portrait", o.name, "", 500);
  else { $("photo").remove(); document.querySelector(".sheet").classList.add("no-photo"); }
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
  /* colour switch: the 3D scene is built for one palette, so a switch saves the choice and reloads */
  [].forEach.call(document.querySelectorAll(".theme-dots button"), function (b) {
    if (b.dataset.th === th) b.setAttribute("aria-pressed", "true"); else b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () {
      if (b.dataset.th === th) return;
      try { localStorage.setItem("theme", b.dataset.th); } catch (e) {}
      location.href = location.pathname + "?theme=" + b.dataset.th + location.hash;
    });
  });
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
    if (hangar.classList.contains("deck")) { $("bay").scrollTo({ left: i * deckStep(), behavior: calm ? "auto" : "smooth" }); return; }
    scrollTo({ top: hangarTop() + (list.length > 1 ? i / (list.length - 1) : 0) * span(), behavior: calm ? "auto" : "smooth" });
  }

  function renderBay() {
    var p = list[active];
    $("bay").innerHTML =
      '<div class="frame bay-media">' + media(p.thumb || (p.gallery || [])[0], p.id, p.title) + "</div>" +
      '<div class="bay-text">' +
      '<p class="build-meta"><span>' + esc(p.mark) + "</span><span>" + esc(TYPES[p.type] || p.type) + "</span>" + builtTag(p) + "</p>" +
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
    /* with many projects, pack the nodes closer round the ring and need less scrolling per project */
    STEP = Math.min(22, 336 / Math.max(1, list.length));
    hangar.style.height = "calc(100svh + " + Math.round((list.length - 1) * clamp(700 / list.length, 30, 70)) + "vh)";
    $("ring").innerHTML = Draw.ring(list, STEP);
    ringG = document.querySelector("#ring svg");   /* the whole drawing turns as one layer, which is cheap */
    $("hangar-lede").textContent = list.length + (list.length === 1 ? " project" : " projects") + ". Built hardware first, then CAD design.";
    $("filters").innerHTML = Object.keys(TYPES).map(function (t) {
      var n = t === "all" ? D.projects.length : D.projects.filter(function (p) { return p.type === t; }).length;
      return n ? '<button type="button" data-type="' + t + '" aria-pressed="' + (t === filter) + '">' + TYPES[t] + " <span>" + n + "</span></button>" : "";
    }).join("");
    active = -1;
    if (phone.matches) { hangar.classList.add("deck"); hangar.style.height = ""; buildDeck(); }
    else { hangar.classList.remove("deck"); turnRing(); }
  }

  /* ---------- phones: projects become a deck of cards you swipe sideways ---------- */
  function deckStep() { var c = $("bay").firstElementChild; return c ? c.offsetWidth + 14 : 1; }
  function buildDeck() {
    $("bay").innerHTML = list.map(function (p, i) {
      return '<article class="card" data-i="' + i + '"><div class="card-media">' + media(p.thumb || (p.gallery || [])[0], p.id, p.title) +
        '<span class="card-mark">' + esc(p.mark) + '</span></div><div class="card-body">' +
        '<p class="build-meta"><span>' + esc(TYPES[p.type] || p.type) + "</span>" + builtTag(p) + "</p>" +
        '<h3 class="codename">' + esc(p.codename || p.title) + "</h3>" +
        (p.codename ? '<p class="bay-title">' + esc(p.title) + "</p>" : "") +
        '<p class="bay-sum">' + esc(p.summary) + "</p>" + stat(p) +
        '<a class="btn btn-go" href="#/project/' + esc(p.id) + '">Open dossier</a></div></article>';
    }).join("");
    $("bay").scrollLeft = 0;
    active = -1; deckMove();
  }
  function deckMove() {
    if (!hangar.classList.contains("deck")) return;
    var pos = $("bay").scrollLeft / deckStep(), i = clamp(Math.round(pos), 0, list.length - 1);
    if (ringG) ringG.style.transform = "rotate(" + (-pos * STEP).toFixed(2) + "deg)";
    if (i === active) return;
    active = i;
    [].forEach.call($("bay").children, function (c) { c.classList.toggle("on", +c.dataset.i === i); });
    $("count").textContent = (i + 1) + " / " + list.length;
    $("prev").disabled = i === 0; $("next").disabled = i === list.length - 1;
    document.querySelectorAll("#ring .node").forEach(function (n) { n.classList.toggle("on", +n.dataset.i === i); });
    if (navigator.vibrate && deckTouched) navigator.vibrate(6);
  }
  var deckTouched = false;
  $("bay").addEventListener("scroll", deckMove, { passive: true });
  $("bay").addEventListener("touchstart", function () { deckTouched = true; }, { passive: true, once: true });

  function turnRing(rect) {
    if (hangar.classList.contains("deck")) return;
    var s = span(), p = s > 0 ? clamp(-(rect || hangar.getBoundingClientRect()).top / s, 0, 1) : 0;
    var pos = p * (list.length - 1), i = Math.round(pos);
    if (ringG) ringG.style.transform = "rotate(" + (-pos * STEP).toFixed(2) + "deg)";
    if (i !== active) { active = i; renderBay(); }
  }

  var phone = matchMedia("(max-width: 47.99rem)");
  (phone.addEventListener ? phone.addEventListener.bind(phone, "change") : phone.addListener.bind(phone))(function () { buildHangar(); });
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
    /* the first picture is shown large at the top, so the gallery holds the rest */
    var gallery = pics(p).slice(p.thumb ? 0 : 1).map(function (g, i) {
      return '<figure class="frame">' + media(g, p.id + i, p.title + " " + (i + 2)) + "</figure>";
    }).join("");
    var links = Object.keys(p.links || {}).map(function (k) {
      return '<a class="btn" href="' + esc(p.links[k]) + '" target="_blank" rel="noopener">' + esc(k) + "</a>";
    }).join("");

    $("dossier-in").innerHTML =
      '<header class="dossier-head"><p class="build-meta"><span>' + esc(p.mark) + "</span><span>" + esc(TYPES[p.type] || p.type) + "</span>" + builtTag(p) + "</p>" +
      '<button class="btn" type="button" id="dossier-close">Close</button></header>' +
      '<div class="dossier-top"><div><h2 id="dossier-title">' + esc(p.codename || p.title) + "</h2>" +
      (p.codename ? '<p class="bay-title">' + esc(p.title) + "</p>" : "") +
      '<p class="lede">' + esc(p.summary) + "</p>" + chips(p) +
      stat(p, true) + "</div>" +
      '<figure class="frame">' + media(p.thumb || (p.gallery || [])[0], p.id, p.title) + "</figure></div>" +
      '<dl class="titleblock">' + specs + "</dl>" +
      '<div class="story">' + story + "</div>" +
      (gallery ? '<h3>More views</h3><div class="gallery">' + gallery + "</div>" : "") +
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
  Object.keys(D.skills).forEach(function (g) { D.skills[g].forEach(function (s) { CAPS.push({ name: s.name, cat: g, note: s.usedIn, projects: s.projects }); }); });
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
      esc(c.note || "") + "</p>" + projLinks(c.projects, "Used in") + '<div class="rd-wave" aria-hidden="true">' + bars + '</div><p class="rd-idx">' + pad2(i + 1) + " / " + pad2(CAPS.length) + "</p>";
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
  /* A credential vault: a list of credentials on one side, and a screen that scans in the selected
     certificate on the other. It steps through them on its own until the visitor takes over. */
  var ACH = D.achievements.filter(function (x) { return x.media; }), achOn = -1, achAuto = null;
  $("vault-list").innerHTML = ACH.map(function (x, i) {
    return '<li><button type="button" data-i="' + i + '"><i>' + pad2(i + 1) + "</i><span>" + esc(x.title) + "</span><small>" + esc(x.date || "") + "</small></button></li>";
  }).join("");
  $("vault-stack").innerHTML = ACH.map(function (x, i) {
    return '<div class="vault-item" data-i="' + i + '">' + media(x.media, "ach" + i, x.title, "LOADING", 283) + "</div>";
  }).join("");
  function showAch(i) {
    if (i === achOn || !ACH[i]) return;
    achOn = i; var x = ACH[i];
    [].forEach.call($("vault-stack").children, function (el) { el.classList.toggle("on", +el.dataset.i === i); });
    [].forEach.call($("vault-list").querySelectorAll("button"), function (bt) { bt.setAttribute("aria-current", +bt.dataset.i === i); });
    $("vault-count").textContent = pad2(i + 1) + " / " + pad2(ACH.length);
    $("vault-cap").innerHTML = '<p class="rd-cat">' + esc(x.issuer || "") + '</p><p class="vault-title">' + esc(x.title) + '</p><p class="vault-meta">' +
      [x.date ? "Issued " + esc(x.date) : "", x.id ? "Credential " + esc(x.id) : ""].filter(Boolean).join("<span></span>") +
      "</p>" + projLinks(x.projects, "Applied in") + '<a class="btn" href="' + esc(x.media) + '" target="_blank" rel="noopener">Open certificate</a>';
  }
  function takeOver(e) {
    if (achAuto) { clearInterval(achAuto); achAuto = null; }
    var bt = e && e.target.closest ? e.target.closest("button[data-i]") : null;
    if (bt) showAch(+bt.dataset.i);
  }
  ["pointerover", "focusin", "click"].forEach(function (ev) { $("vault-list").addEventListener(ev, takeOver); });
  $("vault").addEventListener("pointerdown", takeOver);
  /* step through certificates without hunting in the list: arrows, swipe, arrow keys */
  function stepAch(d) { takeOver(); showAch((achOn + d + ACH.length) % ACH.length); }
  $("vault-prev").addEventListener("click", function () { stepAch(-1); });
  $("vault-next").addEventListener("click", function () { stepAch(1); });
  var swipeX = null;
  $("vault-stack").addEventListener("pointerdown", function (e) { swipeX = e.clientX; });
  addEventListener("pointerup", function (e) {
    if (swipeX === null) return;
    var dx = e.clientX - swipeX; swipeX = null;
    if (Math.abs(dx) > 40) stepAch(dx < 0 ? 1 : -1);
  });
  $("vault").addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); stepAch(1); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); stepAch(-1); }
  });
  showAch(0);
  if (!calm && ACH.length > 1) achAuto = setInterval(function () {
    var r = $("vault").getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) showAch((achOn + 1) % ACH.length);
  }, 4200);
  var pdfsDrawn = false;   /* certificates are fetched and drawn only when the visitor gets near them */

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
  var GHOSTS = { about: "About", arsenal: "Skills", proof: "Certified", log: "Experience", contact: "Contact" }, ghosts = [];
  Object.keys(GHOSTS).forEach(function (id) {
    var s = document.createElement("span");
    s.className = "ghost"; s.setAttribute("aria-hidden", "true"); s.textContent = GHOSTS[id];
    $(id).insertBefore(s, $(id).firstChild);
    ghosts.push(s);
  });

  /* ---------- cockpit read-outs: sector, depth, local time, position on the page ---------- */
  var SECT = [["top", "Home"], ["about", "About"], ["builds", "Projects"], ["arsenal", "Skills"], ["proof", "Certifications"], ["log", "Experience"], ["contact", "Contact"]];
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
  var bar = $("progress"), barGear = $("bar-gear"), core = $("core"), ticking = false, dockOn = "";
  [].forEach.call(document.querySelectorAll(".dock a"), function (a) {
    a.addEventListener("click", function () { if (navigator.vibrate) navigator.vibrate(8); });
  });
  $("mail-btn").href = "mailto:" + o.email;
  $("cv-btn").href = o.resume;
  function onScroll() {
    ticking = false;
    /* all measuring happens first, all style changes after: mixing the two forces the browser to re-lay
       out the page several times per frame, which is what makes scrolling stutter */
    var vh = innerHeight, sy = scrollY, max = document.documentElement.scrollHeight - vh;
    var vaultTop = pdfsDrawn ? 0 : $("vault").getBoundingClientRect().top;
    var sector = SECT[0][1], secId = SECT[0][0];
    SECT.forEach(function (s) { if ($(s[0]).getBoundingClientRect().top < vh * 0.5) { sector = s[1]; secId = s[0]; } });
    var ghostTops = ghosts.map(function (g) { return g.parentNode.getBoundingClientRect().top; });
    var r = rack.getBoundingClientRect(), hangRect = hangar.getBoundingClientRect();
    var reveal = [];
    for (var i = rv.length - 1; i >= 0; i--) if (calm || rv[i].getBoundingClientRect().top < vh * 0.92) { reveal.push(rv[i]); rv.splice(i, 1); }
    /* ---- writes ---- */
    if (!pdfsDrawn && vaultTop < vh * 1.8) { pdfsDrawn = true; drawPdfs(); }
    bar.style.transform = "scaleX(" + (max > 0 ? sy / max : 0) + ")";
    mark.style.top = (max > 0 ? sy / max : 0) * 100 + "%";
    if (secId !== dockOn) {
      dockOn = secId;
      [].forEach.call(document.querySelectorAll(".dock a"), function (a) {
        var hit = a.dataset.s === secId || (a.dataset.s === "proof" && secId === "log");
        if (hit) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }
    $("hud-sector").textContent = "Sector " + sector;
    $("hud-depth").textContent = "Depth " + ("000" + Math.round(scrollY / 30)).slice(-4) + " m";
    ghosts.forEach(function (g, gi) { g.style.transform = "translateX(" + ((ghostTops[gi] / vh) * -16).toFixed(2) + "%)"; });
    barGear.style.transform = "rotate(" + (scrollY * 0.4).toFixed(1) + "deg)";
    core.style.setProperty("--ex", calm ? 0 : clamp(scrollY / (innerHeight * 0.75), 0, 1).toFixed(3));
    turnRing(hangRect);
    var y = clamp((vh * 0.55 - r.top) / r.height, 0, 1) * (r.height - PIN);
    pinion.style.transform = "translateY(" + y.toFixed(1) + "px) rotate(" + (-y / PITCH_R).toFixed(3) + "rad)";
    /* things assemble as they enter the screen */
    reveal.forEach(function (el) { el.classList.add("in"); });
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
