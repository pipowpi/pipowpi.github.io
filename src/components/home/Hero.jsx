import { SITE } from '../../data/site.js';
import { HERO, FACTS, PHASE, NOW } from '../../data/home.js';
import { Button, Icon, Mark, Sheet, Stat, TextLink, Wrap, cn, tone, useHref } from '../ui.jsx';
import { StepIcon, STATE_TEXT } from './StepIcons.jsx';

// Where this academic year stands: a four-stop track, the first stop running.
function PhaseTrack() {
  return (
    <ol className="grid grid-cols-4" aria-label="This academic year">
      {PHASE.map((p, i) => (
        <li key={p.when} className="relative min-w-0 pr-2">
          {i < PHASE.length - 1 && (
            <span aria-hidden="true" className={cn('absolute top-[11px] left-6 right-0 h-0.5',
              p.state === 'running' ? 'dash-run opacity-70' : 'bg-rule-strong')} />
          )}
          <StepIcon state={p.state} />
          <p className={cn('t-label mt-2.5', p.state === 'running' ? 'text-run' : 'text-ink')}>{p.when}</p>
          <p className="text-caption leading-snug text-lead"><span className="sr-only">{STATE_TEXT[p.state]}: </span>{p.what}</p>
        </li>
      ))}
    </ol>
  );
}

function NowCard() {
  const href = useHref();
  return (
    <Sheet as="aside" aria-labelledby="now-title" className="p-5 md:p-6">
      <h2 id="now-title" className="font-display text-h4 font-semibold leading-tight">Right now</h2>
      <div className="mt-5"><PhaseTrack /></div>
      <dl className="mt-5 border-t border-rule">
        {NOW.map((r) => (
          <div key={r.k} style={tone(r.tone)} className="flex gap-3.5 border-b border-rule py-3 last:border-b-0 last:pb-0">
            <Mark name={r.icon} size="sm" />
            <div className="min-w-0">
              <dt className="t-label text-ink">{r.k}</dt>
              <dd className="mt-0.5 text-small leading-snug text-lead">
                {r.v}{r.href && <> <TextLink href={href(r.href)} className="whitespace-nowrap text-small">See projects</TextLink></>}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </Sheet>
  );
}

export function Hero() {
  const href = useHref();
  return (
    <Wrap className="grid grid-cols-1 items-center gap-10 pt-10 pb-10 md:pt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
      <div>
        <p className="text-title font-medium text-lead">{HERO.hello}</p>
        <h1 className="mt-3 font-display text-h2 font-semibold leading-[1.1] md:text-display">{HERO.title}</h1>
        {HERO.lede.map((para, i) => <p key={i} className={cn('max-w-[58ch] text-large leading-relaxed text-lead', i ? 'mt-3' : 'mt-6')}>{para}</p>)}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button primary href={href('work/')}>See my work</Button>
          <Button href={`mailto:${SITE.email}`}><Icon name="mail" className="size-[18px]" />Email me</Button>
        </div>
        <p className="mt-7 inline-flex items-center gap-2.5 text-small font-medium text-run">
          <span className="ping relative inline-block size-2 rounded-full bg-run" aria-hidden="true" />
          {SITE.availability}
        </p>
        <dl className="mt-8 grid max-w-[560px] grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {FACTS.map((f) => <Stat key={f.label} value={f.n} label={f.label} tone={f.tone} />)}
        </dl>
      </div>
      <NowCard />
    </Wrap>
  );
}
