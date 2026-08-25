/* ============================================================
   MAIN.JS
   Reads PORTFOLIO_DATA (from data.js) and renders it into the
   page, then wires up all interactive behavior.
   You generally shouldn't need to edit this file just to change
   content — edit js/data.js instead.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const D = PORTFOLIO_DATA;

  /* ---------------------------------------------------------
     BOOT SEQUENCE
  --------------------------------------------------------- */
  function runBootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');
    const bootBar = document.getElementById('boot-bar-fill');

    // Skip the boot animation on repeat visits so it doesn't get annoying
    const seen = sessionStorage.getItem('bootSeen');
    const lines = [
      'INITIALIZING PORTFOLIO SYSTEM...',
      'LOADING SKILL MATRIX...',
      'CALIBRATING ARC REACTOR...',
      'SYSTEMS ONLINE.',
    ];

    if (seen) {
      bootScreen.classList.add('boot-hidden');
      return;
    }

    let i = 0;
    let progress = 0;
    bootLog.textContent = lines[0];

    const interval = setInterval(() => {
      progress += 4;
      bootBar.style.width = Math.min(progress, 100) + '%';
      const stage = Math.floor((progress / 100) * lines.length);
      if (stage !== i && stage < lines.length) {
        i = stage;
        bootLog.textContent = lines[i];
      }
      if (progress >= 100) {
        clearInterval(interval);
        bootLog.textContent = lines[lines.length - 1];
        setTimeout(() => {
          bootScreen.classList.add('boot-hidden');
          sessionStorage.setItem('bootSeen', '1');
        }, 400);
      }
    }, 60);
  }

  /* ---------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------- */
  function initCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll('a, button, .project-card, .cert-card').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-active'));
    });
  }

  /* ---------------------------------------------------------
     BACKGROUND BLUEPRINT GRID CANVAS
  --------------------------------------------------------- */
  function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let w, h;
    const nodes = [];
    const NODE_COUNT = 55;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight * 1.0;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // faint blueprint grid
      ctx.strokeStyle = 'rgba(255,255,255,0.025)';
      ctx.lineWidth = 1;
      const gap = 60;
      for (let x = 0; x < w; x += gap) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gap) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // nodes + connecting lines (circuit-board feel)
      nodes.forEach((n, idx) => {
        if (!reduceMotion) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        for (let j = idx + 1; j < nodes.length; j++) {
          const o = nodes[j];
          const d = Math.hypot(n.x - o.x, n.y - o.y);
          if (d < 140) {
            ctx.strokeStyle = `rgba(214,40,40,${0.08 * (1 - d / 140)})`;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(o.x, o.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(255,184,0,0.5)';
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2); ctx.fill();
      });

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------------------------------------------------------
     NAV: inject links, scrollspy, mobile toggle, header bg
  --------------------------------------------------------- */
  function initNav() {
    const navLinks = document.getElementById('nav-links');
    navLinks.innerHTML = D.nav.map(item =>
      `<li><a href="${item.href}">${item.label}</a></li>`
    ).join('');

    const toggle = document.getElementById('nav-toggle');
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));

    const header = document.getElementById('site-header');
    const sections = D.nav.map(n => document.querySelector(n.href)).filter(Boolean);
    const linkEls = navLinks.querySelectorAll('a');

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 40);

      // scroll progress bar
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      document.getElementById('scroll-progress').style.width = pct + '%';

      // scrollspy
      let currentIndex = 0;
      sections.forEach((sec, idx) => {
        if (window.scrollY >= sec.offsetTop - 140) currentIndex = idx;
      });
      linkEls.forEach((l, idx) => l.classList.toggle('active', idx === currentIndex));
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  /* ---------------------------------------------------------
     HERO: text content, typewriter roles, stat counters
  --------------------------------------------------------- */
  function initHero() {
    document.getElementById('hero-eyebrow').append(document.createTextNode(D.hero.eyebrow));
    document.getElementById('hero-name').textContent = D.hero.name;
    document.getElementById('hero-subtext').textContent = D.hero.subtext;

    document.getElementById('hero-ctas').innerHTML = `
      <a class="btn btn-primary" href="${D.hero.primaryCta.href}"><span>${D.hero.primaryCta.label}</span></a>
      <a class="btn btn-outline" href="${D.hero.secondaryCta.href}" download><span>${D.hero.secondaryCta.label}</span></a>
    `;

    const statsWrap = document.getElementById('hero-stats');
    statsWrap.innerHTML = D.hero.stats.map((s, i) => `
      <div class="stat-item">
        <span class="stat-value" data-target="${s.value}" data-suffix="${s.suffix}" id="stat-${i}">0</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `).join('');

    // typewriter
    const el = document.getElementById('hero-role-typed');
    const roles = D.hero.rotatingRoles;
    let roleIdx = 0, charIdx = 0, deleting = false;

    function tick() {
      const current = roles[roleIdx];
      if (!deleting) {
        charIdx++;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIdx--;
        el.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 55);
    }
    tick();

    // counters, triggered on view
    const counters = statsWrap.querySelectorAll('.stat-value');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // arc reactor click easter egg
    const reactor = document.getElementById('hero-reactor');
    let clicks = 0;
    reactor.addEventListener('click', () => {
      reactor.classList.remove('overcharged');
      void reactor.offsetWidth; // restart animation
      reactor.classList.add('overcharged');
      clicks++;
      if (clicks === 5) {
        document.querySelector('.reactor-caption').textContent = 'REACTOR OVERLOAD — NICE.';
      }
    });
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     ABOUT
  --------------------------------------------------------- */
  function initAbout() {
    document.getElementById('about-eyebrow').textContent = D.about.eyebrow;
    document.getElementById('about-heading').textContent = D.about.heading;
    document.getElementById('about-paragraphs').innerHTML =
      D.about.paragraphs.map(p => `<p>${p}</p>`).join('');
    document.getElementById('about-photo').src = D.about.photo;
    document.getElementById('about-photo').alt = D.about.heading;

    document.getElementById('quick-facts').innerHTML = D.about.quickFacts.map(f => `
      <div class="fact">
        <span class="fact-label">${f.label}</span>
        <span class="fact-value">${f.value}</span>
      </div>
    `).join('');
  }

  /* ---------------------------------------------------------
     SKILLS
  --------------------------------------------------------- */
  function initSkills() {
    document.getElementById('skills-eyebrow').textContent = 'SYSTEM DIAGNOSTICS';
    const grid = document.getElementById('skills-grid');
    grid.innerHTML = D.skillCategories.map(cat => `
      <div class="skill-card">
        <h3>${cat.category}</h3>
        ${cat.skills.map(s => `
          <div class="skill-row">
            <div class="skill-row-head">
              <span class="skill-name">${s.name}</span>
              <span class="skill-pct">${s.level}%</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" data-level="${s.level}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');

    const bars = grid.querySelectorAll('.skill-bar-fill');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.level + '%';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => obs.observe(b));
  }

  /* ---------------------------------------------------------
     PROJECTS: filters, grid, modal
  --------------------------------------------------------- */
  function initProjects() {
    const filterWrap = document.getElementById('project-filters');
    const grid = document.getElementById('projects-grid');

    filterWrap.innerHTML = D.projectCategories.map((cat, i) =>
      `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');

    function renderProjects(filter) {
      const list = filter === 'All' ? D.projects : D.projects.filter(p => p.category === filter);
      grid.innerHTML = list.map((p, idx) => `
        <article class="project-card" data-idx="${D.projects.indexOf(p)}" tabindex="0">
          <div class="project-thumb" style="background-image:url('${p.image}')">
            <span class="project-cat-badge">${p.category}</span>
          </div>
          <div class="project-body">
            <h3>${p.title}</h3>
            <p>${p.summary}</p>
            <div class="project-tools">
              ${p.tools.slice(0, 3).map(t => `<span class="tool-chip">${t}</span>`).join('')}
            </div>
            <span class="project-view-more">View Details →</span>
          </div>
        </article>
      `).join('');

      grid.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => openProjectModal(D.projects[card.dataset.idx]));
        card.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') openProjectModal(D.projects[card.dataset.idx]);
        });
      });
    }
    renderProjects('All');

    filterWrap.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterWrap.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(btn.dataset.cat);
      });
    });
  }

  function openProjectModal(p) {
    const modal = document.getElementById('project-modal');
    document.getElementById('modal-content').innerHTML = `
      <img class="modal-img" src="${p.image}" alt="${p.title}" />
      <div class="modal-inner">
        <h3>${p.title}</h3>
        <div class="modal-meta">
          <div><strong>Role</strong>${p.role}</div>
          <div><strong>Category</strong>${p.category}</div>
          <div><strong>Outcome</strong>${p.outcome}</div>
        </div>
        <p class="desc">${p.description}</p>
        <div class="project-tools">${p.tools.map(t => `<span class="tool-chip">${t}</span>`).join('')}</div>
        <div class="modal-links" style="margin-top:1.4rem;">
          ${p.github ? `<a class="btn btn-outline" href="${p.github}" target="_blank" rel="noopener"><span>GitHub Repo</span></a>` : ''}
          ${p.demo ? `<a class="btn btn-outline" href="${p.demo}" target="_blank" rel="noopener"><span>Live Demo</span></a>` : ''}
          ${p.report ? `<a class="btn btn-outline" href="${p.report}" target="_blank" rel="noopener"><span>Full Report (PDF)</span></a>` : ''}
        </div>
      </div>
    `;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function initModal() {
    const modal = document.getElementById('project-modal');
    function close() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    document.getElementById('modal-close').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ---------------------------------------------------------
     TIMELINE
  --------------------------------------------------------- */
  function initTimeline() {
    const track = document.getElementById('timeline-track');
    track.innerHTML = D.timeline.map(item => `
      <div class="timeline-item type-${item.type}">
        <div class="timeline-date">${item.date}</div>
        <h3>${item.title}<span class="timeline-type-tag">${item.type}</span></h3>
        <div class="timeline-org">${item.org}</div>
        <p class="desc">${item.description}</p>
      </div>
    `).join('');
  }

  /* ---------------------------------------------------------
     CERTIFICATIONS
  --------------------------------------------------------- */
  function initCerts() {
    document.getElementById('certs-grid').innerHTML = D.certifications.map(c => `
      <div class="cert-card">
        <div class="cert-name">${c.name}</div>
        <div class="cert-issuer">${c.issuer}</div>
        <span class="cert-year">${c.year}</span>
      </div>
    `).join('');
  }

  /* ---------------------------------------------------------
     TESTIMONIALS CAROUSEL
  --------------------------------------------------------- */
  function initTestimonials() {
    const carousel = document.getElementById('testimonial-carousel');
    const dotsWrap = document.getElementById('testimonial-dots');
    carousel.innerHTML = D.testimonials.map((t, i) => `
      <div class="testimonial-slide ${i === 0 ? 'active' : ''}">
        <blockquote>"${t.quote}"</blockquote>
        <cite><b>${t.name}</b> — ${t.title}</cite>
      </div>
    `).join('');
    dotsWrap.innerHTML = D.testimonials.map((_, i) =>
      `<button class="${i === 0 ? 'active' : ''}" data-i="${i}" aria-label="Show testimonial ${i + 1}"></button>`
    ).join('');

    let current = 0;
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dots = dotsWrap.querySelectorAll('button');

    function show(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = i;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    dots.forEach(d => d.addEventListener('click', () => show(parseInt(d.dataset.i))));

    if (D.testimonials.length > 1) {
      setInterval(() => show((current + 1) % D.testimonials.length), 6000);
    }
  }

  /* ---------------------------------------------------------
     CONTACT
  --------------------------------------------------------- */
  function initContact() {
    document.getElementById('contact-heading').textContent = D.contact.heading;
    document.getElementById('contact-subtext').textContent = D.contact.subtext;
    const emailLink = document.getElementById('contact-email-link');
    emailLink.href = `mailto:${D.contact.email}`;
    emailLink.textContent = D.contact.email;

    const icons = {
      github: '<svg viewBox="0 0 24 24"><path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.78 10.77.57.1.78-.25.78-.55v-2.1c-3.16.69-3.83-1.36-3.83-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.24 1.17-3.03-.12-.29-.5-1.46.11-3.05 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.61 1.59.23 2.76.11 3.05.73.79 1.17 1.79 1.17 3.03 0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.11v3.13c0 .3.21.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5z"/></svg>',
      linkedin: '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>',
      mail: '<svg viewBox="0 0 24 24"><path d="M2 4h20c.55 0 1 .45 1 1v14c0 .55-.45 1-1 1H2c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1zm1.4 2L12 12.5 20.6 6H3.4zM21 7.4l-8.7 6.4a1 1 0 0 1-1.18 0L2.4 7.4V18h18.6V7.4z"/></svg>',
    };
    document.getElementById('social-links').innerHTML = D.contact.socials.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}">${icons[s.icon] || ''}</a>
    `).join('');

    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!D.contact.formspreeEndpoint) {
        status.textContent = 'Form endpoint not configured — see README to connect Formspree, or email me directly.';
        return;
      }
      status.textContent = 'Transmitting...';
      try {
        const res = await fetch(D.contact.formspreeEndpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        status.textContent = res.ok
          ? 'Message sent. I\'ll get back to you soon.'
          : 'Something went wrong — try emailing me directly.';
        if (res.ok) form.reset();
      } catch {
        status.textContent = 'Network error — try emailing me directly.';
      }
    });
  }

  /* ---------------------------------------------------------
     MISC: footer, favicon fallback, scroll-reveal, resume link
  --------------------------------------------------------- */
  function initMisc() {
    document.getElementById('footer-text').textContent = D.footer.text;

    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ---------------------------------------------------------
     INIT ALL
  --------------------------------------------------------- */
  runBootSequence();
  initCursor();
  initBackgroundCanvas();
  initNav();
  initHero();
  initAbout();
  initSkills();
  initProjects();
  initModal();
  initTimeline();
  initCerts();
  initTestimonials();
  initContact();
  initMisc();
});
