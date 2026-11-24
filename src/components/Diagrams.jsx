import { useEffect, useRef, useState } from 'react';

// Diagrams: small labelled diagrams of the systems this site is about, drawn literally so each one
// reads as the real thing: an API service with its database and file storage, a CI run graph with a
// build-time chart, a Kubernetes cluster scheduling a pod, causal attention between words, a
// convolution over an image, a photo turned into a 3D head mesh, a fine-tuning loss curve, and a
// transformer block. Each has one slow animation that shows how it works. They sit in the layout
// (page headers, home cards), never behind text. Decorative: aria-hidden; motion stops under
// reduced motion, with the motion toggle, and while the drawing is off screen.

// Steps through 0..n-1 every `ms` while the drawing is visible and motion is allowed.
// The server render and the still state show `rest`.
function useStep(n, ms, rest = n - 1) {
  const ref = useRef(null);
  const [step, setStep] = useState(rest);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let timer = null;
    let i = 0;
    const tick = () => {
      if (document.documentElement.getAttribute('data-motion') === 'off') { setStep(rest); return; }
      i = (i + 1) % n;
      setStep(i);
    };
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = setInterval(tick, ms);
    });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [n, ms, rest]);
  return [ref, step];
}

const T = ({ x, y, children, sm, anchor, hi, dim }) => (
  <text x={x} y={y} textAnchor={anchor} className={`mt-text${sm ? ' mt-sm' : ''}${hi ? ' mt-hi' : ''}${dim ? ' mt-dim' : ''}`}>{children}</text>
);
const Check = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}><circle r="7" className="mt-pass" /><path d="M-3.2 0.2 L-0.8 2.6 L3.4 -2.2" className="mt-on" /></g>
);
const Spin = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}><circle r="6.5" className="mt-track" /><path d="M0 -6.5 A6.5 6.5 0 0 1 6.5 0" className="mt-spin" /></g>
);
const Wait = ({ x, y }) => <circle cx={x} cy={y} r="6.5" className="mt-wait" />;

// Backend: a client calls an API service, which writes to a database and to file storage.
function Api() {
  const [ref, s] = useStep(4, 900, 3);
  return (
    <svg ref={ref} viewBox="0 0 420 190">
      <rect x="2" y="70" width="78" height="44" rx="6" /><T x="41" y="97" anchor="middle">client</T>
      <rect x="130" y="40" width="140" height="104" rx="8" className="mt-box" />
      <T x="144" y="62">API service</T>
      <T x="144" y="86" sm dim>POST /files</T>
      <T x="144" y="104" sm dim>GET  /jobs/:id</T>
      <T x="144" y="122" sm dim>auth, rate limits</T>
      <g transform="translate(318 18)">
        <path d="M0 9 a48 9 0 0 0 96 0 a48 9 0 0 0 -96 0 V52 a48 9 0 0 0 96 0 V9" />
        <T x="48" y="42" anchor="middle">database</T>
      </g>
      <rect x="318" y="120" width="96" height="50" rx="6" /><path d="M330 136 h44 M330 146 h60 M330 156 h34" className="mt-faint" />
      <T x="366" y="186" anchor="middle" sm dim>file storage</T>
      <path d="M80 92 H130 M270 70 H318 M270 130 H318" />
      <circle cx={s === 0 ? 90 : 120} cy="92" r="5" className={`mt-dot ${s === 0 ? '' : 'mt-gone'}`} />
      <circle cx="294" cy="70" r="5" className={`mt-dot ${s === 1 ? '' : 'mt-gone'}`} />
      <circle cx="294" cy="130" r="5" className={`mt-dot ${s === 2 ? '' : 'mt-gone'}`} />
      <g className={s === 3 ? '' : 'mt-gone'}><rect x="4" y="128" width="96" height="22" rx="11" className="mt-chip" /><T x="52" y="143" anchor="middle" sm hi>201 Created</T></g>
    </svg>
  );
}

// CI/CD: a push triggers build, two test jobs (one on a Windows GPU runner) and deploy; below, a
// chart of build times. Jobs run and pass one stage at a time.
function Pipeline() {
  const [ref, s] = useStep(5, 1100, 4); // 0 build running, 1 tests running, 2 deploy running, 3-4 all passed
  const st = (stage) => (s > stage ? 'pass' : s === stage ? 'run' : 'wait');
  const Job = ({ x, y, w = 112, name, time, stage }) => {
    const k = st(stage);
    return (
      <g>
        <rect x={x} y={y} width={w} height="34" rx="6" className={k === 'run' ? 'mt-box-hi' : undefined} />
        {k === 'pass' ? <Check x={x + 16} y={y + 17} /> : k === 'run' ? <Spin x={x + 16} y={y + 17} /> : <Wait x={x + 16} y={y + 17} />}
        <T x={x + 30} y={y + 21} sm>{name}</T>
        <T x={x + w - 8} y={y + 21} sm dim anchor="end">{k === 'pass' ? time : ''}</T>
      </g>
    );
  };
  const bars = [34, 30, 36, 29, 31, 27, 33, 26, 25, 28, 24, 23, 25, 22, 21, 22, 20, 19];
  return (
    <svg ref={ref} viewBox="0 0 430 190">
      <rect x="2" y="44" width="70" height="30" rx="15" /><T x="37" y="63" anchor="middle" sm>push</T>
      <Job x={88} y={42} w={104} name="build" time="2m" stage={0} />
      <Job x={212} y={6} w={146} name="linux tests" time="4m" stage={1} />
      <Job x={212} y={78} w={146} name="windows gpu" time="9m" stage={1} />
      <Job x={374} y={42} w={56} name="ship" time="" stage={2} />
      <path d="M72 59 H88 M192 59 H202 V23 H212 M202 59 V95 H212 M358 23 H366 V59 H374 M358 95 H366 V59" />
      <T x="2" y="140" sm dim>build time, last 18 runs</T>
      {bars.map((b, i) => <rect key={i} x={2 + i * 14} y={186 - b} width="9" height={b} rx="1.5" className={i === bars.length - 1 ? 'mt-fill-hi' : 'mt-fill'} />)}
      <path d="M262 150 H428" className="mt-faint" />
      <T x="262" y="166" sm dim>p95 latency</T>
      <path d="M262 186 L290 180 L318 183 L346 172 L374 176 L402 168 L428 170" className="mt-line-hi" />
    </svg>
  );
}

// Kubernetes: a control plane (API server, scheduler) over three GPU worker nodes running pods.
// The scheduler places a new pod on the node with room.
function Cluster() {
  const [ref, s] = useStep(3, 1200, 2); // 0 pending at scheduler, 1 placing, 2 running on worker 3
  const Pod = ({ x, y, hi }) => (
    <g><rect x={x} y={y} width="44" height="30" rx="5" className={hi ? 'mt-box-hi' : undefined} /><T x={x + 22} y={y + 19} anchor="middle" sm dim={!hi} hi={hi}>pod</T></g>
  );
  const nodes = [[6, 4], [146, 3], [286, 1]];
  return (
    <svg ref={ref} viewBox="0 0 430 260">
      <rect x="120" y="4" width="190" height="58" rx="8" className="mt-box" />
      <T x="215" y="27" anchor="middle">control plane</T>
      <T x="215" y="47" anchor="middle" sm dim>API server, scheduler</T>
      {nodes.map(([x, n], i) => (
        <g key={x}>
          <path d={`M215 62 L${x + 66} 100`} />
          <rect x={x} y="100" width="132" height="156" rx="8" />
          <T x={x + 12} y="120" sm dim>{`worker ${i + 1}`}</T>
          <rect x={x + 88} y="109" width="34" height="16" rx="3" className="mt-chip" /><T x={x + 105} y="121" anchor="middle" sm hi>GPU</T>
          {Array.from({ length: n }, (_, k) => <Pod key={k} x={x + 12 + (k % 2) * 56} y={136 + Math.floor(k / 2) * 40} />)}
        </g>
      ))}
      <g className="mt-move" style={{ transform: s === 0 ? 'translate(193px, 36px) scale(.8)' : s === 1 ? 'translate(330px, 66px)' : 'translate(354px, 136px)' }}>
        <rect width="44" height="30" rx="5" className={s === 2 ? 'mt-box-hi' : 'mt-box-hi mt-dash'} />
        <T x="22" y="19" anchor="middle" sm hi>{s === 2 ? 'pod' : 'new'}</T>
      </g>
    </svg>
  );
}

// Causal attention: one word (the query) looks back at itself and every earlier word. Line width
// is the attention weight. The query moves along the sentence.
const WORDS = ['The', 'model', 'reads', 'every', 'token'];
const WEIGHTS = [[1], [0.45, 0.55], [0.2, 0.5, 0.3], [0.15, 0.25, 0.35, 0.25], [0.1, 0.35, 0.15, 0.25, 0.15]];
function Attention() {
  const [ref, s] = useStep(4, 1500, 3);
  const q = s + 1; // query index 1..4
  const X = (i) => 8 + i * 82;
  return (
    <svg ref={ref} viewBox="0 0 420 240">
      <T x="8" y="14" sm dim>{`query "${WORDS[q]}" looks at the words before it`}</T>
      {WORDS.map((w, i) => (
        <g key={`q${i}`}>
          <rect x={X(i)} y="26" width="72" height="30" rx="6" className={i === q ? 'mt-box-hi' : undefined} />
          <T x={X(i) + 36} y="46" anchor="middle" hi={i === q}>{w}</T>
        </g>
      ))}
      {WEIGHTS[q].map((wt, j) => (
        <path key={`a${q}-${j}`} d={`M${X(q) + 36} 56 C ${X(q) + 36} 120, ${X(j) + 36} 130, ${X(j) + 36} 186`}
          className="mt-arc" style={{ strokeWidth: 1 + wt * 12, opacity: 0.3 + wt * 1.4 }} />
      ))}
      {WORDS.map((w, i) => (
        <g key={`k${i}`} className={i > q ? 'mt-masked' : undefined}>
          <rect x={X(i)} y="186" width="72" height="30" rx="6" />
          <T x={X(i) + 36} y="206" anchor="middle">{w}</T>
        </g>
      ))}
      <T x="8" y="236" sm dim>line width = attention weight; later words are masked</T>
    </svg>
  );
}

// Convolution: a 3x3 edge-detecting kernel slides over a small image; each position gives one value
// in the feature map, which is bright where the image has an edge.
const IMG = Array.from({ length: 7 }, (_, r) => Array.from({ length: 7 }, (_, c) => (c >= 3 ? 1 : 0) * (r >= 1 && r <= 5 ? 1 : 0.4)));
const KER = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]];
const OUT = Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => {
  let v = 0;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) v += IMG[r + i][c + j] * KER[i][j];
  return Math.max(0, Math.min(1, v / 3));
}));
function Convolution() {
  const [ref, s] = useStep(25, 450, 12);
  const r = Math.floor(s / 5), c = s % 5, px = 22;
  return (
    <svg ref={ref} viewBox="0 0 440 200">
      <T x="0" y="12" sm dim>input image</T>
      {IMG.map((row, i) => row.map((v, j) => (
        <rect key={`i${i}${j}`} x={j * px} y={22 + i * px} width={px - 2} height={px - 2} rx="2" className="mt-pixel" style={{ fillOpacity: 0.08 + v * 0.55 }} />
      )))}
      <rect x={c * px - 2} y={20 + r * px} width={px * 3 + 2} height={px * 3 + 2} rx="3" className="mt-frame" />
      <T x="186" y="58" sm dim>kernel</T>
      {KER.map((row, i) => row.map((v, j) => (
        <g key={`k${i}${j}`}><rect x={180 + j * 24} y={66 + i * 24} width="22" height="22" rx="3" className="mt-box" /><T x={191 + j * 24} y={81 + i * 24} anchor="middle" sm>{v}</T></g>
      )))}
      <path d="M164 100 H176 M258 100 H284 l-6 -5 M284 100 l-6 5" />
      <T x="300" y="12" sm dim>feature map</T>
      {OUT.map((row, i) => row.map((v, j) => (
        <rect key={`o${i}${j}`} x={300 + j * 27} y={22 + i * 27} width="25" height="25" rx="3"
          className={i === r && j === c ? 'mt-frame mt-cellhi' : 'mt-out'} style={{ fillOpacity: 0.06 + v * 0.7 }} />
      )))}
      <T x="300" y="170" sm dim>bright = an edge was found</T>
    </svg>
  );
}

// Head reconstruction: one photo in, a 3D head mesh out. The mesh is a wireframe of latitude and
// longitude lines clipped to a head outline; a scan line passes over it.
function Mesh() {
  // Front view of a head: cranium, cheeks, jaw and chin, with ears and a neck.
  const head = 'M110 16 C150 16 172 46 172 86 C172 112 166 132 154 148 C142 164 126 176 110 176 C94 176 78 164 66 148 C54 132 48 112 48 86 C48 46 70 16 110 16 Z';
  const rr = (i) => { const x = Math.sin(i * 78.233) * 43758.5453; return x - Math.floor(x); };
  // A jittered grid of vertices, joined into triangles, clipped to the head outline.
  const pts = [];
  for (let r = 0; r <= 13; r++) {
    const row = [];
    for (let c = 0; c <= 10; c++) row.push([40 + c * 14 + (rr(r * 31 + c) - 0.5) * 6 + (r % 2) * 7, 10 + r * 14 + (rr(r * 17 + c * 3) - 0.5) * 6]);
    pts.push(row);
  }
  const tri = [];
  for (let r = 0; r < 13; r++) for (let c = 0; c < 10; c++) {
    const [a1, b1, c1, d1] = [pts[r][c], pts[r][c + 1], pts[r + 1][c], pts[r + 1][c + 1]];
    tri.push(`M${a1[0].toFixed(1)} ${a1[1].toFixed(1)} L${b1[0].toFixed(1)} ${b1[1].toFixed(1)} L${d1[0].toFixed(1)} ${d1[1].toFixed(1)} Z M${a1[0].toFixed(1)} ${a1[1].toFixed(1)} L${c1[0].toFixed(1)} ${c1[1].toFixed(1)} L${d1[0].toFixed(1)} ${d1[1].toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 400 200">
      <T x="0" y="12" sm dim>photo</T>
      <rect x="0" y="22" width="120" height="150" rx="6" />
      <ellipse cx="60" cy="86" rx="28" ry="34" className="mt-faint" />
      <path d="M48 80 h6 M66 80 h6 M60 86 v10 M51 104 q9 6 18 0 M22 172 q38 -46 76 0" className="mt-faint" />
      <path d="M134 97 H196 l-6 -5 M196 97 l-6 5" />
      <T x="136" y="88" sm dim>SMIRK + GNM</T>
      <g transform="translate(200 0)">
        <T x="70" y="12" sm dim>3D head mesh</T>
        <defs><clipPath id="headclip"><path d={head} /></clipPath></defs>
        <path d="M94 170 V196 M126 170 V196" className="mt-outline" />
        <path d="M49 82 C40 82 40 108 52 112 M171 82 C180 82 180 108 168 112" className="mt-outline" />
        <g clipPath="url(#headclip)">
          <path d={tri.join(' ')} className="mt-wire" />
          <path d="M78 82 q10 -7 20 0 q-10 6 -20 0 Z M122 82 q10 -7 20 0 q-10 6 -20 0 Z M110 88 L104 112 h12 M96 132 q14 9 28 0" className="mt-feature" />
          <path d="M40 0 H180" className="mt-scan" />
        </g>
        <path d={head} className="mt-outline" />
      </g>
    </svg>
  );
}

// Fine-tuning: training and validation loss over epochs, with the best checkpoint marked where
// validation loss is lowest.
function Loss() {
  const r = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
  const N = 46, X0 = 40, W = 330, H = 150, Y0 = 172;
  const train = Array.from({ length: N }, (_, i) => 130 * Math.exp(-i / 11) + 14 + (r(i) - 0.5) * 6);
  const val = Array.from({ length: N }, (_, i) => 130 * Math.exp(-i / 13) + 26 + Math.max(0, i - 28) * 0.9 + (r(i + 50) - 0.5) * 5);
  const best = val.indexOf(Math.min(...val));
  const xp = (i) => X0 + (i / (N - 1)) * W;
  const path = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${xp(i).toFixed(1)} ${(Y0 - (v / 150) * H).toFixed(1)}`).join(' ');
  return (
    <svg viewBox="0 0 400 210">
      <path d={`M${X0} 12 V${Y0} H${X0 + W + 10}`} />
      {[0, 10, 20, 30, 40].map((e) => <g key={e}><path d={`M${xp(e)} ${Y0} v5`} /><T x={xp(e)} y={Y0 + 18} anchor="middle" sm dim>{e}</T></g>)}
      <T x={X0 + W} y="206" anchor="end" sm dim>epochs</T>
      <T x="0" y="16" sm dim>loss</T>
      <path d={path(val)} className="mt-dashline" />
      <path d={path(train)} pathLength="1" className="mt-line-hi mt-draw" />
      <path d={`M${xp(best)} 20 V${Y0}`} className="mt-faint" strokeDasharray="3 4" />
      <circle cx={xp(best)} cy={Y0 - (val[best] / 150) * H} r="5" className="mt-dot" />
      <T x={xp(best) + 8} y="30" sm hi>best checkpoint</T>
      <g transform={`translate(${X0 + W - 92} 52)`}>
        <path d="M0 0 h18" className="mt-line-hi" /><T x="24" y="4" sm>train</T>
        <path d="M0 18 h18" className="mt-dashline" /><T x="24" y="22" sm>validation</T>
      </g>
    </svg>
  );
}

// Transformer: tokens are embedded, pass through N blocks of attention and feed-forward layers with
// residual connections, and come out as next-token probabilities. The active layer moves upward.
function Transformer() {
  const [ref, s] = useStep(6, 800, 5);
  const layers = [['embedding', 236], ['multi-head attention', 188], ['add & norm', 150], ['feed-forward', 112], ['add & norm', 74]];
  const active = s < 5 ? 4 - s : -1;
  const probs = [6, 10, 26, 8, 14, 5];
  return (
    <svg ref={ref} viewBox="0 0 250 300">
      {['The', 'cat', 'sat'].map((w, i) => <g key={w}><rect x={46 + i * 56} y="274" width="48" height="22" rx="4" /><T x={70 + i * 56} y="289" anchor="middle" sm>{w}</T></g>)}
      <path d="M125 274 V262" />
      {layers.map(([name, y], i) => (
        <g key={y}>
          <rect x="30" y={y} width="190" height="28" rx="6" className={4 - i === active ? 'mt-box-hi' : undefined} />
          <T x="125" y={y + 18} anchor="middle" sm hi={4 - i === active}>{name}</T>
          {i > 0 && <path d={`M125 ${y + 28} V${y + 38}`} />}
        </g>
      ))}
      <path d="M226 230 H238 V162 H226 M226 160 H238 V88 H226" className="mt-faint" />
      <rect x="22" y="64" width="206" height="160" rx="10" className="mt-faint" strokeDasharray="4 5" />
      <T x="236" y="150" sm dim anchor="end">× N</T>
      <path d="M125 74 V58" />
      <T x="125" y="16" anchor="middle" sm dim>next-token probabilities</T>
      {probs.map((p, i) => <rect key={i} x={74 + i * 18} y={52 - p} width="12" height={p} rx="2" className={i === 2 ? 'mt-fill-hi' : 'mt-fill'} />)}
    </svg>
  );
}

// The NVIDIA CI: GitHub asks for a Windows GPU run; the job waits in my job query service; a runner
// inside the cluster pulls it over an outbound connection (nothing outside can reach in); a fresh
// Windows VM with a passed-through GPU runs it; the result goes back to GitHub.
function JobQuery() {
  const [ref, s] = useStep(5, 1300, 4); // 0 queued, 1 runner asks, 2 job handed out, 3 VM runs, 4 passed
  return (
    <svg ref={ref} viewBox="0 0 470 240">
      <rect x="2" y="30" width="118" height="54" rx="7" />
      <T x="14" y="52">GitHub</T>
      <T x="14" y="70" sm dim>workflow run</T>
      <g className={s === 4 ? '' : 'mt-gone'}><rect x="14" y="96" width="76" height="22" rx="11" className="mt-chip" /><T x="52" y="111" anchor="middle" sm hi>passed</T></g>
      <rect x="160" y="16" width="140" height="132" rx="8" className="mt-box" />
      <T x="172" y="38">job query</T>
      <T x="172" y="54">service</T>
      {[0, 1, 2].map((k) => (
        <rect key={k} x="172" y={66 + k * 24} width="116" height="18" rx="4"
          className={k === 0 && s <= 1 ? 'mt-box-hi' : k === 0 ? 'mt-faint mt-dash' : undefined} />
      ))}
      <T x="180" y="79" sm hi={s <= 1}>{s <= 1 ? 'job: win-gpu-test' : ''}</T>
      <T x="180" y="103" sm dim>job: queued</T>
      <T x="180" y="127" sm dim>job: queued</T>
      <rect x="160" y="160" width="140" height="34" rx="6" />
      <T x="230" y="181" anchor="middle" sm>pre-run gateway</T>
      <path d="M120 57 H160" /><path d="M154 52 l6 5 l-6 5" />
      <rect x="322" y="6" width="146" height="230" rx="10" className="mt-faint" strokeDasharray="5 5" />
      <T x="334" y="26" sm dim>GPU cluster</T>
      <T x="334" y="42" sm dim>no inbound access</T>
      <rect x="336" y="56" width="118" height="44" rx="6" className={s === 1 || s === 2 ? 'mt-box-hi' : undefined} />
      <T x="348" y="76">runner pod</T>
      <T x="348" y="92" sm dim>polls for work</T>
      <path d="M336 78 H300" className="mt-line-hi" />
      <path d="M306 73 l-6 5 l6 5" className="mt-line-hi" />
      <T x="304" y="70" sm hi anchor="end">pull</T>
      <circle cx={s === 1 ? 312 : 326} cy="78" r="4.5" className={`mt-dot ${s === 1 ? '' : 'mt-gone'}`} />
      <circle cx={s === 2 ? 326 : 312} cy="88" r="4.5" className={`mt-dot ${s === 2 ? '' : 'mt-gone'}`} />
      <path d="M395 100 V128" />
      <rect x="336" y="128" width="118" height="92" rx="6" className={s === 3 ? 'mt-box-hi' : undefined} />
      <T x="348" y="150">Windows VM</T>
      <T x="348" y="167" sm dim>fresh per job</T>
      <rect x="348" y="180" width="40" height="18" rx="4" className="mt-chip" /><T x="368" y="193" anchor="middle" sm hi>GPU</T>
      {s === 3 ? <Spin x={430} y={150} /> : s === 4 ? <Check x={430} y={150} /> : <Wait x={430} y={150} />}
    </svg>
  );
}

const MOTIFS = { jobquery: JobQuery,  api: Api, pipeline: Pipeline, cluster: Cluster, attention: Attention, conv: Convolution, mesh: Mesh, loss: Loss, transformer: Transformer };

// A diagram in the layout. `tone` sets its highlight color. On the page it is wrapped in an Island
// (see Diagram below) so its animation runs in the browser.
export function Motif({ name, tone = 'accent', className = '' }) {
  const M = MOTIFS[name];
  return <div className={`motif ${className}`} style={{ '--hi': `var(--${tone})` }} aria-hidden="true"><M /></div>;
}
