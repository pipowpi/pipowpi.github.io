import { useEffect, useState } from 'react';
import { PostList } from '../components/PostList.jsx';
import { cn, tone } from '../components/ui.jsx';
import { topicTone } from '../data/site.js';

// The post list with topic filters (an island). It gets post metadata only (no post bodies).
// The chosen topic lives in the URL (?topic=Security) so a filtered list can be shared; it is read
// after hydration, because the prerendered HTML always shows every post.
export default function PostFilter({ posts }) {
  const tags = ['All', ...new Set(posts.flatMap((p) => p.tags))];
  const [filter, setFilterState] = useState('All');
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
  if (posts.length === 0) return <p className="text-body text-lead">The first posts are being written.</p>;
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter posts by topic">
        {tags.map((t) => (
          <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)} style={t === 'All' ? undefined : tone(topicTone(t))}
            className={cn('min-h-10 cursor-pointer rounded-full border px-4 text-small font-medium transition-colors duration-(--duration-fast) active:translate-y-px',
              filter === t ? 'border-accent bg-wash text-accent' : t === 'All' ? 'border-rule-strong text-ink hover:border-accent hover:text-accent' : 'border-[color-mix(in_srgb,var(--accent)_45%,transparent)] text-accent hover:border-accent')}>
            {t}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{shown.length} {shown.length === 1 ? 'post' : 'posts'} shown</p>
      {shown.length > 0 ? (
        <PostList posts={shown} detail />
      ) : (
        <p className="text-body text-lead">No posts on this topic yet. <button type="button" className="cursor-pointer font-medium text-accent underline underline-offset-4" onClick={() => setFilter('All')}>Show all posts</button></p>
      )}
    </>
  );
}
