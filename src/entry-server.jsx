import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { SITE, PAGE_META } from './data/site.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Every page the site has, with its output file and its relative path to the site root.
// `index: false` keeps a page out of search results and the sitemap.
export function routes(posts) {
  return [
    { page: 'home', file: 'index.html', root: '' },
    { page: 'work', file: 'work/index.html', root: '../' },
    { page: 'projects', file: 'projects/index.html', root: '../' },
    { page: 'writing', file: 'writing/index.html', root: '../' },
    { page: 'about', file: 'about/index.html', root: '../' },
    ...posts.map((p) => ({ page: 'post', slug: p.slug, file: `writing/${p.slug}/index.html`, root: '../../', title: p.title, description: p.summary, date: p.date, index: !p.draft })),
    { page: 'styleguide', file: 'styleguide/index.html', root: '../', index: false },
    { page: '404', file: '404.html', root: '/', index: false },
  ];
}

const urlOf = (route) => SITE.url + route.file.replace(/index\.html$/, '');

// Structured data: who the site is about (home), and what each post is (posts).
function jsonLd(route, url) {
  if (route.page === 'home') {
    return { '@context': 'https://schema.org', '@type': 'Person', name: SITE.name, url, email: `mailto:${SITE.email}`, jobTitle: SITE.role, sameAs: [SITE.linkedin, SITE.github], alumniOf: ['Stony Brook University', 'IIT Kharagpur'] };
  }
  if (route.page === 'post') {
    return { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: route.title, description: route.description, datePublished: route.date, url, author: { '@type': 'Person', name: SITE.name, url: SITE.url } };
  }
  return null;
}

export function render(route) {
  const meta = route.page === 'post' ? { title: route.title, description: route.description } : PAGE_META[route.page];
  const title = meta.title === SITE.name ? SITE.name : `${meta.title} | ${SITE.name}`;
  const url = urlOf(route);
  const ld = jsonLd(route, url);
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    route.index === false ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:type" content="${route.page === 'post' ? 'article' : 'website'}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${SITE.url}assets/img/og.png">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<link rel="alternate" type="application/rss+xml" title="${esc(SITE.name)}: writing" href="${route.root}writing/feed.xml">`,
    '<meta name="color-scheme" content="light dark">',
    '<meta name="theme-color" content="#121316">',
    `<link rel="preload" href="${route.root}assets/fonts/fira-sans-400.woff" as="font" type="font/woff" crossorigin>`,
    `<link rel="preload" href="${route.root}assets/fonts/bitter-var.woff" as="font" type="font/woff" crossorigin>`,
    ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n');
  const html = renderToString(<App page={route.page} root={route.root} slug={route.slug || null} />);
  return { html, head };
}

// Files that are not pages: the sitemap, robots.txt and the RSS feed of published posts.
export function extras(routes, posts) {
  const today = new Date().toISOString().slice(0, 10);
  const listed = routes.filter((r) => r.index !== false);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${listed.map((r) => `  <url><loc>${urlOf(r)}</loc><lastmod>${r.date || today}</lastmod></url>`).join('\n')}
</urlset>
`;
  const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE.url}sitemap.xml\n`;
  const published = posts.filter((p) => !p.draft);
  const rfc = (d) => new Date(`${d}T12:00:00Z`).toUTCString();
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(SITE.name)}: writing</title>
  <link>${SITE.url}writing/</link>
  <atom:link href="${SITE.url}writing/feed.xml" rel="self" type="application/rss+xml" />
  <description>${esc(PAGE_META.writing.description)}</description>
  <language>en</language>
${published.map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${SITE.url}writing/${p.slug}/</link>
    <guid>${SITE.url}writing/${p.slug}/</guid>
    <pubDate>${rfc(p.date)}</pubDate>
    <description>${esc(p.summary)}</description>
  </item>`).join('\n')}
</channel>
</rss>
`;
  return { 'sitemap.xml': sitemap, 'robots.txt': robots, 'writing/feed.xml': feed };
}
