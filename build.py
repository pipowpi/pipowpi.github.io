#!/usr/bin/env python3
"""Build the static portfolio site for GitHub Pages.

No dependencies beyond the Python 3 standard library.

    python3 build.py

Reads:
  content/pages/home.html, work.html, about.html   page bodies
  content/posts/*.md                                blog posts (front matter + simple Markdown)
Writes:
  index.html, work/, writing/, writing/<slug>/, about/, 404.html

Post front matter (between --- lines):
  title, summary, date (YYYY-MM-DD), read (e.g. "5 min"), tags (comma separated), draft (true/false)
Markdown supported in posts: "## " headings, paragraphs separated by blank lines,
``` fenced code blocks, and `inline code`.

Links are relative, so the site works both as https://<user>.github.io/ and as
https://<user>.github.io/<repo>/.
"""

import datetime
import html
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))

SITE = {
    'name': 'Gopi Krishna Kanugula',
    'description': 'Systems and infrastructure engineer. CI/CD, GPU virtualization and MLOps, now studying vision-language models at Stony Brook University.',
    'email': 'pi.kanugula@gmail.com',
    'linkedin': 'https://linkedin.com/in/gopi-krishna-kanugula-0099a711a/',
    'github': 'https://github.com/pipowpi',
    'location': 'Stony Brook, NY',
    # Set to False to leave posts marked "draft: true" out of the build entirely.
    'show_drafts': True,
}

TOOLS = ['Kubernetes', 'KubeVirt', 'VFIO', 'QEMU/KVM', 'GitHub Actions', 'Docker', 'Terraform',
         'Ansible', 'PyTorch', 'ONNX Runtime', 'Databricks', 'Airflow', 'MLflow', 'Prometheus',
         'Grafana', 'FastAPI', 'Python', 'C++', 'AWS', 'GCP', 'Azure', 'STRIDE']

esc = html.escape

# Simple stroke icons, drawn for this site. Use {{icon:name}} in page bodies.
ICON_PATHS = {
    'gpu': '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="9" cy="12" r="3"/><path d="M15 10h4M15 14h4M6 18v2M10 18v2M14 18v2"/>',
    'shield': '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    'layers': '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    'gauge': '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/><circle cx="12" cy="18" r="1.2"/>',
    'database': '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    'convert': '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
    'cpu': '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    'face': '<path d="M12 3c-4 0-7 3-7 7.5 0 3 1.3 5.6 3.5 7.2V21h7v-3.3c2.2-1.6 3.5-4.2 3.5-7.2C19 6 16 3 12 3z"/><path d="M9.5 10.5h.01M14.5 10.5h.01"/><path d="M9.5 14.5c1.4 1 3.6 1 5 0"/>',
    'eye': '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>',
    'branch': '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 7v10"/><path d="M18 9c0 4-4 5-10 8"/>',
    'server': '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    'code': '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    'book': '<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z"/><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>',
    'wrench': '<path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-3-1-1-3z"/>',
    'sparkle': '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
    'target': '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12h.01"/>',
    'briefcase': '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    'pen': '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
}
TAG_ICONS = {'CI/CD': 'branch', 'Security': 'shield', 'Virtualization': 'gpu', 'GPUs': 'gpu',
             'VLMs': 'eye', 'Deep learning': 'layers'}


def icon(name):
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON_PATHS[name] + '</svg>')


def apply_icons(text):
    return re.sub(r'\{\{icon:([a-z]+)\}\}', lambda m: icon(m.group(1)) if m.group(1) in ICON_PATHS else m.group(0), text)



# ---------------------------------------------------------------- content
def read(path):
    with open(os.path.join(HERE, path), encoding='utf-8') as f:
        return f.read()


def write(path, text):
    full = os.path.join(HERE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(text)


def parse_post(name, raw):
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', raw, re.S)
    if not m:
        raise SystemExit('Missing front matter in ' + name)
    meta = {}
    for line in m.group(1).splitlines():
        if ':' in line:
            k, v = line.split(':', 1)
            meta[k.strip()] = v.strip()
    date = datetime.date.fromisoformat(meta['date'])
    return {
        'slug': name[:-3],
        'title': meta['title'],
        'summary': meta.get('summary', ''),
        'date': date,
        'date_label': date.strftime('%b %Y'),
        'read': meta.get('read', ''),
        'tags': [t.strip() for t in meta.get('tags', '').split(',') if t.strip()],
        'draft': meta.get('draft', 'false').lower() == 'true',
        'body': m.group(2),
    }


def inline(text):
    parts = re.split(r'(`[^`]+`)', text)
    out = []
    for p in parts:
        if p.startswith('`') and p.endswith('`') and len(p) > 1:
            out.append('<code>' + esc(p[1:-1]) + '</code>')
        else:
            out.append(esc(p, quote=False))
    return ''.join(out)


def markdown(md):
    out, para, code, in_code = [], [], [], False

    def flush():
        if para:
            out.append('<p>' + inline(' '.join(para)) + '</p>')
            para.clear()

    for line in md.splitlines():
        if line.strip().startswith('```'):
            if in_code:
                out.append('<pre><code>' + esc('\n'.join(code)) + '</code></pre>')
                code.clear()
                in_code = False
            else:
                flush()
                in_code = True
            continue
        if in_code:
            code.append(line)
        elif line.startswith('## '):
            flush()
            out.append('<h2>' + inline(line[3:].strip()) + '</h2>')
        elif not line.strip():
            flush()
        else:
            para.append(line.strip())
    flush()
    return '\n'.join(out)


def load_posts():
    folder = os.path.join(HERE, 'content', 'posts')
    posts = [parse_post(n, read(os.path.join('content', 'posts', n)))
             for n in sorted(os.listdir(folder)) if n.endswith('.md')]
    if not SITE['show_drafts']:
        posts = [p for p in posts if not p['draft']]
    posts.sort(key=lambda p: p['date'], reverse=True)
    return posts


# ---------------------------------------------------------------- layout
ICON_SUN = ('<svg class="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            'stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/>'
            '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>')
ICON_MOON = ('<svg class="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
             'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
             '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>')

# Runs before the page paints, so a saved theme never flashes. Dark is the default.
THEME_BOOT = ("<script>(function(){var t='dark';try{var s=localStorage.getItem('gkk-theme');"
              "if(s==='light'||s==='dark'){t=s;}}catch(e){}document.documentElement.setAttribute('data-theme',t);})();</script>")


def layout(title, description, root, active, body, extra=''):
    nav = ''.join(
        '<a href="{r}{href}"{cur}>{label}</a>'.format(
            r=root, href=href, label=label,
            cur=' aria-current="page"' if active == key else '')
        for key, label, href in [('work', 'Work', 'work/'), ('projects', 'Projects', 'projects/'), ('writing', 'Writing', 'writing/'), ('about', 'About', 'about/')])
    full_title = title if title == SITE['name'] else title + ' | ' + SITE['name']
    return '''<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#100E0B">
<link rel="icon" href="{r}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="{r}assets/css/site.css">
{boot}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="{r}" aria-label="{name}, home"><span class="mono-mark">GK</span><span class="brand-name">{name}</span></a>
    <div class="header-right">
      <nav class="nav" aria-label="Main">{nav}</nav>
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Switch to light mode">{sun}{moon}</button>
    </div>
  </div>
</header>
<main id="main" class="page">
{extra}{body}
</main>
<footer class="site-footer wrap">
  <div class="tile cta reveal">
    <div>
      <p class="cta-title">Let's build something.</p>
      <p class="desc" style="margin-top:6px;">Open to systems, infrastructure and applied AI roles from June 2027.</p>
    </div>
    <a class="btn btn-primary" href="mailto:{email}">{email}</a>
  </div>
  <div class="foot-row">
    <span class="meta">{location}</span>
    <div class="foot-links">
      <a class="plain-link" href="{linkedin}" target="_blank" rel="noopener">LinkedIn &#8599;</a>
      <a class="plain-link" href="{github}" target="_blank" rel="noopener">GitHub &#8599;</a>
    </div>
  </div>
</footer>
<script src="{r}assets/js/site.js" defer></script>
</body>
</html>
'''.format(title=esc(full_title), desc=esc(description), r=root, boot=THEME_BOOT, name=esc(SITE['name']),
           nav=nav, sun=ICON_SUN, moon=ICON_MOON, body=body, extra=extra, email=SITE['email'],
           location=esc(SITE['location']), linkedin=SITE['linkedin'], github=SITE['github'])


def short_meta(p):
    return ('Draft · ' if p['draft'] else '') + p['date_label']


# ---------------------------------------------------------------- pages
def build_home(posts):
    root = ''
    if posts:
        rows = ''.join(
            '<a class="post-row" href="{r}writing/{slug}/"><div><p class="title" style="font-size:16px;">{t}</p>'
            '<p class="desc" style="font-size:14px;margin-top:2px;">{s}</p></div>'
            '<p class="meta">{m} <span class="go">&rarr;</span></p></a>'.format(
                r=root, slug=p['slug'], t=esc(p['title']), s=esc(p['summary']), m=esc(short_meta(p)))
            for p in posts[:3])
        recent = '<div>' + rows + '</div>'
    else:
        recent = '<p class="desc">First posts are on the way.</p>'
    tools = ''.join('<span class="pill">{}</span>'.format(esc(t)) for t in TOOLS + TOOLS)
    body = (read('content/pages/home.html').replace('{{root}}', root)
            .replace('{{recent_posts}}', recent).replace('{{tools}}', tools))
    body = apply_icons(body)
    write('index.html', layout(SITE['name'], SITE['description'], root, 'home', body))


def build_simple(key, title, description):
    root = '../'
    body = apply_icons(read('content/pages/{}.html'.format(key)).replace('{{root}}', root))
    write('{}/index.html'.format(key), layout(title, description, root, key, body))


def build_writing(posts):
    root = '../'
    tags = []
    for p in posts:
        for t in p['tags']:
            if t not in tags:
                tags.append(t)
    chips = ''.join('<button class="chip" type="button" data-filter="{t}" aria-pressed="{on}">{t}</button>'.format(
        t=esc(t), on='true' if t == 'All' else 'false') for t in ['All'] + tags)
    cards = ''.join(
        '<a class="tile post-card" href="{slug}/" data-tags="{dt}">'
        '<div class="card-head" style="justify-content:space-between;"><span class="ic">{ic}</span><span class="meta">{m}</span></div>'
        '<p class="card-title">{t}</p><p class="desc" style="margin-top:8px;">{s}</p>'
        '<div class="post-foot"><span class="tag">{tags}</span><span class="read-chip">{rd}</span></div></a>'.format(
            slug=p['slug'], dt=esc('|'.join(p['tags'])), tags=esc(' · '.join(p['tags'])),
            ic=icon(TAG_ICONS.get(p['tags'][0] if p['tags'] else '', 'pen')),
            rd=esc(p['read'] + ' read') if p['read'] else '',
            m=esc(short_meta(p)), t=esc(p['title']), s=esc(p['summary']))
        for p in posts)
    body = '''<div class="wrap">
  <section class="page-head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;">
    <div>
      <p class="eyebrow">Writing</p>
      <h1 class="page-h1" style="margin-top:10px;">Notes and explainers</h1>
      <p class="desc">Concepts I have worked with, explained the way I wish someone had explained them to me.</p>
    </div>
    <div class="filters" role="group" aria-label="Filter posts by topic">{chips}</div>
  </section>
  <div class="two">{cards}</div>
  <div class="tile pad" data-empty {hidden}><p class="desc">First posts are on the way.</p></div>
</div>'''.format(chips=chips if posts else '', cards=cards, hidden='hidden' if posts else '')
    write('writing/index.html', layout('Writing', 'Notes and explainers on CI/CD, GPU virtualization, security and vision-language models.', root, 'writing', body))


def build_post(posts, i):
    p = posts[i]
    root = '../../'
    newer = posts[i - 1] if i > 0 else None
    older = posts[i + 1] if i + 1 < len(posts) else None
    nav = ''
    if newer or older:
        prev_html = ('<a class="tile" href="../{s}/"><p class="meta">&larr; Newer</p><p class="title" style="margin-top:6px;font-size:15.5px;">{t}</p></a>'
                     .format(s=newer['slug'], t=esc(newer['title'])) if newer else '<div></div>')
        next_html = ('<a class="tile next" href="../{s}/"><p class="meta">Older &rarr;</p><p class="title" style="margin-top:6px;font-size:15.5px;">{t}</p></a>'
                     .format(s=older['slug'], t=esc(older['title'])) if older else '')
        nav = '<nav class="two post-nav" aria-label="More posts">' + prev_html + next_html + '</nav>'
    draft = ('<p class="draft-note">Draft. This post is still being written and reviewed.</p>' if p['draft'] else '')
    meta = short_meta(p) + (' · ' + p['read'] + ' read' if p['read'] else '') + (' · ' + ', '.join(p['tags']) if p['tags'] else '')
    body = '''<div class="progress" aria-hidden="true"></div>
<div class="wrap">
  <article class="article">
    <a class="text-link" href="../" style="color:var(--muted);">&larr; Writing</a>
    <p class="meta" style="margin-top:24px;">{meta}</p>
    <h1 class="page-h1">{title}</h1>
    <p class="dek">{summary}</p>
    {draft}
    <div class="prose">
{content}
    </div>
    {nav}
  </article>
</div>'''.format(meta=esc(meta), title=esc(p['title']), summary=esc(p['summary']), draft=draft,
                 content=markdown(p['body']), nav=nav)
    write('writing/{}/index.html'.format(p['slug']), layout(p['title'], p['summary'], root, 'writing', body))


def build_404():
    # GitHub Pages serves this for unknown paths at any depth, so links here are root-absolute.
    body = '''<div class="wrap"><section class="page-head" style="padding-bottom:40px;">
  <p class="eyebrow">404</p>
  <h1 class="page-h1" style="margin-top:10px;">This job was never queued.</h1>
  <p class="desc">The page you are looking for does not exist. Try the home page instead.</p>
  <p style="margin-top:24px;"><a class="btn btn-primary" href="/">Go home <span class="go">&rarr;</span></a></p>
</section></div>'''
    page = layout('Not found', 'Page not found.', '/', '', body)
    write('404.html', page)


def main():
    posts = load_posts()
    build_home(posts)
    build_simple('work', 'Work', 'CI/CD, GPU virtualization and MLOps work at NVIDIA and Abzooba.')
    build_simple('projects', 'Projects', 'Course and personal projects: 3D head reconstruction with GNM, a RISC-V CPU, a VLM project and an open GPU CI design.')
    build_simple('about', 'About', 'About Gopi Krishna Kanugula: background, current focus, toolbox and education.')
    build_writing(posts)
    for i in range(len(posts)):
        build_post(posts, i)
    build_404()
    print('Built {} pages ({} posts).'.format(6 + len(posts), len(posts)))


if __name__ == '__main__':
    main()
