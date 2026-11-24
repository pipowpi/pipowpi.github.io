import { Chip, cn, tone, useHref } from './ui.jsx';
import { topicTone } from '../data/site.js';
import { Motif } from './Diagrams.jsx';

const MONTH = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
// "2026-10-14" -> "Oct 2026". UTC so the server render and the browser always agree.
export function fmtMonth(iso) {
  const [y, m] = iso.split('-').map(Number);
  return MONTH.format(new Date(Date.UTC(y, m - 1, 1)));
}
// "5 min" -> "5 min" with a non-breaking space, so the number never wraps away from its unit.
export const nb = (s) => String(s).replace(/(\d) /g, '$1\u00a0');

// Posts as a ruled reading list: title and summary on the left, status and date on the right.
// `detail` adds the topics and reading time under the summary (the Writing page).
export function PostList({ posts, detail = false, compact = false, className = '' }) {
  const href = useHref();
  return (
    <ul className={cn('border-b border-rule', className)}>
      {posts.map((p) => (
        <li key={p.slug} className="border-t border-rule" style={tone(topicTone(p.tags[0]))}>
          <a href={href(`writing/${p.slug}/`)} className={cn('group grid grid-cols-1 gap-x-8 gap-y-1.5', compact ? 'py-4' : 'py-5 md:grid-cols-[minmax(0,1fr)_auto]',
            detail && p.diagram && 'md:grid-cols-[200px_minmax(0,1fr)_auto] md:gap-x-6')}>
            {detail && p.diagram && (
              <span className="hidden h-[112px] items-center justify-center rounded-md border border-rule bg-paper p-2.5 transition-colors group-hover:border-accent md:flex">
                <Motif name={p.diagram} tone={topicTone(p.tags[0])} className="h-full w-full" />
              </span>
            )}
            <span className="min-w-0">
              <span className={cn('flex items-center gap-2.5 font-display font-semibold text-ink group-hover:text-accent', detail ? 'text-h4' : 'text-title', 'leading-snug')}><i aria-hidden="true" className="inline-block size-2.5 shrink-0 rounded-sm bg-accent" />{p.title}</span>
              <span className="mt-1 block max-w-[62ch] text-body leading-relaxed text-lead">{p.summary}</span>
              {detail && (
                <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {p.tags.map((t) => <Chip key={t} variant="accent" style={tone(topicTone(t))}>{t}</Chip>)}
                  <span className="t-meta ml-1 text-lead">{nb(p.read)} read</span>
                </span>
              )}
            </span>
            <span className={cn('t-meta whitespace-nowrap text-lead', !compact && 'md:pt-1 md:text-right')}>
              {p.draft && <span className="mr-2 font-medium text-run">Draft</span>}{fmtMonth(p.date)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
