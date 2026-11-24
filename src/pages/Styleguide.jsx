import { Layout } from '../components/Layout.jsx';
import { Diagram } from '../components/Diagram.jsx';
import { Button, Chip, Collapsible, Mark, PageHead, Section, Sheet, Stat, StatusPill, Tag, TextLink, Wrap, tone } from '../components/ui.jsx';

// A page that shows every token and component in one place, so changes can be checked in both
// themes before they ship. Not linked from the site and kept out of search results.
const COLORS = ['paper', 'sheet', 'ink', 'lead', 'rule', 'rule-strong', 'accent', 'wash', 'pass', 'run', 'queue', 'pink', 'teal', 'coral', 'lime'];
const SIZES = [['display', 40], ['h1', 34], ['h2', 28], ['h3', 23], ['h4', 20], ['title', 18], ['large', 16], ['body', 15], ['small', 14], ['caption', 13]];
const DIAGRAMS = [['api', 'pink'], ['gpuvm', 'lime'], ['pipeline', 'teal'], ['mlops', 'coral'], ['jobquery', 'lime'], ['dataops', 'coral'], ['mesh', 'pink'], ['riscv', 'teal'], ['vlm', 'coral'], ['pullloop', 'lime'], ['pushpull', 'teal'], ['stride', 'pink']];

export default function Styleguide() {
  return (
    <Layout active="styleguide">
      <Wrap>
        <PageHead title="Style guide">Every color, type size and component the site uses. Switch the theme to check both.</PageHead>
        <Section id="colors" label="Colors" note="Tokens in styles.css">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {COLORS.map((c) => (
              <li key={c} className="overflow-hidden rounded-md border border-rule">
                <span className="block h-14" style={{ background: `var(--${c})` }} />
                <span className="block px-3 py-2 font-mono text-caption text-ink">--{c}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section id="type" label="Type scale" note="text-caption to text-display">
          <ul className="flex flex-col gap-3">
            {SIZES.map(([n, px]) => (
              <li key={n} className="flex items-baseline gap-4 border-t border-rule pt-3">
                <span className="w-28 shrink-0 font-mono text-caption text-lead">{`text-${n} ${px}`}</span>
                <span className={`text-${n} ${px >= 20 ? 'font-display font-semibold' : ''} leading-tight text-ink`}>Ship it on Friday</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section id="controls" label="Controls">
          <div className="flex flex-wrap items-center gap-4">
            <Button primary href="#controls">Primary</Button>
            <Button href="#controls">Secondary</Button>
            <TextLink href="#controls">Text link</TextLink>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Tag>Kubernetes</Tag>
            <Chip variant="accent">Topic</Chip>
            <Chip variant="ink" icon="convert">New role and team</Chip>
            <Chip variant="dashed">Waiting for review</Chip>
            <StatusPill status="running" />
            <StatusPill status="planned" />
            <StatusPill status="passed" />
          </div>
        </Section>
        <Section id="cards" label="Cards and stats">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Sheet className="p-5"><Mark name="gpu" size="sm" /><p className="mt-3 text-body font-semibold text-ink">Sheet</p><p className="text-small text-lead">The one card surface.</p></Sheet>
            <Sheet as="a" interactive href="#cards" style={tone('teal')} className="border-t-[3px] border-t-accent p-5"><Mark name="branch" size="sm" /><p className="mt-3 text-body font-semibold text-ink">Interactive sheet, toned teal</p><p className="text-small text-lead">Hover, focus and press it.</p></Sheet>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            <Stat value="8+" label="years" tone="pink" /><Stat value="2" label="companies" tone="teal" /><Stat value="4" label="mentored" tone="coral" /><Stat value="3" label="services" tone="lime" />
          </dl>
          <Collapsible label="example details" className="mt-6"><p className="text-body text-lead">Folded on phones, open from 768px up.</p></Collapsible>
        </Section>
        <Section id="diagrams" label="Diagrams" note="Animate while on screen">
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {DIAGRAMS.map(([n, t]) => (
              <li key={n}><Sheet className="p-4"><Diagram name={n} tone={t} className="mx-auto block h-[200px] w-full" /><p className="mt-2 font-mono text-caption text-lead">{n}</p></Sheet></li>
            ))}
          </ul>
        </Section>
      </Wrap>
    </Layout>
  );
}
