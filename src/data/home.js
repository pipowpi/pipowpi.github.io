// Home page content. The home page is about who Gopi is and the phase he is in now;
// diagrams of the work itself live on the Work and Projects pages.

export const HERO = {
  hello: 'Hi, I’m Gopi.',
  title: 'I build the systems ML runs on. This year, I’m studying the models too.',
  lede:
    'Eight years in software: ML and CI platforms at Abzooba, then Windows GPU CI for PyTorch at NVIDIA. Now I’m doing an MS in Computer Science at Stony Brook, focused on computer vision and vision-language models.',
};

export const FACTS = [
  { n: '8+', label: 'years in software' },
  { n: '2', label: 'companies' },
  { n: '4', label: 'engineers mentored' },
  { n: 'May ’27', label: 'MS graduation' },
];

// This academic year, stop by stop. `state` drives the icon: running, queued.
export const PHASE = [
  { when: 'Fall 2026', what: 'This semester', state: 'running' },
  { when: 'Spring 2027', what: 'Final semester', state: 'queued' },
  { when: 'May 2027', what: 'Graduate', state: 'queued' },
  { when: 'June 2027', what: 'Available full-time', state: 'queued' },
];

export const NOW = [
  { icon: 'book', k: 'Studying', v: 'MS in Computer Science at Stony Brook University, with a focus on computer vision and vision-language models.' },
  { icon: 'wrench', k: 'Building', v: '3D head reconstruction with GNM, a RISC-V CPU and a VLM course project.', href: 'projects/' },
  { icon: 'sparkle', k: 'Learning', v: 'Agents and tool use, building small local agents against open models.' },
  { icon: 'target', k: 'Looking for', v: 'Systems, infrastructure and applied AI roles, starting June 2027.' },
];

// Eight years as a CI run. Stages pass one by one; the switch marks the move to NVIDIA
// (new company, role and team); the pivot marks the move from industry to the MS; the MS is the
// running stage; the full-time role is the deploy job, waiting for review.
export const CAREER_STEPS = [
  { kind: 'stage', time: '2017 - 2020', name: 'Learn the craft', tone: 'pink', org: 'Abzooba', role: 'Associate, then Software Engineer', sub: 'Chatbot services and their integrations' },
  { kind: 'stage', time: '2020 - 2022', name: 'Make it scale', tone: 'teal', org: 'Abzooba', role: 'Senior Software Engineer', sub: 'DataOps versioning on Pachyderm and MinIO, production Kubernetes' },
  { kind: 'stage', time: '2022 - 2024', name: 'Own the platform', tone: 'coral', org: 'Abzooba', role: 'Lead Product Engineer', sub: 'Core architect of the Xpresso.ai MLOps platform, mentored 4 engineers' },
  { kind: 'switch', time: 'Jan 2025', name: 'Switch', tone: 'ink', org: 'New role, new team', sub: 'From leading MLOps product engineering to system software at NVIDIA' },
  { kind: 'stage', time: '2025 - 2026', name: 'Bring Windows GPUs to CI', tone: 'lime', org: 'NVIDIA', role: 'Senior System Software Engineer', sub: 'Led the design of Windows GPU CI for PyTorch on Kubernetes' },
  { kind: 'pivot', time: '2026', name: 'Pivot', tone: 'accent', org: 'Industry to an MS', sub: 'To stop treating models and LLMs as a black box, and understand them well enough to build better infrastructure for them' },
  { kind: 'stage', time: '2026 - 2027', name: 'Go deeper into vision and AI', tone: 'accent', org: 'Stony Brook', role: 'MS in Computer Science', why: 'Why: to understand the models I build infrastructure for', sub: 'Computer vision, VLMs and systems' },
  { kind: 'deploy', time: 'June 2027', name: 'Deploy: full-time role', tone: 'accent', org: 'Waiting for review', sub: 'Systems, infrastructure and applied AI' },
];

export const PILLARS = [
  { icon: 'gpu', title: 'GPU and virtualization', sub: 'Windows VMs on Kubernetes with GPU passthrough', href: 'work/#pytorch-ci' },
  { icon: 'shield', title: 'CI/CD and security', sub: 'Pull-based runners, STRIDE threat modeling', href: 'work/#pytorch-ci' },
  { icon: 'layers', title: 'ML platforms and vision', sub: 'MLOps platforms, now 3D faces and VLMs', href: 'projects/' },
];
