import { HEAD, COURSE, PERSONAL } from '../data/projects.js';
import { Layout } from '../components/Layout.jsx';
import { Flow, Stages } from '../components/Flow.jsx';
import { Glance, Mark, PageHead, Section, Sheet, StatusPill, TextLink, Wrap, cn, useHref } from '../components/ui.jsx';

const NUM = new Intl.NumberFormat('en-US');
const toStatus = (s) => (s === 'live' ? 'running' : 'planned');

function Checklist({ items, done }) {
  return (
    <ul className="mt-3 flex flex-col gap-3">
      {items.map((t) => (
        <li key={t} className={cn('relative pl-8 text-[16px] leading-snug', done ? 'text-ink' : 'text-lead')}>
          <span aria-hidden="true" className={cn('absolute top-0.5 left-0 inline-flex size-5 items-center justify-center rounded-full',
            done ? 'bg-pass text-sheet' : 'border-2 border-dashed border-queue')}>
            {done && <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}
          </span>
          <span className="sr-only">{done ? 'Done: ' : 'Next: '}</span>{t}
        </li>
      ))}
    </ul>
  );
}

// Horizontal bar chart comparing mesh sizes.
function VertexChart({ flame, gnm }) {
  const max = Math.max(flame, gnm);
  const rows = [['FLAME', flame, false], ['GNM', gnm, true]];
  return (
    <figure>
      <figcaption className="text-[16px] font-semibold text-ink">Mesh vertices</figcaption>
      <div className="mt-3 flex flex-col gap-3">
        {rows.map(([name, v, hot]) => (
          <div key={name} className="grid grid-cols-[64px_minmax(0,1fr)_72px] items-center gap-3">
            <span className="text-[15px] font-medium text-lead">{name}</span>
            <span className="h-3 overflow-hidden rounded-sm bg-rule">
              <span className={cn('grow-x block h-full rounded-sm', hot ? 'bg-accent' : 'bg-lead')} style={{ width: `${(v / max) * 100}%` }} />
            </span>
            <span className="text-right text-[16px] font-semibold tabular-nums lining-nums text-ink">{NUM.format(v)}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[15px] leading-snug text-lead">GNM’s mesh is about {(gnm / flame).toFixed(1)}x denser, so landmarks and face masks have to be remapped.</p>
    </figure>
  );
}

function HeadProject() {
  const p = HEAD;
  const pct = Math.round((p.milestones.done / p.milestones.total) * 100);
  return (
    <Sheet as="article" id={p.id} className="p-5 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start justify-between gap-3 sm:contents">
          <Mark name={p.icon} size="lg" />
          <span className="sm:hidden"><StatusPill status={toStatus(p.status)} /></span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-[26px] font-semibold leading-tight md:text-[32px]">{p.title}</h3>
            <span className="hidden shrink-0 pt-1.5 sm:block"><StatusPill status={toStatus(p.status)} /></span>
          </div>
          <p className="t-meta mt-2 text-lead">{p.context}</p>
        </div>
      </div>
      <Glance className="mt-6" items={p.glance} />
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="h-2.5 w-full max-w-[360px] overflow-hidden rounded-sm bg-rule" role="progressbar" aria-valuemin={0} aria-valuemax={p.milestones.total} aria-valuenow={p.milestones.done} aria-label="Milestones done">
          <div className="grow-x h-full rounded-sm bg-pass" style={{ width: `${pct}%` }} />
        </div>
        <span className="t-meta font-medium text-ink">{p.milestones.done} of {p.milestones.total} milestones done</span>
      </div>
      <details className="group/d mt-5 border-t border-rule pt-3">
        <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-2.5 text-[16px] font-semibold text-ink hover:text-accent [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="inline-flex size-6 items-center justify-center rounded-md border border-rule-strong text-[16px] leading-none text-accent">
            <span className="group-open/d:hidden">+</span><span className="hidden group-open/d:inline">−</span>
          </span>
          Why GNM
        </summary>
        <p className="mt-2 max-w-[70ch] text-[16px] leading-relaxed text-lead">{p.why}</p>
      </details>
      <Flow className="mt-8" nodes={p.flow} label="SMIRK pipeline with GNM swapped in" />
      <p className="mt-3 text-[15px] text-lead">{p.flowNote}</p>
      <div className="mt-8 grid grid-cols-1 gap-8 border-t border-rule pt-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <VertexChart {...p.vertices} />
        <dl className="grid grid-cols-2 gap-6">
          {p.gnmParams.map((g) => (
            <div key={g.label} className="flex flex-col">
              <dd className="order-1 t-stat text-ink">{g.value}</dd>
              <dt className="order-2 mt-2 text-[15px] leading-snug text-lead">GNM {g.label}</dt>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 border-t border-rule pt-6 md:grid-cols-2">
        <div><h4 className="font-display text-[19px] font-semibold">Done</h4><Checklist items={p.done} done /></div>
        <div><h4 className="font-display text-[19px] font-semibold">Next</h4><Checklist items={p.next} /></div>
      </div>
    </Sheet>
  );
}

function SmallProject({ p }) {
  const href = useHref();
  const hasDiagram = p.stages || p.loop;
  return (
    <Sheet as="article" id={p.id} className={cn('grid grid-cols-1 gap-y-6 p-5 md:p-7', hasDiagram && 'md:gap-y-7')}>
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <Mark name={p.icon} />
          <StatusPill status={toStatus(p.status)} />
        </div>
        <h3 className="mt-4 font-display text-[24px] font-semibold leading-snug">{p.title}</h3>
        <p className="t-meta mt-1 text-lead">{p.context}</p>
        <p className="mt-2 max-w-[72ch] text-[16px] leading-relaxed text-lead">{p.text}</p>
        {p.link && <p className="mt-auto pt-5"><TextLink href={href(p.link[1])}>{p.link[0]}</TextLink></p>}
      </div>
      {p.stages && (
        <div>
          <p className="text-[15px] font-medium text-ink">{p.diagramTitle || 'How it works'}</p>
          <Stages stages={p.stages} label={p.diagramTitle || `${p.title}: how it works`} />
        </div>
      )}
      {p.loop && (
        <div>
          <p className="text-[15px] font-medium text-ink">The pull loop</p>
          <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="The pull loop">
            {p.loop.map((step, i) => (
              <li key={step} className="flex items-center gap-2.5 rounded-md border border-rule-strong bg-sheet px-3 py-3 text-[15px] text-ink">
                <span className="t-chip font-semibold text-accent">{i + 1}</span>{step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </Sheet>
  );
}

export default function Projects() {
  return (
    <Layout active="projects">
      <Wrap>
        <PageHead title="Things I’m building"
          aside={(
            <ul className="flex gap-3" aria-label="Legend">
              <li><StatusPill status="running" /></li>
              <li><StatusPill status="planned" /></li>
            </ul>
          )}>
          Course projects from my MS at Stony Brook, and open versions of ideas from my professional work.
        </PageHead>

        <Section id="fall-2026" label="Fall 2026" note="Stony Brook University">
          <HeadProject />
          <div className="mt-4 grid grid-cols-1 gap-4">
            {COURSE.map((p) => <SmallProject key={p.id} p={p} />)}
          </div>
        </Section>

        <Section id="personal" label="Personal" note="Built on my own time">
          <div className="grid grid-cols-1 gap-4">
            {PERSONAL.map((p) => <SmallProject key={p.id} p={p} />)}
          </div>
        </Section>
      </Wrap>
    </Layout>
  );
}
