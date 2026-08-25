# ⚙️ Alex Rhodes — Mechanical Engineering Portfolio

A HUD-inspired, arc-reactor-powered portfolio site for a mechanical engineering
student. Built with plain HTML/CSS/JS — no frameworks, no build step — so it's
easy to fork, host on GitHub Pages for free, and keep editing for the rest of
your degree.

**Live demo layout:** boot-up loading sequence → hero with typewriter roles →
animated stats → skill "diagnostics" panels → filterable project grid with
detail modals → education/experience timeline → certifications → testimonial
carousel → contact form.

---

## 🚀 Quick start

1. **Get the files onto GitHub**
   - Create a new repository on GitHub, e.g. `yourusername.github.io` (this
     special name makes it your root portfolio URL) or any name like `portfolio`.
   - Upload all these files to it (drag-and-drop on github.com works, or use
     git — see below).

2. **Turn on GitHub Pages**
   - In your repo: **Settings → Pages**
   - Under "Build and deployment", set **Source: Deploy from a branch**
   - Branch: `main`, folder: `/ (root)` → **Save**
   - Wait ~1 minute, then visit the URL GitHub gives you (something like
     `https://yourusername.github.io/portfolio/`).

3. **Using git from the command line instead:**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

That's it — no `npm install`, no build tools, no dependencies to break.

---

## ✏️ How to edit your content (do this first)

**99% of your editing happens in one file: [`js/data.js`](js/data.js).**

It's a plain JavaScript object holding every piece of text on the site: your
name, bio, stats, skills, projects, timeline, certifications, testimonials,
and contact info. Open it, read the comments at the top, and start replacing
the placeholder content with yours. You don't need to touch `index.html` or
the CSS to update your info.

To **add a new project**, copy one of the existing `{ ... }` blocks inside the
`projects: [ ... ]` array in `data.js`, paste it as a new entry, and edit the
fields. The site automatically re-renders the grid — no other code changes
needed. Same pattern applies to `skillCategories`, `timeline`,
`certifications`, and `testimonials`.

### Replacing placeholder images
Generated placeholder images are already in `assets/img/` so the site works
out of the box. Swap in your own photos/renders with the **same filenames**
(or update the paths in `data.js`) — real photo, real project renders/screenshots,
etc.:

| File | Used for |
|---|---|
| `assets/img/profile.jpg` | About section photo |
| `assets/img/og-cover.jpg` | Social media link preview image (1200×630 recommended) |
| `assets/img/project-*.jpg` | Project card thumbnails |
| `assets/img/favicon.svg` | Browser tab icon (arc reactor mark) |

### Adding your real resume
Drop your PDF at `assets/resume/resume.pdf` (same filename), or change the
path in `data.js` under `meta.resumePdf` and `hero.secondaryCta.href`.

### Connecting the contact form
The form is wired for [Formspree](https://formspree.io) (free tier, no backend
needed):
1. Sign up at formspree.io and create a form — you'll get an endpoint like
   `https://formspree.io/f/abcdwxyz`.
2. Paste it into `contact.formspreeEndpoint` in `data.js`.
3. Done — submissions land in your Formspree inbox/email.

If you skip this, the form will politely tell visitors to email you directly
via the mailto link instead (which always works, no setup needed).

---

## 🎨 Design system reference

If you want to adjust the look, everything is token-based at the top of
[`css/style.css`](css/style.css) under `:root { ... }`:

```css
--red:   #d62828;   /* chili red — primary accent */
--gold:  #ffb800;   /* bold gold — secondary accent */
--bg:    #0a0c10;   /* carbon-black background */
```

Change these and the whole site re-colors — buttons, glows, progress bars,
skill gauges, timeline dots, all reference these variables.

**Fonts** (loaded from Google Fonts in `index.html`):
- `Orbitron` — big display headings (hero name, section titles)
- `Rajdhani` — nav links, labels, eyebrows, buttons
- `Inter` — body paragraphs (kept plain for readability)
- `JetBrains Mono` — stats, spec data, dates, timestamps (gives it that
  "read-out" feel)

---

## ✨ Full feature list

**Motion & first impression**
- Reactor boot-up loading sequence on first visit (skipped on repeat visits
  via `sessionStorage` so it's not annoying)
- Custom crosshair-style cursor (auto-disabled on touch devices)
- Animated blueprint-grid + circuit-node canvas background
- Scroll progress bar (chili-red → gold gradient) fixed to the top of the page
- Scroll-reveal animations on every section (IntersectionObserver-based)
- Typewriter effect cycling through your different role titles
- Animated count-up statistics that trigger when scrolled into view
- Clickable arc-reactor hero graphic with an "overcharge" animation + a
  small easter egg after enough clicks

**Navigation**
- Sticky, blurred header that changes background on scroll
- Scrollspy — nav link highlights automatically based on which section is
  in view
- Mobile hamburger menu with slide-in drawer

**Content sections**
- Hero with name, rotating role titles, stats, and two CTAs (View Projects /
  Download Resume)
- About with photo, bio paragraphs, and a "spec sheet" quick-facts grid
- Skills ("Systems") grouped into categories with animated progress bars
- Projects: filterable by category, card grid, click any card to open a full
  detail modal (description, tools used, your role, outcome, links to
  GitHub/demo/report PDF)
- Education + Experience combined into a single chronological timeline with
  color-coded markers
- Certifications & achievements grid
- Testimonials carousel with auto-rotate and manual dot navigation
- Contact section with a working form + social links + direct email

**Technical / polish**
- Fully responsive down to mobile
- Respects `prefers-reduced-motion` (disables non-essential animation)
- Visible keyboard focus states throughout
- Semantic HTML with ARIA labels on interactive elements
- SEO meta tags + Open Graph tags for nice link previews when shared
- Custom themed 404 page (`404.html`)
- Print-safe (form/nav elements are decorative — resume PDF is the real
  print artifact)
- Zero build step, zero dependencies — just static files GitHub Pages can
  serve directly

---

## 🗂️ File structure

```
├── index.html              → page structure (rarely needs edits)
├── 404.html                → themed not-found page
├── css/
│   └── style.css           → all styling + design tokens
├── js/
│   ├── data.js              → ALL your content — edit this constantly
│   └── main.js              → renders data.js into the page + interactions
├── assets/
│   ├── img/                 → photos, project images, favicon, OG image
│   └── resume/               → your resume PDF + any project report PDFs
└── README.md
```

---

## 🧩 Suggested next steps as you grow this

- Swap placeholder images for real photos/renders as soon as you have them —
  it's the single biggest visual upgrade.
- Add a project the moment you finish it — copy/paste a block in `data.js`,
  takes under 2 minutes.
- Consider a custom domain later: GitHub Pages supports it for free under
  **Settings → Pages → Custom domain**.
- If you eventually want a blog or write-ups per project, each project entry
  already supports a `report` PDF link — or you could extend the modal to
  link out to a full case-study page.

Good luck with the degree — go build something that breaks in an interesting way.
