// Name, links and the short descriptions used in page titles and meta tags.
export const SITE = {
  name: 'Gopi Krishna Kanugula',
  short: 'Gopi',
  initials: 'GK',
  role: 'Systems and infrastructure engineer',
  description:
    'Systems and infrastructure engineer working on CI/CD, GPU virtualization and MLOps, now studying vision-language models at Stony Brook University.',
  email: 'pi.kanugula@gmail.com',
  linkedin: 'https://linkedin.com/in/gopi-krishna-kanugula-0099a711a/',
  github: 'https://github.com/pipowpi',
  location: 'Stony Brook, NY',
  // Where the site is served. Used for canonical links, the sitemap, the RSS feed and link previews.
  url: 'https://pipowpi.github.io/',
  availability: 'Open to roles from June 2027',
  seeking: 'Systems, infrastructure and applied AI roles',
};

export const NAV = [
  { key: 'work', label: 'Work', href: 'work/' },
  { key: 'projects', label: 'Projects', href: 'projects/' },
  { key: 'writing', label: 'Writing', href: 'writing/' },
  { key: 'about', label: 'About', href: 'about/' },
];

export const PAGE_META = {
  home: { title: SITE.name, description: SITE.description },
  work: { title: 'Work', description: 'CI/CD, GPU virtualization and MLOps work at NVIDIA and Abzooba, year by year.' },
  projects: {
    title: 'Projects',
    description:
      'Course and personal projects: 3D head reconstruction with GNM, a RISC-V CPU, a VLM project and an open GPU CI design.',
  },
  writing: {
    title: 'Writing',
    description: 'Notes and explainers on CI/CD, GPU virtualization, security and vision-language models.',
  },
  about: { title: 'About', description: 'About Gopi Krishna Kanugula: background, how I work, toolbox and education.' },
  styleguide: { title: 'Style guide', description: 'Tokens and components used on this site.' },
  404: { title: 'Not found', description: 'Page not found.' },
};


// One color per topic, used the same way everywhere (writing tags, toolbox, focus areas):
// lime for infrastructure and GPUs, teal for CI/CD, coral for ML platforms, pink for security,
// amber for vision and AI. Career stages and projects have their own colors in their data files.
export const TOPIC_TONE = {
  Infrastructure: 'lime', GPUs: 'lime', Virtualization: 'lime',
  'CI/CD': 'teal', 'CI/CD and observability': 'teal', DevOps: 'teal',
  MLOps: 'coral', 'ML and vision': 'coral', 'ML platforms': 'coral',
  Security: 'pink',
  VLMs: 'accent', 'Deep learning': 'accent', Vision: 'accent',
  Languages: 'ink', 'Backend and APIs': 'pink',
  'Infrastructure and DevOps': 'lime', 'CI/CD and monitoring': 'teal',
};
export const topicTone = (t) => TOPIC_TONE[t] || 'accent';
