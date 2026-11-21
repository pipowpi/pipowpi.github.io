// Motifs: small animated line drawings of the systems this site is about (a CI pipeline, an API
// with its database, a Kubernetes cluster, a loss curve, causal attention, a convolution, a
// transformer block, a head mesh, the RISC-V pipeline). They are placed in the layout where there is
// room for them (the page headers and the home page's "What I work on" cards), not behind text.
// Lines use the ink color; one element per drawing uses the highlight color (--hi) and moves slowly.
// Decorative only: aria-hidden, and every animation stops under reduced motion.

const r = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }; // fixed pseudo-random

function Pipeline() {
  const stages = ['build', 'test', 'deploy'];
  return (
    <svg viewBox="0 0 360 130">
      {stages.map((s, i) => (
        <g key={s} transform={`translate(${i * 125} 40)`}>
          <rect width="100" height="46" rx="6" />
          <text x="12" y="28" className="bd-text">{s}</text>
          <circle cx="86" cy="14" r="6" className="bd-hi-soft" />
          <path d="M83 14 l2 2 l4 -4" className="bd-hi" />
          {i < 2 && <path d="M100 23 H125" />}
        </g>
      ))}
      <path d="M0 110 H350" strokeDasharray="3 6" />
      <circle cx="0" cy="63" r="4.5" className="bd-hi-fill bd-packet" />
      <text x="0" y="16" className="bd-text">ci.yml  #4127</text>
    </svg>
  );
}

function Cluster() {
  return (
    <svg viewBox="0 0 320 210">
      {[0, 1, 2].map((n) => (
        <g key={n} transform={`translate(${n * 108} 10)`}>
          <rect width="96" height="190" rx="6" />
          <path d="M0 26 H96" />
          <text x="10" y="18" className="bd-text">node-{n + 1}</text>
          {[0, 1, 2, 3, 4, 5].map((p) => {
            const hot = (n === 1 && p === 2) || (n === 2 && p === 4);
            return <rect key={p} x={10 + (p % 2) * 40} y={38 + Math.floor(p / 2) * 50} width="34" height="40" rx="4"
              className={hot ? 'bd-hi-soft bd-pulse' : undefined} style={hot ? { animationDelay: `${n * 1.3}s` } : undefined} />;
          })}
        </g>
      ))}
    </svg>
  );
}

function Loss() {
  const pts = Array.from({ length: 51 }, (_, i) => {
    const x = i * 6;
    const y = 150 * Math.exp(-x / 70) + 18 + (r(i) - 0.5) * 10;
    return [x + 20, 170 - y];
  });
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const v = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${(y - 12 - i * 0.12).toFixed(1)}`).join(' ');
  return (
    <svg viewBox="0 0 340 200">
      <path d="M20 10 V170 H330" />
      {[1, 2, 3, 4].map((k) => <path key={k} d={`M${20 + k * 62} 170 v5`} />)}
      <path d={v} strokeDasharray="4 5" />
      <path d={d} pathLength="1" className="bd-hi bd-draw" />
      <text x="26" y="20" className="bd-text">loss</text>
      <text x="290" y="192" className="bd-text">epoch</text>
    </svg>
  );
}

// Causal self-attention: only the lower triangle exists, and the weights shift over time.
function Attention() {
  const n = 8, c = 26;
  return (
    <svg viewBox="0 0 250 250">
      {Array.from({ length: n }, (_, i) => <rect key={`t${i}`} x={30 + i * c} y="6" width={c - 6} height="8" rx="2" />)}
      {Array.from({ length: n }, (_, i) => <rect key={`l${i}`} x="6" y={30 + i * c} width="8" height={c - 6} rx="2" />)}
      {Array.from({ length: n }, (_, i) => Array.from({ length: i + 1 }, (_, j) => (
        <rect key={`${i}-${j}`} x={30 + j * c} y={30 + i * c} width={c - 4} height={c - 4} rx="3"
          className="bd-hi-fill bd-weight" style={{ animationDelay: `${-(r(i * 9 + j) * 6).toFixed(2)}s`, opacity: (0.15 + (i === j ? 0.5 : r(i * 7 + j) * 0.4)).toFixed(2) }} />
      )))}
      {Array.from({ length: n }, (_, i) => Array.from({ length: n - i - 1 }, (_, k) => (
        <rect key={`m${i}-${k}`} x={30 + (i + k + 1) * c} y={30 + i * c} width={c - 4} height={c - 4} rx="3" strokeDasharray="2 4" />
      )))}
    </svg>
  );
}

// A 3x3 kernel slides over a 6x6 input; the matching output cell lights up in step.
function Convolution() {
  const s = 24;
  return (
    <svg viewBox="0 0 340 190">
      {Array.from({ length: 36 }, (_, i) => <rect key={i} x={(i % 6) * s} y={20 + Math.floor(i / 6) * s} width={s - 3} height={s - 3} rx="2" />)}
      <rect x="-2" y="18" width={s * 3 + 1} height={s * 3 + 1} rx="4" className="bd-hi bd-slide" strokeWidth="2.2" />
      <path d="M160 92 H200 l-6 -5 M200 92 l-6 5" />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={226 + (i % 4) * s} y={44 + Math.floor(i / 4) * s} width={s - 3} height={s - 3} rx="2" />)}
      <rect x="226" y="44" width={s - 3} height={s - 3} rx="2" className="bd-hi-fill bd-slide" />
      <text x="0" y="12" className="bd-text">conv 3x3</text>
    </svg>
  );
}

function Transformer() {
  const blocks = ['FFN', 'add & norm', 'attention', 'add & norm', 'embed'];
  return (
    <svg viewBox="0 0 220 300">
      {blocks.map((b, i) => (
        <g key={i} transform={`translate(30 ${20 + i * 54})`}>
          <rect width="150" height="34" rx="6" />
          <text x="12" y="22" className="bd-text">{b}</text>
          {i < blocks.length - 1 && <path d="M75 34 V54 M70 41 l5 -7 l5 7" />}
        </g>
      ))}
      <path d="M190 260 H205 V36 H190" strokeDasharray="3 5" />
      <rect x="28" y="18" width="154" height="38" rx="7" className="bd-hi bd-rise" strokeWidth="2" />
    </svg>
  );
}

// A wireframe head mesh: rows of vertices wrapped on an ellipse, with a scan line passing over it.
function Mesh() {
  const rows = 11, cols = 8;
  const pts = Array.from({ length: rows }, (_, i) => {
    const t = i / (rows - 1);
    const y = 16 + t * 220;
    const half = Math.sin(Math.PI * (0.08 + t * 0.84)) * 92;
    return Array.from({ length: cols }, (_, j) => [110 + (j / (cols - 1) - 0.5) * 2 * half, y + Math.sin((j / (cols - 1)) * Math.PI) * 6]);
  });
  const lines = [];
  pts.forEach((row, i) => row.forEach(([x, y], j) => {
    if (j < cols - 1) lines.push(`M${x.toFixed(1)} ${y.toFixed(1)} L${row[j + 1][0].toFixed(1)} ${row[j + 1][1].toFixed(1)}`);
    if (i < rows - 1) {
      const nx = pts[i + 1];
      lines.push(`M${x.toFixed(1)} ${y.toFixed(1)} L${nx[j][0].toFixed(1)} ${nx[j][1].toFixed(1)}`);
      if (j < cols - 1) lines.push(`M${x.toFixed(1)} ${y.toFixed(1)} L${nx[j + 1][0].toFixed(1)} ${nx[j + 1][1].toFixed(1)}`);
    }
  }));
  return (
    <svg viewBox="0 0 220 250">
      <path d={lines.join(' ')} strokeWidth="1" />
      <path d="M10 0 H210" className="bd-hi bd-scan" strokeWidth="2" />
    </svg>
  );
}

// The classic five-stage RISC-V pipeline chart: each instruction starts one cycle after the last.
function RiscV() {
  const st = ['IF', 'ID', 'EX', 'MEM', 'WB'];
  return (
    <svg viewBox="0 0 330 190">
      {[0, 1, 2, 3].map((row) => st.map((s, k) => (
        <g key={`${row}-${s}`} transform={`translate(${(row + k) * 40} ${20 + row * 40})`}>
          <rect width="36" height="28" rx="3" />
          <text x="5" y="18" className="bd-text bd-text-sm">{s}</text>
        </g>
      )))}
      <rect x="-2" y="12" width="40" height="164" rx="4" className="bd-hi bd-clock" strokeWidth="1.8" />
    </svg>
  );
}

function Api() {
  return (
    <svg viewBox="0 0 360 150">
      <g transform="translate(0 40)"><rect width="76" height="46" rx="6" /><text x="12" y="28" className="bd-text">client</text></g>
      <g transform="translate(130 30)"><rect width="96" height="66" rx="6" /><text x="12" y="26" className="bd-text">api</text><text x="12" y="46" className="bd-text bd-text-sm">POST /files</text></g>
      <g transform="translate(286 34)">
        <path d="M0 8 a37 8 0 0 0 74 0 a37 8 0 0 0 -74 0 V50 a37 8 0 0 0 74 0 V8" />
        <text x="22" y="36" className="bd-text">db</text>
      </g>
      <path d="M76 63 H130 M226 63 H286" />
      <g transform="translate(150 112)"><rect width="56" height="30" rx="4" /><path d="M12 10 h20 M12 18 h30" /></g>
      <path d="M178 96 V112" strokeDasharray="3 4" />
      <circle cx="80" cy="63" r="4.5" className="bd-hi-fill bd-req" />
      <circle cx="230" cy="63" r="4.5" className="bd-hi-fill bd-req bd-req-2" />
      <text x="0" y="16" className="bd-text">GET  200  14 ms</text>
    </svg>
  );
}

const MOTIFS = { api: Api,  pipeline: Pipeline, cluster: Cluster, loss: Loss, attention: Attention, conv: Convolution, transformer: Transformer, mesh: Mesh, riscv: RiscV };

// A motif in the layout. `tone` sets the highlight color; `label` is an optional caption.
export function Motif({ name, tone = 'accent', className = '' }) {
  const M = MOTIFS[name];
  return <div className={`motif ${className}`} style={{ '--hi': `var(--${tone})` }} aria-hidden="true"><M /></div>;
}

// The page background itself is only a faint dot grid that fades down the page.
export function Backdrop() {
  return <div className="backdrop" aria-hidden="true" />;
}
