# Content Guide — How to Add Your Own Files Later

This site has no backend, so there's no login/admin panel — it's a static
site (required for GitHub Pages). Instead, it's built so that **you only
ever need to touch one file for content, and drop files into folders for
media.** No HTML or CSS editing needed for routine updates.

## 1. Adding project photos or CAD renders

1. Find the project's image folder under `assets/images/`:
   - `assets/images/rc-aircraft/`
   - `assets/images/human-tracking-robot/`
   - `assets/images/drift-car/`
   - `assets/images/animatronics/`
   - `assets/images/otto-bot/`
   - `assets/images/line-follower/`
   - `assets/images/ai-assistant/`
   - `assets/images/cad-general/`
2. Drop your image file(s) in there (`.jpg`, `.png`, or `.webp` — keep
   each under ~500KB if you can, for fast loading).
3. Open `js/data.js`, find that project's entry, and add the path to its
   `images` array, e.g.:
   ```js
   images: [
     "assets/images/rc-aircraft/wing-cad-render.jpg",
     "assets/images/rc-aircraft/prototype-flight-test.jpg"
   ]
   ```
4. Save and refresh the page — the placeholder graphic is automatically
   replaced anywhere that image is used (thumbnail, case-study gallery).

Leave the placeholder path (`assets/images/placeholder.svg`) in the array
for any project you don't have real photos for yet — don't delete it or
leave the array empty, or the layout will break.

## 2. Adding a video

1. Drop the `.mp4` file into the same project folder as above.
2. In `js/data.js`, set that project's `video` field to the path, e.g.
   `video: "assets/images/drift-car/first-drift-test.mp4"`.
3. (Videos aren't auto-embedded in the current layout — ask Claude to
   wire in a `<video>` element in the modal once you have real footage,
   so it's only added when there's something real to show.)

## 3. Adding your resume PDF

Save your resume as `resume.pdf` and place it directly in the `resume/`
folder, replacing nothing else — the Download Resume buttons already
point to `resume/resume.pdf`.

## 4. Adding certifications

Open `js/data.js` and find the `CERTIFICATIONS` array near the bottom.
Add one object per certificate:
```js
{ name: "Certificate Name", issuer: "Issuing Organization", date: "MM/YYYY", link: "https://..." }
```
The empty-state message disappears automatically once this array isn't empty.

## 5. Editing any text (hero statement, about paragraph, project descriptions)

All of it lives in `js/data.js` under `SITE` (hero/about/contact) and
`PROJECTS` (per-project text). Nothing in `index.html` needs to change.

## 6. Updating your GitHub/LinkedIn links

Also in `js/data.js`, under `SITE.github` and `SITE.linkedin`.

## A note on honesty

Two projects (human-tracking robot, and the drift car before it was
tested) are marked with real status — "In Development" or
"Prototype — Tested" — rather than being shown as finished. When you
update these with new results, update the `status` / `statusLabel` and
the `testing` / `problems` fields in `data.js` to match reality, not just
the images. That accuracy is part of what makes this credible to
engineers reviewing it.
