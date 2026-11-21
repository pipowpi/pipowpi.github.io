import { useEffect, useRef, useState } from 'react';
import { SITE } from '../data/site.js';
import { HERO, FACTS, PHASE, NOW, CAREER_STEPS, PILLARS } from '../data/home.js';
import { PYTORCH_CI, XPRESSO } from '../data/work.js';
import { HEAD, COURSE } from '../data/projects.js';
import posts from '../generated/posts.json';
import { Layout } from '../components/Layout.jsx';
import { PostList } from '../components/PostList.jsx';
import { CareerWalk } from '../components/CareerWalk.jsx';
import { Button, Icon, Mark, Section, Sheet, StatusPill, Tag, TextLink, Wrap, cn, tone, useHref } from '../components/ui.jsx';

// Step markers shared by the "Now" stepper and the career run.
function StepIcon({ state, className = '' }) {
  if (state === 'done') {
    return <span className={cn('relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sc,var(--pass))] text-sheet', className)}><Icon name="check" className="size-3.5" strokeWidth={3} /></span>;
  }
  if (state === 'running') {
    return <span className={cn('relative z-10 inline-block size-6 shrink-0 animate-spin rounded-full border-[2.5px] border-[color-mix(in_srgb,var(--run)_25%,transparent)] border-t-run bg-sheet [animation-duration:1.2s]', className)} />;
  }
  return <span className={cn('relative z-10 inline-block size-6 shrink-0 rounded-full border-2 border-dashed border-queue bg-sheet', className)} />;
}

const STATE_TEXT = { done: 'passed', running: 'in progress', queued: 'queued' };

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
          <p className="text-[13px] leading-snug text-lead"><span className="sr-only">{STATE_TEXT[p.state]}: </span>{p.what}</p>
        </li>
      ))}
    </ol>
  );
}

function NowCard() {
  const href = useHref();
  return (
    <Sheet as="aside" aria-labelledby="now-title" className="p-5 md:p-6">
      <h2 id="now-title" className="font-display text-[20px] font-semibold leading-tight">Right now</h2>
      <div className="mt-5"><PhaseTrack /></div>
      <dl className="mt-5 border-t border-rule">
        {NOW.map((r) => (
          <div key={r.k} style={tone(r.tone)} className="flex gap-3.5 border-b border-rule py-2.5 last:border-b-0 last:pb-0">
            <Mark name={r.icon} size="sm" />
            <div className="min-w-0">
              <dt className="t-label text-ink">{r.k}</dt>
              <dd className="mt-0.5 text-[14px] leading-snug text-lead">
                {r.v}{r.href && <> <TextLink href={href(r.href)} className="whitespace-nowrap text-[14px]">See projects</TextLink></>}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </Sheet>
  );
}

function Hero() {
  const href = useHref();
  return (
    <Wrap className="grid grid-cols-1 items-center gap-10 pt-10 pb-10 md:pt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
      <div>
        <p className="text-[17px] font-medium text-lead">{HERO.hello}</p>
        <h1 className="mt-3 font-display text-[30px] font-semibold leading-[1.1] md:text-[38px] lg:text-[40px]">{HERO.title}</h1>
        {HERO.lede.map((para, i) => <p key={i} className={cn('max-w-[58ch] text-[16px] leading-relaxed text-lead', i ? 'mt-3' : 'mt-6')}>{para}</p>)}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button primary href={href('work/')}>See my work</Button>
          <Button href={`mailto:${SITE.email}`}><Icon name="mail" className="size-[18px]" />Email me</Button>
        </div>
        <p className="mt-7 inline-flex items-center gap-2.5 text-[14px] font-medium text-run">
          <span className="ping relative inline-block size-2 rounded-full bg-run" aria-hidden="true" />
          {SITE.availability}
        </p>
        <dl className="mt-8 grid max-w-[560px] grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} style={tone(f.tone)} className="flex flex-col border-t-2 border-accent pt-3">
              <dd className="t-metric order-1 text-ink">{f.n}</dd>
              <dt className="order-2 mt-1.5 text-[13px] leading-snug text-lead">{f.label}</dt>
            </div>
          ))}
        </dl>
      </div>
      <NowCard />
    </Wrap>
  );
}

// Eight years as a CI run. Vertical on phones, a left-to-right pipeline on wide screens.
// When the card scrolls into view the run replays: each stage runs and passes, the switch to NVIDIA
// flips, and the run ends on the MS, which keeps running. The deploy job (a full-time role) waits
// for review. The server render (and reduced motion) shows that final state directly.
const RUN_END = CAREER_STEPS.findIndex((s) => s.kind === 'deploy') - 1; // the MS
const DUR = CAREER_STEPS.map((s) => (s.kind === 'switch' ? 1100 : s.kind === 'pivot' ? 1500 : 1400));

function stepState(i, at) {
  if (CAREER_STEPS[i].kind === 'deploy') return 'waiting';
  if (i < at) return 'done';
  if (i === at) return 'running';
  return 'queued';
}

function SwitchIcon({ state, className = '' }) {
  return (
    <span className={cn('relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-md border-2',
      state === 'queued' ? 'border-dashed border-queue bg-sheet text-lead' : 'border-ink bg-sheet text-ink', className)}>
      <Icon name="convert" className="size-3.5" strokeWidth={2.4} />
    </span>
  );
}

function PivotIcon({ state, className = '' }) {
  return (
    <span className={cn('relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-md border-2',
      state === 'queued' ? 'border-dashed border-queue bg-sheet text-lead' : 'border-accent bg-accent text-on-accent', className)}>
      <Icon name="book" className="size-3.5" strokeWidth={2.2} />
    </span>
  );
}

function DeployIcon({ className = '' }) {
  return (
    <span className={cn('relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-accent bg-sheet text-accent', className)}>
      <Icon name="briefcase" className="size-3" strokeWidth={2.2} />
    </span>
  );
}

function CareerRun() {
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
    setAt(-1); // waiting to start: everything queued until the card is on screen
    setPlayed(false);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); setTimeout(play, 250); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); timers.current.forEach(clearTimeout); };
  }, []);

  const cur = CAREER_STEPS[Math.max(at, 0)];
  const status = at < 0
    ? 'queued: career.yml'
    : cur.kind === 'switch'
      ? 'switch: new company, new role, new team'
      : cur.kind === 'pivot'
        ? 'pivot: stop treating models as a black box, learn them to build better infra for them'
      : at < RUN_END
        ? `running: ${cur.name} (${cur.time})`
        : `running: ${cur.name}. next: deploy, waiting for review`;

  return (
    <Sheet className="overflow-hidden">
      <div ref={ref} className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3 md:px-6">
        <p className="flex flex-wrap items-center gap-3 text-[14px]">
          <StatusPill status="running">Running</StatusPill>
          <span translate="no" className="font-mono text-[15px] text-ink">career.yml</span>
        </p>
        <div className="flex items-center gap-5">
          <button type="button" onClick={play} disabled={!played}
            className={cn('t-label inline-flex min-h-10 cursor-pointer items-center gap-1.5 text-lead transition-opacity duration-200 hover:text-accent disabled:cursor-default disabled:opacity-0')}>
            <Icon name="play" className="size-3.5" />Replay
          </button>
          <TextLink href={href('work/#timeline')} className="inline-flex min-h-10 items-center text-[14px]">See the full timeline</TextLink>
        </div>
      </div>
      <div className="border-b border-rule bg-paper px-2 pt-3 md:px-6 md:pt-4">
        <CareerWalk at={at} className="mx-auto block h-auto w-full max-w-[680px]" />
      </div>
      <ol className="grid grid-cols-1 p-5 md:p-6 lg:grid-cols-[repeat(3,minmax(0,1fr))_92px_minmax(0,1fr)_92px_repeat(2,minmax(0,1fr))]" aria-label="Career so far, as a build run">
        {CAREER_STEPS.map((s, i) => {
          const st = stepState(i, at);
          const next = CAREER_STEPS[i + 1];
          const iconCls = cn('absolute top-0.5 left-0 lg:static lg:flex', st === 'done' && 'pop');
          return (
            <li key={s.name} style={{ '--sc': `var(--${s.tone})` }} className={cn('relative pb-6 pl-10 transition-opacity duration-500 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-4', st === 'queued' && 'opacity-45')}>
              {next && (
                <span aria-hidden="true" className={cn('absolute top-7 bottom-1 left-[11px] w-0.5 lg:top-[11px] lg:bottom-auto lg:left-7 lg:right-1 lg:h-0.5 lg:w-auto',
                  next.kind === 'deploy' ? 'dash-run-yx opacity-60' : 'bg-rule-strong')}>
                  {next.kind !== 'deploy' && (
                    <span className={cn('absolute inset-0 origin-top bg-[var(--sc)] transition-transform duration-500 ease-out lg:origin-left',
                      i < at ? 'scale-100' : 'scale-y-0 lg:scale-x-0 lg:scale-y-100')} />
                  )}
                </span>
              )}
              {s.kind === 'switch' ? <SwitchIcon key={st} state={st} className={iconCls} />
                : s.kind === 'pivot' ? <PivotIcon key={st} state={st} className={iconCls} />
                : s.kind === 'deploy' ? <DeployIcon className={iconCls} />
                : <StepIcon key={st} state={st} className={iconCls} />}
              <p className={cn('t-chip transition-colors duration-300 lg:mt-3',
                s.kind === 'switch' ? 'text-ink' : s.kind === 'pivot' || s.kind === 'deploy' ? 'text-accent' : st === 'running' ? 'text-run' : st === 'done' ? 'text-[var(--sc)]' : 'text-lead')}>
                {s.time}<span className="sr-only">, {s.kind === 'deploy' ? 'waiting for review' : s.kind === 'switch' || s.kind === 'pivot' ? s.kind : STATE_TEXT[st]}</span>
              </p>
              <p className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">{s.name}</p>
              {s.kind === 'deploy'
                ? <p className="mt-1"><span className="t-chip inline-block rounded-md border border-dashed border-accent px-2 py-px text-accent">{s.org}</span></p>
                : <p className="text-[14px] font-medium text-ink/80">{s.org}</p>}
              {s.role && <p className="text-[13px] leading-snug text-lead">{s.role}</p>}
              {s.why && <p className="mt-1.5 hidden text-[13px] leading-snug text-accent lg:block">{s.why}</p>}
              <p className="mt-1 text-[14px] leading-snug text-lead lg:hidden">{s.sub}</p>
              {st === 'running' && i < RUN_END && s.kind === 'stage' && <div className="relative mt-3 h-1 max-w-[160px] overflow-hidden rounded-sm bg-rule"><div className="busy-fill" /></div>}
            </li>
          );
        })}
      </ol>
      <p translate="no" className="border-t border-rule bg-paper px-5 py-2.5 font-mono text-[14px] text-lead md:px-6">
        <span className="text-run">&gt;</span> {status}
      </p>
    </Sheet>
  );
}

function Focus() {
  const href = useHref();
  return (
    <ul className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 xl:grid-cols-4 xl:divide-x xl:divide-rule">
      {PILLARS.map((p) => (
        <li key={p.title} style={tone(p.tone)} className="sm:pr-5 xl:px-5 xl:first:pl-0 xl:last:pr-0">
          <a href={href(p.href)} className="group flex items-start gap-3.5">
            <Mark name={p.icon} />
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold text-ink group-hover:text-accent">{p.title}</span>
              <span className="mt-0.5 block text-[14px] leading-snug text-lead">{p.sub}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// Two short cards. The diagrams and detail stay on the Work page.
function SelectedWork() {
  const href = useHref();
  const cards = [
    {
      to: 'work/#pytorch-ci', icon: 'gpu', tone: 'lime', title: PYTORCH_CI.title, org: PYTORCH_CI.org, dates: '2025 - 2026',
      text: 'PyTorch had no CI that tested Windows with a GPU. I designed and built a harness that runs GPU-backed Windows VMs inside Kubernetes. Runners pull their jobs from a job query service I built as an alternative to GitHub’s ARC.',
      tags: ['KubeVirt', 'VFIO', 'GitHub Actions', 'STRIDE'],
    },
    {
      to: 'work/#xpresso', icon: 'layers', tone: 'coral', title: XPRESSO.title, org: XPRESSO.org, dates: XPRESSO.dates,
      text: 'An MLOps platform for data, training, serving and deployment. I grew from engineer to core architect and lead, and built its DataOps layer.',
      tags: ['Pachyderm', 'MinIO', 'Kubernetes', 'FastAPI'],
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {cards.map((c) => (
        <Sheet key={c.to} as="a" interactive href={href(c.to)} style={tone(c.tone)} className="group flex flex-col border-t-[3px] border-t-accent p-5 md:p-6">
          <Mark name={c.icon} size="sm" />
          <h3 className="mt-4 font-display text-[20px] font-semibold leading-tight">{c.title}</h3>
          <p className="t-meta mt-1.5 text-lead"><span className="font-medium text-ink">{c.org}</span>, {c.dates}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-lead">{c.text}</p>
          <p className="mt-4 flex flex-wrap gap-2">{c.tags.map((t) => <Tag key={t}>{t}</Tag>)}</p>
          <p className="mt-auto pt-5 font-medium text-accent underline decoration-[color-mix(in_srgb,var(--accent)_40%,transparent)] underline-offset-4 group-hover:decoration-accent">Read the case study</p>
        </Sheet>
      ))}
    </div>
  );
}

const BUILDING = [
  { id: HEAD.id, title: '3D head reconstruction', sub: HEAD.short, tone: 'pink' },
  { id: 'riscv', title: COURSE[0].title, sub: 'Graduate computer architecture', tone: 'teal' },
  { id: 'vlm', title: 'VLM project', sub: 'Graduate vision-language models', tone: 'coral' },
];

// Recent writing and current course projects, side by side.
function Lately() {
  const href = useHref();
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-10 xl:grid-cols-2">
      <div className="min-w-0">
        <h3 className="font-display text-[17px] font-semibold">Writing</h3>
        {posts.length > 0
          ? <PostList posts={posts.slice(0, 3)} compact className="mt-3" />
          : <p className="mt-3 border-t border-rule pt-4 text-[15px] text-lead">The first posts are being written.</p>}
        <TextLink href={href('writing/')} className="mt-4 inline-block">All posts</TextLink>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-[17px] font-semibold">Building</h3>
        <ul className="mt-3 border-b border-rule">
          {BUILDING.map((p) => (
            <li key={p.id} className="border-t border-rule">
              <a href={href(`projects/#${p.id}`)} className="group flex items-start justify-between gap-4 py-4">
                <span className="min-w-0">
                  <span className="flex items-center gap-2.5 font-display text-[18px] font-semibold leading-snug text-ink group-hover:text-accent"><i aria-hidden="true" className="inline-block size-2.5 shrink-0 rounded-sm" style={{ background: `var(--${p.tone})` }} />{p.title}</span>
                  <span className="mt-1 block text-[15px] leading-snug text-lead">{p.sub}</span>
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
        <Section id="so-far" wide label="The pipeline so far" note="Eight years, one stage at a time"><CareerRun /></Section>
        <Section id="focus" wide label="What I work on" tight><Focus /></Section>
        <Section id="selected" label="Selected work" note="2 case studies"><SelectedWork /></Section>
        <Section id="lately" label="Lately" note="What I’m writing and building"><Lately /></Section>
      </Wrap>
    </Layout>
  );
}
