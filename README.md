# Gopi Krishna Kanugula: portfolio

This is my personal site. It has five pages:

- **Home**
- **Work**: a timeline and two case studies
- **Projects**: with diagrams
- **Writing**: posts
- **About**

It's built with React and Tailwind CSS. Every page is prerendered to plain HTML at build time and hydrated in the browser, so GitHub Pages serves static files and needs no server or build step on GitHub's side.

## Build and preview

You need Node.js 20 or newer.

```
npm install
npm run build              # writes index.html, work/, projects/, writing/, about/, 404.html and assets/
npm run preview            # serves the folder at http://localhost:8000
```

`npm run dev` rebuilds whenever something in `src/` or `content/` changes. Commit the generated HTML and `assets/` with your changes, because GitHub Pages serves them as they are.

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
| Shared pieces (sections, buttons, tags, diagrams) | `src/components/` |
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
python3 -m http.server 8000 &
python3 tests/webapp_test.py --out .screens
```

It saves screenshots of every page at 390px and 1440px in light and dark. It fails on any of these:

- horizontal scroll or overflow;
- overlapping or covered controls;
- small tap targets;
- console errors;
- a broken toggle, filter or link.

## Publish on GitHub Pages

Recommended: a repository named exactly `pipowpi.github.io`, which serves the site at https://pipowpi.github.io.

1. Create an empty public repository named `pipowpi.github.io` on GitHub (no README).
2. Push this folder to its `main` branch.
3. On GitHub, go to Settings > Pages > Build and deployment. Set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then save.
4. The site goes live at https://pipowpi.github.io after a minute or two.

A repository with any other name (for example `portfolio`) also works, served at https://pipowpi.github.io/portfolio/. Page links are relative, so they keep working. Only the 404 page assumes the site sits at the domain root.

To update the site later: edit the content, run `npm run build`, then commit and push.
