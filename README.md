# Portfolio

A dark, "engineered in red & gold" mechanical-engineering portfolio. Pure
HTML/CSS/JS — no build step, no framework, no backend. Deploys anywhere
static (GitHub Pages, Vercel, Netlify).

## What's built in
- Custom loading sequence ("CALIBRATING SYSTEMS") with a signature animated
  **reactor mark** (a hybrid of a machined bolt-ring and a pulsing core) used
  as the logo, hero visual, and footer mark
- Gold/red scroll-progress bar + shrinking blur nav with active-section highlighting
- Magnetic custom cursor that expands over links/buttons/cards (disabled
  automatically on touch devices and when the OS "reduce motion" setting is on)
- Scroll-triggered reveal animations, animated stat counters, animated skill rings
- Filterable + searchable project grid, filterable skills, certificate grid with
  a full-screen lightbox
- Light/dark theme toggle (persisted in localStorage)
- Contact form that opens the visitor's email client pre-filled (no backend needed)
- Fully responsive, keyboard-focus-visible, respects `prefers-reduced-motion`

## Adding your real content
See **`CONTENT-GUIDE.md`** — everything is edit-by-file in `js/data.js`, no
HTML/CSS knowledge required. Until real images are added, project and
certificate cards show a clean "not added yet" placeholder instead of any
fake/stock image.

## Deploy to GitHub Pages
1. Create a repo named exactly `<your-username>.github.io`
2. Push all these files to the `main` branch
3. In the repo Settings → Pages, set the source to the `main` branch, root folder
4. Your site is live at `https://<your-username>.github.io`

## Deploy to Vercel
1. `vercel` → follow prompts, or connect the GitHub repo in the Vercel dashboard
2. No build command needed — it's a static site (Framework Preset: "Other")

## File structure
```
index.html
css/style.css
js/data.js        ← all editable content (projects, certs, skills, timeline)
js/main.js        ← all interactivity
assets/images/profile/       ← your photo
assets/images/projects/      ← project renders
assets/images/certificates/  ← certificate scans
resume/resume.pdf            ← your resume
```
