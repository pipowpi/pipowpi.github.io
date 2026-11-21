# Design System Master File: Gopi Krishna Kanugula portfolio

> **How to use:** when changing a page, check `pages/<page>.md` first. Its rules override this file.
> Otherwise follow this file. Tokens live in `src/styles.css`; this file explains them.

**Type:** modification of an existing system, not a new one.
**Generated with:** ui-ux-pro-max (`search.py --design-system`, plus `--domain product|style|typography|color|chart`), then edited by hand.
**Supersedes:** the palette and type sections of `docs/design-plan.md`, which keeps the reasoning behind the concept.

---

## 1. Why a modification and not a new system

The tool's matches for this site agree with the direction that was already in place:

| Query | Tool's answer | What we kept or changed |
|---|---|---|
| Product: Portfolio / Personal | Minimalism & Swiss Style | Kept. The site is a ruled, grid-based spec sheet. |
| Color: Resume / CV, professional navy | Navy primary, blue accent, success green, near-white background | Rejected later: navy and blue read as a generic AI default. Replaced first with an amber "Phosphor" palette, now the "Graphite" palette (section 3). |
| Typography: data and dashboards | Fira Sans for UI and data, from the Fira family | Kept, and widened: Fira Sans now sets every number, stat and small label. |
| Default output: Inter + Inter, shadows md to xl, 12px card radius, lift-on-hover cards | Rejected | Inter is the generic default. Shadows and lift-on-hover fight the flat, drawn-on-paper concept. |

So the system keeps the ruled spec-sheet layout and tightens it: more consistent number styling, a floor on small text and fixed text roles. Color is the "Graphite" palette: amber for actions plus four stage colors, dark by default.

---

## 2. UI style

**Style:** Swiss minimalism, drawn as an engineering spec sheet.

- Solid cards on an ambient background (dot grid plus soft color glows, section 3). Depth comes from 1px rules and borders, never from shadows.
- One card surface (the "sheet"). Sections are separated by full-width rules, not by boxes.
- Section names sit in a 200px left margin on desktop, like a drawing's title block.
- The accent is functional: links, the active nav item, focus rings and the one important wire in a diagram.
- Status colors come from CI: passed (green), running (amber), queued (grey, dashed).
- Motion is small, uses `transform`/`opacity` only with `ease-out`, pauses off screen, and has a cause: hover a diagram to see packets move; hero canvas pauses off screen; everything stops under `prefers-reduced-motion`.

**Keywords:** ruled, quiet, precise, technical, warm graphite, amber, readable.

---

## 3. Color palette

All component code uses tokens (`bg-sheet`, `text-lead`), never raw hex.

**Palette: "Graphite".** Cool charcoal with amber as the one action color, plus four stage colors. It replaced the warm near-black "Phosphor" palette, which used only amber and green and read as flat. **Dark is the default theme**; light is opt-in from the header toggle and remembered in `localStorage` (`gkk-theme`).

### Roles

- **Amber (`--accent`)** is for actions and "now": buttons, links, focus, the running MS stage, the deploy step.
- **Stage colors** tell career stages and projects apart. They never mean pass or fail.
  - Career: Learn the craft = pink, Make it scale = teal, Own the platform = coral, Bring Windows GPUs to CI = lime, MS = amber. The switch is drawn in ink.
  - Projects: 3D head reconstruction = pink, RISC-V CPU = teal, VLM project = coral, open GPU CI design = lime, this site = amber.
  - Inside a project card or a Work case study, `--accent` is set to that item's color, so its icon, numbers, links and diagram highlight follow.
- **Green (`--pass`)** stays for done checklist items.
- **Topics** have one color each, everywhere (writing tags and filters, post pages, the About toolbox, the home focus areas): lime = infrastructure and GPUs, teal = CI/CD, coral = ML platforms and MLOps, pink = backend and security, amber = vision and AI, ink = languages. The map lives in `src/data/site.js` (`TOPIC_TONE`).
- **Lists of four** (home facts, the "Right now" rows, About numbers, About habits) cycle through the colors so each item is easy to tell apart.
- **How to apply a color:** wrap the item with `style={tone('teal')}` (from `ui.jsx`). That swaps `--accent` and `--wash` inside it, so icons, numbers, links and highlights follow without new classes.

### Background and drawings

**Background** (`Backdrop` in `Backdrop.jsx`): a blueprint grid (fine lines every 24px, heavier every 120px) with a soft wash of the page's two colors along the top edge. Both scroll with the page and fade out within the first screen, so text further down sits on plain graphite. Wash colors: Home amber and teal, Work lime and coral, Projects pink and teal, Writing teal and amber, About coral and amber. Wash strength is `--wash-o` (16% dark, 13% light).

**Drawings** (`Motif` in `Backdrop.jsx`) are literal, labelled diagrams placed in the layout, never behind text:

| Where | Drawing | What moves |
|---|---|---|
| Home card: Backend and APIs | client, API service (routes, auth, rate limits), database, file storage | a request travels to the API, then to the database and storage, then "201 Created" |
| Home card: Infrastructure and DevOps; Work header | Kubernetes control plane (API server, scheduler) over three GPU worker nodes with pods | the scheduler places a new pod on a node |
| Home card: CI/CD and monitoring | push, build, Linux and Windows GPU test jobs, ship; build-time bars and a p95 latency line | jobs run and pass stage by stage |
| Home card: ML platforms and vision | input image, 3x3 edge kernel with its weights, feature map | the kernel slides; the matching output cell lights up |
| Projects header | a photo, SMIRK + GNM, a triangulated 3D head mesh with eyes, nose and mouth | a scan line passes over the mesh |
| Writing header | causal attention: a query word, the words before it, line width = weight, later words masked | the query moves along the sentence |
| About header | training and validation loss over epochs, best checkpoint marked | the training curve draws |

A transformer block (embedding, attention, add & norm, feed-forward, × N, next-token probabilities) is also available as `transformer`.

- Lines are ink at 50%, labels in the mono font, and one highlight in the item's color.
- Animations run only while the drawing is on screen, and stop under reduced motion or the motion toggle.
- Header drawings show on screens 1024px and wider; home cards show theirs at every size.
- Rejected: blurred color glows, and drawings fixed behind the content.

### Dark (default)

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `--paper` | `#121316` | | `--accent` | `#FFB224` |
| `--sheet` | `#1A1C20` | | `--on-accent` | `#1A1203` |
| `--ink` | `#EEEDEA` | | `--pink` | `#FF8FB1` |
| `--lead` | `#A2A3A0` | | `--teal` | `#38C9B0` |
| `--rule` | `#2A2D32` | | `--coral` | `#FF6B57` |
| `--rule-strong` | `#3B3F46` | | `--lime` | `#C3E26B` |
| `--wash` | `#2E2A22` | | `--pass` | `#8BD17C` |
| `--queue` | `#8A8C91` | | `--term-bg` | `#0C0D0F` |

### Light

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `--paper` | `#F4F4F2` | | `--accent` | `#A35200` |
| `--sheet` | `#FFFFFF` | | `--on-accent` | `#FFFFFF` |
| `--ink` | `#17181B` | | `--pink` | `#B8285F` |
| `--lead` | `#55575C` | | `--teal` | `#0B7A6A` |
| `--rule` | `#E2E3E5` | | `--coral` | `#BF3B27` |
| `--rule-strong` | `#C8CACE` | | `--lime` | `#5A7710` |
| `--wash` | `#F7ECDC` | | `--pass` | `#2F7A2B` |
| `--queue` | `#76787D` | | `--term-bg` | `#17181B` |

### Contrast (WCAG 2.x, on the card surface, checked with a script)

| Color | Dark | Light | Needed |
|---|---|---|---|
| ink | 14.6 | 17.8 | 4.5 |
| lead | 6.7 | 7.2 | 4.5 |
| accent | 9.5 | 5.6 | 4.5 |
| pink | 8.0 | 6.0 | 4.5 |
| teal | 8.3 | 5.2 | 4.5 |
| coral | 6.1 | 5.4 | 4.5 |
| lime | 11.7 | 5.2 | 4.5 |
| pass | 9.4 | 5.3 | 4.5 |
| on-accent on accent | 10.3 | 5.6 | 4.5 |

---|---|---|---|
| ink on paper | 15.4 | 16.4 | 4.5 |
| lead on paper | 6.4 | 7.4 | 4.5 |
| lead on sheet | 7.1 | 6.9 | 4.5 |
| accent on sheet | 5.4 | 10.1 | 4.5 |
| accent on wash | 4.6 | 8.8 | 4.5 |
| on-accent on accent (button) | 5.6 | 10.3 | 4.5 |
| pass on sheet | 5.1 | 9.7 | 4.5 |
| run on paper | 4.9 | 10.7 | 4.5 |
| term-dim on term-bg | 6.6 | 7.6 | 4.5 |
| term-run on term-bg | 9.6 | 11.0 | 4.5 |
| queue on sheet (non-text) | 5.3 | 5.0 | 3.0 |

---

## 4. Typography

| Role | Font | Why |
|---|---|---|
| Headings (h1 to h4, post titles) | **Bitter**, 600 | A slab serif with an engineering-drawing feel, readable at 19 to 60px. |
| Body, UI, **all numbers, stats and small text** | **Fira Sans**, 400/500/600 | Built for small sizes on screens; open shapes; clear 1/l/I and 0/O. |
| Code and the terminal only | Anonymous Pro, 400 | A monospace with a typewriter feel. It is never used for data or labels. |

All fonts are self-hosted as woff files (no Google Fonts request).

### Text roles

| Role | Utility | Spec |
|---|---|---|
| Display (home h1) | | Bitter 38 / 56 / 60px, 600, leading 1.05 |
| Page title (h1) | | Bitter 36 / 48px, 600, leading 1.08 |
| Section name (h2) | | Bitter 21px, 600 |
| Card title (h3) | | Bitter 24 to 32px, 600 |
| Lede | | Fira Sans 18px, leading 1.65, `--lead`, max 66ch |
| Body | | Fira Sans 17px, leading 1.65, max 70ch |
| Article body | | Fira Sans 18px, leading 1.75 |
| **Stat** | `t-stat` | Fira Sans 40px, 600, leading 1, tabular lining figures |
| **Metric** | `t-metric` | Fira Sans 28px, 600, leading 1, tabular lining figures |
| **Meta** (dates, counts, read time) | `t-meta` | Fira Sans 15px, `--lead`, tabular lining figures |
| **Label** (field names, axis labels) | `t-label` | Fira Sans 13px, 500, `--lead`, tabular lining figures |
| **Chip** (status pill, tag, filter) | `t-chip` | Fira Sans 13px, 500 |

**Rules:**

- The smallest text is **13px** (labels and chips). Body copy is 15 to 16px. The scale was tightened in Nov 2026 so pages stay compact.
- Every element that shows a number (stats, years, dates, counts, chart values, step numbers) uses `font-variant-numeric: tabular-nums lining-nums`. The `t-*` roles include it.
- Sentence case everywhere. No eyebrows above headings, and no letter-spacing changes (baseline-ui).
- Weights: 600 for headings and stats, 500 for labels and links, 400 for body.

**Type scale (px):** 14, 15, 16, 17, 18, 21, 24, 28, 32, 40, 48, 60.

---

## 5. Spacing scale

This is a 4px base, using Tailwind's default steps. Use only these values.

| Token | px | Tailwind | Use |
|---|---|---|---|
| `--space-1` | 4 | `1` | Icon-to-text in chips |
| `--space-2` | 8 | `2` | Gaps inside lists of chips |
| `--space-3` | 12 | `3` | Card inner gaps, list rows |
| `--space-4` | 16 | `4` | Gaps between cards |
| `--space-5` | 20 | `5` | Card padding on phones, page gutter on phones |
| `--space-6` | 24 | `6` | Gaps inside a section |
| `--space-8` | 32 | `8` | Card padding on desktop, page gutter on desktop |
| `--space-10` | 40 | `10` | Section padding on phones |
| `--space-12` | 48 | `12` | Section padding on desktop |
| `--space-16` | 64 | `16` | Page head top padding |

- **Container:** 1200px max width, with a 20px gutter on phones and 32px from 768px up.
- **Breakpoints:** 390 (phone baseline), 640 `sm`, 768 `md`, 1024 `lg`, 1280 `xl`, 1440 (desktop check).

---

## 6. Components

### Buttons

| | Primary | Secondary | Text link |
|---|---|---|---|
| Background | `--accent` | `--sheet` | none |
| Text | `--on-accent`, Fira Sans 16px, 500 | `--ink` | `--accent`, 500 |
| Border | 1px `--accent` | 1px `--rule-strong` | 1px underline at 40% accent, offset 4px |
| Hover | accent mixed 12% toward ink | border and text turn accent | full-opacity underline |
| Size | min-height 44px, padding 10px 20px | same | inline |
| Radius | 6px (`rounded-md`) | 6px | none |
| Focus | 2px accent outline, offset 3px | same | same |

Use one primary button per view. Buttons have no arrows, icons or shadows, and do not lift on hover.

### Cards (sheets)

```
background: var(--sheet); border: 1px solid var(--rule); border-radius: 6px;
padding: 20px (phone) / 28 to 32px (desktop); no shadow.
interactive: border turns --accent on hover and focus (150ms); no transform.
```

**Radius by hierarchy:**

| Radius | Used on |
|---|---|
| 2px | Bars, progress tracks |
| 6px | Cards, buttons, diagram nodes, icon frames |
| Full (pill) | Status pills, tags, filter chips |

### Status pill

A 14px label with a dot. The dot's shape and motion also carry the state, so color is not the only cue:

| State | Dot |
|---|---|
| Passed | Solid green dot |
| In progress | Amber dot that blinks |
| Planned | Dashed grey ring, with text in `--lead` |

### Filter chip

- Toggle button with `aria-pressed`. Minimum height 40px.
- When selected: accent border, wash background, accent text.

### Diagram node (Flow)

- 6px radius, `--rule-strong` border, `--sheet` background.
- A highlighted node uses a accent border on wash.
- The wire into the important node is accent, with a 14px text label ("pull", "swap").

---

## 7. Chart colors

| Role | Token | Notes |
|---|---|---|
| Series 1 (the subject) | `--accent` | GNM in the vertex chart; Abzooba and NVIDIA years |
| Series 2 (the comparison) | `--lead` | FLAME; earlier roles |
| In progress | `--run` with a dashed fill | "Now" bar and running steps. The dash pattern is the non-color cue. |
| Done | `--pass` | Progress toward milestones |
| Track and gridline | `--rule` | Low contrast, so it stays behind the data |

**Rules:**

- Label values directly on or beside the bar, in Fira Sans tabular (`t-label` or 16px 600).
- Use no legend when direct labels do the job.
- Every chart has a caption that states the takeaway, for example "about 3.5x denser". The caption is the screen-reader summary.
- Bars grow in once (1.1s) and are static under reduced motion. Data is readable before the animation ends.
- Do not pair red and green. Run (amber) and pass (green) never sit side by side without a text label.
- Use bars for comparisons and stat blocks for fewer than four values. No pie charts.

---

## 8. Anti-patterns (do not use)

- ❌ Inter, Roboto or system-ui as the display font: they are the generic defaults.
- ❌ Dark terminal-green "hacker" themes, neon glows, or gradient text.
- ❌ Navy, indigo, violet or cyan accents, and blue-to-purple gradients: the generic AI-generated look.
- ❌ Using a stage color to mean success or failure, or more than one stage color inside one card.
- ❌ En and em dashes in copy, including date ranges. Write "2017 - 2020".
- ❌ Drop shadows and hover lift (`translateY`) on cards.
- ❌ All-caps eyebrows, letter-spaced labels, and middle-dot (·) separators.
- ❌ A highlighted or colored word inside a headline.
- ❌ Skill bars or percentage ratings ("Python 90%").
- ❌ Logo walls, icon grids of technologies, or emoji used as icons.
- ❌ Invented metrics: every number must come from the resume or the project data.
- ❌ Text under 13px (labels and chips are 13px, body copy 15 to 16px). Monospace for numbers or labels.
- ❌ Color as the only signal (status, chart series, selected chip).
- ❌ Card grids of identical boxes for every section. Use ruled sections and one card type for objects.
- ❌ Carousels, autoplaying media, or scroll-jacking.

---

## 9. Pre-delivery checklist

- [ ] Only tokens in components; no raw hex outside `styles.css` and the canvas color read-out.
- [ ] Numbers use `t-stat`, `t-metric`, `t-meta`, `t-label` or `tabular-nums`.
- [ ] No text under 13px. Body copy is 15px or more.
- [ ] Contrast table above still holds after any palette edit (`scratchpad/contrast.py` or similar).
- [ ] Focus ring is visible on every link, button, chip and summary.
- [ ] Tap targets are at least 40px high (44px for buttons).
- [ ] Both themes are checked; the theme toggle persists across reloads.
- [ ] No horizontal scroll at 390px; the layout holds at 1440px.
- [ ] `prefers-reduced-motion`: no packets, no typing, no blinking, no bar growth.
