import posts from '../generated/posts.json';
import { Layout } from '../components/Layout.jsx';
import { Island, PageHead, Section, Wrap, tone } from '../components/ui.jsx';
import { Diagram } from '../components/Diagram.jsx';
import PostFilter from '../islands/PostFilter.jsx';

function WhyIWrite() {
  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <p className="max-w-[60ch] text-large leading-relaxed text-ink">
        Writing is how I check that I understand something. If I can’t explain an idea simply, I go back to the source and try again. These posts are what came out of that.
      </p>
      <ol className="grid grid-cols-1 gap-x-6 sm:grid-cols-3" aria-label="How a post gets written">
        {[['Learn', 'Work with it or study it', 'pink'], ['Explain', 'Write it in plain words', 'teal'], ['Find the gaps', 'Fix what I could not explain', 'lime']].map(([t, s, c], i) => (
          <li key={t} style={tone(c)} className="border-t-2 border-accent py-3">
            <span className="t-chip font-semibold text-accent">{i + 1}</span>
            <p className="text-body font-semibold text-ink">{t}</p>
            <p className="text-small leading-snug text-lead">{s}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Post metadata for the list (the island gets this, never the post bodies).
const LIST = posts.map(({ slug, title, summary, date, read, tags, draft }) => ({ slug, title, summary, date, read, tags, draft }));

export default function Writing() {
  return (
    <Layout active="writing">
      <Wrap>
        <PageHead title="Notes and explainers" art={<Diagram name="attention" tone="accent" className="ml-auto block aspect-[420/240] w-full max-w-[420px]" />}>
          Notes on things I’ve worked with or studied, written in plain language.
        </PageHead>
        <Section id="why" label="Why this page" note="A way of learning"><WhyIWrite /></Section>
        <Section id="posts" label="Posts" note={`${posts.length} so far`}>
          <Island name="PostFilter" component={PostFilter} props={{ posts: LIST }} />
        </Section>
      </Wrap>
    </Layout>
  );
}
