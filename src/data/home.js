// Home page content. The home page is about who Gopi is and the phase he is in now;
// diagrams of the work itself live on the Work and Projects pages.

export const HERO = {
  hello: 'Hi, I’m Gopi.',
  title: 'I build the systems that help teams develop, test and ship software.',
  lede: [
    'It might be a web app, an ML model or an LLM agent. Over eight years at Abzooba and NVIDIA, I’ve worked on most of the stack behind them. I’ve written Python APIs, set up and monitored machines, managed infrastructure as code and built CI/CD pipelines. Most recently, I designed and built Windows GPU CI for PyTorch at NVIDIA. When something breaks, I can find the cause at any layer, from the OS to the code to the database.',
    'I’m now studying for an MS in Computer Science at Stony Brook, focusing on computer vision and vision-language models. I want to understand the models as well as I understand the infrastructure around them.',
  ],
};

export const FACTS = [
  { n: '8+', label: 'years in software', tone: 'pink' },
  { n: '2', label: 'companies', tone: 'teal' },
  { n: '4', label: 'engineers mentored', tone: 'coral' },
  { n: 'May ’27', label: 'MS graduation', tone: 'lime' },
];

// This academic year, stop by stop. `state` drives the icon: running, queued.
export const PHASE = [
  { when: 'Fall 2026', what: 'This semester', state: 'running' },
  { when: 'Spring 2027', what: 'Final semester', state: 'queued' },
  { when: 'May 2027', what: 'Graduate', state: 'queued' },
  { when: 'June 2027', what: 'Available full-time', state: 'queued' },
];

export const NOW = [
  { icon: 'book', tone: 'accent', k: 'Studying', v: 'Computer vision and vision-language models, as part of my MS in Computer Science at Stony Brook.' },
  { icon: 'wrench', tone: 'pink', k: 'Building', v: 'A 3D head reconstruction model built on GNM, a RISC-V CPU, and a project for my vision-language models course.', href: 'projects/' },
  { icon: 'sparkle', tone: 'teal', k: 'Learning', v: 'How agents use tools. I’m building small agents that run locally on open models.' },
  { icon: 'target', tone: 'lime', k: 'Looking for', v: 'A full-time role in systems, infrastructure or applied AI, starting June 2027.' },
];

// Eight years as a CI run. Stages pass one by one; the switch marks the move to NVIDIA
// (new company, role and team); the pivot marks the move from industry to the MS; the MS is the
// running stage; the full-time role is the deploy job, waiting for review.
export const CAREER_STEPS = [
  { kind: 'stage', time: '2017 - 2020', name: 'Learn the craft', tone: 'pink', org: 'Abzooba', role: 'Associate, then Software Engineer', sub: 'Chatbot services and their integrations' },
  { kind: 'stage', time: '2020 - 2022', name: 'Make it scale', tone: 'teal', org: 'Abzooba', role: 'Senior Software Engineer', sub: 'DataOps versioning on Pachyderm and MinIO, production Kubernetes' },
  { kind: 'stage', time: '2022 - 2024', name: 'Own the platform', tone: 'coral', org: 'Abzooba', role: 'Lead Product Engineer', sub: 'Core architect of the Xpresso.ai MLOps platform, mentored 4 engineers' },
  { kind: 'switch', time: 'Jan 2025', name: 'Switch', tone: 'ink', org: 'New role, new team', sub: 'From leading MLOps product engineering to system software at NVIDIA' },
  { kind: 'stage', time: '2025 - 2026', name: 'Bring Windows GPUs to CI', tone: 'lime', org: 'NVIDIA', role: 'Senior System Software Engineer', sub: 'Designed and built Windows GPU CI for PyTorch on Kubernetes' },
  { kind: 'pivot', time: '2026', name: 'Pivot', tone: 'accent', org: 'Industry to an MS', sub: 'To stop treating models and LLMs as a black box, and understand them well enough to build better infrastructure for them' },
  { kind: 'stage', time: '2026 - 2027', name: 'Go deeper into vision and AI', tone: 'accent', org: 'Stony Brook', role: 'MS in Computer Science', why: 'Why: to understand the models I build infrastructure for', sub: 'Computer vision, VLMs and systems' },
  { kind: 'deploy', time: 'June 2027', name: 'Deploy: full-time role', tone: 'accent', org: 'Waiting for review', sub: 'Systems, infrastructure and applied AI' },
];

// The areas I work in, colored by topic (see TOPIC_TONE in site.js).
export const PILLARS = [
  { icon: 'code', tone: 'ink', title: 'Backend and APIs', sub: 'Python APIs, file handling and data services, and the databases behind them', href: 'work/#xpresso' },
  { icon: 'server', tone: 'lime', title: 'Infrastructure and DevOps', sub: 'Infrastructure as code, machine setup, Kubernetes and GPU virtualization', href: 'work/#pytorch-ci' },
  { icon: 'branch', tone: 'teal', title: 'CI/CD and monitoring', sub: 'Pipelines from build to deploy, Windows GPU CI, Prometheus and Grafana', href: 'work/#pytorch-ci' },
  { icon: 'layers', tone: 'coral', title: 'ML platforms and vision', sub: 'MLOps platforms, and now 3D faces and vision-language models', href: 'projects/' },
];
