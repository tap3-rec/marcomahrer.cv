# marcomahrer.cv

Personal profile and writing for Marco Mahrer. Static site built with Jekyll and served by GitHub Pages from the `main` branch.

## Structure

- `index.html` — the profile (hero, numbers, approach, work, writing, toolkit, contact)
- `blog/index.html` — blog index, lists everything in `_posts/`
- `_posts/YYYY-MM-DD-slug.md` — one markdown file per post
- `_layouts/default.html` — page shell (head, nav, footer)
- `_layouts/post.html` — article layout
- `assets/css/site.css`, `assets/js/site.js`, `assets/img/`, `assets/Marco-Mahrer-CV.pdf`
- `tools/preview.mjs` — local preview renderer (GitHub builds the real site with Jekyll)

## Languages

The profile exists in English (`index.html`) and German (`de/index.html`); the writing index too (`blog/index.html`, `de/blog/index.html`). Both are edited by hand and must be kept in sync. Posts are written once, in whichever language, and get a `lang: de` front-matter key when German. The German index tags English posts.

## Adding a post

Create `_posts/2026-10-01-my-title.md`:

```markdown
---
layout: post
title: My title
description: One sentence shown on cards and in search results.
---

Body in markdown.
```

The URL becomes `/blog/my-title/`. Then run `node tools/og.mjs` to generate the post's social preview image (used when the link is shared on LinkedIn, X, Slack, iMessage). Push to `main` and GitHub Pages rebuilds within a minute or two.

Every post ends with a share bar (LinkedIn, X, email, copy link, and the native share sheet on phones).

Optional stat callouts inside a post:

```html
<div class="figures">
<div><b>70%</b><span>time spent on admin</span></div>
</div>
```

## Previewing locally

```bash
npm install
node tools/preview.mjs
```

Then open http://localhost:4747. The preview renders the same layouts and posts with a small Liquid subset; the production build is Jekyll on GitHub.

## Updating the CV PDF

Replace `assets/Marco-Mahrer-CV.pdf` (English) and `assets/Marco-Mahrer-Lebenslauf.pdf` (German). The English pages link the first, the German pages the second, and the German contact section links both. The German PDF is built in career-ops from `cv-de.md` with `templates/cv-template-de.html`.
