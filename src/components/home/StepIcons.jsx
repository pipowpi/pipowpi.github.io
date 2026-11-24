import { Icon, cn } from '../ui.jsx';

// Step markers shared by the "Right now" track and the career run.
export const STATE_TEXT = { done: 'passed', running: 'in progress', queued: 'queued' };

export function StepIcon({ state, className = '' }) {
  if (state === 'done') {
    return <span className={cn('relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sc,var(--pass))] text-sheet', className)}><Icon name="check" className="size-3.5" strokeWidth={3} /></span>;
  }
  if (state === 'running') {
    return <span className={cn('relative z-10 inline-block size-6 shrink-0 animate-spin rounded-full border-[2.5px] border-[color-mix(in_srgb,var(--run)_25%,transparent)] border-t-run bg-sheet [animation-duration:1.2s]', className)} />;
  }
  return <span className={cn('relative z-10 inline-block size-6 shrink-0 rounded-full border-2 border-dashed border-queue bg-sheet', className)} />;
}

export function SwitchIcon({ state, className = '' }) {
  return (
    <span className={cn('relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-md border-2',
      state === 'queued' ? 'border-dashed border-queue bg-sheet text-lead' : 'border-ink bg-sheet text-ink', className)}>
      <Icon name="convert" className="size-3.5" strokeWidth={2.4} />
    </span>
  );
}

export function PivotIcon({ state, className = '' }) {
  return (
    <span className={cn('relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-md border-2',
      state === 'queued' ? 'border-dashed border-queue bg-sheet text-lead' : 'border-accent bg-accent text-on-accent', className)}>
      <Icon name="book" className="size-3.5" strokeWidth={2.2} />
    </span>
  );
}

export function DeployIcon({ className = '' }) {
  return (
    <span className={cn('relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-accent bg-sheet text-accent', className)}>
      <Icon name="briefcase" className="size-3" strokeWidth={2.2} />
    </span>
  );
}
