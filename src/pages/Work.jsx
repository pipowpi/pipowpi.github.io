import { ERAS, YEAR_TICKS, PYTORCH_CI, XPRESSO } from '../data/work.js';
import { Layout } from '../components/Layout.jsx';
import { Flow } from '../components/Flow.jsx';
import { HeroScene } from '../components/HeroScene.jsx';
import { Motif } from '../components/Backdrop.jsx';
import { Glance, Icon, Mark, MotionToggle, PageHead, Section, Sheet, Tag, TextLink, Wrap, cn, enDash, useHref } from '../components/ui.jsx';

// Each era has its own stage color (the same as on the home page); the current one is dashed amber.
// Inside a case study the accent becomes that era's color (NVIDIA lime, Abzooba coral).
const tone = (t) => ({ '--accent': `var(--${t})`, '--wash': `color-mix(in srgb, var(--${t}) 16%, var(--sheet))` });
const ERA_TONE = ['bg-pink', 'bg-teal', 'bg-coral', 'bg-lime', 'dash-run'];
const ERA_TEXT = ['text-pink', 'text-teal', 'text-coral', 'text-lime', 'text-accent'];

function Timeline() {
  return (
    <>
      {/* Each bar is a mouse shortcut to its era below (keyboard users have the list itself).
          The link is 24px tall for an easy target; the bar drawn inside it is 16px. */}
      <div className="flex gap-1" aria-hidden="true">
        {ERAS.map((e, i) => (
          <a key={e.id} href={`#${e.id}`} tabIndex={-1} className="group flex h-6 items-center" style={{ flexGrow: e.weight }}>
            <span className={cn('block h-4 w-full rounded-sm transition-opacity duration-150 group-hover:opacity-80', ERA_TONE[i])} />
          </a>
        ))}
      </div>
      <div className="mt-1 flex justify-between t-label text-lead" aria-hidden="true">
        {YEAR_TICKS.map((y) => <span key={y}>{y}</span>)}
      </div>
      {/* Each era is a column; subgrid lines up the same row (dates, title, role, metric, work, skills)
          across columns so eras can be compared side by side. */}
      <ol className="mt-8 grid grid-cols-1 gap-x-6 sm:grid-cols-2 xl:grid-cols-5">
        {ERAS.map((e, i) => (
          <li key={e.id} id={e.id} className="row-span-7 grid grid-rows-subgrid content-start pb-10">
            <span className={cn('block h-1 w-full self-start rounded-sm', ERA_TONE[i])} aria-hidden="true" />
            <div className="mt-4">
              {e.switch && <p className="t-chip mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-ink px-2.5 py-0.5 text-ink"><Icon name="convert" className="size-3.5" /><span className="sr-only">Switch: </span>{e.switch}</p>}
              {e.pivot && <p className="t-chip mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-accent px-2.5 py-0.5 text-accent"><Icon name="book" className="size-3.5" />{e.pivot}</p>}
              <p className="t-meta text-lead"><span className={cn('font-semibold', ERA_TEXT[i])}>{enDash(e.years)}</span>, {e.org}</p>
              <h3 className="mt-1 font-display text-[18px] font-semibold leading-snug text-ink">{e.title}</h3>
            </div>
            <p className="text-[14px] leading-snug text-lead">{e.role}</p>
            <p className={cn('mt-3 items-baseline gap-2 sm:min-h-7', e.metric ? 'flex' : 'hidden sm:flex')}>
              {e.metric && (
                <>
                  <span className="t-metric whitespace-nowrap text-ink">{e.metric.value}</span>
                  <span className="text-[13px] font-medium leading-snug text-lead">{e.metric.label}</span>
                </>
              )}
            </p>
            <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-4 text-[14px] leading-snug text-ink marker:text-rule-strong">
              {e.work.map((w) => <li key={w}>{w}</li>)}
            </ul>
            <p className="t-label mt-5 text-lead">Skills</p>
            <ul className="mt-1.5 flex flex-wrap content-start gap-1.5" aria-label={`Skills, ${e.title}`}>
              {e.skills.map((sk) => <li key={sk}><Tag>{sk}</Tag></li>)}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
}

function CaseHead({ icon, c }) {
  return (
    <div className="flex items-start gap-4">
      <Mark name={icon} size="lg" />
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[23px] font-semibold leading-tight md:text-[28px]">{c.title}</h3>
        <p className="t-meta mt-2 text-lead"><span className="font-semibold text-ink">{c.org}</span>, {c.role}, {enDash(c.dates)}</p>
      </div>
    </div>
  );
}

function PytorchCase() {
  const href = useHref();
  const c = PYTORCH_CI;
  return (
    <Sheet as="article" id={c.id} style={tone('lime')} className="border-t-[3px] border-t-accent p-5 md:p-6">
      <CaseHead icon="gpu" c={c} />
      <Glance className="mt-6" items={c.glance} />
      <Flow className="mt-7" nodes={c.flow} label="How a Windows GPU test run flows" />
      <div className="mt-6 flex items-start gap-3.5 rounded-md border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-wash p-4 md:p-5">
        <Mark name="server" size="sm" />
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-ink">{c.keyPiece.title}</p>
          <p className="mt-1 max-w-[72ch] text-[15px] leading-relaxed text-lead">{c.keyPiece.text}</p>
        </div>
      </div>
      <figure className="relative mt-6 h-[260px] overflow-hidden rounded-md border border-rule bg-paper md:h-[320px]">
        <div className="blueprint-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <HeroScene className="absolute inset-0 block size-full font-sans" />
        <MotionToggle className="absolute top-3 right-3" />
        <figcaption className="absolute inset-x-4 bottom-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px] text-lead">
          <span>The pull model: runners ask the queue for work</span>
          <span className="flex gap-4">
            <span className="inline-flex items-center gap-1.5"><i className="inline-block size-2 rounded-full bg-queue" />request</span>
            <span className="inline-flex items-center gap-1.5"><i className="inline-block size-2 rounded-full bg-accent" />job</span>
          </span>
        </figcaption>
      </figure>
      <h4 className="mt-9 font-display text-[17px] font-semibold">How it came together</h4>
      <ol className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
        {c.phases.map(([t, s], i) => (
          <li key={t} className="flex gap-3">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-accent t-chip font-semibold text-accent">{i + 1}</span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-ink">{t}</p>
              <p className="text-[14px] leading-snug text-lead">{s}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex items-start gap-3.5 border-t border-rule pt-5">
        <Mark name="gauge" size="sm" />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-ink">{c.also.title}</p>
          <p className="mt-0.5 text-[14px] text-lead">{c.also.text}</p>
        </div>
      </div>
      <p className="t-label mt-6 text-lead">Related writing</p>
      <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-1">
        {c.reading.map(([label, to]) => <li key={to}><TextLink href={href(to)}>{label}</TextLink></li>)}
      </ul>
    </Sheet>
  );
}

function XpressoCase() {
  const c = XPRESSO;
  return (
    <Sheet as="article" style={tone('coral')} id={c.id} className="border-t-[3px] border-t-accent p-5 md:p-6">
      <CaseHead icon="layers" c={c} />
      <Glance className="mt-6" items={c.glance} />
      <Flow className="mt-7" nodes={c.flow} label="Xpresso.ai platform lifecycle" />
      <p className="mt-3 text-[14px] text-lead">{c.flowNote}</p>
      <h4 className="mt-9 font-display text-[17px] font-semibold">Results</h4>
      <dl className="mt-3 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {c.stats.map((s) => (
          <div key={s.label} className="flex flex-col border-t border-rule py-4">
            <dd className="order-1 t-stat text-ink">{s.value}<span className="ml-0.5 text-[21px] text-lead">{s.suffix}</span></dd>
            <dt className="order-2 mt-2 text-[15px] font-semibold text-ink">{s.label}</dt>
            <dd className="order-3 mt-0.5 text-[14px] leading-snug text-lead">{s.ctx}</dd>
          </div>
        ))}
      </dl>
      <h4 className="mt-8 font-display text-[17px] font-semibold">What I built</h4>
      <ul className="mt-3 grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
        {c.highlights.map((h) => (
          <li key={h.title} className="flex items-start gap-3 border-t border-rule py-4">
            <Mark name={h.icon} size="sm" />
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-ink">{h.title}</p>
              <p className="mt-0.5 text-[14px] leading-snug text-lead">{h.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="t-label mt-6 text-lead">Also</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {c.also.map((a) => <li key={a}><Tag>{a}</Tag></li>)}
      </ul>
    </Sheet>
  );
}

export default function Work() {
  const href = useHref();
  return (
    <Layout active="work">
      <Wrap>
        <PageHead title="8 years in software" art={<Motif name="cluster" tone="teal" className="ml-auto h-[200px] w-[310px]" />}>
          I started out on product work and spent the next six years on platforms. At Abzooba that meant DataOps and reliability, and later leading an MLOps platform. At NVIDIA it meant bringing GPU CI to PyTorch on Windows.
          My course and personal projects are on the <TextLink href={href('projects/')}>Projects</TextLink> page.
        </PageHead>
        <Section id="timeline" wide label="8 years at a glance" note={enDash('2017 - 2027')}><Timeline /></Section>
        <Section id="nvidia" label="NVIDIA" note="Case study"><PytorchCase /></Section>
        <Section id="abzooba" label="Abzooba" note="Case study"><XpressoCase /></Section>
      </Wrap>
    </Layout>
  );
}
