import { cn, useHref } from './ui.jsx';

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
        <li key={p.slug} className="border-t border-rule">
          <a href={href(`writing/${p.slug}/`)} className={cn('group grid grid-cols-1 gap-x-8 gap-y-1.5', compact ? 'py-4' : 'py-5 md:grid-cols-[minmax(0,1fr)_auto]')}>
            <span className="min-w-0">
              <span className={cn('block font-display font-semibold text-ink group-hover:text-accent', detail ? 'text-[22px]' : 'text-[20px]', 'leading-snug')}>{p.title}</span>
              <span className="mt-1 block max-w-[62ch] text-[16px] leading-relaxed text-lead">{p.summary}</span>
              {detail && <span className="t-meta mt-2 block text-lead">{p.tags.join(', ')}, {nb(p.read)} read</span>}
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
