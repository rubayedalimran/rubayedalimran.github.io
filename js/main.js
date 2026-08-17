// ============================================================
// RENDER — pulls everything from data.js. Edit data.js, not this file.
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  renderNavAndHero();
  renderAbout();
  renderSkills();
  renderFilters();
  renderProjects();
  renderCertifications();
  renderResumeAndContact();
  renderFooter();
  wireInteractions();
  wireScrollReveal();
  updateTitleBlock("home");
});

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function renderNavAndHero() {
  document.getElementById("nav-mark").innerHTML = `${SITE.name.split(" ")[0]}<span>.</span>`;
  document.getElementById("hero-name").textContent = SITE.name;
  document.getElementById("hero-role").textContent = SITE.role;
  document.getElementById("hero-statement").textContent = SITE.heroStatement;
  document.title = `${SITE.name} — ${SITE.role}`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", SITE.heroStatement);
  const og = document.querySelector('meta[property="og:description"]');
  if (og) og.setAttribute("content", SITE.heroStatement);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", `${SITE.name} — ${SITE.role}`);
}

function renderAbout() {
  document.getElementById("about-text").innerHTML = `<p>${SITE.about}</p>`;
  document.getElementById("about-location").textContent = SITE.location;
  document.getElementById("about-focus").textContent = SITE.role;
}

function renderSkills() {
  const wrap = document.getElementById("skills-grid");
  Object.entries(SKILLS).forEach(([group, items]) => {
    const card = el("div", "skill-card reveal");
    card.appendChild(el("h3", null, group));
    const ul = el("ul");
    items.forEach(i => ul.appendChild(el("li", null, i)));
    card.appendChild(ul);
    wrap.appendChild(card);
  });
}

function renderFilters() {
  const wrap = document.getElementById("filters");
  FILTERS.forEach((f, i) => {
    const btn = el("button", "filter-btn" + (i === 0 ? " active" : ""), f);
    btn.dataset.filter = f;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(f);
    });
    wrap.appendChild(btn);
  });
}

function applyFilter(filter) {
  document.querySelectorAll(".project-card, .secondary-card").forEach(card => {
    const tags = (card.dataset.tags || "").split("|");
    const show = filter === "All" || tags.includes(filter);
    card.style.display = show ? "" : "none";
  });
}

function renderProjects() {
  const majorWrap = document.getElementById("major-grid");
  const secondaryWrap = document.getElementById("secondary-grid");
  const minorWrap = document.getElementById("minor-grid");

  PROJECTS.filter(p => p.tier === "major").forEach(p => {
    const card = el("article", "project-card reveal");
    card.dataset.tags = p.tags.join("|");
    card.dataset.slug = p.slug;
    card.innerHTML = `
      <div class="thumb"><img src="${p.images[0]}" alt="${p.title}" loading="lazy"></div>
      <div class="body">
        <span class="status-chip">${p.statusLabel}</span>
        <h3>${p.title}</h3>
        <div class="subtitle">${p.subtitle} · ${p.dates}</div>
        <p class="desc">${p.overview}</p>
        <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        <span class="view-link">VIEW CASE STUDY →</span>
      </div>`;
    card.addEventListener("click", () => openModal(p.slug));
    majorWrap.appendChild(card);
  });

  PROJECTS.filter(p => p.tier === "secondary").forEach(p => {
    const card = el("article", "secondary-card reveal");
    card.dataset.tags = p.tags.join("|");
    card.innerHTML = `
      <h4>${p.title}</h4>
      <div class="subtitle">${p.subtitle} · ${p.dates}</div>
      <p class="desc">${p.overview}</p>`;
    card.addEventListener("click", () => openModal(p.slug));
    secondaryWrap.appendChild(card);
  });

  PROJECTS.filter(p => p.tier === "minor").forEach(p => {
    const card = el("div", "minor-card");
    card.innerHTML = `
      <h4>${p.title}</h4>
      <div class="subtitle">${p.subtitle} · ${p.dates}</div>
      <p class="desc">${p.overview}</p>`;
    minorWrap.appendChild(card);
  });
}

function openModal(slug) {
  const p = PROJECTS.find(x => x.slug === slug);
  if (!p) return;
  const overlay = document.getElementById("modal-overlay");
  const modal = document.getElementById("modal");

  const sections = [];
  if (p.objective) sections.push(["Objective", p.objective]);
  if (p.myRole) sections.push(["My Role", p.myRole]);
  if (p.process) sections.push(["Design Process", p.process]);
  if (p.decisions) sections.push(["Engineering Decisions", p.decisions]);
  if (p.testing) sections.push(["Testing", p.testing]);
  if (p.problems) sections.push(["Problems & Iterations", p.problems]);
  if (p.futureImprovements) sections.push(["Future Improvements", p.futureImprovements]);

  modal.innerHTML = `
    <button class="modal-close" aria-label="Close">✕</button>
    <span class="status-chip">${p.statusLabel || ""}</span>
    <h2>${p.title}</h2>
    <div class="subtitle">${p.subtitle} · ${p.dates}${p.contribution ? " · " + p.contribution : ""}</div>
    <div class="modal-section"><h3>Overview</h3><p>${p.overview}</p></div>
    ${sections.map(([h, t]) => `<div class="modal-section"><h3>${h}</h3><p>${t}</p></div>`).join("")}
    <div class="modal-section">
      <h3>Gallery</h3>
      <div class="modal-gallery">${p.images.map(src => `<img src="${src}" alt="${p.title} image" loading="lazy">`).join("")}</div>
    </div>
    <div class="modal-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
  `;
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.querySelectorAll(".modal-gallery img").forEach(img => {
    img.addEventListener("click", () => openLightbox(img.src));
  });
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  updateTitleBlock(slug, p.title);
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function openLightbox(src) {
  const lb = document.getElementById("lightbox");
  lb.querySelector("img").src = src;
  lb.classList.add("open");
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}

function renderCertifications() {
  const wrap = document.getElementById("cert-wrap");
  if (!CERTIFICATIONS.length) {
    wrap.innerHTML = `<div class="cert-empty">No certifications added yet. Add them in <code>js/data.js</code> under <code>CERTIFICATIONS</code> — name, issuer, date, and an optional link.</div>`;
    return;
  }
  const list = el("div", "cert-list");
  CERTIFICATIONS.forEach(c => {
    const card = el("div", "cert-card");
    card.innerHTML = `<h4>${c.name}</h4><div class="meta">${c.issuer} · ${c.date}${c.link ? ` · <a href="${c.link}" target="_blank" rel="noopener">Credential ↗</a>` : ""}</div>`;
    list.appendChild(card);
  });
  wrap.appendChild(list);
}

function renderResumeAndContact() {
  document.getElementById("resume-link").href = SITE.resumePath;
  document.getElementById("contact-email").href = `mailto:${SITE.email}`;
  document.getElementById("contact-email").textContent = SITE.email;
  document.getElementById("contact-linkedin").href = SITE.linkedin;
  document.getElementById("contact-github").href = SITE.github;
}

function renderFooter() {
  document.getElementById("footer-name").textContent = SITE.name;
  document.getElementById("footer-role").textContent = SITE.role;
  document.getElementById("footer-github").href = SITE.github;
  document.getElementById("footer-linkedin").href = SITE.linkedin;
  document.getElementById("footer-email").href = `mailto:${SITE.email}`;
  document.getElementById("footer-year").textContent = new Date().getFullYear();
}

function wireInteractions() {
  const toggle = document.getElementById("nav-toggle");
  const mobile = document.getElementById("nav-mobile");
  toggle.addEventListener("click", () => mobile.classList.toggle("open"));
  mobile.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobile.classList.remove("open")));

  document.getElementById("modal-overlay").addEventListener("click", e => {
    if (e.target.id === "modal-overlay") closeModal();
  });
  document.getElementById("lightbox").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal(); closeLightbox(); }
  });
}

function wireScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.12 });
  items.forEach(i => obs.observe(i));
}

function updateTitleBlock(sheet, title) {
  const tb = document.getElementById("titleblock");
  if (!tb) return;
  tb.innerHTML = `
    <span>SHEET</span><strong>${sheet.toUpperCase().slice(0,3)}</strong>
    <span>TITLE</span><strong>${title || "PORTFOLIO"}</strong>
    <span>SCALE</span><strong>NTS</strong>
    <span>DRAWN BY</span><strong>${SITE.name.split(" ")[0].toUpperCase()}</strong>
  `;
}
