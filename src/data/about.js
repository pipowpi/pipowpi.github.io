export const BIO = [
  "I live in Stony Brook, NY, where I’m finishing an MS in Computer Science with a focus on computer vision and vision-language models. Before this I spent eight years in software. The first few were on product work, and the six after that were on platforms, first an MLOps platform at Abzooba and then a Windows GPU CI system for PyTorch at NVIDIA. I came back to school because I didn’t want to keep treating models and LLMs as a black box. I want to understand them well enough to build better infrastructure for them.",
  'The problems I enjoy most are the ones where the requirement is clear but the architecture isn’t. I also write a lot, mostly to make sure I really understand what I’m working on.',
];

// A different angle from the Work page: how I approach the job rather than what I shipped.
export const PRINCIPLES = [
  {
    icon: 'pen',
    tone: 'accent',
    title: 'Write it down to understand it',
    text: 'If I cannot explain a system in plain words, I do not understand it yet. Design notes and the posts on this site come from that habit.',
  },
  {
    icon: 'shield',
    tone: 'pink',
    title: 'Give the risky part the fewest doors',
    text: 'On the GPU CI work, runners pulled jobs so nothing outside the cluster needed a way in. I start security from the data flow, not the checklist.',
  },
  {
    icon: 'gauge',
    tone: 'teal',
    title: 'Measure before fixing',
    text: 'The 10-minute telemetry dashboards were a query problem. Finding the bottleneck first turned the fix into a change in how queries ran, and load times dropped to under a second.',
  },
  {
    icon: 'book',
    tone: 'coral',
    title: 'Teach what I learn',
    text: 'At Abzooba I ran regular DevOps and MLOps sessions and mentored 4 engineers. Explaining things to others is how I find the gaps in my own understanding.',
  },
];

export const NOW = [
  { k: 'Studying', tone: 'accent', icon: 'book', v: 'MS in Computer Science at Stony Brook University, expected May 2027.' },
  { k: 'Building', tone: 'pink', icon: 'wrench', v: '3D head reconstruction with GNM, a RISC-V CPU and a VLM project.', link: ['See projects', 'projects/'] },
  { k: 'Learning', tone: 'teal', icon: 'sparkle', v: 'Agents and tool use, building small local agents against open models with Ollama.' },
  { k: 'Looking for', tone: 'lime', icon: 'target', v: 'Systems, infrastructure and applied AI roles starting June 2027.' },
];

export const TOOLBOX = [
  { k: 'Infrastructure', items: ['Kubernetes', 'KubeVirt', 'VFIO', 'QEMU/KVM', 'Docker', 'Terraform', 'Ansible', 'AWS', 'GCP', 'Azure'] },
  { k: 'CI/CD and observability', items: ['GitHub Actions', 'Jenkins', 'Bamboo', 'Azure DevOps', 'Prometheus', 'Grafana', 'ELK'] },
  { k: 'ML and vision', items: ['PyTorch', 'ONNX Runtime', 'Databricks', 'Airflow', 'MLflow', 'DVC'] },
  { k: 'Languages', items: ['Python', 'C++', 'Bash', 'SQL', 'Node.js', 'FastAPI'] },
  { k: 'Security', items: ['STRIDE', 'Network policies', 'RBAC', 'JWT'] },
];

export const EDUCATION = [
  { date: 'Expected May 2027', title: 'MS in Computer Science', place: 'Stony Brook University (SUNY)', note: 'Computer vision, vision-language models, algorithms, computer architecture, systems security' },
  { date: 'May 2018', title: 'BTech in Computer Science and Engineering', place: 'IIT Kharagpur' },
];

export const FACTS = [
  { n: '8+', label: 'years in industry', tone: 'pink' },
  { n: '2', label: 'companies', tone: 'teal' },
  { n: '4', label: 'engineers mentored', tone: 'coral' },
  { n: '\u201927', label: 'MS graduation', tone: 'lime' },
];
