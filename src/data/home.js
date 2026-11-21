export const HERO = {
  lead: 'I build the infrastructure behind',
  rotating: ['CI pipelines.', 'GPU clusters.', 'ML platforms.'],
  lede:
    '8 years in software, the last 6 building ML and CI platforms at Abzooba and NVIDIA. Now an MS in Computer Science student at Stony Brook, studying vision-language models and writing about how things work.',
};

export const PILLARS = [
  { icon: 'gpu', title: 'GPU and virtualization', sub: 'Windows VMs on Kubernetes with GPU passthrough', href: 'work/#pytorch-ci' },
  { icon: 'shield', title: 'CI/CD and security', sub: 'Pull-based runners, STRIDE threat modeling', href: 'work/#pytorch-ci' },
  { icon: 'layers', title: 'ML platforms and vision', sub: 'MLOps at scale, now 3D faces and VLMs', href: 'projects/' },
];

// The career shown as a CI run: finished steps, the running step and the queued one.
export const CAREER_STEPS = [
  { state: 'done', kind: 'build', name: 'Abzooba (UST)', time: '2017 - 2024', sub: 'Product engineering, then DataOps and reliability, then lead architect of an MLOps platform' },
  { state: 'done', kind: 'build', name: 'NVIDIA', time: '2025 - 2026', sub: 'Senior System Software Engineer, Windows GPU CI for PyTorch' },
  { state: 'running', kind: 'train', name: 'MS in Computer Science', time: 'running', sub: 'Stony Brook University, graduating May 2027' },
  { state: 'queued', kind: 'deploy', name: 'Full-time role', time: 'queued', sub: 'Systems, infrastructure or applied AI, from June 2027' },
];

export const STATUS_LINES = [
  ['status', 'MS CS student, Stony Brook'],
  ['graduating', 'May 2027'],
  ['seeking', 'systems, infra, applied AI roles'],
  ['available', 'June 2027'],
  ['building', '3D head model, RISC-V CPU'],
  ['learning', 'agents and tool use'],
];

