# Web Interface Guidelines review (Prompt 6)

**Rules source:** `web-design-guidelines/references/command.md`. It is the Vercel snapshot pinned at `434b7f9` (SHA-256 `d246b026…`) and matches `web-interface-guidelines/command.md`.

**Scope:**

- Pages: every page as built (Home, Work, Projects, Writing, Post, About, 404).
- Sources: the components in `src/`.
- Build: `scripts/build.mjs`, which owns the Markdown output and the boot script.

## First pass: issues by page

Severity:

- **High**: it blocks or hides content for some visitors.
- **Medium**: a guideline is broken in a way visitors notice.
- **Low**: polish.

### All pages (shared layout)

| Sev | Issue | Where | Status |
|---|---|---|---|
| **High** | The sticky header can cover the focused element when tabbing backwards or jumping to anchors. Only `:target` had `scroll-margin`. | `styles.css` base | Fixed: `html { scroll-padding-top: 88px }`. I tabbed through Work and found no focused element under the header. |
| Medium | `theme-color` follows the system setting, not the visitor's toggle, so the browser chrome mismatches the page. | `entry-server.jsx` metas, `ThemeToggle` | Fixed: the toggle and the boot script now update both metas. |
| Medium | No `touch-action: manipulation`, and the tap highlight was the browser default. | `styles.css` | Fixed: set on `a, button, summary`. The tap highlight is a cyan tint. |
| Medium | Brand and code tokens could be machine-translated (tool tags, name, terminal, code). | `Tag`, header name, terminal, Markdown `code`/`pre` | Fixed: `translate="no"` |
| Low | External links in the footer give no "new tab" warning. | `Layout.jsx` footer | Fixed: sr-only "(opens in a new tab)" |
| Low | No page overscroll guard for fine pointers. | `styles.css` | Fixed: `overscroll-behavior: none` inside `@media (pointer: fine)` |
| Low | `Let's`, `I'm`, `GNM's`, `'27` used straight quotes. | JSX text and data | Fixed: curly apostrophes, and `’27` |

### Home

| Sev | Issue | Where | Status |
|---|---|---|---|
| **High** | Motion autoplays for longer than 5 seconds next to content with no way to pause it: the hero scene, the rotating headline, and the status dots and spinner. Reduced-motion users were covered; others were not (WCAG 2.2.2). | `Home.jsx` hero, `HeroScene.jsx` | Fixed: a **pause/play button** on the hero figure (`aria-label` "Pause animations" / "Play animations"). The choice is stored and applied before first paint. It stops the canvas and every CSS loop, and each one rests on its finished state. |
| Low | Counts written as words: "Eight years…, the last six". | `data/home.js` | Fixed: "8 years…, the last 6" |
| Low | Focus row text spans had no `min-w-0`. | `Focus` | Fixed |

### Work

| Sev | Issue | Where | Status |
|---|---|---|---|
| Medium | "10 min", "1 s": the number can wrap away from its unit. | `data/work.js` | Fixed: non-breaking spaces |
| Low | The h1 and lede write counts as words ("Eight years", "six years"). | `Work.jsx` | Fixed: numerals |
| Low | Flex text children without `min-w-0`: the phases, the "Also" row, the highlights. | `Work.jsx` | Fixed |

### Projects

| Sev | Issue | Where | Status |
|---|---|---|---|
| Medium | Hard-coded number format: `toLocaleString('en-US')`. | `VertexChart` | Fixed: `Intl.NumberFormat` |
| Low | The "Why GNM" expanded state is not deep-linkable. | `HeadProject` | Kept: native `<details>`. It's a short disclosure, and the section itself is linkable at `#head-reconstruction`. |

### Writing

| Sev | Issue | Where | Status |
|---|---|---|---|
| Medium | Filter state is not in the URL, so a filtered list can't be shared or restored. | `Writing.jsx` | Fixed: `?topic=Security` is read after hydration and kept current with `history.replaceState`. "All" clears it. |
| Medium | Dates used `toLocaleDateString` with an inline locale. | `fmtMonth` | Fixed: one shared `Intl.DateTimeFormat`. UTC keeps the server and browser output identical, so there is no hydration mismatch. |
| Medium | "5 min read": the number and unit can split. | `PostList` | Fixed: `nb()` |

### Post

| Sev | Issue | Where | Status |
|---|---|---|---|
| Medium | Post prose used straight quotes (`"is there anything for me?"`). | `build.mjs` Markdown | Fixed: the build applies typographer's quotes and `…` outside code. Titles and summaries get the same treatment. |
| Low | Code blocks could be machine-translated. | `build.mjs` | Fixed: `translate="no"` on `pre` and `code` |

### About

| Sev | Issue | Where | Status |
|---|---|---|---|
| Low | Counts in words: "eight years", "six years", "four engineers". | `data/about.js` | Fixed: numerals |
| Low | "How I work" text without `min-w-0`. | `About.jsx` | Fixed |

### 404

| Sev | Issue | Where | Status |
|---|---|---|---|
| (from P4) | The error message lacked a next step. | `NotFound.jsx` | Already fixed: a plain explanation, plus links to Home, Work, Projects and Writing |

## Deliberate exceptions

- **Title Case for headings and buttons.** The design system sets sentence case (MASTER.md §4), which fits a personal, technical voice.
- **Second person instead of first.** A portfolio speaks as its owner. First person is the content.
- **Numerals in essays.** Post prose keeps words for small numbers at the start of sentences ("Six questions…"), which is ordinary editorial style. Site UI copy uses numerals.
- **Virtualization, image dimensions, forms, `<select>`.** None apply: lists are under 50 items, there are no `<img>` tags (the hero is a canvas) and no form fields.

## Second pass (re-run)

I re-ran every rule group against the changed files and the built pages:

- **Accessibility:** icon buttons labelled (theme and motion). Decorative icons have `aria-hidden`. Skip link present. One h1 per page with ordered levels. The filter count is `aria-live`.
- **Focus:** a global `:focus-visible` ring, no bare `outline-none`, and `scroll-padding-top` so focus is never hidden under the header. Checked by tabbing through Work.
- **Animation:** transform and opacity only, no `transition: all`, reduced-motion support, and now a pause control.
- **Typography:** `…`, curly quotes, nbsp between numbers and units, tabular numbers, balanced headings.
- **Navigation and state:** links are `<a>`, and the filter state is in the URL.
- **Theming:** `color-scheme` on `<html>`, and `theme-color` follows the toggle.
- **i18n:** `Intl` for dates and numbers, `translate="no"` on brands and code.

**Result: 0 high, 0 medium open.** The one remaining low is the `<details>` deep link, kept on purpose.

**Playwright, 390px and 1440px, light and dark:**

- No horizontal overflow on any page.
- No console errors. The only one is the expected 404 status on the missing-page check.
- Motion toggle: it persists across reload and sets the rotating headline's `animation-name` to `none`.
- `?topic=Security` restores the Security filter (2 posts). Choosing another topic rewrites the URL, and "All" clears it.
