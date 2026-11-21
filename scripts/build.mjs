#!/usr/bin/env node
// Build the portfolio: React pages are rendered to static HTML (one file per route)
// and hydrated in the browser. Output goes to the repo root so GitHub Pages can serve
// it as-is: index.html, work/, projects/, writing/, about/, 404.html, assets/app.*.
//
//   npm run build            (after npm install)
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

// ------------------------------------------------------------------ posts
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Typographer's quotes and ellipses for prose (never applied inside code).
export function smart(text) {
  return text
    .replace(/(^|[\s([{\u2014\u2013-])"/g, '$1\u201c').replace(/"/g, '\u201d')
    .replace(/(^|[\s([{\u2014\u2013-])'/g, '$1\u2018').replace(/'/g, '\u2019')
    .replace(/\.\.\./g, '\u2026');
}

function inline(text) {
  return text.split(/(`[^`]+`)/).map((part) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 1
      ? '<code translate="no">' + esc(part.slice(1, -1)) + '</code>'
      : esc(smart(part))
  ).join('');
}

// The same small Markdown subset the old build.py supported: "## " headings, paragraphs,
// fenced code blocks and `inline code`.
function markdown(md) {
  const out = [];
  let para = [];
  let code = [];
  let inCode = false;
  const flush = () => {
    if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; }
  };
  for (const line of md.split('\n')) {
    if (line.trim().startsWith('```')) {
      if (inCode) { out.push('<pre translate="no"><code>' + esc(code.join('\n')) + '</code></pre>'); code = []; inCode = false; }
      else { flush(); inCode = true; }
      continue;
    }
    if (inCode) code.push(line);
    else if (line.startsWith('## ')) { flush(); out.push('<h2>' + inline(line.slice(3).trim()) + '</h2>'); }
    else if (!line.trim()) flush();
    else para.push(line.trim());
  }
  flush();
  return out.join('\n');
}

// Drafts are listed with a "Draft" label. Set SHOW_DRAFTS to false (or run with SHOW_DRAFTS=false)
// to leave every post marked `draft: true` out of the site.
const SHOW_DRAFTS = process.env.SHOW_DRAFTS !== 'false';

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
      html: markdown(m[2]),
    };
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return SHOW_DRAFTS ? posts : posts.filter((p) => !p.draft);
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

async function buildClient() {
  const res = await esbuild.build({
    ...common,
    entryPoints: [path.join(ROOT, 'src/entry-client.jsx')],
    format: 'iife',
    minify: true,
    target: ['es2019'],
    write: false,
  });
  return res.outputFiles[0].text;
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
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
<link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${root}${cssHref}">
<script>(function(){var d=document.documentElement,t='dark',s=null;try{s=localStorage.getItem('gkk-theme');if(s==='light'||s==='dark'){t=s;}if(localStorage.getItem('gkk-motion')==='off'){d.setAttribute('data-motion','off');}}catch(e){}d.setAttribute('data-theme',t);if(s==='light'||s==='dark'){var c=t==='dark'?'#121316':'#F4F4F2';document.querySelectorAll('meta[name=theme-color]').forEach(function(m){m.setAttribute('content',c);});}})();</script>
</head>
<body>
<div id="root">${body}</div>
<script type="application/json" id="page-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
<script src="${root}${jsHref}" defer></script>
</body>
</html>
`;
}

async function build() {
  const t0 = Date.now();
  const posts = loadPosts();
  write('src/generated/posts.json', JSON.stringify(posts, null, 2) + '\n');

  const [css, js, server] = await Promise.all([buildCss(), buildClient(), loadServer()]);
  const hash = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
  write('assets/app.css', css);
  write('assets/app.js', js);
  const cssHref = 'assets/app.css?v=' + hash(css);
  const jsHref = 'assets/app.js?v=' + hash(js);

  const routes = server.routes(posts);
  for (const r of routes) {
    const { html, head } = server.render(r);
    write(r.file, page({ head, body: html, root: r.root, data: { page: r.page, root: r.root, slug: r.slug || null }, cssHref, jsHref }));
  }
  fs.rmSync(path.join(ROOT, '.build'), { recursive: true, force: true });
  console.log(`Built ${routes.length} pages (${posts.length} posts) in ${Date.now() - t0} ms.`);
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
