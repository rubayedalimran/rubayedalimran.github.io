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
      window.requestIdleCallback ? window.requestIdleCallback(initReactor3D) : setTimeout(initReactor3D, 200);
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
          window.requestIdleCallback ? window.requestIdleCallback(initReactor3D) : setTimeout(initReactor3D, 200);
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

    initCursorRepulsor();
  }

  /* ---------------------------------------------------------
     CURSOR REPULSOR — spark trail + click-pulse ring
     Priority 3 upgrade: replaces the plain lag-ring trail feel with a
     handful of fading gold sparks, plus an expanding "repulsor pulse"
     ring on click. Canvas-based and intentionally cheap:
       - hard-capped particle count (never grows unbounded)
       - spawn rate throttled independent of mouse-move frequency
       - clears + redraws each frame rather than accumulating DOM nodes
       - fully skipped for prefers-reduced-motion and touch/coarse
         pointers, matching the existing cursor's own gating
  --------------------------------------------------------- */
  function initCursorRepulsor() {
    const canvas = document.getElementById('cursor-fx');
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (reduceMotion || coarsePointer) return;

    const ctx = canvas.getContext('2d');
    let w, h;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const MAX_SPARKS = 40;
    const SPARK_SPAWN_INTERVAL_MS = 25;
    const sparks = [];
    const pulses = [];

    let lastSparkAt = 0;
    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSparkAt < SPARK_SPAWN_INTERVAL_MS) return;
      lastSparkAt = now;
      if (sparks.length >= MAX_SPARKS) sparks.shift();
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        life: 0,
        maxLife: 400 + Math.random() * 250,
        size: 1 + Math.random() * 1.8,
      });
    });

    window.addEventListener('click', (e) => {
      pulses.push({ x: e.clientX, y: e.clientY, radius: 4, alpha: 0.9 });
    });

    let lastFrame = performance.now();
    function draw(now) {
      requestAnimationFrame(draw);
      const dt = Math.min(now - lastFrame, 48); // clamp so a stalled tab doesn't jump particles
      lastFrame = now;
      ctx.clearRect(0, 0, w, h);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.maxLife) { sparks.splice(i, 1); continue; }
        s.x += s.vx * dt * 0.06;
        s.y += s.vy * dt * 0.06;
        const p = s.life / s.maxLife;
        const alpha = (1 - p) * 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (1 - p * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.fill();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += dt * 0.09;
        p.alpha -= dt * 0.0022;
        if (p.alpha <= 0) { pulses.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 184, 0, ${p.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        // hotter inner edge, trailing slightly behind the outer ring
        const innerR = Math.max(p.radius - 6, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, innerR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 30, 30, ${p.alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
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

    // arc reactor click easter egg — shared between the SVG fallback and
    // the 3D reactor (see initReactor3D), so the overload counter/caption
    // stays correct no matter which visual is active.
    const reactor = document.getElementById('hero-reactor');
    reactor.addEventListener('click', () => {
      reactor.classList.remove('overcharged');
      void reactor.offsetWidth; // restart animation
      reactor.classList.add('overcharged');
      handleReactorClick();
    });
  }

  let reactorClickCount = 0;
  function handleReactorClick() {
    reactorClickCount++;
    if (reactorClickCount === 5) {
      const caption = document.querySelector('.reactor-caption');
      if (caption) caption.textContent = 'REACTOR OVERLOAD — NICE.';
    }
    document.dispatchEvent(new CustomEvent('reactor:overcharge'));
  }

  /* ---------------------------------------------------------
     3D ARC REACTOR (Three.js, via CDN — see index.html)
     Progressive enhancement over the CSS/SVG reactor above:
     - only runs if THREE loaded successfully and the visitor
       doesn't prefer reduced motion
     - on any failure it just leaves the SVG fallback in place
     - lazy-initialized after the boot sequence finishes so it
       never competes with first paint / boot animation
  --------------------------------------------------------- */
  function initReactor3D() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // SVG fallback stays as-is

    const wrap = document.getElementById('hero-reactor-wrap');
    const mount = document.getElementById('hero-reactor-3d');
    if (!wrap || !mount || typeof THREE === 'undefined') return;

    try {
      const width = mount.clientWidth || 340;
      const height = mount.clientHeight || 340;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 7);
      const camBase = { x: 0, y: 0 };

      scene.add(new THREE.AmbientLight(0x2a2e35, 1.4));
      const coreLight = new THREE.PointLight(0xffd700, 3, 12);
      coreLight.position.set(0, 0, 3);
      scene.add(coreLight);
      const rimLight = new THREE.PointLight(0xd62828, 1.5, 12);
      rimLight.position.set(-3, 2, 2);
      scene.add(rimLight);

      // Independently-rotating rings
      const ringDefs = [
        { radius: 2.55, tube: 0.045, color: 0x8b0000, emissive: 0xff1e1e, speed: 0.006, axis: 'z' },
        { radius: 2.05, tube: 0.04, color: 0xc99700, emissive: 0xffd700, speed: -0.009, axis: 'y' },
        { radius: 1.55, tube: 0.06, color: 0xff1e1e, emissive: 0xff1e1e, speed: 0.014, axis: 'x' },
      ];
      const ringsGroup = new THREE.Group();
      const rings = ringDefs.map((def) => {
        const geo = new THREE.TorusGeometry(def.radius, def.tube, 16, 72);
        const mat = new THREE.MeshStandardMaterial({
          color: def.color,
          emissive: def.emissive,
          emissiveIntensity: 0.55,
          metalness: 0.75,
          roughness: 0.3,
        });
        const mesh = new THREE.Mesh(geo, mat);
        ringsGroup.add(mesh);
        return { mesh, ...def };
      });
      scene.add(ringsGroup);

      // Core
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 1.3,
        metalness: 0.4,
        roughness: 0.25,
      });
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), coreMat);
      scene.add(core);
      const coreInnerMat = new THREE.MeshBasicMaterial({ color: 0xfff2c2 });
      const coreInner = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 24), coreInnerMat);
      scene.add(coreInner);

      // Mouse parallax tilt toward cursor, relative to the wrap element
      let targetRotX = 0, targetRotY = 0;
      function onPointerMove(e) {
        const rect = wrap.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotY = nx * 0.55;
        targetRotX = -ny * 0.4;
      }
      window.addEventListener('mousemove', onPointerMove);

      // Overcharge: light-intensity spike + camera shake, decaying over time
      let shakeIntensity = 0;
      let overcharging = false;
      function triggerOvercharge() {
        overcharging = true;
        shakeIntensity = 0.4;
        coreLight.intensity = 9;
        coreMat.emissiveIntensity = 3;
      }
      mount.style.cursor = 'pointer';
      mount.addEventListener('click', () => {
        const reactorEl = document.getElementById('hero-reactor');
        if (reactorEl) {
          reactorEl.classList.remove('overcharged');
          void reactorEl.offsetWidth;
          reactorEl.classList.add('overcharged');
        }
        triggerOvercharge();
        handleReactorClick();
      });
      // Stay in sync if overcharge is ever triggered elsewhere
      document.addEventListener('reactor:overcharge', () => {
        if (!overcharging) triggerOvercharge();
      });

      function animate() {
        requestAnimationFrame(animate);

        rings.forEach((r) => { r.mesh.rotation[r.axis] += r.speed; });
        ringsGroup.rotation.x += (targetRotX - ringsGroup.rotation.x) * 0.06;
        ringsGroup.rotation.y += (targetRotY - ringsGroup.rotation.y) * 0.06;

        if (shakeIntensity > 0.002) {
          camera.position.x = camBase.x + (Math.random() - 0.5) * shakeIntensity;
          camera.position.y = camBase.y + (Math.random() - 0.5) * shakeIntensity;
          shakeIntensity *= 0.9;
          coreLight.intensity += (3 - coreLight.intensity) * 0.07;
          coreMat.emissiveIntensity += (1.3 - coreMat.emissiveIntensity) * 0.07;
        } else {
          overcharging = false;
          camera.position.x = camBase.x;
          camera.position.y = camBase.y;
        }

        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);

      window.addEventListener('resize', () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      });

      // Everything above succeeded — swap the visible reactor to 3D
      wrap.classList.add('reactor-3d-active');
    } catch (err) {
      // Any failure (WebGL unavailable, context creation error, etc.)
      // just leaves the SVG reactor as the visible one.
      console.warn('3D reactor unavailable, using SVG fallback:', err);
    }
  }

  // Overshoot-then-settle easing ("easeOutBack") — gives counters a
  // measured, targeting-reticle-locking feel instead of a plain
  // linear/ease-out count-up. Briefly overshoots the target value then
  // settles back, per the HUD calibration pass.
  function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1100;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = easeOutBack(p);
      const value = Math.max(0, Math.round(target * eased));
      el.textContent = value + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target + suffix; // land exactly on target, no residual overshoot
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
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    filterWrap.innerHTML = D.projectCategories.map((cat, i) =>
      `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');

    // decorative telemetry bars — purely visual, count/heights don't mean anything
    const telemetryBars = Array.from({ length: 8 }, () => '<span></span>').join('');

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
            <div class="telemetry-strip" aria-hidden="true">${telemetryBars}</div>
            <span class="project-view-more">View Details →</span>
          </div>
        </article>
      `).join('');

      grid.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => openProjectModal(D.projects[card.dataset.idx]));
        card.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') openProjectModal(D.projects[card.dataset.idx]);
        });
        if (!reduceMotion) attachCardTilt(card);
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

  // Subtle 3D tilt-on-hover, following cursor position within the card
  // (~6deg max, CSS transform driven by JS-set custom properties — no
  // library). Skipped entirely under prefers-reduced-motion.
  function attachCardTilt(card) {
    const MAX_TILT_DEG = 6;
    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const tiltX = (py - 0.5) * -2 * MAX_TILT_DEG;
      const tiltY = (px - 0.5) * 2 * MAX_TILT_DEG;
      card.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
    }
    function onLeave() {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    }
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  }

  function openProjectModal(p) {
    const modal = document.getElementById('project-modal');
    const specs = p.specs || [];
    const gallery = (p.gallery && p.gallery.length) ? p.gallery : [p.image];

    document.getElementById('modal-content').innerHTML = `
      <img class="modal-img" src="${p.image}" alt="${p.title}" />
      <div class="modal-inner">
        <h3>${p.title}</h3>
        <div class="modal-meta">
          <div><strong>Role</strong>${p.role}</div>
          <div><strong>Category</strong>${p.category}</div>
          <div><strong>Outcome</strong>${p.outcome}</div>
        </div>

        <div class="modal-tabs" role="tablist">
          <button class="modal-tab active" data-tab="overview" role="tab" aria-selected="true">Overview</button>
          <button class="modal-tab" data-tab="specs" role="tab" aria-selected="false">Specs</button>
          <button class="modal-tab" data-tab="gallery" role="tab" aria-selected="false">Gallery</button>
        </div>

        <div class="modal-tab-panel active" data-panel="overview" role="tabpanel">
          <p class="desc">${p.description}</p>
          <div class="project-tools">${p.tools.map(t => `<span class="tool-chip">${t}</span>`).join('')}</div>
          <div class="modal-links">
            ${p.github ? `<a class="btn btn-outline" href="${p.github}" target="_blank" rel="noopener"><span>GitHub Repo</span></a>` : ''}
            ${p.demo ? `<a class="btn btn-outline" href="${p.demo}" target="_blank" rel="noopener"><span>Live Demo</span></a>` : ''}
            ${p.report ? `<a class="btn btn-outline" href="${p.report}" target="_blank" rel="noopener"><span>Full Report (PDF)</span></a>` : ''}
          </div>
        </div>

        <div class="modal-tab-panel" data-panel="specs" role="tabpanel">
          ${specs.length
            ? specs.map(s => `
                <div class="spec-row">
                  <span class="spec-label">${s.label}</span>
                  <span class="spec-value">${s.value}</span>
                </div>
              `).join('')
            : '<p class="desc">No additional specs listed for this project yet.</p>'}
        </div>

        <div class="modal-tab-panel" data-panel="gallery" role="tabpanel">
          <div class="modal-gallery-grid">
            ${gallery.map(src => `<img src="${src}" alt="${p.title} photo" loading="lazy" />`).join('')}
          </div>
        </div>
      </div>
    `;

    const tabs = modal.querySelectorAll('.modal-tab');
    const panels = modal.querySelectorAll('.modal-tab-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(panel => panel.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        modal.querySelector(`.modal-tab-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
      });
    });

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
