import { cn } from './ui.jsx';

// A wiring diagram: boxes joined by wires, left to right, stacked on phones.
// A node's `link` ('pull' | 'swap') marks the wire that leads into it as the important one.
export function Flow({ nodes, className = '', label }) {
  return (
    <div className={cn('flow flex flex-col items-stretch md:flex-row', className)} role="list" aria-label={label}>
      {nodes.map((n, i) => (
        <FlowStep key={n.name} node={n} first={i === 0} />
      ))}
    </div>
  );
}

function FlowStep({ node, first }) {
  const hot = node.link === 'pull' || node.link === 'swap';
  return (
    <>
      {!first && (
        <div className={cn('conn', hot && 'conn-hot', node.link === 'pull' && 'conn-rev')} aria-hidden="true">
          {hot && (
            <span className="absolute top-1/2 left-3 -translate-y-1/2 rounded-sm bg-paper px-1 text-[14px] leading-none font-semibold text-accent md:top-[-22px] md:left-1/2 md:-translate-x-1/2 md:translate-y-0">
              {node.link === 'pull' ? 'pull' : 'swap'}
            </span>
          )}
        </div>
      )}
      <div role="listitem" className={cn('min-w-0 flex-1 rounded-md border px-3.5 py-3',
        node.highlight ? 'border-accent bg-wash' : 'border-rule-strong bg-sheet')}>
        <p className="text-[15px] font-semibold leading-snug text-ink">
          {node.name}
          {node.strike && <s className="ml-1.5 font-normal text-lead decoration-[1.5px]">{node.strike}</s>}
        </p>
        <p className="mt-1 text-[14px] leading-snug text-lead">{node.sub}</p>
      </div>
    </>
  );
}

// A numbered strip for real sequences (pipeline stages), used in the smaller project diagrams.
export function Stages({ stages, label }) {
  const cols = { 4: 'sm:grid-cols-4', 5: 'sm:grid-cols-5' }[stages.length] || 'sm:grid-cols-4';
  return (
    <ol className={cn('mt-3 grid grid-cols-2 gap-2', cols)} aria-label={label}>
      {stages.map(([name, sub], i) => (
        <li key={name} className="rounded-md border border-rule-strong bg-sheet px-3 py-2.5">
          <span className="t-chip text-accent">{i + 1}</span>
          <p className="text-[15px] font-semibold leading-snug text-ink">{name}</p>
          <p className="mt-0.5 text-[14px] leading-snug text-lead">{sub}</p>
        </li>
      ))}
    </ol>
  );
}
