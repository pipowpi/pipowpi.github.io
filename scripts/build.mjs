#!/usr/bin/env node
// Build the portfolio: React pages are rendered to static HTML (one file per route) in dist/.
// Only the interactive parts (islands) run React in the browser.
//
//   npm run build            the live site: published posts only
//   npm run build:preview    the same, plus posts marked draft: true (also what npm run dev shows)
//
// Needs: react, react-dom, esbuild, tailwindcss (v4). No other build tooling.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WATCH = process.argv.includes('--watch');

// Resolve packages from ./node_modules first, then from EXTRA_NODE_PATH (used in sandboxes
// where packages are preinstalled globally instead of with npm install).
const extraPaths = (process.env.EXTRA_NODE_PATH || '').split(path.delimiter).filter(Boolean);
const require = createRequire(path.join(ROOT, 'package.json'));
function resolvePkg(id) {
  return require.resolve(id, { paths: [ROOT, ...extraPaths] });
}
const esbuild = await import(pathToFileURL(resolvePkg('esbuild')).href);
const tailwind = await import(pathToFileURL(resolvePkg('tailwindcss')).href.replace(/lib\.js$/, 'lib.mjs'));
const tailwindDir = path.dirname(resolvePkg('tailwindcss/package.json'));

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
function write(p, text) {
  const full = path.join(ROOT, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

// The built site goes to dist/ (or OUT_DIR). It is not committed: GitHub Actions builds it on every
// push to main and deploys it to GitHub Pages (.github/workflows/deploy.yml).
const OUT = path.resolve(ROOT, process.env.OUT_DIR || 'dist');
function writeOut(p, text) {
  const full = path.join(OUT, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}
// The output folder is deleted and rebuilt on every build, so refuse anything that is not clearly
// a build folder: it must sit inside the project, must not be the project itself or one of its
// source folders, and, if it already has files in it, must carry the marker an earlier build left.
const MARKER = '.portfolio-build';
const SOURCE_DIRS = new Set(['src', 'content', 'assets', 'scripts', 'tests', 'docs', 'design-system', 'node_modules', '.git', '.github']);
function checkOut() {
  const rel = path.relative(ROOT, OUT);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) throw new Error(`OUT_DIR must be a folder inside the project, not ${OUT}`);
  if (SOURCE_DIRS.has(rel.split(path.sep)[0])) throw new Error(`OUT_DIR must not be inside a source folder: ${rel}`);
  if (!fs.existsSync(OUT)) return;
  const files = fs.readdirSync(OUT);
  // dist/ from builds made before the marker existed is still accepted.
  if (files.length && !files.includes(MARKER) && rel !== 'dist') {
    throw new Error(`${rel}/ has files that this build did not make (no ${MARKER} marker). Empty or remove it first.`);
  }
}
// Start from an empty output folder with the static files (fonts, favicon) copied in.
function resetOut() {
  checkOut();
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, MARKER), 'Made by scripts/build.mjs. This folder is deleted and rebuilt on every build.\n');
  for (const dir of ['assets/fonts', 'assets/img']) {
    fs.cpSync(path.join(ROOT, dir), path.join(OUT, dir), { recursive: true });
  }
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
}

// ------------------------------------------------------------------ posts
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Typographer's quotes and ellipses for prose (never applied inside code).
export function smart(text) {
  return text
    .replace(/(^|[\s([{\u2014\u2013-])"/g, '$1\u201c').replace(/"/g, '\u201d')
    .replace(/(^|[\s([{\u2014\u2013-])'/g, '$1\u2018').replace(/'/g, '\u2019')
    .replace(/\.\.\./g, '\u2026');
}

// Posts are Markdown (GitHub flavour: headings, lists, links, images, tables, code). marked turns
// them into HTML at build time; quotes in prose become typographer's quotes, code is left alone,
// headings get ids for linking, and links to other sites open in a new tab.
const markedMod = await import(pathToFileURL(resolvePkg('marked')).href);
const Marked = markedMod.Marked || markedMod.default.Marked;
const slugify = (t) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const md = new Marked({ gfm: true });
md.use({
  walkTokens(token) {
    if (token.type === 'text' && !token.tokens) token.text = smart(token.text);
  },
  renderer: {
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens);
      return `<h${depth} id="${slugify(html)}">${html}</h${depth}>\n`;
    },
    code({ text, lang }) {
      return `<pre translate="no"><code${lang ? ` class="language-${esc(lang)}"` : ''}>${esc(text)}</code></pre>\n`;
    },
    link({ href, title, tokens }) {
      const html = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href);
      return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${html}</a>`;
    },
    image({ href, title, text }) {
      return `<img src="${esc(href)}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy" decoding="async">`;
    },
  },
});
const markdown = (src) => md.parse(src);

// Posts marked `draft: true` are left out of the live site. They are included, with a "Draft"
// label, in preview builds (SHOW_DRAFTS=true, npm run build:preview) and in npm run dev.
const SHOW_DRAFTS = process.env.SHOW_DRAFTS === 'true' || WATCH;

function loadPosts() {
  const dir = path.join(ROOT, 'content', 'posts');
  const posts = fs.readdirSync(dir).filter((n) => n.endsWith('.md')).map((name) => {
    const raw = fs.readFileSync(path.join(dir, name), 'utf8');
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!m) throw new Error('Missing front matter in ' + name);
    const meta = {};
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    const words = m[2].split(/\s+/).filter(Boolean).length;
    return {
      slug: name.replace(/\.md$/, ''),
      title: smart(meta.title),
      summary: smart(meta.summary || ''),
      date: meta.date,
      read: meta.read || Math.max(1, Math.round(words / 220)) + ' min',
      words,
      tags: (meta.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      draft: (meta.draft || 'false').toLowerCase() === 'true',
      diagram: meta.diagram || null,
      caption: smart(meta.caption || ''),
      html: markdown(m[2]),
    };
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

// ------------------------------------------------------------------ tailwind
async function buildCss() {
  const input = read('src/styles.css');
  const compiler = await tailwind.compile(input, {
    base: path.join(ROOT, 'src'),
    loadStylesheet: async (id, base) => {
      let file;
      if (id === 'tailwindcss') file = path.join(tailwindDir, 'index.css');
      else if (id.startsWith('tailwindcss/')) file = path.join(tailwindDir, id.slice('tailwindcss/'.length));
      else file = path.resolve(base, id);
      return { path: file, base: path.dirname(file), content: fs.readFileSync(file, 'utf8') };
    },
  });
  // Candidate scanning: every token that could be a class name in the sources.
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(jsx?|json)$/.test(e.name)) files.push(p);
    }
  };
  walk(path.join(ROOT, 'src'));
  const candidates = new Set();
  for (const f of files) {
    for (const tok of fs.readFileSync(f, 'utf8').split(/[\s"'`{}]+/)) {
      if (tok && tok.length < 120) candidates.add(tok);
    }
  }
  const css = compiler.build([...candidates]);
  const min = await esbuild.transform(css, { loader: 'css', minify: true });
  return min.code;
}

// ------------------------------------------------------------------ bundles
const nodePaths = extraPaths;
const common = {
  bundle: true,
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  nodePaths,
  logLevel: 'warning',
  define: { 'process.env.NODE_ENV': '"production"' },
};

// The browser bundle is split: app-*.js is small plain JavaScript that runs on every page (theme and
// motion toggles, phone panels, pausing animations off screen). React and the island components load
// as separate chunks, and only on pages that have an island.
async function buildClient() {
  const res = await esbuild.build({
    ...common,
    entryPoints: { app: path.join(ROOT, 'src/entry-client.jsx') },
    format: 'esm',
    splitting: true,
    minify: true,
    target: ['es2020'],
    outdir: path.join(OUT, 'assets/js'),
    entryNames: '[name]-[hash]',
    chunkNames: 'chunk-[hash]',
    write: false,
  });
  return res.outputFiles.map((f) => ({ file: path.relative(OUT, f.path), text: f.text }));
}

async function loadServer() {
  const outfile = path.join(ROOT, '.build', 'server.mjs');
  await esbuild.build({
    ...common,
    entryPoints: [path.join(ROOT, 'src/entry-server.jsx')],
    platform: 'node',
    format: 'esm',
    // react-dom/server is CommonJS and calls require() for Node built-ins.
    banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
    outfile,
  });
  return import(pathToFileURL(outfile).href + '?t=' + Date.now());
}

// ------------------------------------------------------------------ html
function page({ head, body, root, data, cssHref, jsHref }) {
  // The boot script runs before first paint: it applies the saved theme and motion choice, and adds
  // the "js" class that lets phone panels start folded (without JavaScript they stay open).
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
<link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${root}${cssHref}">
<script>(function(){var d=document.documentElement,t='dark',s=null;d.classList.add('js');try{s=localStorage.getItem('gkk-theme');if(s==='light'||s==='dark'){t=s;}if(localStorage.getItem('gkk-motion')==='off'){d.setAttribute('data-motion','off');}}catch(e){}d.setAttribute('data-theme',t);if(s==='light'||s==='dark'){var c=t==='dark'?'#121316':'#F4F4F2';document.querySelectorAll('meta[name=theme-color]').forEach(function(m){m.setAttribute('content',c);});}})();</script>
</head>
<body>
<div id="root">${body}</div>
<script type="application/json" id="page-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
<script type="module" src="${root}${jsHref}"></script>
</body>
</html>
`;
}

async function build() {
  const t0 = Date.now();
  const all = loadPosts();
  const posts = SHOW_DRAFTS ? all : all.filter((p) => !p.draft);
  write('src/generated/posts.json', JSON.stringify(posts, null, 2) + '\n');
  // Drafts left out of this build: only their titles are shown, as "in review", on the Writing page.
  const upcoming = all.filter((p) => !posts.includes(p)).map(({ slug, title, summary, tags, diagram }) => ({ slug, title, summary, tags, diagram }));
  write('src/generated/upcoming.json', JSON.stringify(upcoming, null, 2) + '\n');

  const [css, js, server] = await Promise.all([buildCss(), buildClient(), loadServer()]);
  const hash = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
  resetOut();
  // File names carry a content hash, so browsers can cache them for as long as they like.
  const cssHref = `assets/app-${hash(css)}.css`;
  writeOut(cssHref, css);
  for (const f of js) writeOut(f.file, f.text);
  const jsHref = js.find((f) => /assets\/js\/app-[^/]+\.js$/.test(f.file)).file;

  const routes = server.routes(posts);
  for (const r of routes) {
    const { html, head } = server.render(r);
    writeOut(r.file, page({ head, body: html, root: r.root, data: { page: r.page, root: r.root, slug: r.slug || null }, cssHref, jsHref }));
  }
  for (const [file, text] of Object.entries(server.extras(routes, posts))) writeOut(file, text);
  fs.rmSync(path.join(ROOT, '.build'), { recursive: true, force: true });
  console.log(`Built ${routes.length} pages (${posts.length} posts) into ${path.relative(ROOT, OUT) || '.'}/ in ${Date.now() - t0} ms.`);
}

await build();

if (WATCH) {
  let timer = null;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((e) => console.error(e.message)), 120);
  };
  for (const dir of ['src', 'content']) {
    fs.watch(path.join(ROOT, dir), { recursive: true }, (ev, file) => {
      if (file && !String(file).includes('generated')) rebuild();
    });
  }
  console.log('Watching src/ and content/ for changes...');
}
