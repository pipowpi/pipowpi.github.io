# Design plan (frontend-design pass)

> **Update (Nov 21, 2026):** the palette below was replaced by the "Phosphor" amber palette, dark by default. The current colors are in `design-system/gopi-portfolio/MASTER.md`, section 3. Layout, type and component decisions here still apply.


> Palette, type roles, spacing and component specs now live in `design-system/gopi-portfolio/MASTER.md` (Prompt 3). This file keeps the concept and the reasoning behind it.

Written before any code changed, then checked against the brief. Section 5 lists what the review changed.

## 1. Subject, audience, job

- **Subject:** Gopi Krishna Kanugula, a systems and infrastructure engineer (CI/CD, GPU virtualization, MLOps) who is now an MS student in computer vision and vision-language models.
- **Audience:** recruiters and hiring managers scanning for fit, and engineers who want to see how he thinks.
- **Primary job:** in under a minute, show who he is, the evidence (two case studies with numbers), what he is doing now, and how to reach him for roles from June 2027.

The vernacular of his work is the source of the visual language: **engineering schematics and CI runs.** Blueprint wiring diagrams, spec sheets, status lights on a pipeline (passed, running, queued).

## 2. Color: 10 named colors

| Name | Light | Dark | Role |
|---|---|---|---|
| Drafting film | `#F1F4F2` | `#0E1620` | Page background. Cool grey-green, not cream; dark is blueprint navy, not warm black |
| Sheet | `#FCFDFC` | `#15202B` | Cards, diagrams, the parts of a page you read closely |
| Blueprint ink | `#14212B` | `#E4ECF1` | Headings and primary text |
| Pencil lead | `#4A5862` | `#9DADB9` | Body copy and secondary text (meets 4.5:1 on both backgrounds) |
| Graphite rule | `#D2DAD7` | `#26333F` | Hairlines, borders, table rules |
| Cyanotype | `#1F4E8C` | `#86B6EE` | The one brand color: links, diagram wiring, focus, primary button |
| Cyan wash | `#E2EBF5` | `#172B41` | Fills behind highlighted diagram nodes and selected chips |
| Build passed | `#2B7A4B` | `#62C28E` | Completed steps and finished milestones only |
| Running | `#B4530E` | `#F08B4C` | Things in progress right now (the MS, live projects) |
| Queued | `#7C8790` | `#6E7C88` | Planned or waiting items |

Status colors are semantic, never decorative. They mean exactly what they mean in a CI run.

## 3. Type

- **Bitter** (slab serif, 600 to 700) for page titles, section titles and case-study titles. Slab serifs come from technical manuals and engineering notebooks, which fits a systems engineer better than a fashion serif or a neutral grotesk.
- **Fira Sans** (400, 500, 600) for body text, UI and every number. It was drawn for screens, has true tabular figures and a slashed zero, and stays readable at 13 to 14px.
- **Anonymous Pro** only for things that really are code: the terminal on the home page, commands and snippets in posts.
- All three are self-hosted (OFL), so the site makes no third-party font request.
- **Scale** (classic typographic scale): 12, 14, 16, 18, 21, 24, 30, 36, 48, 60. Body copy is 17px with a 1.65 line height, and line length is capped near 70 characters.

## 4. Layout concept: the spec sheet

Every page is a document with a **margin column** on the left for section names and a content column on the right. Sections are separated by hairline rules instead of being boxed into cards. Cards (sheets) are reserved for things that are objects: case studies, projects, posts.

```
| GK Gopi Krishna Kanugula                    Work  Projects  Writing  About  (theme) |
|-------------------------------------------------------------------------------------|
| Open to roles from June 2027                                                        |
| I build the infrastructure          |  [ blueprint scene: runners pulling jobs ]   |
| behind CI pipelines.                |                                               |
| lede                                |                                               |
| [Email me]  See the work            |                                               |
|-------------------------------------|-----------------------------------------------|
| Focus      | GPU and virtualization | CI/CD and security | ML platforms and vision |
|------------|-------------------------------------------------------------------------|
| Status     | career run: passed, passed, running, queued   |  $ career status     |
|------------|-------------------------------------------------------------------------|
| Selected   | Windows GPU CI case study (wiring diagram)    |  spec table: 10m->1s |
| work       |                                               |  4 yrs, 8+ yrs       |
|------------|-------------------------------------------------------------------------|
| Writing    | three posts as a ruled list                                             |
| Now        | three projects in progress                                              |
| Toolbox    | parts list                                                              |
```

- Content is **left-aligned** throughout; nothing is centered except the theme icon.
- Max width 1200px, a 12-column grid at desktop, margin column 200px. On phones the margin label sits above its section.
- **Radius follows hierarchy:** sheets 6px, buttons 6px, chips and status pills fully round. No drop shadows; depth comes from the rule and the sheet color.

## 5. Principles

1. **Every device carries information.** Color only for status and links. Numbering only for real sequences (the 9 build phases, the 5 CPU stages). Labels only where they name something.
2. **One memorable thing:** the career shown as a live CI run, plus the blueprint hero scene. That is the only automatic motion on the site. Diagram packets move on hover, not all the time.
3. **Numbers are the evidence.** Large tabular figures in ink, units in pencil lead, context underneath, like a spec table.
4. **Quiet everywhere else:** no tilt, no spotlight, no scroll reveals, no gradients.

## 6. Review against the brief (what changed after the first draft)

The first draft was checked against the generic tells and revised:

| First draft | Why it was generic | Revised to |
|---|---|---|
| Keep near-black background with one bright amber accent | Matches the "near-black with a single bright accent" default | Blueprint navy dark mode and a light default that follows the visitor's system setting |
| Mono, ALL-CAPS eyebrow above every heading | Template chrome | Sentence-case labels in the margin column, only where they name a section |
| Meta lines joined with middle dots, `→` after every link | Template chrome | Structured meta (role, organization, dates as separate pieces) and underlined links without arrows |
| Identical rounded cards with shadows for everything | The SaaS card kit | Ruled sections, sheets only for objects, radius by hierarchy, no shadows |
| Highlighted word in the hero headline | "Accent one word" tell | Rotating phrase stays in the headline color; the motion is the emphasis |
| Geist from Google Fonts | Default developer-portfolio pairing | Bitter + Fira Sans + Anonymous Pro, self-hosted |
| Status shown with one accent color | Meaningless color | CI status colors: passed, running, queued |

Everything else (pages, features, sample data) stays exactly as it was.
