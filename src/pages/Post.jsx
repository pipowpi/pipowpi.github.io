import posts from '../generated/posts.json';
import { Layout } from '../components/Layout.jsx';
import { Chip, Sheet, Wrap, tone } from '../components/ui.jsx';
import { topicTone } from '../data/site.js';
import { fmtMonth, nb } from '../components/PostList.jsx';

export default function Post({ slug }) {
  const i = posts.findIndex((p) => p.slug === slug);
  const p = posts[i];
  const newer = i > 0 ? posts[i - 1] : null;
  const older = i + 1 < posts.length ? posts[i + 1] : null;
  return (
    <Layout active="writing">
      <div style={tone(topicTone(p.tags[0]))}>
      <div className="read-progress" aria-hidden="true" />
      <Wrap>
        <article className="mx-auto max-w-[68ch] pt-10 pb-4 md:pt-14">
          <a className="inline-flex min-h-10 items-center text-body font-medium text-accent underline decoration-[color-mix(in_srgb,var(--accent)_40%,transparent)] underline-offset-4 hover:decoration-accent" href="../">All writing</a>
          <h1 className="mt-6 font-display text-h2 font-semibold leading-[1.1] md:text-display">{p.title}</h1>
          <p className="mt-4 text-title leading-relaxed text-lead">{p.summary}</p>
          <p className="t-meta mt-4 flex flex-wrap gap-x-4 gap-y-1 text-lead">
            {p.draft && <span className="font-medium text-run">Draft</span>}
            <span>{fmtMonth(p.date)}</span>
            <span>{nb(p.read)} read</span>
            {p.tags.map((t) => <Chip key={t} variant="accent" style={tone(topicTone(t))}>{t}</Chip>)}
          </p>
          {p.draft && (
            <p className="mt-5 rounded-md border border-dashed border-run px-4 py-3 text-small text-ink">Draft. This post is still being written and reviewed.</p>
          )}
          <div className="prose-post mt-8 border-t border-rule" dangerouslySetInnerHTML={{ __html: p.html }} />
          {(newer || older) && (
            <nav className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="More posts">
              {newer ? (
                <Sheet as="a" interactive href={`../${newer.slug}/`} className="p-5">
                  <p className="text-small text-lead">Newer post</p>
                  <p className="mt-1 font-display text-large font-semibold leading-snug">{newer.title}</p>
                </Sheet>
              ) : <div className="hidden sm:block" />}
              {older && (
                <Sheet as="a" interactive href={`../${older.slug}/`} className="p-5 sm:text-right">
                  <p className="text-small text-lead">Older post</p>
                  <p className="mt-1 font-display text-large font-semibold leading-snug">{older.title}</p>
                </Sheet>
              )}
            </nav>
          )}
        </article>
      </Wrap>
      </div>
    </Layout>
  );
}
