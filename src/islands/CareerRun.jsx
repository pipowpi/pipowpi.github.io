import { useEffect, useRef, useState } from 'react';
import { CAREER_STEPS } from '../data/home.js';
import { CareerWalk } from '../components/CareerWalk.jsx';
import { Chip, Icon, Sheet, StatusPill, TextLink, cn, useHref } from '../components/ui.jsx';
import { DeployIcon, PivotIcon, STATE_TEXT, StepIcon, SwitchIcon } from '../components/home/StepIcons.jsx';

// Eight years as a CI run (an island: hydrated in the browser). Vertical below 1280px wide, a
// left-to-right pipeline above. When the card scrolls into view the run replays: each stage runs and
// passes, the switch to NVIDIA flips, and the run ends on the MS, which keeps running; the deploy job
// (a full-time role) waits for review. The server render shows that final state. If the card is
// already on screen when the page loads, it stays in that state (no reset flash); Replay runs it.
const RUN_END = CAREER_STEPS.findIndex((s) => s.kind === 'deploy') - 1; // the MS
const DUR = CAREER_STEPS.map((s) => (s.kind === 'switch' ? 1100 : s.kind === 'pivot' ? 1500 : 1400));

function stepState(i, at) {
  if (CAREER_STEPS[i].kind === 'deploy') return 'waiting';
  if (i < at) return 'done';
  if (i === at) return 'running';
  return 'queued';
}

function statusLine(at) {
  const cur = CAREER_STEPS[Math.max(at, 0)];
  if (at < 0) return 'queued: career.yml';
  if (cur.kind === 'switch') return 'switch: new company, new role, new team';
  if (cur.kind === 'pivot') return 'pivot: stop treating models as a black box, learn them to build better infra for them';
  if (at < RUN_END) return `running: ${cur.name} (${cur.time})`;
  return `running: ${cur.name}. next: deploy, waiting for review`;
}

export default function CareerRun() {
  const href = useHref();
  const ref = useRef(null);
  const timers = useRef([]);
  const [at, setAt] = useState(RUN_END); // index of the running step
  const [played, setPlayed] = useState(true);

  const play = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPlayed(false);
    setAt(0);
    let t = 0;
    for (let i = 1; i <= RUN_END; i++) {
      t += DUR[i - 1];
      timers.current.push(setTimeout(() => setAt(i), t));
    }
    timers.current.push(setTimeout(() => setPlayed(true), t + 300));
  };

  useEffect(() => {
    const el = ref.current;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || document.documentElement.getAttribute('data-motion') === 'off';
    if (!el || still || !('IntersectionObserver' in window)) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight) return undefined; // already visible: no flash
    setAt(-1); // below the fold: queue everything until the card is on screen
    setPlayed(false);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); setTimeout(play, 250); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); timers.current.forEach(clearTimeout); };
  }, []);

  return (
    <Sheet className="overflow-hidden">
      <div ref={ref} className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3 md:px-6">
        <p className="flex flex-wrap items-center gap-3 text-small">
          <StatusPill status="running">Running</StatusPill>
          <span translate="no" className="font-mono text-body text-ink">career.yml</span>
        </p>
        <div className="flex items-center gap-5">
          <button type="button" onClick={play} disabled={!played}
            className="t-label inline-flex min-h-10 cursor-pointer items-center gap-1.5 text-lead transition-opacity duration-(--duration-base) hover:text-accent active:translate-y-px disabled:cursor-default disabled:opacity-0">
            <Icon name="play" className="size-3.5" />Replay
          </button>
          <TextLink href={href('work/#timeline')} className="inline-flex min-h-10 items-center text-small">See the full timeline</TextLink>
        </div>
      </div>
      <div className="border-b border-rule bg-paper px-2 pt-3 md:px-6 md:pt-4">
        <CareerWalk at={at} className="mx-auto block h-auto w-full max-w-[680px]" />
      </div>
      <ol className="grid grid-cols-1 p-5 md:p-6 xl:grid-cols-[repeat(3,minmax(0,1fr))_92px_minmax(0,1fr)_92px_repeat(2,minmax(0,1fr))]" aria-label="Career so far, as a build run">
        {CAREER_STEPS.map((s, i) => {
          const st = stepState(i, at);
          const next = CAREER_STEPS[i + 1];
          const iconCls = cn('absolute top-0.5 left-0 xl:static xl:flex', st === 'done' && 'pop');
          return (
            <li key={s.name} style={{ '--sc': `var(--${s.tone})` }} className={cn('relative pb-6 pl-10 transition-opacity duration-(--duration-slow) last:pb-0 xl:pb-0 xl:pl-0 xl:pr-4', st === 'queued' && 'opacity-45')}>
              {next && (
                <span aria-hidden="true" className={cn('absolute top-7 bottom-1 left-[11px] w-0.5 xl:top-[11px] xl:bottom-auto xl:left-7 xl:right-1 xl:h-0.5 xl:w-auto',
                  next.kind === 'deploy' ? 'dash-run-yx opacity-60' : 'bg-rule-strong')}>
                  {next.kind !== 'deploy' && (
                    <span className={cn('absolute inset-0 origin-top bg-[var(--sc)] transition-transform duration-(--duration-slow) ease-[var(--ease-out)] xl:origin-left',
                      i < at ? 'scale-100' : 'scale-y-0 xl:scale-x-0 xl:scale-y-100')} />
                  )}
                </span>
              )}
              {s.kind === 'switch' ? <SwitchIcon key={st} state={st} className={iconCls} />
                : s.kind === 'pivot' ? <PivotIcon key={st} state={st} className={iconCls} />
                : s.kind === 'deploy' ? <DeployIcon className={iconCls} />
                : <StepIcon key={st} state={st} className={iconCls} />}
              <p className={cn('t-chip transition-colors duration-(--duration-base) xl:mt-3',
                s.kind === 'switch' ? 'text-ink' : s.kind === 'pivot' || s.kind === 'deploy' ? 'text-accent' : st === 'running' ? 'text-run' : st === 'done' ? 'text-[var(--sc)]' : 'text-lead')}>
                {s.time}<span className="sr-only">, {s.kind === 'deploy' ? 'waiting for review' : s.kind === 'switch' || s.kind === 'pivot' ? s.kind : STATE_TEXT[st]}</span>
              </p>
              <p className="mt-0.5 text-body font-semibold leading-snug text-ink">{s.name}</p>
              {s.kind === 'deploy'
                ? <p className="mt-1"><Chip variant="dashed">{s.org}</Chip></p>
                : <p className="text-small font-medium text-ink/80">{s.org}</p>}
              {s.role && <p className="text-caption leading-snug text-lead">{s.role}</p>}
              {s.why && <p className="mt-1.5 hidden text-caption leading-snug text-accent xl:block">{s.why}</p>}
              {s.sub && <p className={cn('mt-1 text-small leading-snug text-lead xl:hidden', s.kind === 'stage' && 'hidden md:block')}>{s.sub}</p>}
              {st === 'running' && i < RUN_END && s.kind === 'stage' && <div className="relative mt-3 h-1 max-w-[160px] overflow-hidden rounded-sm bg-rule"><div className="busy-fill" /></div>}
            </li>
          );
        })}
      </ol>
      <p translate="no" className="border-t border-rule bg-paper px-5 py-2.5 font-mono text-small text-lead md:px-6">
        <span className="text-run">&gt;</span> {statusLine(at)}
      </p>
    </Sheet>
  );
}
