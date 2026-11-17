# Gopi Krishna Kanugula: portfolio

Personal site with work, writing and current status. Plain HTML, CSS and JavaScript, so it runs on GitHub Pages with no build step on GitHub's side.

## Preview locally

```
cd portfolio
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Edit content

| What | Where |
| --- | --- |
| Home, Work and About pages | `content/pages/home.html`, `work.html`, `about.html` |
| Blog posts | `content/posts/<slug>.md` (one file per post) |
| Name, email, links | `SITE` at the top of `build.py` |
| Colors, layout, animation | `assets/css/site.css` |
| Theme toggle, 3D scene, card effects, post filter | `assets/js/site.js` |

After editing anything in `content/` or `build.py`, regenerate the pages:

```
python3 build.py
```

This rewrites `index.html`, `work/`, `writing/`, `about/` and `404.html`. Commit those generated files too; GitHub Pages serves them as they are.

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

Fenced code blocks with three backticks work too. The file name becomes the URL: `writing/my-post/`.

**The four posts included now are drafts written for you to review.** They are marked `draft: true` and show a "Draft" label. Rewrite them in your own words and set `draft: false`, or delete them. To hide every draft from the site, set `show_drafts` to `False` in `build.py` and rebuild.

## Publish on GitHub Pages

Recommended: a repository named exactly `pipowpi.github.io`, which serves the site at https://pipowpi.github.io.

1. Create an empty public repository named `pipowpi.github.io` on GitHub (no README).
2. From this folder:

   ```
   git init -b main
   git add .
   git commit -m "Initial portfolio site"
   git remote add origin https://github.com/pipowpi/pipowpi.github.io.git
   git push -u origin main
   ```

3. On GitHub: Settings > Pages > Build and deployment > Source: **Deploy from a branch**, Branch: **main**, folder **/ (root)**. Save.
4. The site is live at https://pipowpi.github.io after a minute or two.

A repository with any other name (for example `portfolio`) also works and is served at https://pipowpi.github.io/portfolio/. All page links are relative, so they keep working; only the custom 404 page assumes the site sits at the domain root.

To update the site later: edit, run `python3 build.py`, then `git add . && git commit -m "Update" && git push`.
