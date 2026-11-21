# Final check against the brief (Prompt 8)

**Brief:** professional, clean and interesting. Only make big changes where they make sense. React and Tailwind, realistic data, responsive, tested before completion.

| Step | Requirement | Where it was done | Evidence |
|---|---|---|---|
| A | ui-ux-pro-max design system, saved in the project | Prompt 3 | `design-system/gopi-portfolio/MASTER.md`: style, palette (light and dark) with a checked contrast table, Bitter + Fira Sans pairing, spacing scale, buttons, cards, chart colors, anti-patterns. Numbers and small text use Fira Sans with tabular figures at 14px or larger. |
| B | frontend-design plan, applied to every page | Prompt 2 | `docs/design-plan.md`: 10 named colors, typefaces and roles, the spec-sheet layout concept, and the generic defaults that were changed |
| C | impeccable critique, then polish | Prompt 4 | `docs/critique-prompt4.md`: score 22/32 → 24/32. Also covers the Home layout, Work typeset and site-wide polish. |
| D | web-design-guidelines, all high and medium fixed | Prompt 6 | `docs/web-guidelines-prompt6.md`: 2 high and 10 medium found, all fixed. The re-run shows 0 high and 0 medium. |
| E | webapp-testing, screenshots at 390 and 1440, fixes confirmed | Prompt 7 | `docs/testing-prompt7.md` and `tests/webapp_test.py`: 28 screenshots, `failures: []` |
| also | baseline-ui component review | Prompt 5 | `docs/baseline-ui-prompt5.md`: 10 rule violations fixed |

## The brief's adjectives

- **Professional:** real data only, taken from the resume and the original site. Every metric traces to `src/data/`.
- **Clean:** sentence case, no eyebrows, no shadows. Ruled sections with one card type for objects.
- **Interesting:** pieces specific to this person, not a template.
  - The career shown as a CI run, with a typed terminal.
  - The hero scene of runners pulling jobs from a queue.
  - Wiring diagrams whose packets move on hover.
  - The FLAME → GNM swap and vertex chart.

## Content to review

These were written or arranged from the resume and the old site. Please check them against your own wording:

1. **Work:** the skills listed under each era.
2. **Projects:**
   - the project diagrams (RISC-V stages, VLM pipeline, the pull loop);
   - the "This portfolio" project entry.
3. **Writing:**
   - the "Why this page" intro and its 3 steps;
   - the 4 posts. They are still drafts.
4. **About:** the 4 "How I work" principles.
5. **Home:** the one-sentence Xpresso.ai summary.
