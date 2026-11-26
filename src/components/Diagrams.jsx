// Diagrams: small labelled drawings of the systems this site is about, drawn literally so each one
// reads as the real thing. Every one shows work Gopi did or exactly what its section covers:
// an API service, a CI pipeline with a Windows RTX lane, a VM with a passed-through GPU on Kubernetes,
// the Xpresso MLOps lifecycle and its DataOps layer, the job query service, a photo turned into a 3D
// head mesh, a RISC-V instruction moving through a core, a VLM reading an image, the pull loop, push
// versus pull, and STRIDE on a CI cluster. Each has one slow animation that shows how it works.
// Decorative: aria-hidden, with the meaning in a caption next to it.
//
// No React in the browser: each drawing is a function of its step `s`, and Motif prerenders one SVG
// per step, stacked. entry-client.jsx shows them in turn (data-step) while the drawing is on screen
// and motion is allowed; otherwise the resting step stays up. Each STEPS entry is
// [number of steps, ms per step, resting step].

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

// Arrowheads: r, l, u, d point right, left, up and down, with the tip at (x, y).
const Head = ({ x, y, dir = 'r', hi }) => {
  const d = { r: `M${x - 6} ${y - 5} L${x} ${y} L${x - 6} ${y + 5}`, l: `M${x + 6} ${y - 5} L${x} ${y} L${x + 6} ${y + 5}`,
    u: `M${x - 5} ${y + 6} L${x} ${y} L${x + 5} ${y + 6}`, d: `M${x - 5} ${y - 6} L${x} ${y} L${x + 5} ${y - 6}` }[dir];
  return <path d={d} className={hi ? 'mt-line-hi' : undefined} />;
};
// A box with a title and an optional second line. `hi` highlights it.
const Box = ({ x, y, w, h, title, sub, hi, center, box }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="7" className={hi ? 'mt-box-hi' : box ? 'mt-box' : undefined} />
    {title && <T x={center ? x + w / 2 : x + 12} y={sub ? y + h / 2 - 3 : y + h / 2 + 5} anchor={center ? 'middle' : undefined} hi={hi}>{title}</T>}
    {sub && <T x={center ? x + w / 2 : x + 12} y={y + h / 2 + 14} anchor={center ? 'middle' : undefined} sm dim>{sub}</T>}
  </g>
);

// Backend: a client calls an API service, which writes to a database and to file storage.
function Api({ s }) {
  return (
    <svg viewBox="0 0 420 190">
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

// CI/CD: a push triggers build, two test jobs (one on a Windows RTX runner) and ship. Below, the
// monitoring side: Prometheus scrapes metrics from the runners and Grafana shows them.
function Pipeline({ s }) { // 0 build running, 1 tests running, 2 ship running, 3-4 all passed
  const st = (stage) => (s > stage ? 'pass' : s === stage ? 'run' : 'wait');
  const Job = ({ x, y, w = 112, name, stage }) => {
    const k = st(stage);
    return (
      <g>
        <rect x={x} y={y} width={w} height="34" rx="6" className={k === 'run' ? 'mt-box-hi' : undefined} />
        {k === 'pass' ? <Check x={x + 16} y={y + 17} /> : k === 'run' ? <Spin x={x + 16} y={y + 17} /> : <Wait x={x + 16} y={y + 17} />}
        <T x={x + 30} y={y + 21} sm>{name}</T>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 430 190">
      <rect x="2" y="44" width="70" height="30" rx="15" /><T x="37" y="63" anchor="middle" sm>push</T>
      <Job x={88} y={42} w={104} name="build" stage={0} />
      <Job x={212} y={6} w={146} name="linux tests" stage={1} />
      <Job x={212} y={78} w={146} name="windows rtx" stage={1} />
      <Job x={374} y={42} w={56} name="ship" stage={2} />
      <path d="M72 59 H88 M192 59 H202 V23 H212 M202 59 V95 H212 M358 23 H366 V59 H374 M358 95 H366 V59" />
      <path d="M285 112 V124 H77 V132" className="mt-faint mt-dash" />
      <T x="92" y="118" sm dim>metrics</T>
      <Box x={2} y={132} w={150} h={50} title="Prometheus" sub="scrapes metrics" />
      <path d="M152 157 H180" /><Head x={180} y={157} />
      <Box x={180} y={132} w={248} h={50} title="Grafana" sub="dashboards, alerts" />
      <path d="M330 170 L346 162 L360 166 L374 152 L390 158 L404 146 L418 150" className="mt-line-hi" />
    </svg>
  );
}

// GPU passthrough on Kubernetes (KubeVirt + VFIO): the GPU is taken from the host driver and bound
// to vfio-pci, with the IOMMU keeping its memory access in bounds; the device plugin advertises it;
// the VM's pod asks for it; and the Windows VM gets the real GPU.
function GpuVm({ s }) { // 0 host driver owns it, 1 bound to vfio-pci, 2 pod asks for gpu1, 3 passed into the VM
  return (
    <svg viewBox="0 0 440 220">
      <rect x="2" y="2" width="436" height="216" rx="10" className="mt-faint" strokeDasharray="5 5" />
      <T x="14" y="22" sm dim>Kubernetes node</T>
      <rect x="14" y="32" width="252" height="124" rx="8" className={s === 2 ? 'mt-box-hi' : 'mt-box'} />
      <T x="26" y="52" sm dim>VM pod (KubeVirt)</T>
      <rect x="26" y="62" width="228" height="82" rx="6" className={s === 3 ? 'mt-box-hi' : undefined} />
      <T x="38" y="84" hi={s === 3}>Windows VM</T>
      <T x="38" y="102" sm dim>{s === 3 ? 'its own driver sees the GPU' : 'asks for gpus: gpu1'}</T>
      <g className={s === 3 ? '' : 'mt-gone'}><rect x="38" y="114" width="44" height="20" rx="4" className="mt-chip" /><T x="60" y="128" anchor="middle" sm hi>GPU</T></g>
      <Box x={290} y={32} w={136} h={46} title="device plugin" sub="advertises gpu1" hi={s === 2} />
      <path d="M290 55 H266" className={s === 2 ? 'mt-line-hi' : 'mt-faint'} />
      <rect x="290" y="96" width="136" height="60" rx="7" className={s === 3 ? 'mt-box-hi' : undefined} />
      <T x="302" y="118">physical GPU</T>
      <T x="302" y="138" sm hi={s >= 1} dim={s < 1}>{s === 0 ? 'driver: nvidia' : 'driver: vfio-pci'}</T>
      <path d="M290 126 H254" className={s === 3 ? 'mt-line-hi' : 'mt-faint'} /><Head x={254} y={126} dir="l" hi={s === 3} />
      <g className={s === 3 ? '' : 'mt-gone'}><T x="272" y="118" anchor="middle" sm hi>VFIO</T></g>
      <path d="M358 156 V172" className="mt-faint" />
      <rect x="14" y="172" width="412" height="36" rx="6" className="mt-box" />
      <T x="26" y="195">host kernel</T>
      <rect x="290" y="180" width="128" height="20" rx="4" className={s >= 1 ? 'mt-chip' : 'mt-faint'} />
      <T x="354" y="194" anchor="middle" sm hi={s >= 1} dim={s < 1}>IOMMU group</T>
    </svg>
  );
}

// Xpresso.ai: the MLOps lifecycle as a loop, with the DataOps layer (the part Gopi built) marked.
// The highlight moves round the loop.
const LIFE = [['data', 'sources', 2, 14], ['DataOps', 'versioning', 158, 14], ['experiments', 'MLflow, DVC', 314, 14], ['serving', 'ONNX, FastAPI', 314, 132], ['deploy', 'Kubernetes', 158, 132]];
function Mlops({ s }) {
  return (
    <svg viewBox="0 0 440 190">
      {LIFE.map(([t, sub, x, y], i) => <Box key={t} x={x} y={y} w={124} h={46} title={t} sub={sub} hi={i === s} box={i === 1} />)}
      <rect x="176" y="68" width="88" height="20" rx="10" className="mt-chip" /><T x="220" y="82" anchor="middle" sm hi>my layer</T>
      <path d="M126 37 H158 M282 37 H314 M376 60 V132 M314 155 H282 M158 155 H64 V60" />
      <Head x={158} y={37} /><Head x={314} y={37} /><Head x={376} y={132} dir="d" /><Head x={282} y={155} dir="l" /><Head x={64} y={60} dir="u" />
      <T x="72" y="100" sm dim>new data,</T><T x="72" y="116" sm dim>new version</T>
    </svg>
  );
}

// The DataOps layer: connectors pull from SQL, NoSQL and cloud storage; every new batch becomes a
// new version of the dataset (Pachyderm, with MinIO as the store); Airflow pipelines take it on.
function DataOps({ s }) {
  const SRC = ['SQL', 'NoSQL', 'cloud storage'];
  return (
    <svg viewBox="0 0 440 200">
      {SRC.map((t, i) => (
        <g key={t}>
          <rect x="2" y={14 + i * 44} width="100" height="30" rx="6" className={i === s % 3 ? 'mt-box-hi' : undefined} />
          <T x="52" y={33 + i * 44} anchor="middle" sm hi={i === s % 3}>{t}</T>
          <path d={`M102 ${29 + i * 44} C118 ${29 + i * 44} 116 74 130 74`} className={i === s % 3 ? 'mt-line-hi' : undefined} />
        </g>
      ))}
      <Box x={130} y={50} w={92} h={48} title="connectors" center />
      <path d="M222 74 H250" /><Head x={250} y={74} />
      <rect x="250" y="8" width="188" height="132" rx="8" className="mt-box" />
      <T x="262" y="30">versioned data</T>
      <T x="262" y="48" sm dim>Pachyderm on MinIO</T>
      <path d="M268 96 H424" className="mt-faint" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k} className={k <= s ? '' : 'mt-gone'}>
          <circle cx={282 + k * 42} cy="96" r="7" className={k === s ? 'mt-dot' : undefined} />
          <T x={282 + k * 42} y="122" anchor="middle" sm dim={k !== s} hi={k === s}>{`v${k + 1}`}</T>
        </g>
      ))}
      <path d="M344 140 V158" /><Head x={344} y={158} dir="d" />
      <Box x={250} y={158} w={188} h={34} title="Airflow pipelines" center />
      <T x="2" y="166" sm dim>each new batch of</T><T x="2" y="182" sm dim>data is a new version</T>
    </svg>
  );
}

// RISC-V: one load instruction moving through the five steps every core performs. Accurate for
// any RISC-V core, pipelined or not.
const RV = [
  ['fetch', 'read the instruction at the PC'],
  ['decode', 'read x2, build the immediate 8'],
  ['execute', 'ALU adds x2 + 8: the address'],
  ['memory', 'load the word at that address'],
  ['write back', 'write the word into x5'],
];
function Riscv({ s }) {
  return (
    <svg viewBox="0 0 440 200">
      <T x="2" y="18">lw x5, 8(x2)</T>
      <T x="438" y="18" anchor="end" sm hi>{`${s + 1}. ${RV[s][0]}`}</T>
      <rect x="2" y="60" width="40" height="64" rx="6" className={s === 0 ? 'mt-box-hi' : undefined} /><T x="22" y="97" anchor="middle" sm hi={s === 0}>PC</T>
      <rect x="62" y="60" width="84" height="64" rx="6" className={s === 0 ? 'mt-box-hi' : undefined} />
      <T x="104" y="89" anchor="middle" sm hi={s === 0}>instruction</T><T x="104" y="105" anchor="middle" sm hi={s === 0}>memory</T>
      <rect x="166" y="60" width="76" height="64" rx="6" className={s === 1 || s === 4 ? 'mt-box-hi' : undefined} />
      <T x="204" y="97" anchor="middle" sm hi={s === 1 || s === 4}>registers</T>
      <path d="M262 60 L310 78 V106 L262 124 V100 L270 92 L262 84 Z" className={s === 2 ? 'mt-box-hi' : undefined} />
      <T x="291" y="97" anchor="middle" sm hi={s === 2}>ALU</T>
      <rect x="330" y="60" width="84" height="64" rx="6" className={s === 3 ? 'mt-box-hi' : undefined} />
      <T x="372" y="89" anchor="middle" sm hi={s === 3}>data</T><T x="372" y="105" anchor="middle" sm hi={s === 3}>memory</T>
      <path d="M42 92 H62 M146 92 H166 M242 92 H262 M310 92 H330" />
      <Head x={62} y={92} /><Head x={166} y={92} /><Head x={262} y={92} /><Head x={330} y={92} />
      <path d="M414 92 H430 V156 H232 V124" className={s === 4 ? 'mt-line-hi' : 'mt-faint'} /><Head x={232} y={124} dir="u" hi={s === 4} />
      {[['fetch', 74], ['decode', 204], ['execute', 286], ['memory', 372]].map(([t, x], i) => (
        <T key={t} x={x} y="142" anchor="middle" sm hi={s === i} dim={s !== i}>{t}</T>
      ))}
      <T x="331" y="174" anchor="middle" sm hi={s === 4} dim={s !== 4}>write back</T>
      <T x="2" y="194" sm dim>{RV[s][1]}</T>
    </svg>
  );
}

// A vision-language model: the image is cut into patches, a vision encoder embeds them, an adapter
// maps them into the language model's space, and they arrive as tokens next to the text prompt.
function Vlm({ s }) { // 0 patches, 1 encoder, 2 adapter, 3 language model
  const grid = 'M30 14 V126 M58 14 V126 M86 14 V126 M2 42 H114 M2 70 H114 M2 98 H114';
  return (
    <svg viewBox="0 0 440 200">
      <rect x="2" y="14" width="112" height="112" rx="4" />
      <circle cx="84" cy="40" r="11" className="mt-faint" />
      <path d="M2 112 Q30 70 58 92 T114 80" className="mt-faint" />
      <path d={grid} className={s === 0 ? 'mt-line-hi' : 'mt-faint'} style={{ strokeWidth: s === 0 ? 1.4 : undefined }} />
      <T x="2" y="146" sm hi={s === 0} dim={s !== 0}>16 patches</T>
      <path d="M114 70 H138" /><Head x={138} y={70} />
      <Box x={138} y={38} w={92} h={64} title="vision" sub="encoder" center hi={s === 1} />
      <path d="M230 70 H250" /><Head x={250} y={70} />
      <Box x={250} y={48} w={70} h={44} title="adapter" center hi={s === 2} />
      <path d="M320 70 H340" /><Head x={340} y={70} />
      <Box x={340} y={24} w={98} h={92} title="language" sub="model" center hi={s === 3} />
      <T x="140" y="146" sm dim>what the language model reads</T>
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={140 + k * 24} y="156" width="20" height="22" rx="4" className={s >= 2 ? 'mt-chip' : 'mt-faint mt-dash'} />
      ))}
      {[['what', 240, 44], ['is', 288, 26], ['this?', 318, 50]].map(([t, x, w]) => (
        <g key={t}><rect x={x} y="156" width={w} height="22" rx="4" /><T x={x + w / 2} y="171" anchor="middle" sm>{t}</T></g>
      ))}
      <T x="140" y="194" sm dim>image tokens, then the prompt</T>
    </svg>
  );
}

// The pull loop of the RTX CI design: ask, hand out, run in a fresh VM, report and destroy.
const LOOP = [['runner', 'asks for a job', 2, 8], ['job service', 'hands one out', 262, 8], ['fresh VM', 'runs the job', 262, 136], ['result reported', 'VM destroyed', 2, 136]];
function PullLoop({ s }) {
  return (
    <svg viewBox="0 0 440 190">
      {LOOP.map(([t, sub, x, y], i) => <Box key={t} x={x} y={y} w={176} h={46} title={t} sub={sub} hi={i === s} />)}
      <path d="M178 31 H262 M350 54 V136 M262 159 H178 M90 136 V54" />
      <Head x={262} y={31} /><Head x={350} y={136} dir="d" /><Head x={178} y={159} dir="l" /><Head x={90} y={54} dir="u" />
      <T x="220" y="92" anchor="middle" sm dim>once per job;</T>
      <T x="220" y="108" anchor="middle" sm dim>no VM is reused</T>
    </svg>
  );
}

// Push versus pull. Push needs a way into the worker's network; pull only needs the worker to reach out.
function PushPull({ s }) { // 0 push sends, 1 push arrives, 2 pull asks, 3 job comes back
  return (
    <svg viewBox="0 0 440 220">
      <T x="6" y="16" sm dim>push</T>
      <Box x={30} y={28} w={150} h={40} title="controller" center />
      <path d="M6 112 H95 M115 112 H204" className="mt-wall" />
      <T x="122" y="106" sm hi>open port</T>
      <path d="M105 68 V150" /><Head x={105} y={150} dir="d" />
      <Box x={30} y={150} w={150} h={40} title="worker" center hi={s === 1} />
      <T x="105" y="212" anchor="middle" sm dim>needs a way in</T>
      <g className={`mt-move ${s <= 1 ? '' : 'mt-gone'}`} style={{ transform: `translate(105px, ${s === 1 ? 140 : 78}px)` }}><circle r="5" className="mt-dot" /></g>

      <T x="236" y="16" sm dim>pull</T>
      <Box x={260} y={28} w={150} h={40} title="job service" center hi={s === 2} />
      <path d="M236 112 H434" className="mt-wall" />
      <path d="M335 150 V68" /><Head x={335} y={68} dir="u" />
      <T x="342" y="100" sm hi>outbound</T>
      <Box x={260} y={150} w={150} h={40} title="worker" center hi={s === 3} />
      <T x="335" y="212" anchor="middle" sm dim>nothing reaches in</T>
      <g className={`mt-move ${s >= 2 ? '' : 'mt-gone'}`} style={{ transform: `translate(327px, ${s === 2 ? 78 : 140}px)` }}><circle r="5" className="mt-dot" /></g>
    </svg>
  );
}

// STRIDE on a CI cluster: each letter sits on the part of the system it applies to most.
const STRIDE = [
  ['S', 'spoofing', 'forged webhook', 124, 50],
  ['T', 'tampering', 'altered images', 284, 132],
  ['R', 'repudiation', 'who ran this?', 268, 96],
  ['I', 'info disclosure', 'leaked secrets', 428, 150],
  ['D', 'denial of service', 'GPU hogged', 300, 28],
  ['E', 'elevation', 'VM escape', 428, 28],
];
function Stride({ s }) { // 0-5 one letter each, 6 all
  const cur = STRIDE[s];
  return (
    <svg viewBox="0 0 440 210">
      <rect x="130" y="4" width="308" height="202" rx="10" className="mt-faint" strokeDasharray="5 5" />
      <T x="142" y="20" sm dim>CI cluster</T>
      <Box x={2} y={28} w={100} h={44} title="source host" center />
      <path d="M102 50 H146" /><Head x={146} y={50} />
      <Box x={146} y={28} w={122} h={44} title="job service" center />
      <Box x={146} y={96} w={122} h={34} title="audit log" center />
      <Box x={146} y={156} w={122} h={34} title="base images" center />
      <rect x="300" y="28" width="128" height="82" rx="7" className="mt-box" />
      <T x="312" y="54">runner VM</T>
      <T x="312" y="74" sm dim>untrusted code</T>
      <Box x={300} y={150} w={128} h={40} title="secrets, logs" center />
      <path d="M268 50 H300 M207 72 V96 M268 173 H284 V90 H300 M364 110 V150" />
      <Head x={300} y={50} /><Head x={207} y={96} dir="d" /><Head x={300} y={90} />
      {STRIDE.map(([l, , , x, y], i) => (
        <g key={l}>
          <circle cx={x} cy={y} r="10" className={i === s ? 'mt-box-hi' : 'mt-chipsolid'} />
          <T x={x} y={y + 4} anchor="middle" sm hi={i === s}>{l}</T>
        </g>
      ))}
      {cur ? (
        <g>
          <T x="2" y="124" hi>{cur[0]}</T>
          <T x="2" y="144" sm>{cur[1]}</T>
          <T x="2" y="162" sm dim>{cur[2]}</T>
        </g>
      ) : (
        <g><T x="2" y="144" sm>six questions,</T><T x="2" y="162" sm dim>every part</T></g>
      )}
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

// RTX CI at NVIDIA: GitHub asks for a Windows RTX run; the job waits in my job query service; a runner
// inside the cluster pulls it over an outbound connection (nothing outside can reach in); a fresh
// Windows VM with a passed-through GPU runs it; the result goes back to GitHub.
function JobQuery({ s }) { // 0 queued, 1 runner asks, 2 job handed out, 3 VM runs, 4 passed
  return (
    <svg viewBox="0 0 470 240">
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
      <T x="180" y="79" sm hi={s <= 1}>{s <= 1 ? 'job: win-gpu' : ''}</T>
      <T x="180" y="103" sm dim>job: queued</T>
      <T x="180" y="127" sm dim>job: queued</T>
      <rect x="160" y="160" width="140" height="34" rx="6" />
      <T x="230" y="181" anchor="middle" sm>pre-run gateway</T>
      <path d="M120 57 H160" /><path d="M154 52 l6 5 l-6 5" />
      <rect x="322" y="6" width="146" height="230" rx="10" className="mt-faint" strokeDasharray="5 5" />
      <T x="334" y="26" sm dim>RTX cluster</T>
      <T x="334" y="42" sm dim>no inbound access</T>
      <rect x="336" y="56" width="118" height="44" rx="6" className={s === 1 || s === 2 ? 'mt-box-hi' : undefined} />
      <T x="348" y="76">runner pod</T>
      <T x="348" y="92" sm dim>polls for work</T>
      <path d="M336 78 H300" className="mt-line-hi" />
      <path d="M306 73 l-6 5 l6 5" className="mt-line-hi" />
      <T x="318" y="70" sm hi anchor="middle">pull</T>
      <circle cx={s === 1 ? 312 : 326} cy="78" r="4.5" className={`mt-dot ${s === 1 ? '' : 'mt-gone'}`} />
      <circle cx={s === 2 ? 326 : 312} cy="88" r="4.5" className={`mt-dot ${s === 2 ? '' : 'mt-gone'}`} />
      <path d="M395 100 V128" />
      <rect x="336" y="128" width="118" height="92" rx="6" className={s === 3 ? 'mt-box-hi' : undefined} />
      <T x="348" y="150">Windows VM</T>
      <T x="348" y="167" sm dim>fresh per job</T>
      <rect x="348" y="180" width="40" height="18" rx="4" className="mt-chip" /><T x="368" y="193" anchor="middle" sm hi>RTX</T>
      {s === 3 ? <Spin x={430} y={150} /> : s === 4 ? <Check x={430} y={150} /> : <Wait x={430} y={150} />}
    </svg>
  );
}

const MOTIFS = { api: Api, pipeline: Pipeline, gpuvm: GpuVm, mlops: Mlops, dataops: DataOps, jobquery: JobQuery, mesh: Mesh, riscv: Riscv, vlm: Vlm, pullloop: PullLoop, pushpull: PushPull, stride: Stride };
const STEPS = { api: [4, 900, 3], pipeline: [5, 1100, 4], gpuvm: [4, 1500, 3], mlops: [5, 1100, 1], dataops: [4, 1300, 3], jobquery: [5, 1300, 4], riscv: [5, 1300, 4], vlm: [4, 1300, 3], pullloop: [4, 1200, 1], pushpull: [4, 1200, 3], stride: [7, 1400, 6] };

// A diagram in the layout. `tone` sets its highlight color. Drawings with steps render one frame per
// step; the one matching data-step is shown (styles.css, .mt-f).
export function Motif({ name, tone = 'accent', className = '' }) {
  const M = MOTIFS[name];
  const [n, ms, rest] = STEPS[name] || [1, 0, 0];
  return (
    <div className={`motif ${className}`} style={{ '--hi': `var(--${tone})` }} aria-hidden="true"
      data-steps={n > 1 ? n : undefined} data-ms={n > 1 ? ms : undefined} data-rest={n > 1 ? rest : undefined} data-step={n > 1 ? rest : undefined}>
      {Array.from({ length: n }, (_, k) => <div key={k} className="mt-f" data-k={k}><M s={k} /></div>)}
    </div>
  );
}
