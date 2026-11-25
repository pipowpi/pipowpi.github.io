import { createContext, useContext } from 'react';
import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Relative path from the current page to the site root ('', '../' or '../../'),
// so links work at https://user.github.io/ and at https://user.github.io/repo/.
export const RootContext = createContext('');
export function useHref() {
  const root = useContext(RootContext);
  return (href = '') => (root + href) || './';
}

// Class names: clsx for conditions, tailwind-merge so a later class wins over a conflicting earlier one.
// Swap the accent inside an element for one of the site's colors (pink, teal, coral, lime, accent, ink).
// Everything inside that uses the accent (icons, numbers, links, highlights) follows.
export function tone(t) {
  if (!t || t === 'accent') return undefined;
  const c = `var(--${t})`;
  return { '--accent': c, '--wash': `color-mix(in srgb, ${c} 16%, var(--sheet))` };
}

// tailwind-merge must know the custom type scale (text-caption ... text-display) is a font size,
// or it would treat it as a color and drop text-lead or text-ink next to it.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ['caption', 'small', 'body', 'large', 'title', 'h4', 'h3', 'h2', 'h1', 'display'] } },
});
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ICON_PATHS = {
  gpu: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="9" cy="12" r="3" /><path d="M15 10h4M15 14h4M6 18v2M10 18v2M14 18v2" /></>,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>,
  gauge: <><path d="M4 18a8 8 0 1 1 16 0" /><path d="M12 18l4-6" /><circle cx="12" cy="18" r="1.2" /></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  convert: <path d="M4 8h14l-3-3M20 16H6l3 3" />,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>,
  face: <><path d="M12 3c-4 0-7 3-7 7.5 0 3 1.3 5.6 3.5 7.2V21h7v-3.3c2.2-1.6 3.5-4.2 3.5-7.2C19 6 16 3 12 3z" /><path d="M9.5 10.5h.01M14.5 10.5h.01" /><path d="M9.5 14.5c1.4 1 3.6 1 5 0" /></>,
  eye: <><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.6" /></>,
  branch: <><circle cx="6" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="7" r="2" /><path d="M6 7v10" /><path d="M18 9c0 4-4 5-10 8" /></>,
  server: <><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /><path d="M7 7.5h.01M7 16.5h.01" /></>,
  code: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />,
  book: <><path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z" /><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z" /></>,
  wrench: <path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-3-1-1-3z" />,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 12h.01" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  pen: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  external: <path d="M7 17L17 7M9 7h8v8" />,
  pause: <><path d="M9 5v14M15 5v14" /></>,
  play: <><path d="M8 5.5v13l10.5-6.5z" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
};

export function Icon({ name, className = 'size-5', strokeWidth = 1.8 }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {ICON_PATHS[name]}
    </svg>
  );
}

// A line icon inside a small square frame, drawn like a symbol on a schematic.
const MARK_SIZES = { sm: 'size-8 [&_svg]:size-[18px]', md: 'size-10 [&_svg]:size-[22px]', lg: 'size-12 [&_svg]:size-[26px]' };
export function Mark({ name, size = 'md', className = '' }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center rounded-md border border-rule-strong bg-sheet text-accent', MARK_SIZES[size], className)}>
      <Icon name={name} />
    </span>
  );
}

// A sheet is the one card surface: for things that are objects (case studies, projects, posts).
export function Sheet({ as: Tag = 'div', interactive = false, className = '', children, ...rest }) {
  return (
    <Tag className={cn('relative rounded-md border border-rule bg-sheet',
      interactive && 'block text-ink transition-[border-color,transform] duration-(--duration-fast) ease-[var(--ease-out)] hover:border-accent focus-visible:border-accent active:translate-y-px', className)} {...rest}>
      {children}
    </Tag>
  );
}

// Chip: the one small label shape. Variants: tag (a tool or skill), accent (a topic, in the current
// accent color), ink (a neutral marker such as "New role and team"), dashed (something pending).
const CHIP = {
  tag: 'border-rule font-normal text-lead',
  accent: 'border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-wash text-accent',
  ink: 'border-ink text-ink',
  dashed: 'rounded-md border-dashed border-accent text-accent',
};
export function Chip({ variant = 'tag', icon, className = '', children, ...rest }) {
  return (
    <span className={cn('t-chip inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5', CHIP[variant], className)} {...rest}>
      {icon && <Icon name={icon} className="size-3.5" />}
      {children}
    </span>
  );
}

export function Tag({ children, className = '' }) {
  return <Chip translate="no" className={className}>{children}</Chip>;
}

const STATUS = {
  passed: { label: 'Passed', dot: 'bg-pass', text: 'text-pass' },
  running: { label: 'In progress', dot: 'bg-run animate-[blink_1.4s_ease-in-out_infinite]', text: 'text-run' },
  planned: { label: 'Planned', dot: 'border-[1.5px] border-dashed border-queue', text: 'text-lead' },
};
export function StatusPill({ status, children }) {
  const s = STATUS[status];
  return (
    <Chip className={cn('gap-2 font-medium', s.text)}>
      <span aria-hidden="true" className={cn('inline-block size-2 rounded-full', s.dot)} />
      {children || s.label}
    </Chip>
  );
}

// A number with its label and a colored rule above it (home facts, About numbers).
export function Stat({ value, label, tone: t, size = 'metric' }) {
  return (
    <div style={tone(t)} className="flex flex-col border-t-2 border-accent pt-3">
      <dd className={cn('order-1 text-ink', size === 'stat' ? 't-stat' : 't-metric')}>{value}</dd>
      <dt className="order-2 mt-1.5 text-caption leading-snug text-lead">{label}</dt>
    </div>
  );
}

// Details that are always open on tablets and desktops, and folded behind a button on phones.
// The button is wired up in entry-client.jsx; without JavaScript everything stays open.
export function Collapsible({ label = 'details', className = '', children }) {
  return (
    <div className={cn('clps', className)}>
      <button type="button" data-clps data-label={label} aria-expanded="false"
        className="clps-btn t-label inline-flex min-h-10 cursor-pointer items-center gap-1.5 text-accent md:hidden">
        <span aria-hidden="true" className="clps-sign">+</span><span className="clps-text">{`Show ${label}`}</span>
      </button>
      <div className="clps-body">{children}</div>
    </div>
  );
}

// An island: a part of the page that becomes interactive in the browser. The server renders the
// component as usual; entry-client.jsx loads its code only on pages that have one, and hydrates just
// this element. Props must be plain data (they travel as JSON in data-props).
export function Island({ name, component: C, props = {} }) {
  return <div data-island={name} data-props={JSON.stringify(props)} className="contents"><C {...props} /></div>;
}

export function TextLink({ href, className = '', children, ...rest }) {
  return (
    <a href={href} className={cn('font-medium text-accent underline decoration-[color-mix(in_srgb,var(--accent)_40%,transparent)] decoration-1 underline-offset-4 hover:decoration-accent', className)} {...rest}>
      {children}
    </a>
  );
}

export function Button({ href, primary = false, className = '', children, ...rest }) {
  return (
    <a href={href} className={cn('inline-flex min-h-11 items-center gap-2 rounded-md border px-5 py-2.5 text-body font-medium transition-colors duration-150',
      'active:translate-y-px',
      primary
        ? 'border-accent bg-accent text-on-accent hover:bg-[color-mix(in_srgb,var(--accent)_88%,var(--ink))]'
        : 'border-rule-strong bg-sheet text-ink hover:border-accent hover:text-accent', className)} {...rest}>
      {children}
    </a>
  );
}

export function Wrap({ className = '', children }) {
  return <div className={cn('mx-auto max-w-[1120px] px-5 md:px-8', className)}>{children}</div>;
}

// A document section: its name sits in the left margin on wide screens and above the content on phones.
// `wide` puts the name above the content at every size, for content that needs the full width.
export function Section({ id, label, note, wide = false, tight = false, className = '', children }) {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={titleId} className={cn('grid grid-cols-1 gap-x-10 gap-y-5 border-t border-rule', tight ? 'py-6' : 'py-8 lg:py-10', !wide && 'lg:grid-cols-[180px_minmax(0,1fr)]', className)}>
      <div>
        <h2 id={titleId} className="font-display text-h4 font-semibold leading-tight text-ink">{label}</h2>
        {note && <p className="mt-1.5 text-caption leading-snug text-lead">{note}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

// `art` is a drawing shown on the right on wide screens (a Motif); `aside` sits under the text when
// there is art, and on the right when there is not.
export function PageHead({ title, children, aside, art }) {
  return (
    <header className={cn('grid grid-cols-1 gap-6 pt-10 pb-8 md:pt-12', art ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-center' : 'lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end')}>
      <div>
        <h1 className="font-display text-h1 font-semibold leading-[1.08] md:text-display">{title}</h1>
        {children && <div className="mt-4 max-w-[66ch] text-large leading-relaxed text-lead">{children}</div>}
        {art && aside && <div className="mt-5">{aside}</div>}
      </div>
      {art ? <div className="hidden lg:block">{art}</div> : aside}
    </header>
  );
}

// Key facts as a ruled definition table, like the header block of a spec sheet.
export function Glance({ items, className = '' }) {
  return (
    <dl className={cn('grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {items.map(([k, v]) => (
        <div key={k} className="border-t border-rule py-3">
          <dt className="t-label font-normal text-lead">{k}</dt>
          <dd className="mt-0.5 text-body font-medium leading-snug tabular-nums lining-nums text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// Date ranges are shown as written ("2017 - 2020"): house style avoids en and em dashes.
export function enDash(s) {
  return String(s);
}

// Pause or play every animation on the site. Plain markup: the click handler lives in
// entry-client.jsx, and the saved choice is applied before first paint by the boot script.
export function MotionToggle({ className = '' }) {
  return (
    <button type="button" data-motion-toggle aria-pressed="false"
      className={cn('t-label inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-rule-strong px-3 text-ink transition-colors duration-(--duration-fast) hover:border-accent hover:text-accent', className)}>
      <span className="motion-on inline-flex"><Icon name="pause" className="size-4" /></span>
      <span className="motion-off inline-flex"><Icon name="play" className="size-4" /></span>
      <span className="motion-label">Pause animations</span>
    </button>
  );
}

// Light and dark switch. Plain markup; the handler lives in entry-client.jsx.
export function ThemeToggle() {
  return (
    <button type="button" data-theme-toggle aria-label="Switch to light mode" title="Switch to light mode"
      className="inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-rule-strong text-ink transition-colors duration-(--duration-fast) hover:border-accent hover:text-accent active:translate-y-px">
      <span className="hidden dark:block"><Icon name="sun" className="size-[18px]" /></span>
      <span className="hidden light:block"><Icon name="moon" className="size-[18px]" /></span>
    </button>
  );
}
