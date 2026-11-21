import { useEffect, useState } from 'react';
import { SITE, NAV } from '../data/site.js';
import { Button, Icon, Wrap, cn, useHref } from './ui.jsx';

function ThemeToggle() {
  // Starts as 'dark' to match the server render; the real value is read after hydration.
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }, []);
  const next = theme === 'dark' ? 'light' : 'dark';
  const flip = () => {
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('gkk-theme', next); } catch (e) { /* storage unavailable */ }
    // Keep the browser chrome color in step with the page, not only with the system setting.
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', next === 'dark' ? '#100E0B' : '#F5F1E8'));
    setTheme(next);
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  };
  return (
    <button type="button" onClick={flip} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}
      className="inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-rule-strong text-ink transition-colors duration-150 hover:border-accent hover:text-accent">
      <span className="hidden dark:block"><Icon name="sun" className="size-[18px]" /></span>
      <span className="hidden light:block"><Icon name="moon" className="size-[18px]" /></span>
    </button>
  );
}

function Header({ active }) {
  const href = useHref();
  return (
    <header className="sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)] border-rule bg-[var(--header)] backdrop-blur-md">
      <Wrap className="flex items-center justify-between gap-3 py-3">
        <a className="flex items-center gap-3 text-ink" href={href('')} aria-label={`${SITE.name}, home`}>
          <span className="inline-flex size-9 items-center justify-center rounded-md bg-accent font-display text-[15px] font-bold text-on-accent">{SITE.initials}</span>
          <span className="hidden font-display text-[18px] font-semibold md:inline" translate="no">{SITE.name}</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Main">
            <ul className="flex">
              {NAV.map((n) => (
                <li key={n.key}>
                  <a href={href(n.href)} aria-current={active === n.key ? 'page' : undefined}
                    className={cn('relative inline-flex min-h-10 items-center px-2 text-[15px] font-medium sm:px-3 sm:text-[16px]',
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
      <Wrap className="grid grid-cols-1 gap-x-10 gap-y-6 py-12 lg:grid-cols-[200px_minmax(0,1fr)]">
        <h2 className="font-display text-[21px] font-semibold leading-tight">Contact</h2>
        <div>
          <p className="max-w-[24ch] font-display text-[30px] font-semibold leading-tight md:text-[36px]">Let’s build something.</p>
          <p className="mt-3 max-w-[60ch] text-[17px] text-lead">Open to systems, infrastructure and applied AI roles from June 2027.</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button primary href={`mailto:${SITE.email}`}><Icon name="mail" className="size-[18px]" />{SITE.email}</Button>
            <a className="inline-flex min-h-11 items-center gap-1.5 font-medium text-ink hover:text-accent" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<Icon name="external" className="size-4" /><span className="sr-only"> (opens in a new tab)</span></a>
            <a className="inline-flex min-h-11 items-center gap-1.5 font-medium text-ink hover:text-accent" href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub<Icon name="external" className="size-4" /><span className="sr-only"> (opens in a new tab)</span></a>
          </div>
          <p className="mt-10 text-[14px] text-lead">{SITE.name}, {SITE.location}</p>
        </div>
      </Wrap>
    </footer>
  );
}

export function Layout({ active, children }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">Skip to content</a>
      <Header active={active} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

export { Wrap };
