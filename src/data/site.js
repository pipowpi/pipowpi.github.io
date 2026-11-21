// Name, links and the short descriptions used in page titles and meta tags.
export const SITE = {
  name: 'Gopi Krishna Kanugula',
  short: 'Gopi',
  initials: 'GK',
  role: 'Systems and infrastructure engineer',
  description:
    'Systems and infrastructure engineer. CI/CD, GPU virtualization and MLOps, now studying vision-language models at Stony Brook University.',
  email: 'pi.kanugula@gmail.com',
  linkedin: 'https://linkedin.com/in/gopi-krishna-kanugula-0099a711a/',
  github: 'https://github.com/pipowpi',
  location: 'Stony Brook, NY',
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
  404: { title: 'Not found', description: 'Page not found.' },
};

