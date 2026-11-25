import { POSTS as posts, UPCOMING } from '../data/posts.js';
import { Motif } from '../components/Diagrams.jsx';
import { topicTone } from '../data/site.js';
import { Layout } from '../components/Layout.jsx';
import { Chip, Island, PageHead, Section, Wrap, tone } from '../components/ui.jsx';
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

// Drafts that are not published yet: titles only, no links.
function Upcoming() {
  return (
    <ul className="border-b border-rule">
      {UPCOMING.map((p) => (
        <li key={p.slug} className="grid grid-cols-1 gap-x-6 gap-y-1.5 border-t border-rule py-5 md:grid-cols-[200px_minmax(0,1fr)_auto]" style={tone(topicTone(p.tags[0]))}>
          {p.diagram ? (
            <span className="hidden h-[112px] items-center justify-center rounded-md border border-rule bg-paper p-2.5 md:flex">
              <Motif name={p.diagram} tone={topicTone(p.tags[0])} className="h-full w-full" />
            </span>
          ) : <span className="hidden md:block" />}
          <span className="min-w-0">
            <span className="flex items-center gap-2.5 font-display text-h4 font-semibold leading-snug text-ink"><i aria-hidden="true" className="inline-block size-2.5 shrink-0 rounded-sm bg-accent" />{p.title}</span>
            <span className="mt-1 block max-w-[62ch] text-body leading-relaxed text-lead">{p.summary}</span>
            <span className="mt-2.5 flex flex-wrap gap-1.5">{p.tags.map((t) => <Chip key={t} variant="accent" style={tone(topicTone(t))}>{t}</Chip>)}</span>
          </span>
          <span className="md:pt-1"><Chip variant="dashed">In review</Chip></span>
        </li>
      ))}
    </ul>
  );
}

// Post metadata for the list (the island gets this, never the post bodies).
const LIST = posts.map(({ slug, title, summary, date, read, tags, draft, diagram }) => ({ slug, title, summary, date, read, tags, draft, diagram }));

export default function Writing() {
  return (
    <Layout active="writing">
      <Wrap>
        <PageHead title="Notes and explainers">
          Notes on things I’ve worked with or studied, written in plain language.
        </PageHead>
        <Section id="why" label="Why this page" note="A way of learning"><WhyIWrite /></Section>
        {posts.length > 0 && (
          <Section id="posts" label="Posts" note={`${posts.length} so far`}>
            <Island name="PostFilter" component={PostFilter} props={{ posts: LIST }} />
          </Section>
        )}
        {UPCOMING.length > 0 && (
          <Section id="upcoming" label={posts.length ? 'Coming next' : 'Posts'} note="Being written and reviewed">
            <Upcoming />
          </Section>
        )}
      </Wrap>
    </Layout>
  );
}
