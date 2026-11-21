⚠️ DEGRADED: single-context. The impeccable engine (the detector and critique storage) could not be downloaded in this environment, and the review ran inline without sub-agents.

# Impeccable critique: every page (Prompt 4)

**Target:** the built site, at 390px and 1440px in both themes. Screenshots came from `scripts/check.py`.
**Modes:**

- Home: Persuade
- Work and Projects: Experience (a body of work)
- Writing index, posts and About: Read

**Assessment B (detector):** unavailable, because the engine binary could not be fetched. As the substitute, the Playwright checks measured page width, overflow, text spill and console errors at both sizes and in both themes. They found **0 overflow and 0 console errors**. The only flags were the expected 404 on the missing-page check and pseudo-element dots in the wiring diagrams. Those dots are false positives.

## Design health score (whole site, Nielsen heuristics)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Active nav, live filter count, reading progress and theme label all work. The availability status appears twice on Home. |
| 2 | Match with the real world | 3 | The CI metaphor ("Pull this job", "career.yml", "never queued") delights infra readers but may slow a non-technical recruiter. |
| 3 | User control and freedom | 3 | There is a skip link, the filters reset with "Show all", posts link back to "All writing", and the theme choice persists. |
| 4 | Consistency and standards | 2 | Writing items are cards on Writing but ruled rows on Home. Some project lists are cards, others rows. Some sections use icon frames and others don't. Every page head has an eyebrow label. |
| 5 | Error prevention | 3 | No forms. Filters cannot reach a dead end, because the empty state offers a reset. |
| 6 | Recognition rather than recall | 3 | Clear labels everywhere. The case-study diagrams name each part. |
| 7 | Flexibility and efficiency | n/a | Portfolio. There is no repeated task to accelerate. |
| 8 | Aesthetic and minimalist design | 2 | Home tells the career story three times: the status run, the experience bars and the work teaser. The toolbox appears on both Home and About. Icon frames sit on nearly every list item. |
| 9 | Error recovery | 3 | The 404 page keeps the nav and offers a home link. It could name the sections. |
| 10 | Help and documentation | n/a | Portfolio. |
| **Total** | | **22/32 (69%)** | **Acceptable, on the edge of Good** |

### Per-page scores

| Page | Score /10 | One line |
|---|---|---|
| Home | 6 | Strong hero and status run, but seven sections, repeated career summaries, an eyebrow above the h1 and a hero-metric stat row. |
| Work | 7 | The timeline and case studies are specific and real. The five era columns don't line up row by row, so the eye zigzags. |
| Projects | 8 | The best page. A real diagram, chart and checklist for the head project; the small projects are honest about being early. |
| Writing | 6 | The intro is good. The posts are four identical icon cards, which looks like a feature grid and not a reading list. |
| Post | 7 | Comfortable measure and type. The meta line sits above the title like an eyebrow. |
| About | 6 | The voice is good. "In numbers" repeats Home, the Toolbox repeats Home, and an icon on every line adds noise. |
| 404 | 7 | On-brand copy. "404" is an eyebrow label, and there is only one way out. |

## Design specificity verdict

**Authored, not interchangeable.** The blueprint palette, the spec-sheet margin column, the CI status colors, the runner-and-queue canvas and the career-as-a-CI-run are all specific to an infrastructure engineer. Another portfolio could not reuse them unchanged. What still reads as template:

- the eyebrow above every h1;
- the same-size icon cards (Writing posts, Home "In progress");
- big-number stat rows on Home and About.

## What's working

1. **The career as a CI run** on Home: passed, passed, running, queued, plus the terminal. It is the most memorable piece, and it is true to the person.
2. **Real diagrams instead of decoration:** the pull-based runner flow, the SMIRK/GNM swap, and the RISC-V and VLM stages. Each explains something.
3. **Restraint:** one accent, ruled sections, no shadows, real numbers only, and calm motion that stops under reduced motion.

## Priority issues

1. **[P1] Home repeats itself and runs long.** It has seven sections. The career is summarized three times: the status run, the "Experience 8+ yrs" bars and the work teaser. The Toolbox duplicates About.
   - *Fix:* keep one career summary (the status run). Replace the stat row with a second, smaller case study (Xpresso.ai). Turn "In progress" into ruled rows that match "Recent writing". Drop the Home Toolbox, since About owns it. Tie Focus to the hero with tighter spacing.
   - *Command:* `/impeccable layout` on Home.
2. **[P1] An eyebrow sits above every page title** ("Work", "Projects", "Writing", "About", "404", and "Open to roles" on Home). The active nav item already says where you are, so this duplicates it. It is also on impeccable's ban list.
   - *Fix:* remove the kickers. Move the availability line under the hero buttons. Move the post meta under the summary.
   - *Command:* `/impeccable polish`.
3. **[P2] The Work timeline columns don't align.** Titles wrap to one or two lines, so the metric, bullets and skills start at different heights in each of the five columns. Comparing eras across means reading a zigzag.
   - *Fix:* use CSS subgrid so each row (meta, title, role, metric, work, skills) shares a baseline across columns.
   - *Command:* `/impeccable typeset` on Work.
4. **[P2] Writing posts are identical icon cards.** For reading content, a ruled list with title, summary and meta scans faster. It also matches Home's "Recent writing".
   - *Fix:* use ruled rows with the meta and tags on one line.
   - *Command:* `/impeccable polish`.
5. **[P3] An icon on every row of About** ("Right now" and the Toolbox groups) and on Home "In progress". These icons add no meaning beyond the label next to them.
   - *Fix:* keep icons where they identify an object (projects, case studies). Drop them from labelled rows.
   - *Command:* `/impeccable polish`.

## Persona red flags

**Jordan (first-time visitor, recruiter):**

- On Home they meet "career.yml", a terminal and "Pull this job" before any plain contact line. The footer has the plain version, but it's seven sections down. The fix for issue 1 shortens that path.
- "Pull this job" as a mailto label is clever but vague. It needs a visible hint that it opens email.

**Casey (on a phone):**

- On Home at 390px, the hero, focus, status run and terminal take about four screens before any work appears. The stat row and bars add another screen.
- On Work at 390px, the eras stack fine, but the year axis labels are 14px and crowd at the ends.

**Riley (stress tester):**

- If every Writing filter except one is empty, the state is handled.
- A long post title in the older/newer nav wraps cleanly.
- If a fifth era is added, the year ticks and the five-column grid are hard-coded and will need care.

## Minor observations

- The Home hero availability line uses a pinging dot *and* orange text, and the status run below repeats the same fact.
- The About Education timeline uses a vertical line next to rounded content, not a box, so it's fine.
- The post page's older/newer card sits alone on the right when only one exists. That's acceptable.
- The scrollbar and form accent colors are browser defaults. Theme them (`scrollbar-color`, `accent-color`).

## Questions to consider

- If a recruiter only reads the first screen, does it tell them what to hire Gopi for, and how to reach him?
- Does Home need to prove range (toolbox, numbers), or only depth (two case studies), and let Work and About carry the rest?

Questions skipped: autonomous run. Prompt 4 already chooses the follow-ups (typeset on Work, layout on Home, polish on everything), and the user asked for work to continue without stopping.

---

## Applied in Prompt 4

**Layout (Home):**

- Cut Home from seven sections to four (Focus, Status, Selected work, Lately).
- Removed the stat row and the experience bars. The Status run already tells the career story, and Work owns the timeline.
- Added Xpresso.ai as a second, smaller case study under NVIDIA, with three results drawn from the Work data.
- Merged "Recent writing" and "In progress" into **Lately**: two ruled lists, Writing and Building, side by side on wide screens.
- Dropped the Home toolbox. About keeps the grouped version with every tool.
- Moved the availability line from an eyebrow above the h1 to a status line under the buttons.
- Tightened Focus (`Section tight`) and gave the larger sections more room (`lg:py-14`), so the spacing has rhythm.
- "Pull this job" now has a mail icon and a screen-reader hint that it opens email.

**Typeset (Work):**

- Era columns use CSS subgrid. Dates and title, role, metric, work, and skills now line up across all five columns, and across both columns on tablets.
- Case-study meta (org, role, dates) moved under the title.
- "Skills", "Also" and "Related writing" share one label style (`t-label`).

**Polish (every page):**

- Removed the eyebrow from every page head (Work, Projects, Writing, About, 404).
- Moved meta lines under titles on Post, Projects, and the Home case studies.
- Writing posts became a ruled reading list. A new `PostList` component is shared with Home.
- About: dropped the icons from "Right now" and the Toolbox groups. Education now shows the title first and the date after the school.
- 404: plain-language explanation, plus links to Work, Projects and Writing.
- Browser surfaces now use the palette: `accent-color`, `scrollbar-color` and `caret-color`.
- Removed dead data: `TIMELINE_BARS`, `TOOLS`, and the unused icon keys.

**Re-score after fixes:**

| | Before | After |
|---|---|---|
| Consistency and standards | 2 | 3 |
| Aesthetic and minimalist design | 2 | 3 |
| Error recovery | 3 | 3 |
| **Total** | **22/32 (69%)** | **24/32 (75%, Good)** |

Per page after: Home 8, Work 8, Projects 8, Writing 8, Post 8, About 7, 404 8.
