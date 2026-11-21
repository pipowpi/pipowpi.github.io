import { SITE } from '../data/site.js';
import { HERO, PILLARS, CAREER_STEPS, STATUS_LINES } from '../data/home.js';
import { PYTORCH_CI, XPRESSO } from '../data/work.js';
import { HEAD, COURSE } from '../data/projects.js';
import posts from '../generated/posts.json';
import { Layout } from '../components/Layout.jsx';
import { Flow } from '../components/Flow.jsx';
import { PostList } from '../components/PostList.jsx';
import { HeroScene } from '../components/HeroScene.jsx';
import { Button, Icon, Mark, MotionToggle, Section, Sheet, StatusPill, TextLink, Wrap, cn, enDash, useHref } from '../components/ui.jsx';

function Hero() {
  const href = useHref();
  return (
    <Wrap className="grid grid-cols-1 items-center gap-10 pt-12 pb-14 md:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div>
        <h1 className="font-display text-[38px] font-semibold leading-[1.05] md:text-[56px] lg:text-[60px]">
          {HERO.lead}{' '}
          <span className="rot" aria-hidden="true">
            {HERO.rotating.map((w) => <span key={w}>{w}</span>)}
          </span>
          <span className="sr-only">CI pipelines, GPU clusters and ML platforms.</span>
        </h1>
        <p className="mt-6 max-w-[56ch] text-[18px] leading-relaxed text-lead">{HERO.lede}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button primary href={href('work/')}>See the work</Button>
          <TextLink href={href('writing/')}>Read the writing</TextLink>
        </div>
        <p className="mt-8 inline-flex items-center gap-2.5 text-[15px] font-medium text-run">
          <span className="ping relative inline-block size-2 rounded-full bg-run" aria-hidden="true" />
          {SITE.availability}
        </p>
      </div>
      <figure className="relative h-[300px] overflow-hidden rounded-md border border-rule bg-sheet md:h-[420px]">
        <div className="blueprint-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <HeroScene className="absolute inset-0 block size-full font-sans" />
        <MotionToggle className="absolute top-3 right-3" />
        <figcaption className="absolute inset-x-4 bottom-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[14px] text-lead">
          <span>Runners pulling jobs from a queue</span>
          <span className="flex gap-4">
            <span className="inline-flex items-center gap-1.5"><i className="inline-block size-2 rounded-full bg-queue" />request</span>
            <span className="inline-flex items-center gap-1.5"><i className="inline-block size-2 rounded-full bg-run" />job</span>
          </span>
        </figcaption>
      </figure>
    </Wrap>
  );
}

function Focus() {
  const href = useHref();
  return (
    <ul className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:divide-x md:divide-rule">
      {PILLARS.map((p) => (
        <li key={p.title} className="md:px-6 md:first:pl-0 md:last:pr-0">
          <a href={href(p.href)} className="group flex items-start gap-3.5">
            <Mark name={p.icon} />
            <span className="min-w-0">
              <span className="block text-[17px] font-semibold text-ink group-hover:text-accent">{p.title}</span>
              <span className="mt-0.5 block text-[15px] leading-snug text-lead">{p.sub}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const STEP_STATE = {
  done: { label: 'passed', cls: 'text-pass' },
  running: { label: 'running', cls: 'text-run' },
  queued: { label: 'queued', cls: 'text-lead' },
};

function StepIcon({ state }) {
  if (state === 'done') {
    return <span className="relative z-10 mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-pass text-sheet"><Icon name="check" className="size-3.5" strokeWidth={3} /></span>;
  }
  if (state === 'running') {
    return <span className="relative z-10 mt-0.5 inline-block size-6 shrink-0 animate-spin rounded-full border-[2.5px] border-[color-mix(in_srgb,var(--run)_25%,transparent)] border-t-run bg-sheet [animation-duration:1.2s]" />;
  }
  return <span className="relative z-10 mt-0.5 inline-block size-6 shrink-0 rounded-full border-2 border-dashed border-queue bg-sheet animate-[qpulse_2.4s_ease-in-out_infinite]" />;
}

function CareerRun() {
  const href = useHref();
  // Typing timings for the terminal lines, so each line starts when the previous one ends.
  let delay = 1.7;
  const lines = STATUS_LINES.map(([k, v]) => {
    const n = 12 + v.length;
    const d = +(n * 0.022).toFixed(2);
    const line = { k, v, n, d, delay };
    delay = +(delay + d + 0.12).toFixed(2);
    return line;
  });
  return (
    <Sheet className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3 md:px-6">
        <p className="flex flex-wrap items-center gap-3 text-[15px]">
          <StatusPill status="running">Running</StatusPill>
          <span translate="no" className="font-mono text-[16px] text-ink">career.yml</span>
        </p>
        <TextLink href={href('work/#timeline')} className="text-[15px]">See all 8 years</TextLink>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <ol className="p-5 md:p-6" aria-label="Career so far, as a build run">
          {CAREER_STEPS.map((s, i) => (
            <li key={s.name} className="step-in relative flex gap-3.5 pb-6 last:pb-0" style={{ animationDelay: `${0.2 + i * 0.4}s` }}>
              {i < CAREER_STEPS.length - 1 && (
                <span aria-hidden="true" className={cn('absolute top-7 bottom-1 left-[11px] w-0.5',
                  s.state === 'done' ? 'bg-pass' : s.state === 'running' ? 'dash-run-y opacity-60' : 'bg-rule-strong')} />
              )}
              <StepIcon state={s.state} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="text-[17px] font-semibold text-ink">{s.name}</p>
                  <span className={cn('t-chip', STEP_STATE[s.state].cls)}>
                    {s.state === 'done' ? enDash(s.time) : STEP_STATE[s.state].label}
                  </span>
                </div>
                <p className="mt-0.5 text-[15px] leading-snug text-lead"><span className="sr-only">{STEP_STATE[s.state].label}, {s.kind} step. </span>{s.sub}</p>
                {s.state === 'running' && <div className="relative mt-3 h-1 max-w-[280px] overflow-hidden rounded-sm bg-rule"><div className="busy-fill" /></div>}
              </div>
            </li>
          ))}
        </ol>
        <div translate="no" className="bg-term-bg p-5 font-mono text-[14px] leading-[1.9] text-term-ink md:p-6 md:text-[16px]">
          <p className="mb-1 text-term-dim">$ career status --now</p>
          {lines.map((l) => (
            <p key={l.k} className="tline" style={{ '--n': l.n, '--s': l.n + 1, '--d': `${l.d}s`, '--delay': `${l.delay}s` }}>
              <span className="text-term-dim">{l.k.padEnd(12, ' ')}</span><span>{l.v}</span>
            </p>
          ))}
          <p className="step-in mt-2 text-term-run" style={{ animationDelay: `${delay}s` }}>
            &gt; waiting for a runner to pull this job
            <span className="ml-1.5 inline-block h-[15px] w-2 bg-term-run align-[-2px] animate-[blink_1s_steps(1)_infinite]" />
          </p>
          <div className="step-in mt-5 flex flex-wrap gap-3 font-sans" style={{ animationDelay: `${delay + 0.24}s` }}>
            <a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-term-ink px-5 py-2.5 text-[16px] font-medium text-term-bg hover:bg-[color-mix(in_srgb,var(--term-ink)_85%,var(--term-bg))]"><Icon name="mail" className="size-4" />Pull this job<span className="sr-only"> (email me)</span></a>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[color-mix(in_srgb,var(--term-ink)_35%,transparent)] px-5 py-2.5 text-[16px] font-medium text-term-ink hover:border-term-ink">LinkedIn<Icon name="external" className="size-4" /></a>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

function SelectedWork() {
  const href = useHref();
  return (
    <div>
      <Sheet as="a" interactive href={href('work/#pytorch-ci')} className="group p-5 md:p-7">
        <h3 className="font-display text-[26px] font-semibold leading-tight md:text-[30px]">{PYTORCH_CI.title}</h3>
        <p className="t-meta mt-2 text-lead"><span className="font-medium text-ink">{PYTORCH_CI.org}</span>, {enDash('2025 - 2026')}</p>
        <p className="mt-3 max-w-[64ch] text-[17px] leading-relaxed text-lead">
          PyTorch had no CI that tested Windows with a GPU. I led the design of a harness that provisions a GPU-backed Windows VM inside Kubernetes on demand, with runners that pull work so nothing outside the cluster needs a way in.
        </p>
        <Flow className="mt-7" label="How a Windows GPU test run flows" nodes={[
          { name: 'GitHub Actions', sub: 'Requests a Windows GPU run' },
          { name: 'Job service', sub: 'Queues it; a gateway screens it' },
          { name: 'Runner pod', sub: 'Asks for work, outbound only', link: 'pull' },
          { name: 'Windows VM', sub: 'KubeVirt + VFIO GPU' },
        ]} />
        <p className="mt-6 font-medium text-accent underline decoration-[color-mix(in_srgb,var(--accent)_40%,transparent)] underline-offset-4 group-hover:decoration-accent">Read the case study</p>
      </Sheet>

      <Sheet as="a" interactive href={href('work/#xpresso')} className="group mt-4 p-5 md:p-7">
        <h3 className="font-display text-[24px] font-semibold leading-tight md:text-[26px]">{XPRESSO.title}</h3>
        <p className="t-meta mt-2 text-lead"><span className="font-medium text-ink">{XPRESSO.org}</span>, {enDash(XPRESSO.dates)}</p>
        <p className="mt-3 max-w-[64ch] text-[17px] leading-relaxed text-lead">
          An MLOps platform for data, training, serving and deployment. I grew from engineer to core architect and lead, and designed and built its DataOps layer.
        </p>
        <dl className="mt-6 grid grid-cols-1 gap-x-8 sm:grid-cols-3">
          {XPRESSO.stats.filter((st) => ['API throughput', 'less inference compute', 'faster container builds'].includes(st.label)).map((st) => (
            <div key={st.label} className="flex items-baseline gap-2.5 border-t border-rule py-3 sm:flex-col sm:gap-1.5">
              <dd className="t-metric order-1 text-ink">{st.value}{st.suffix}</dd>
              <dt className="order-2 text-[15px] leading-snug text-lead">{st.label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-medium text-accent underline decoration-[color-mix(in_srgb,var(--accent)_40%,transparent)] underline-offset-4 group-hover:decoration-accent">Read the case study</p>
      </Sheet>
    </div>
  );
}

const BUILDING = [
  { id: HEAD.id, title: '3D head reconstruction', sub: HEAD.short },
  { id: 'riscv', title: COURSE[0].title, sub: 'Graduate computer architecture' },
  { id: 'vlm', title: 'VLM project', sub: 'Graduate vision-language models' },
];

// Recent writing and current course projects, side by side: the "what's happening now" of the page.
function Lately() {
  const href = useHref();
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-10 xl:grid-cols-2">
      <div className="min-w-0">
        <h3 className="font-display text-[19px] font-semibold">Writing</h3>
        {posts.length > 0
          ? <PostList posts={posts.slice(0, 3)} compact className="mt-3" />
          : <p className="mt-3 border-t border-rule pt-4 text-[16px] text-lead">The first posts are being written.</p>}
        <TextLink href={href('writing/')} className="mt-4 inline-block">All posts</TextLink>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-[19px] font-semibold">Building</h3>
        <ul className="mt-3 border-b border-rule">
          {BUILDING.map((p) => (
            <li key={p.id} className="border-t border-rule">
              <a href={href(`projects/#${p.id}`)} className="group flex items-start justify-between gap-4 py-4">
                <span className="min-w-0">
                  <span className="block font-display text-[20px] font-semibold leading-snug text-ink group-hover:text-accent">{p.title}</span>
                  <span className="mt-1 block text-[16px] leading-snug text-lead">{p.sub}</span>
                </span>
                <span className="shrink-0 pt-1"><StatusPill status="running" /></span>
              </a>
            </li>
          ))}
        </ul>
        <TextLink href={href('projects/')} className="mt-4 inline-block">All projects</TextLink>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout active="home">
      <Hero />
      <Wrap>
        <Section id="focus" label="Focus" tight><Focus /></Section>
        <Section id="status" label="Status" note="My career, shown as a CI run"><CareerRun /></Section>
        <Section id="selected" label="Selected work" note="2 case studies"><SelectedWork /></Section>
        <Section id="lately" label="Lately" note="What I’m writing and building"><Lately /></Section>
      </Wrap>
    </Layout>
  );
}
