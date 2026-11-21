import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { SITE, PAGE_META } from './data/site.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Every page the site has, with its output file and its relative path to the site root.
export function routes(posts) {
  return [
    { page: 'home', file: 'index.html', root: '' },
    { page: 'work', file: 'work/index.html', root: '../' },
    { page: 'projects', file: 'projects/index.html', root: '../' },
    { page: 'writing', file: 'writing/index.html', root: '../' },
    { page: 'about', file: 'about/index.html', root: '../' },
    ...posts.map((p) => ({ page: 'post', slug: p.slug, file: `writing/${p.slug}/index.html`, root: '../../', title: p.title, description: p.summary })),
    { page: '404', file: '404.html', root: '/' },
  ];
}

export function render(route) {
  const meta = route.page === 'post' ? { title: route.title, description: route.description } : PAGE_META[route.page];
  const title = meta.title === SITE.name ? SITE.name : `${meta.title} | ${SITE.name}`;
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:type" content="${route.page === 'post' ? 'article' : 'website'}">`,
    '<meta name="color-scheme" content="light dark">',
    '<meta name="theme-color" content="#100E0B">',
    `<link rel="preload" href="${route.root}assets/fonts/fira-sans-400.woff" as="font" type="font/woff" crossorigin>`,
    `<link rel="preload" href="${route.root}assets/fonts/bitter-var.woff" as="font" type="font/woff" crossorigin>`,
  ].join('\n');
  const html = renderToString(<App page={route.page} root={route.root} slug={route.slug || null} />);
  return { html, head };
}
