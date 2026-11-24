// Projects, grouped by where they come from. status: 'live' (in progress) or 'planned'.
export const HEAD = {
  id: 'head-reconstruction',
  icon: 'face',
  tone: 'pink',
  context: 'CSE 527 Computer Vision, course project',
  status: 'live',
  title: '3D head reconstruction: swapping FLAME for GNM in SMIRK',
  short: 'Swapping FLAME for GNM in SMIRK',
  glance: [
    ['Input', 'One face photo'],
    ['Output', 'A 3D head mesh with expression'],
    ['The change', 'FLAME head model replaced by GNM'],
    ['Data', 'Fine-tuned on FEED'],
  ],
  milestones: { done: 4, total: 7 },
  why:
    'SMIRK estimates a 3D face from a single photo by predicting parameters for the FLAME head model. GNM is a newer head model whose 383 expression controls are grouped by face region and include teeth and tongue. The goal is to swap it in, fine-tune on the FEED dataset, and compare the result against the original SMIRK.',
  flow: [
    { name: 'Face image', sub: 'A single photograph' },
    { name: 'Encoders', sub: 'Predict identity, expression and pose' },
    { name: 'GNM', strike: 'FLAME', sub: 'Parameters become a 3D mesh', link: 'swap', highlight: true },
    { name: 'Render + rebuild', sub: 'The rebuilt face is compared with the input' },
  ],
  flowNote: 'Comparing the rebuilt face with the photo is the training signal, so no 3D labels are needed.',
  // Numbers from the interface mapping done so far.
  vertices: { flame: 5023, gnm: 17821 },
  gnmParams: [
    { value: 253, label: 'identity coefficients' },
    { value: 383, label: 'expression coefficients' },
  ],
  done: [
    'Ran the pretrained SMIRK baseline and inspected its parameters, mesh and reconstruction.',
    'Unblocked FLAME loading by converting its Chumpy-dependent model file to NumPy data.',
    'Traced the encoders, renderer, image translator and training losses.',
    "Mapped GNM’s interface: 253 identity and 383 expression coefficients, and 17,821 vertices against FLAME’s 5,023.",
  ],
  next: [
    'Connect GNM to the encoders and renderer, with new landmark and face-mask mappings.',
    'Revise FLAME-specific losses and confirm training works on a small subset.',
    'Fine-tune on FEED and evaluate against SMIRK on held-out images.',
  ],
};

export const COURSE = [
  {
    id: 'riscv',
    icon: 'cpu',
  tone: 'teal',
    context: 'Computer Architecture',
    status: 'live',
    title: 'RISC-V CPU',
    text: 'Designing and building a RISC-V processor for the graduate computer architecture course. Details and results to follow.',
    diagram: 'riscv',
    diagramTitle: 'One load instruction going through the five steps every RISC-V core performs.',
    stages: [
      ['Fetch', 'Read the instruction at the PC'],
      ['Decode', 'Read registers, build the immediate'],
      ['Execute', 'ALU result or branch target'],
      ['Memory', 'Loads and stores'],
      ['Write back', 'Result into the register file'],
    ],
  },
  {
    id: 'vlm',
    icon: 'eye',
  tone: 'coral',
    context: 'Vision-language models',
    status: 'live',
    title: 'VLM course project',
    text: 'An applied project for the graduate vision-language models course. Code and write-up after the semester.',
    diagram: 'vlm',
    diagramTitle: 'The pipeline the project builds on: patches, a vision encoder, an adapter, then the language model.',
    stages: [
      ['Image', 'Cut into patches'],
      ['Vision encoder', 'One embedding per patch'],
      ['Adapter', 'Maps into the LLM space'],
      ['Language model', 'Reads image and text tokens'],
    ],
    link: ['How a VLM sees an image', 'writing/how-a-vlm-sees-an-image/'],
  },
];

export const PERSONAL = [
  {
    id: 'open-ci',
    icon: 'server',
  tone: 'lime',
    context: 'CI/CD and Kubernetes',
    status: 'planned',
    title: 'Open version of the GPU CI design',
    text: 'A from-scratch, public version of the pull-based GPU CI I designed and built at NVIDIA, built with open tools and no proprietary code, with a full write-up.',
    diagram: 'pullloop',
    diagramTitle: 'The pull loop: every job gets a fresh VM, and nothing outside the cluster reaches in.',
    loop: ['Runner asks for a job', 'Job service hands one out', 'Fresh VM runs it', 'Result reported, VM destroyed'],
    link: ['See the original case study', 'work/#pytorch-ci'],
  },
  {
    id: 'this-site',
    icon: 'code',
    context: 'Web, React',
    status: 'live',
    title: 'This portfolio',
    text: 'React and Tailwind, rendered to static HTML at build time and hydrated in the browser, so it runs on GitHub Pages with no server.',
    stages: [
      ['Content', 'Markdown posts and data files'],
      ['Build', 'React renders every page to HTML'],
      ['GitHub Pages', 'Serves plain files'],
      ['Browser', 'Hydrates for the interactive parts'],
    ],
  },
];
