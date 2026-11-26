import { useEffect, useRef, useState } from 'react';
import { CAREER_STEPS } from '../data/home.js';

const TONE = CAREER_STEPS.map((st) => `var(--${st.tone})`);

// A small line-art character walks the career run, one stop per stage, and picks up a prop at each:
// a speech bubble (Learn the craft), a hard hat (Make it scale), a lead's star (Own the platform),
// a GPU chip (Bring RTX GPUs to CI) and a grad cap (the MS). Props from finished stages stay
// above their stop. Between Abzooba and NVIDIA is a switch: a signpost where the path changes
// direction, and the character hops across. Between NVIDIA and the MS is the pivot: a book on a post,
// a lightbulb moment, and from there the path turns from green (work) to amber (learning).
// Ahead is a closed door: the deploy to a full-time role.
// Decorative only (aria-hidden): the step list beside it carries the same information as text.
// `at` uses the step list's indices: 0-2 stages, 3 the switch, 4 a stage, 5 the pivot, 6 the MS
// (7, the deploy, is the door).

const POS = [55, 150, 245, 305, 365, 430, 505];
const SWITCH = 3;
const PIVOT = 5;
const PROP_OF = { 0: 0, 1: 1, 2: 2, 4: 3, 5: 5, 6: 4 };
const GROUND = 150;
const DOOR_X = 590;
export const WALK_MS = 750;

// Props drawn around (0, 0), about 28 units wide, in the stage color (--sc).
function Prop({ i }) {
  switch (i) {
    case 0: // speech bubble with dots
      return (
        <g>
          <path d="M-15 -9 h30 a4 4 0 0 1 4 4 v10 a4 4 0 0 1 -4 4 h-18 l-7 6 v-6 h-5 a4 4 0 0 1 -4 -4 v-10 a4 4 0 0 1 4 -4 z" className="sc-wash sc-stroke" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="-7" cy="0" r="1.8" className="sc-fill" />
          <circle cx="0" cy="0" r="1.8" className="sc-fill" />
          <circle cx="7" cy="0" r="1.8" className="sc-fill" />
        </g>
      );
    case 1: // hard hat
      return (
        <g>
          <path d="M-11 3 A11 11 0 0 1 11 3 Z" className="sc-fill sc-stroke" strokeWidth="2" strokeLinejoin="round" />
          <path d="M0 -8 v11" className="stroke-on-accent" strokeWidth="1.6" />
          <path d="M-15 3 H15" className="sc-stroke" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 2: // lead's star
      return <path d="M0 -8 L2.4 -2.5 L8.4 -2.5 L3.6 1.2 L5.4 7 L0 3.6 L-5.4 7 L-3.6 1.2 L-8.4 -2.5 L-2.4 -2.5 Z" className="sc-fill sc-stroke" strokeWidth="1.5" strokeLinejoin="round" />;
    case 3: // GPU chip
      return (
        <g>
          <rect x="-8" y="-6" width="16" height="12" rx="1.5" className="sc-wash sc-stroke" strokeWidth="2" />
          <rect x="-3.5" y="-2.5" width="7" height="5" className="sc-fill" />
          <path d="M-5 -6 v-3 M0 -6 v-3 M5 -6 v-3 M-5 6 v3 M0 6 v3 M5 6 v3" className="sc-stroke" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    case 5: // lightbulb: the pivot moment
      return (
        <g>
          <path d="M-6 3 a8 8 0 1 1 12 0 c-1.5 1.5 -2 2.6 -2 4.5 h-8 c0 -1.9 -0.5 -3 -2 -4.5 z" className="sc-wash sc-stroke" strokeWidth="2" strokeLinejoin="round" />
          <path d="M-3.5 10.5 h7 M-2.5 13.5 h5" className="sc-stroke" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M0 -15 v-3 M-10 -10 l-2 -2 M10 -10 l2 -2 M-13 -1 h-3 M13 -1 h3" className="sc-stroke" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    default: // grad cap with tassel
      return (
        <g>
          <path d="M-5 0 v5 a5 3 0 0 0 10 0 v-5" className="sc-fill sc-stroke" strokeWidth="1.5" />
          <path d="M-15 -2 L0 -8 L15 -2 L0 4 Z" className="sc-fill sc-stroke" strokeWidth="1.5" strokeLinejoin="round" />
          <g className="tassel">
            <path d="M0 -2 L11 1 V9" className="stroke-ink" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <circle cx="11" cy="10" r="1.8" className="fill-ink" />
          </g>
        </g>
      );
  }
}

// Where each prop sits on the character (feet at 0, 0; head centred at 0, -50).
const ON_BODY = [
  'translate(24 -76)', // bubble beside the head
  'translate(0 -57)',  // hat on the head
  'translate(0 -30)',  // star on the chest, drawn smaller below
  'translate(16 -22)', // chip in the right hand
  'translate(0 -62)',  // cap on the head
  'translate(18 -78)', // lightbulb above, beside the head
];

function Character({ prop, walking, done, hop }) {
  return (
    <g className={walking ? 'walker walking' : 'walker'}>
      <g className={hop ? 'hop' : undefined}>
      <g className="bob">
        {/* legs swing from the hip */}
        <g className="leg leg-a"><path d="M0 -18 L-6 0" className="stroke-ink" strokeWidth="3" strokeLinecap="round" /></g>
        <g className="leg leg-b"><path d="M0 -18 L6 0" className="stroke-ink" strokeWidth="3" strokeLinecap="round" /></g>
        <path d="M0 -40 V-18" className="stroke-ink" strokeWidth="3" strokeLinecap="round" />
        {/* arms swing from the shoulder; when studying they hold the book */}
        {done ? (
          <path d="M0 -34 L8 -26 M0 -34 L12 -28" className="stroke-ink" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : (
          <>
            <g className="arm arm-a"><path d="M0 -34 L-9 -21" className="stroke-ink" strokeWidth="3" strokeLinecap="round" /></g>
            <g className="arm arm-b"><path d="M0 -34 L10 -21" className="stroke-ink" strokeWidth="3" strokeLinecap="round" /></g>
          </>
        )}
        <circle cx="0" cy="-50" r="10" className="fill-sheet stroke-ink" strokeWidth="3" />
        <circle cx="3" cy="-52" r="1.4" className="fill-ink" />
        <circle cx="7.5" cy="-52" r="1.4" className="fill-ink" />
        <path d="M3 -46.5 q2.5 2 5 0" className="stroke-ink" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {done && (
          <g transform="translate(14 -28)">
            <path d="M-8 -5 L0 -2 L8 -5 V4 L0 7 L-8 4 Z" className="fill-wash stroke-accent" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M0 -2 V7" className="stroke-accent" strokeWidth="1.4" />
          </g>
        )}
        {prop >= 0 && (
          <g key={prop} transform={prop === 2 ? `${ON_BODY[2]} scale(0.75)` : ON_BODY[prop]}>
            <g className="prop-pop"><Prop i={prop} /></g>
          </g>
        )}
      </g>
      </g>
    </g>
  );
}

// The switch between Abzooba and NVIDIA: a signpost whose board flips as the character passes.
function Signpost({ state }) {
  const on = state !== 'queued';
  // An overhead sign: the pole stands just behind the stop, the board hangs over the path.
  return (
    <g className="sign">
      <path d="M-16 0 V-78 H-4" className={on ? 'stroke-ink' : 'stroke-rule-strong'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <g transform="translate(6 -78)">
        <g key={state} className={state === 'running' ? 'sign-flip' : undefined}>
          <path d="M-12 -7 H10 L16 0 L10 7 H-12 Z" className={on ? 'fill-sheet stroke-ink' : 'fill-sheet stroke-rule-strong'} strokeWidth="2" strokeLinejoin="round" />
          <path d="M-6 -2 h12 l-3 -3 M8 2 h-12 l3 3" className={on ? 'stroke-ink' : 'stroke-lead'} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <circle r="4" className={on ? 'fill-ink' : 'fill-sheet stroke-queue'} strokeWidth="1.5" />
    </g>
  );
}

// The pivot from industry to the MS: an open book on a short post.
function BookPost({ state }) {
  const on = state !== 'queued';
  return (
    <g className="sign">
      <path d="M-14 0 V-30" className={on ? 'stroke-accent' : 'stroke-rule-strong'} strokeWidth="2.5" strokeLinecap="round" />
      <g transform="translate(-14 -36)">
        <g key={state} className={state === 'running' ? 'prop-pop' : undefined}>
          <path d="M-11 -6 L0 -3 L11 -6 V6 L0 9 L-11 6 Z" className={on ? 'fill-accent stroke-accent' : 'fill-sheet stroke-rule-strong'} strokeWidth="2" strokeLinejoin="round" />
          <path d="M0 -3 V9" className={on ? 'stroke-on-accent' : 'stroke-rule-strong'} strokeWidth="1.5" />
        </g>
      </g>
      <circle r="4" className={on ? 'fill-accent' : 'fill-sheet stroke-queue'} strokeWidth="1.5" />
    </g>
  );
}

export function CareerWalk({ at, className = '' }) {
  const [walking, setWalking] = useState(false);
  // A reset or replay moves the character back to the start instantly, without walking backwards.
  const prev = useRef(at);
  const jump = at < prev.current;
  useEffect(() => {
    const back = at < prev.current;
    const same = at === prev.current;
    prev.current = at;
    if (back || same) { setWalking(false); return undefined; }
    setWalking(true);
    const t = setTimeout(() => setWalking(false), WALK_MS);
    return () => clearTimeout(t);
  }, [at]);

  const last = POS.length - 1;
  const here = Math.min(at, last);
  const x = at < 0 ? 14 : POS[here];
  const arrived = at === last && !walking;
  const state = (i) => (i < at ? 'done' : i === at ? 'running' : 'queued');

  return (
    <svg viewBox="0 30 640 142" className={className} aria-hidden="true" focusable="false">
      {/* ground: a dashed path, filled in as stages pass, running on to the door */}
      <path d={`M${POS[0]} ${GROUND} H${DOOR_X - 22}`} className="stroke-rule-strong" strokeWidth="2" strokeDasharray="4 6" />
      {POS.slice(0, -1).map((sx, i) => (
        <rect key={sx} x={sx} y={GROUND - 1.5} width={POS[i + 1] - sx} height="3" className="sc-fill walk-fill"
          style={{ '--sc': TONE[i], transform: `scaleX(${at > i ? 1 : 0})`, transitionDuration: jump ? '0ms' : undefined }} />
      ))}
      {/* stops, and the switch */}
      {POS.map((sx, i) => {
        const st = state(i);
        if (i === SWITCH) return <g key={sx} transform={`translate(${sx} ${GROUND})`}><Signpost state={st} /></g>;
        if (i === PIVOT) return <g key={sx} transform={`translate(${sx} ${GROUND})`}><BookPost state={st} /></g>;
        return (
          <g key={sx} transform={`translate(${sx} ${GROUND})`} style={{ '--sc': TONE[i] }}>
            {st === 'done' && (
              <g key="d">
                <g className="prop-pop"><circle r="7" className="sc-fill" /><path d="M-3.2 0.2 L-0.8 2.6 L3.4 -2.2" className="stroke-sheet" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
                <g transform="translate(0 -40) scale(0.7)"><g className="stop-ico"><g className="prop-pop float"><Prop i={PROP_OF[i]} /></g></g></g>
              </g>
            )}
            {st === 'running' && <circle r="6" className="fill-sheet stroke-run" strokeWidth="2.5" />}
            {st === 'queued' && <circle r="6" className="fill-sheet stroke-queue" strokeWidth="2" strokeDasharray="3 3" />}
          </g>
        );
      })}

      {/* the door ahead: the deploy job, waiting for review; light under it once the run reaches the MS */}
      <g transform={`translate(${DOOR_X} ${GROUND})`}>
        <g className="door">
        <rect x="-18" y="-62" width="36" height="62" rx="2" className="fill-sheet stroke-rule-strong" strokeWidth="2" strokeDasharray="5 4" />
        <circle cx="10" cy="-30" r="2.2" className="fill-accent" />
        <g transform="translate(0 -40)">
          <rect x="-8" y="-5" width="16" height="11" rx="2" className="stroke-lead" strokeWidth="1.6" fill="none" />
          <path d="M-3 -5 v-2.5 h6 v2.5 M-8 0 h16" className="stroke-lead" strokeWidth="1.6" fill="none" />
        </g>
        <path d="M-15 -1.5 H15" className={arrived ? 'stroke-accent door-glow' : 'stroke-transparent'} strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* the character */}
      <g className="walk-pos" style={{ '--sc': TONE[Math.max(here, 0)], transform: `translate(${x}px, ${GROUND}px)`, transitionDuration: jump ? '0ms' : `${WALK_MS}ms` }}>
        <Character prop={walking || at < 0 ? -1 : (PROP_OF[here] ?? -1)} walking={walking} done={arrived} hop={at === SWITCH && !walking} />
      </g>
    </svg>
  );
}
