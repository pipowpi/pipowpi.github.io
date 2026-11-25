import { PILLARS } from '../../data/home.js';
import { PYTORCH_CI, XPRESSO } from '../../data/work.js';
import { HEAD, COURSE } from '../../data/projects.js';
import { POSTS as posts } from '../../data/posts.js';
import { PostList } from '../PostList.jsx';
import { Diagram } from '../Diagram.jsx';
import { Mark, Sheet, StatusPill, Tag, TextLink, tone, useHref } from '../ui.jsx';

// "What I work on": four cards, each with a diagram and the main tools. On phones they sit in a
// row you swipe through; from 768px up they form a 2 x 2 grid.
export function Focus() {
  const href = useHref();
  return (
    <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0" aria-label="Areas of work">
      {PILLARS.map((p) => (
        <li key={p.title} style={tone(p.tone)} className="w-[86%] max-w-[420px] shrink-0 snap-start md:w-auto md:max-w-none">
          <Sheet as="a" interactive href={href(p.href)} className="group flex h-full flex-col overflow-hidden">
            <div className="flex h-[190px] items-center justify-center border-b border-rule bg-paper px-5 py-4 md:h-[230px] md:px-6 md:py-5">
              <Diagram name={p.motif} tone={p.tone} className="h-full w-full" />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <span className="flex items-center gap-2 text-body font-semibold text-ink group-hover:text-accent"><i aria-hidden="true" className="inline-block size-2.5 rounded-sm bg-accent" />{p.title}</span>
              <span className="mt-1 block text-small leading-snug text-lead">{p.sub}</span>
              <span className="mt-auto flex flex-wrap gap-1.5 pt-3">{p.tools.map((t) => <Tag key={t}>{t}</Tag>)}</span>
            </div>
          </Sheet>
        </li>
      ))}
    </ul>
  );
}

// Two short cards. The diagrams and detail stay on the Work page.
const CASES = [
  {
    to: 'work/#pytorch-ci', icon: 'gpu', tone: 'lime', diagram: 'jobquery', aspect: 'aspect-[470/240]', title: PYTORCH_CI.title, org: PYTORCH_CI.org, dates: '2025 - 2026',
    text: 'PyTorch had no CI that tested Windows with a GPU. I designed and built a harness that runs GPU-backed Windows VMs inside Kubernetes. Runners pull their jobs from a job query service I built as an alternative to GitHub’s ARC.',
    tags: ['KubeVirt', 'VFIO', 'GitHub Actions', 'STRIDE'],
  },
  {
    to: 'work/#xpresso', icon: 'layers', tone: 'coral', diagram: 'dataops', aspect: 'aspect-[440/200]', title: XPRESSO.title, org: XPRESSO.org, dates: XPRESSO.dates,
    text: 'An MLOps platform for data, training, serving and deployment. I grew from engineer to core architect and lead, and built its DataOps layer.',
    tags: ['Pachyderm', 'MinIO', 'Kubernetes', 'FastAPI'],
  },
];
export function SelectedWork() {
  const href = useHref();
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {CASES.map((c) => (
        <Sheet key={c.to} as="a" interactive href={href(c.to)} style={tone(c.tone)} className="group flex flex-col overflow-hidden border-t-[3px] border-t-accent p-5 md:p-6">
          <div className="-mx-5 -mt-5 mb-5 flex h-[200px] items-center justify-center border-b border-rule bg-paper px-5 py-4 md:-mx-6 md:-mt-6 md:h-[220px] md:px-6">
            <Diagram name={c.diagram} tone={c.tone} className={`h-full max-w-full ${c.aspect}`} />
          </div>
          <Mark name={c.icon} size="sm" />
          <h3 className="mt-4 font-display text-h4 font-semibold leading-tight">{c.title}</h3>
          <p className="t-meta mt-1.5 text-lead"><span className="font-medium text-ink">{c.org}</span>, {c.dates}</p>
          <p className="mt-3 text-body leading-relaxed text-lead">{c.text}</p>
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
export function Lately() {
  const href = useHref();
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-10 xl:grid-cols-2">
      <div className="min-w-0">
        <h3 className="font-display text-title font-semibold">Writing</h3>
        {posts.length > 0
          ? <PostList posts={posts.slice(0, 3)} compact className="mt-3" />
          : <p className="mt-3 border-t border-rule pt-4 text-body text-lead">The first posts are being reviewed. You can see what’s coming on the Writing page.</p>}
        <TextLink href={href('writing/')} className="mt-4 inline-block">All posts</TextLink>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-title font-semibold">Building</h3>
        <ul className="mt-3 border-b border-rule">
          {BUILDING.map((p) => (
            <li key={p.id} className="border-t border-rule" style={tone(p.tone)}>
              <a href={href(`projects/#${p.id}`)} className="group flex items-start justify-between gap-4 py-4">
                <span className="min-w-0">
                  <span className="flex items-center gap-2.5 font-display text-title font-semibold leading-snug text-ink group-hover:text-accent"><i aria-hidden="true" className="inline-block size-2.5 shrink-0 rounded-sm bg-accent" />{p.title}</span>
                  <span className="mt-1 block text-body leading-snug text-lead">{p.sub}</span>
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
