import { useEffect, useState } from 'react';
import posts from '../generated/posts.json';
import { Layout } from '../components/Layout.jsx';
import { PageHead, Section, Wrap, cn, tone } from '../components/ui.jsx';
import { topicTone } from '../data/site.js';
import { PostList } from '../components/PostList.jsx';
import { Motif } from '../components/Backdrop.jsx';

function WhyIWrite() {
  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <p className="max-w-[60ch] text-[16px] leading-relaxed text-ink">
        Writing is how I check that I understand something. If I can’t explain an idea simply, I go back to the source and try again. These posts are what came out of that.
      </p>
      <ol className="grid grid-cols-1 gap-x-6 sm:grid-cols-3" aria-label="How a post gets written">
        {[['Learn', 'Work with it or study it', 'pink'], ['Explain', 'Write it in plain words', 'teal'], ['Find the gaps', 'Fix what I could not explain', 'lime']].map(([t, s, c], i) => (
          <li key={t} style={tone(c)} className="border-t-2 border-accent py-3">
            <span className="t-chip font-semibold text-accent">{i + 1}</span>
            <p className="text-[15px] font-semibold text-ink">{t}</p>
            <p className="text-[14px] leading-snug text-lead">{s}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Writing() {
  const tags = ['All', ...new Set(posts.flatMap((p) => p.tags))];
  const [filter, setFilterState] = useState('All');
  // The chosen topic lives in the URL (?topic=Security) so a filtered list can be shared or bookmarked.
  // It is read after hydration, because the prerendered HTML always shows every post.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('topic');
    if (t && tags.includes(t)) setFilterState(t);
  }, []);
  const setFilter = (t) => {
    setFilterState(t);
    const url = t === 'All' ? window.location.pathname : `${window.location.pathname}?topic=${encodeURIComponent(t)}`;
    window.history.replaceState(null, '', url);
  };
  const shown = posts.filter((p) => filter === 'All' || p.tags.includes(filter));
  return (
    <Layout active="writing">
      <Wrap>
        <PageHead title="Notes and explainers" art={<Motif name="attention" tone="accent" className="ml-auto aspect-[420/240] w-full max-w-[420px]" />}>
          Notes on things I’ve worked with or studied, written in plain language.
        </PageHead>
        <Section id="why" label="Why this page" note="A way of learning"><WhyIWrite /></Section>
        <Section id="posts" label="Posts" note={`${posts.length} so far`}>
          {posts.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter posts by topic">
              {tags.map((t) => (
                <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)} style={t === 'All' ? undefined : tone(topicTone(t))}
                  className={cn('min-h-10 cursor-pointer rounded-full border px-4 text-[14px] font-medium transition-colors duration-150',
                    filter === t ? 'border-accent bg-wash text-accent' : t === 'All' ? 'border-rule-strong text-ink hover:border-accent hover:text-accent' : 'border-[color-mix(in_srgb,var(--accent)_45%,transparent)] text-accent hover:border-accent')}>
                  {t}
                </button>
              ))}
            </div>
          )}
          <p className="sr-only" aria-live="polite">{shown.length} {shown.length === 1 ? 'post' : 'posts'} shown</p>
          {shown.length > 0 ? (
            <PostList posts={shown} detail />
          ) : posts.length === 0 ? (
            <p className="text-[15px] text-lead">The first posts are being written.</p>
          ) : (
            <p className="text-[15px] text-lead">No posts on this topic yet. <button type="button" className="cursor-pointer font-medium text-accent underline underline-offset-4" onClick={() => setFilter('All')}>Show all posts</button></p>
          )}
        </Section>
      </Wrap>
    </Layout>
  );
}
