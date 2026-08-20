# Content Guide

Everything you'll ever need to update lives in **`js/data.js`**. You never need
to touch the HTML or CSS to add real content.

## Add your photo
1. Save a portrait photo as `profile.jpg`
2. Drop it in `assets/images/profile/`
Until it's there, the About section shows a clean "ADD PHOTO" placeholder frame instead of a fake image.

## Add project renders
1. Export/save an image for each project (jpg or png, ~1200px wide looks best)
2. Drop it in `assets/images/projects/`
3. Open `js/data.js`, find the `PROJECTS` array, and set the `image` field for
   that project to the filename you used, e.g.:
   ```js
   image: "assets/images/projects/ferrari-f1.jpg"
   ```
Add a whole new project by copying one of the existing `{ ... }` blocks in the array.

## Add certificates
Same pattern as projects, but in the `CERTIFICATES` array and
`assets/images/certificates/`.

## Add/edit skills
Edit the `SKILLS` array — each category has an `items` array with a `name`,
`level` (0–100, drives the animated ring) and `note` (e.g. "Advanced").

## Update your resume
Save your resume as `resume.pdf` and drop it directly in the `resume/` folder.
The Resume button in the nav already points to `resume/resume.pdf`.

## Update contact info
- Email: change `CONTACT_EMAIL` at the bottom of `js/data.js` (this also
  powers the contact form, which opens the visitor's email client pre-filled).
- Phone / location: edit directly in `index.html` inside the `#contact` section
  (search for the phone number / "Khulna, Bangladesh").

## Social links
In `index.html`, search for `PROFESSIONAL NETWORKS`-equivalent — actually the
LinkedIn/GitHub links live in the footer (`<footer class="footer">`). Replace
the `href="https://linkedin.com"` and `href="https://github.com"` placeholders
with your real profile URLs.

## Colors / theme
All colors are CSS variables at the top of `css/style.css` under `:root` (dark
theme) and `html[data-theme="light"]` (light theme toggle). Change `--red` and
`--gold` to retune the palette without touching anything else.
