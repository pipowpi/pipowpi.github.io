import { SITE, NAV } from '../data/site.js';
import { Button, Icon, MotionToggle, ThemeToggle, Wrap, cn, useHref } from './ui.jsx';

// The page background: a blueprint grid with a soft wash of the page's two colors along the top,
// both fading out within the first screen (styles in styles.css, .backdrop).
function Backdrop({ page }) {
  return <div className="backdrop" data-page={page} aria-hidden="true" />;
}

function Header({ active }) {
  const href = useHref();
  return (
    <header className="sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)] border-rule bg-[var(--header)] backdrop-blur-md">
      <Wrap className="flex items-center justify-between gap-3 py-3">
        <a className="flex items-center gap-3 text-ink" href={href('')} aria-label={`${SITE.name}, home`}>
          <span className="inline-flex size-9 items-center justify-center rounded-md bg-accent font-display text-small font-bold text-on-accent">{SITE.initials}</span>
          <span className="hidden font-display text-large font-semibold md:inline" translate="no">{SITE.name}</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Main">
            <ul className="flex">
              {NAV.map((n) => (
                <li key={n.key}>
                  <a href={href(n.href)} aria-current={active === n.key ? 'page' : undefined}
                    className={cn('relative inline-flex min-h-10 items-center px-2 text-small font-medium sm:px-3 sm:text-body',
                      active === n.key ? 'text-ink after:absolute after:inset-x-2 after:-bottom-[13px] after:h-[3px] after:bg-accent sm:after:inset-x-3' : 'text-lead hover:text-ink')}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </Wrap>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-6 border-t border-rule">
      <Wrap className="grid grid-cols-1 gap-x-10 gap-y-6 py-12 lg:grid-cols-[180px_minmax(0,1fr)]">
        <h2 className="font-display text-h4 font-semibold leading-tight">Contact</h2>
        <div>
          <p className="max-w-[24ch] font-display text-h2 font-semibold leading-tight md:text-h1">If you’re hiring, I’d like to hear from you.</p>
          <p className="mt-3 max-w-[60ch] text-body text-lead">I’m looking for full-time work in systems, infrastructure or applied AI from June 2027. Email is the quickest way to reach me.</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button primary href={`mailto:${SITE.email}`}><Icon name="mail" className="size-[18px]" />{SITE.email}</Button>
            <a className="inline-flex min-h-11 items-center gap-1.5 font-medium text-ink hover:text-accent" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<Icon name="external" className="size-4" /><span className="sr-only"> (opens in a new tab)</span></a>
            <a className="inline-flex min-h-11 items-center gap-1.5 font-medium text-ink hover:text-accent" href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub<Icon name="external" className="size-4" /><span className="sr-only"> (opens in a new tab)</span></a>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-caption text-lead">{SITE.name}, {SITE.location}</p>
            <div className="flex items-center gap-3">
              <a href="#main" className="t-label inline-flex min-h-10 items-center text-lead hover:text-accent">Back to top</a>
              <MotionToggle />
            </div>
          </div>
        </div>
      </Wrap>
    </footer>
  );
}

export function Layout({ active, children }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">Skip to content</a>
      <Backdrop page={active} />
      <Header active={active} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

export { Wrap };
