import { BIO, PRINCIPLES, NOW, TOOLBOX, EDUCATION, FACTS } from '../data/about.js';
import { Layout } from '../components/Layout.jsx';
import { Mark, PageHead, Section, Tag, TextLink, Wrap, cn, tone, useHref } from '../components/ui.jsx';
import { topicTone } from '../data/site.js';

export default function About() {
  const href = useHref();
  return (
    <Layout active="about">
      <Wrap>
        <PageHead title="Hi, I’m Gopi.">
          {BIO.map((para, i) => <p key={i} className={cn(i > 0 && 'mt-4')}>{para}</p>)}
        </PageHead>

        <Section id="numbers" label="In numbers">
          <dl className="grid grid-cols-2 gap-x-8 md:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label} style={tone(f.tone)} className="flex flex-col border-t-2 border-accent py-4">
                <dd className="order-1 t-stat text-ink">{f.n}</dd>
                <dt className="order-2 mt-2 text-[14px] leading-snug text-lead">{f.label}</dt>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="how" label="How I work" note="The habits behind the work">
          <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <li key={p.title} style={tone(p.tone)} className="flex gap-4 border-t border-rule py-5">
                <Mark name={p.icon} size="sm" />
                <div className="min-w-0">
                  <h3 className="font-display text-[18px] font-semibold leading-snug">{p.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-lead">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="now" label="Right now">
          <dl className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {NOW.map((n) => (
              <div key={n.k} style={tone(n.tone)} className="flex gap-3.5 border-t border-rule py-4">
                <Mark name={n.icon} size="sm" />
                <div className="min-w-0">
                  <dt className="t-label text-lead">{n.k}</dt>
                  <dd className="text-[15px] leading-snug text-ink">
                    {n.v}
                    {n.link && <> <TextLink href={href(n.link[1])}>{n.link[0]}</TextLink></>}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="toolbox" label="Toolbox">
          <dl className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {TOOLBOX.map((g) => (
              <div key={g.k} style={tone(topicTone(g.k))} className="border-t-2 border-accent py-4">
                <dt className="flex items-center gap-2 text-[15px] font-semibold text-ink"><i aria-hidden="true" className="inline-block size-2.5 rounded-sm bg-accent" />{g.k}</dt>
                <dd className="mt-3"><ul className="flex flex-wrap gap-1.5">{g.items.map((t) => <li key={t}><Tag className="border-[color-mix(in_srgb,var(--accent)_35%,transparent)]">{t}</Tag></li>)}</ul></dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="education" label="Education">
          <ol className="relative pl-7 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-0.5 before:bg-rule-strong">
            {EDUCATION.map((e, i) => (
              <li key={e.title} className="relative pb-7 last:pb-0">
                <span aria-hidden="true" className={cn('absolute top-1.5 -left-7 size-4 rounded-full border-2',
                  i === 0 ? 'border-accent bg-accent' : 'border-pink bg-pink')} />
                <p className="font-display text-[19px] font-semibold leading-snug text-ink">{e.title}</p>
                <p className="text-[15px] text-ink">{e.place}<span className="t-meta text-lead">, {e.date}</span></p>
                {e.note && <p className="mt-1 text-[14px] text-lead">{e.note}</p>}
              </li>
            ))}
          </ol>
        </Section>
      </Wrap>
    </Layout>
  );
}
