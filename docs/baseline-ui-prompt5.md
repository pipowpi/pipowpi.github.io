# Baseline UI review (Prompt 5)

I reviewed every component against the rules in `ui-skills/skills/baseline-ui/SKILL.md`. The design system, layout, features and data are unchanged.

## Violations fixed

| Rule | Where | Before | Fix |
|---|---|---|---|
| MUST use a `cn` utility (`clsx` + `tailwind-merge`) | `ui.jsx` and every component | `cx()` joined strings, so a conflicting later class did not reliably win | Added `cn = twMerge(clsx(...))` and replaced every `cx` call. I diffed every class attribute across all pages. Only one merge changed output: `text-[22px]` was dropping `leading-snug` in `PostList`. The order is fixed so `leading-snug` survives. |
| NEVER animate layout properties | `styles.css` | Terminal typing animated `width`. The busy bar animated `left`. Diagram packets animated `left`/`top`. | Typing is now a terminal-colored cover that shrinks with `transform: scaleX` in character steps. The busy bar uses `translateX`. Packets use `translateX`/`translateY` over a per-wire `--len`. |
| NEVER introduce custom easing curves | `.rot`, `.grow-x`, `.step-in` | `cubic-bezier(.2,.7,.2,1)` | `ease-out` |
| MUST pause looping animations when off screen | status dots, spinner, busy bar, rotating headline, ping, cursor | Ran forever | `entry-client.jsx` watches each looping element's parent with an IntersectionObserver and sets `data-paused`. CSS sets `animation-play-state: paused`. The hero canvas already paused itself. |
| NEVER modify `letter-spacing` | Hero h1, page h1, post h1, `t-stat` | `tracking-[-0.015em]`, `tracking-[-0.01em]`, `letter-spacing: -0.02em` | Removed. MASTER.md is updated to match. |
| MUST use a fixed `z-index` scale | Skip link | `focus:z-[100]` | `focus:z-50`. The scale is now 10 (step icons), 30 (header), 40 (reading progress) and 50 (skip link). |
| MUST respect `safe-area-inset` for fixed elements | Sticky header, fixed reading-progress bar | No inset | `pt-[env(safe-area-inset-top)]` on the header, `top: env(safe-area-inset-top)` on the progress bar |
| NEVER use gradients unless requested | Dashed "in progress" fills, hero grid | `repeating-linear-gradient` / `linear-gradient` | SVG masks over a token color (`background: var(--run)` plus a `mask` with a data-URI pattern). They look the same and follow the theme. |
| NEVER add animation unless requested; NEVER use `useEffect` for what render can do | `CountUp` on the Work results | Numbers counted up from 0 using `useEffect` and `requestAnimationFrame` | Removed. The real number renders immediately. |
| MUST use `text-balance` on headings | `h4` sub-headings | Only h1–h3 were balanced | `h1, h2, h3, h4 { text-wrap: balance }`. Paragraphs already use `pretty`. |

## Checked and already compliant

- Icon-only button has an `aria-label`: the theme toggle ("Switch to dark mode").
- Native accessible primitives with no hand-built focus logic: `<details>`/`<summary>` for "Why GNM", and `<button aria-pressed>` for the filters.
- No `h-screen`, no `will-change`, and no animated blur. The header's `backdrop-blur` is static.
- Interaction feedback stays at 200ms or less: `transition-colors duration-150`.
- Only `transform` and `opacity` are animated. The one exception is the queued step's dashed border-color pulse, a small local element, which the rule allows.
- `tabular-nums` for data, via the `t-*` text roles.
- Square elements use `size-*`.
- No glow, no shadows, and one accent per view. Pass, run and queue are status colors, not accents.
- The empty state has one clear action ("Show all posts").
- Reduced motion turns off every animation and transition.

## Exceptions kept on purpose

- **Arbitrary text sizes** (`text-[15px]`, `text-[17px]`, `text-[21px]`). The rule allows custom values that already exist. These come from the design system's type scale (MASTER.md §4), and 15, 17 and 21px have no Tailwind default.
- **`motion/react` and `tw-animate-css`** aren't installed. Every remaining animation is CSS. The only JavaScript animation is the hero's `<canvas>` drawing, which isn't DOM animation.
- **Base UI / Radix** aren't needed. The site has no menus, dialogs or popovers. Its only interactive parts are links, native buttons and `<details>`.
- **`useEffect` in `ThemeToggle` and `HeroScene`.** The toggle reads the theme the boot script applied before hydration. The canvas needs the DOM. Neither can be done in render.
