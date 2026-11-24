# Gopi Krishna Kanugula: portfolio

This is my personal site. It has five pages:

- **Home**
- **Work**: a timeline and two case studies
- **Projects**: with diagrams
- **Writing**: posts
- **About**

It's built with React and Tailwind CSS. Every page is prerendered to plain HTML at build time, so it reads fine with JavaScript off. GitHub Actions builds, tests and deploys it on every push to `main`, so the built files are never committed.

There is also a `/styleguide/` page (not linked, not indexed) that shows every color, type size, control and diagram in one place.

## How it works

- **Prerendering.** `scripts/build.mjs` renders each page with React on the server (`src/entry-server.jsx`) and writes plain HTML into `dist/`. Posts are Markdown, converted with `marked`.
- **Islands.** Most of the page is static HTML. Only three parts run React in the browser: the career run on Home, the animated diagrams, and the post filter on Writing. Each is wrapped in `<Island>` (`src/components/ui.jsx`). `src/entry-client.jsx` is about 1 KB of plain JavaScript: it handles the theme and motion toggles and the phone panels, and loads React (`src/hydrate.jsx`) only when an island comes near the screen.
- **Motion.** Animations play while they are on screen and pause when you scroll past them. The footer has a pause button that stops all of them, and `prefers-reduced-motion` is respected.
- **Phones.** Long detail (era work lists, case study phases) is folded behind a "Show ..." button below 768px. Without JavaScript it stays open.
- **Assets.** CSS and JS file names carry a content hash, so browsers can cache them for a long time.
- **SEO.** Each page gets a canonical URL, Open Graph and Twitter tags, and JSON-LD (Person on Home, BlogPosting on posts). The build also writes `sitemap.xml`, `robots.txt` and an RSS feed at `writing/feed.xml`. Drafts are left out of all three. The share image is `assets/img/og.png`; to change it, edit `scripts/og-card.html` and take a 1200x630 screenshot of it.

## Build and preview

You need Node.js 20 or newer.

```
npm install
npm run build              # builds the site into dist/
npm run preview            # serves dist/ at http://localhost:8000
```

`npm run dev` rebuilds whenever something in `src/` or `content/` changes. `dist/` is ignored by git: you only commit source files, and GitHub Actions builds the site.

## Edit content

| What | Where |
| --- | --- |
| Name, email, links, nav, availability | `src/data/site.js` |
| Home hero, focus areas, career run, terminal lines | `src/data/home.js` |
| Work timeline and case studies | `src/data/work.js` |
| Projects (milestones, diagrams, checklists) | `src/data/projects.js` |
| About (bio, principles, now, toolbox, education) | `src/data/about.js` |
| Blog posts | `content/posts/<slug>.md` (one file per post) |
| Page layouts | `src/pages/*.jsx` |
| Shared pieces (sections, buttons, chips, stats, panels) | `src/components/ui.jsx` |
| Diagrams (SVG, one per topic) | `src/components/Diagrams.jsx` |
| Interactive parts (islands) | `src/islands/`, registered in `src/hydrate.jsx` |
| Colors, fonts, text roles | `src/styles.css`, as documented in `design-system/gopi-portfolio/MASTER.md` |

### Writing a post

Create `content/posts/my-post.md`:

```
---
title: My post title
summary: One sentence shown in lists and under the title.
date: 2026-11-20
read: 5 min
tags: CI/CD, Security
draft: false
---
First paragraph.

## A heading

More text, with `inline code`.
```

Fenced code blocks with three backticks work too. The file name becomes the URL: `writing/my-post/`. Straight quotes and `...` are turned into curly quotes and `…` automatically (except inside code).

**The four posts included now are drafts written for you to review.** They are marked `draft: true` and show a "Draft" label. Rewrite them in your own words and set `draft: false`, or delete them. To hide every draft, build with `SHOW_DRAFTS=false npm run build`, or set `SHOW_DRAFTS` in `scripts/build.mjs`.

## Design system and reviews

| File | What it is |
| --- | --- |
| `design-system/gopi-portfolio/MASTER.md` | Palette (light and dark), type roles, spacing, buttons, cards, chart colors, anti-patterns, checklist |
| `docs/design-plan.md` | The design concept and the reasoning behind it |
| `docs/critique-prompt4.md` | Scored design critique and what changed |
| `docs/baseline-ui-prompt5.md` | Component review against the baseline-ui rules |
| `docs/web-guidelines-prompt6.md` | Web Interface Guidelines review by page and severity |
| `docs/testing-prompt7.md` | Responsive and interaction test results |

## Test

The test needs Python with Playwright (`pip install playwright && playwright install chromium`).

```
npm run build
npm run preview &
python3 tests/webapp_test.py --out .screens
```

It saves screenshots of every page at 390, 768, 1024 and 1440px in light and dark. It fails on any of these:

- horizontal scroll or overflow;
- overlapping or covered controls;
- small tap targets;
- console errors;
- a broken toggle, phone panel, filter or link.

The same test runs in GitHub Actions after every build. If it fails, the site is not deployed, and the screenshots are saved with the run (Actions tab, "screens").

## Publish on GitHub Pages

The site deploys itself. `.github/workflows/deploy.yml` runs on every push to `main` (and by hand from the Actions tab): it installs the packages, runs `npm run build`, runs the test, and publishes `dist/` to GitHub Pages.

One-time setup on GitHub: go to Settings > Pages > Build and deployment, and set Source to **GitHub Actions**.

To update the site: edit the content, commit and push. You can watch the run in the repository's Actions tab, and the site updates a minute or two after it finishes.

The repository is `pipowpi.github.io`, which serves the site at https://pipowpi.github.io. A repository with any other name also works, served at https://pipowpi.github.io/<name>/. Page links are relative, so they keep working; only the 404 page assumes the site sits at the domain root.

For exact, repeatable builds, run `npm install` once and commit the `package-lock.json` it creates. The workflow then uses `npm ci` with those exact versions.
