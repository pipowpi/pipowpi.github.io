# Responsive and interaction testing (Prompt 7)

**Tooling:** the webapp-testing skill. Its `with_server.py` helper starts a static server, and `tests/webapp_test.py` (native Python Playwright) drives Chromium. Run it from the repository root:

```bash
python with_server.py --server "python3 -m http.server 8000" --port 8000 -- \
  python3 tests/webapp_test.py --out .screens
```

**Coverage:**

- Pages: Home, Work, Projects, Writing, a post, About, 404.
- Viewports: **390px** (390x844) and **1440px** (1440x900).
- Themes: light and dark. That makes 28 full-page screenshots.

## What is checked

| Check | How |
|---|---|
| Horizontal scroll | `scrollWidth > clientWidth` on the document |
| Content past the right edge | Any visible element whose right edge passes the viewport, ignoring content clipped by an overflow ancestor |
| Text overflow | Leaf text boxes whose content is wider than the box |
| Overlap | Pairs of links, buttons and summaries whose boxes intersect (nesting excluded) |
| Unresponsive or covered controls | Each control is scrolled into view and hit-tested at its center with `elementFromPoint`. Anything else on top fails. |
| Tap target size | Links, buttons and summaries under 24x24 CSS px (WCAG 2.5.8) |
| Console and network | Console errors, page errors, failed requests |
| Theme toggle | Flips, persists across reload, updates its label |
| Motion toggle | Pauses every animation, persists, resumes |
| Nav links (mobile header) | Each one lands on the right page with `aria-current="page"` |
| Writing filters | Every chip sets `aria-pressed`, shows at least one post and updates `?topic=`. "All" resets. |
| Disclosure | "Why GNM" opens |
| Post navigation | "Older post" goes to the next post |
| 404 | Links point at real pages |

## Run 1: findings

| Page | Size | Issue | Fix |
|---|---|---|---|
| Work | 390 and 1440, both themes | The timeline bars (mouse shortcuts to each era) were 16px tall, under the 24px target size. | Each link is now 24px tall and draws the 16px bar inside it. A hover dims the bar. |
| Work | 390 | The empty metric row of "Early career" left a gap between the role and the work list (a subgrid placeholder that only matters when columns sit side by side). | The placeholder is hidden below 640px. |
| Projects | 390 | The head project's icon sat beside the title and squeezed it into 4 short lines. The status pill wrapped under the title on desktop. | Below 640px the icon and pill share a row above the title. From 640px the pill sits top-right, the same as the smaller project cards. |

No horizontal scroll, overflow, overlap, covered controls or console errors turned up on any page in run 1.

## Run 2: confirmation

`failures: []`. The run exits 0.

- 28 of 28 screenshots have no horizontal scroll, nothing past the edge, no text overflow, no overlapping or covered controls, and no tap targets under 24px.
- No console or network errors on any page.
- The theme toggle flips and persists, and its label reads "Switch to light mode".
- The motion toggle pauses, persists and resumes.
- All 4 nav links land on their page and mark it current.
- All 7 Writing filters work: All 4, CI/CD 2, Security 2, Virtualization 1, GPUs 1, VLMs 1, Deep learning 1. Each updates the URL.
- The details element opens. The post nav goes to `gpu-passthrough`. The 404 links are `/`, `/work/`, `/projects/` and `/writing/`.
