# Portfolio — MD Rubayed AL Imran

Static site, plain HTML/CSS/JS, no build step. Built to deploy directly
on GitHub Pages.

## Deploying to GitHub Pages

1. Create a repository named **exactly** `<your-username>.github.io`
   (e.g. `rubayedalimran.github.io`) — this exact naming is what makes
   GitHub Pages serve it at the root domain instead of a subpath.
2. Push all files in this folder to the `main` branch of that repo:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Source → Deploy from
   branch → `main` / root**. Save.
4. Your site will be live at `https://<your-username>.github.io` within
   a few minutes.

## Adding your own content (photos, videos, resume, certificates)

See **CONTENT-GUIDE.md** — it's the only doc you need for routine
updates. You never need to edit `index.html` or the CSS for text or
media changes; everything routine lives in `js/data.js` and the
`assets/images/` folders.

## File structure

```
index.html          -- page structure (rarely needs edits)
css/style.css        -- all styling
js/data.js            -- ALL editable content lives here
js/main.js            -- renders data.js into the page, handles filtering/modal/lightbox
assets/images/         -- per-project image folders + placeholder.svg
resume/               -- put resume.pdf here
CONTENT-GUIDE.md      -- step-by-step guide for adding your own files later
```

## Local preview

Any static server works, e.g.:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.
