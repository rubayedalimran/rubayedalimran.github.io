(function(){
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===================== LOADER ===================== */
  const loader = document.getElementById("loader");
  const loaderFill = document.getElementById("loaderFill");
  const loaderPct = document.getElementById("loaderPct");
  let pct = 0;
  const loadInterval = setInterval(() => {
    pct += Math.random() * 18 + 6;
    if (pct >= 100) {
      pct = 100;
      clearInterval(loadInterval);
      setTimeout(() => loader.classList.add("hidden"), 350);
    }
    loaderFill.style.width = pct + "%";
    loaderPct.textContent = Math.floor(pct) + "%";
  }, 160);

  /* ===================== CURSOR ===================== */
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  if (cursorDot && !reduceMotion && matchMedia("(hover:hover)").matches) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });
    function animateRing(){
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(".magnetic, a, button, input, textarea")) {
        cursorRing.classList.add("hovering");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(".magnetic, a, button, input, textarea")) {
        cursorRing.classList.remove("hovering");
      }
    });
  }

  /* ===================== SCROLL PROGRESS + NAV ===================== */
  const scrollProgress = document.getElementById("scrollProgress");
  const nav = document.getElementById("nav");
  const toTop = document.getElementById("toTop");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main > section[id], main.hero, .hero, .section");

  function onScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + "%";

    nav.classList.toggle("scrolled", scrollTop > 40);
    toTop.classList.toggle("visible", scrollTop > 600);

    let current = "home";
    document.querySelectorAll("section[id], .hero").forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = sec.id || "home";
      }
    });
    navLinks.forEach((l) => l.classList.toggle("active", l.dataset.section === current));
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ===================== MOBILE NAV ===================== */
  const navBurger = document.getElementById("navBurger");
  navBurger.addEventListener("click", () => nav.classList.toggle("open"));
  navLinks.forEach((l) => l.addEventListener("click", () => nav.classList.remove("open")));

  /* ===================== THEME TOGGLE ===================== */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("ri-theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("ri-theme", next);
  });

  /* ===================== REVEAL ON SCROLL ===================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ===================== COUNTERS ===================== */
  const counters = document.querySelectorAll(".stat-num");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      let cur = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target + suffix; return; }
        el.textContent = cur + suffix;
        requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => counterObserver.observe(c));

  /* ===================== TIMELINE (About) ===================== */
  const timelineList = document.getElementById("timelineList");
  TIMELINE.forEach((t) => {
    const li = document.createElement("li");
    li.className = "timeline-item";
    li.innerHTML = `
      <span class="timeline-date">${t.date}</span>
      <h5>${t.title}</h5>
      <div class="timeline-org">${t.org}</div>
      <div class="timeline-place">${t.place || ""}</div>
      ${t.desc ? `<div class="timeline-desc">${t.desc}</div>` : ""}
    `;
    timelineList.appendChild(li);
  });

  /* ===================== SKILLS ===================== */
  const skillFilters = document.getElementById("skillFilters");
  const skillsGroups = document.getElementById("skillsGroups");
  const skillCats = ["All", ...SKILLS.map((s) => s.category)];

  skillCats.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn magnetic" + (i === 0 ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      skillFilters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderSkillGroups(cat);
    });
    skillFilters.appendChild(btn);
  });

  function ringMarkup(level){
    const r = 26, c = 2 * Math.PI * r;
    const offset = c - (level / 100) * c;
    return `
      <div class="skill-ring">
        <svg viewBox="0 0 64 64">
          <circle class="ring-bg" cx="32" cy="32" r="${r}"/>
          <circle class="ring-fg" cx="32" cy="32" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-final="${offset}"/>
        </svg>
        <span class="skill-ring-pct">${level}%</span>
      </div>`;
  }

  function renderSkillGroups(filter){
    skillsGroups.innerHTML = "";
    const list = filter === "All" ? SKILLS : SKILLS.filter((s) => s.category === filter);
    list.forEach((group) => {
      const wrap = document.createElement("div");
      wrap.className = "skill-group reveal in-view";
      wrap.innerHTML = `<p class="skill-group-title">${group.category}</p><div class="skill-cards"></div>`;
      const cards = wrap.querySelector(".skill-cards");
      group.items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.innerHTML = `
          ${ringMarkup(item.level)}
          <div>
            <div class="skill-name">${item.name}</div>
            <div class="skill-note">${item.note}</div>
          </div>`;
        cards.appendChild(card);
      });
      skillsGroups.appendChild(wrap);
    });

    // animate rings in
    requestAnimationFrame(() => {
      skillsGroups.querySelectorAll(".ring-fg").forEach((ring) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.strokeDashoffset = entry.target.dataset.final;
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        observer.observe(ring);
      });
    });
  }
  renderSkillGroups("All");

  /* ===================== PROJECTS ===================== */
  const projectFilters = document.getElementById("projectFilters");
  const projectGrid = document.getElementById("projectGrid");
  const projectSearch = document.getElementById("projectSearch");
  const projectCats = ["All", ...new Set(PROJECTS.map((p) => p.category))];
  let activeCat = "All";

  projectCats.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn magnetic" + (i === 0 ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      projectFilters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCat = cat;
      renderProjects();
    });
    projectFilters.appendChild(btn);
  });

  function renderProjects(){
    const q = projectSearch.value.trim().toLowerCase();
    const list = PROJECTS.filter((p) => {
      const matchCat = activeCat === "All" || p.category === activeCat;
      const matchQ = !q || p.title.toLowerCase().includes(q) ||
        p.tags.join(" ").toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    projectGrid.innerHTML = "";
    if (!list.length) {
      projectGrid.innerHTML = `<p class="no-results">No projects match “${q}”.</p>`;
      return;
    }
    list.forEach((p) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.innerHTML = `
        <div class="project-thumb">
          <img src="${p.image}" alt="${p.title}" onerror="this.parentElement.classList.add('img-missing')">
          <div class="img-missing-label">RENDER NOT<br>ADDED YET</div>
        </div>
        <div class="project-body">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="project-tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        </div>`;
      projectGrid.appendChild(card);
    });
  }
  renderProjects();
  projectSearch.addEventListener("input", renderProjects);

  /* ===================== CERTIFICATES + LIGHTBOX ===================== */
  const certGrid = document.getElementById("certGrid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  CERTIFICATES.forEach((c) => {
    const card = document.createElement("div");
    card.className = "cert-card magnetic";
    card.innerHTML = `
      <span class="cert-tag">${c.tag}</span>
      <h4>${c.title}</h4>
      <div class="cert-meta">${c.issuer} · ${c.date}</div>
      <div class="cert-thumb">
        <img src="${c.image}" alt="${c.title}" onerror="this.parentElement.classList.add('img-missing')">
        <div class="img-missing-label">CERTIFICATE NOT<br>ADDED YET</div>
      </div>`;
    card.addEventListener("click", () => {
      lightboxImg.src = c.image;
      lightboxImg.alt = c.title;
      lightboxCaption.textContent = `${c.title} — ${c.issuer}, ${c.date}`;
      lightbox.classList.add("open");
    });
    certGrid.appendChild(card);
  });

  function closeLightbox(){ lightbox.classList.remove("open"); }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* ===================== CONTACT FORM ===================== */
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fName").value;
    const email = document.getElementById("fEmail").value;
    const subject = document.getElementById("fSubject").value || "Project Inquiry";
    const message = document.getElementById("fMsg").value;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /* ===================== FOOTER YEAR ===================== */
  document.getElementById("year").textContent = new Date().getFullYear();

})();
