"""Responsive and interaction test for the built site (webapp-testing skill, Prompt 7).

Run it against a local static server, for example with the skill's helper:

    python with_server.py --server "python3 -m http.server 8000" --port 8000 -- \
        python3 tests/webapp_test.py --out .screens

It saves a full-page screenshot of every page at 390, 768, 1024 and 1440px, in light and dark (the
theme is saved before the page loads, the way a returning visitor's would be, and checked), and checks:
  - horizontal scroll (document wider than the viewport) and elements past the right edge;
  - text that spills out of its own box;
  - interactive elements that overlap each other or are covered (hit-tested at their center);
  - tap targets smaller than 24x24 CSS px;
  - console errors and failed requests;
  - that every button, toggle and nav link does what it should;
  - that each writing filter shows exactly the posts with that topic;
  - that pausing animations stops the home career run straight away, even mid-run;
  - that every link to another page of the site resolves (no links to unpublished drafts).
Works on the live build (drafts left out, possibly no posts) and on the preview build.
Exits 1 if any check fails.
"""
import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

PAGES = ['', 'work/', 'projects/', 'writing/', 'about/', 'styleguide/', '404.html']  # plus the first post, if any
SIZES = {'390': {'width': 390, 'height': 844}, '768': {'width': 768, 'height': 1024},
         '1024': {'width': 1024, 'height': 768}, '1440': {'width': 1440, 'height': 900}}

LAYOUT_JS = r"""
() => {
  const vw = document.documentElement.clientWidth;
  const out = { docWidth: document.documentElement.scrollWidth, vw, pastEdge: [], spill: [], overlap: [], covered: [], small: [] };
  const label = (el) => (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
  const visible = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0; };
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || el.closest('.sr-only, [aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && getComputedStyle(el).position !== 'fixed') {
      // Ignore children clipped by an overflow-hidden ancestor.
      let clipped = false;
      for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'clip' || o === 'auto') { clipped = true; break; } }
      if (!clipped) out.pastEdge.push(el.tagName + ' ' + label(el));
    }
    const st = getComputedStyle(el);
    if (st.overflowX === 'visible' && el.children.length === 0 && el.textContent.trim() && el.scrollWidth > el.clientWidth + 2 && st.display !== 'inline') out.spill.push(label(el));
  }
  const controls = [...document.querySelectorAll('a[href], button, summary')].filter((el) => visible(el) && !el.closest('.sr-only'));
  const rects = controls.map((el) => el.getBoundingClientRect());
  for (let i = 0; i < controls.length; i++) {
    const a = rects[i];
    if ((a.width < 24 || a.height < 24) && getComputedStyle(controls[i]).display !== 'inline') out.small.push(label(controls[i]) + ` ${Math.round(a.width)}x${Math.round(a.height)}`);
    for (let j = i + 1; j < controls.length; j++) {
      if (controls[i].contains(controls[j]) || controls[j].contains(controls[i])) continue;
      const b = rects[j];
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ix > 2 && iy > 2) out.overlap.push(label(controls[i]) + ' / ' + label(controls[j]));
    }
  }
  return out;
}
"""

# Hit-test each control at its center after scrolling it into view: something else on top means it can't be clicked.
COVERED_JS = r"""
(i) => {
  const el = [...document.querySelectorAll('a[href], button, summary')].filter((e) => e.getBoundingClientRect().width > 0 && !e.closest('.sr-only'))[i];
  if (!el) return null;
  el.scrollIntoView({ block: 'center' });
  const r = el.getBoundingClientRect();
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return { ok: !!hit && (el === hit || el.contains(hit)), label: (el.getAttribute('aria-label') || el.textContent).trim().slice(0, 40), hit: hit ? hit.tagName + '.' + String(hit.className).slice(0, 40) : null };
}
"""


def check_page(page, url, shot):
    errors = []
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('requestfailed', lambda r: errors.append('failed: ' + r.url))
    resp = page.goto(url)
    page.wait_for_load_state('networkidle')
    page.screenshot(path=shot, full_page=True)
    res = page.evaluate(LAYOUT_JS)
    res['theme'] = page.evaluate("document.documentElement.dataset.theme")
    res['links'] = page.evaluate("[...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(location.origin))")
    n = page.evaluate("document.querySelectorAll('a[href], button, summary').length")
    covered = []
    for i in range(n):
        r = page.evaluate(COVERED_JS, i)
        if r and not r['ok']:
            covered.append(f"{r['label']} (under {r['hit']})")
    page.evaluate('window.scrollTo(0, 0)')
    res['covered'] = covered
    res['status'] = resp.status if resp else None
    res['errors'] = errors
    return res


def interactions(browser, base, post):
    out = {}
    pg = browser.new_page(viewport=SIZES['390'])
    pg.goto(base)
    pg.wait_for_load_state('networkidle')
    # Theme toggle: flips, persists across reload, label follows.
    t = pg.locator('header button')
    before = pg.evaluate("document.documentElement.dataset.theme")
    t.click()
    after = pg.evaluate("document.documentElement.dataset.theme")
    pg.reload()
    out['theme'] = {'flips': before != after, 'persists': pg.evaluate("document.documentElement.dataset.theme") == after,
                    'label': pg.locator('header button').get_attribute('aria-label')}
    pg.locator('header button').click()
    # Motion toggle (footer): pauses every animation, persists across reload, resumes.
    pg.goto(base + 'work/')
    pg.wait_for_load_state('networkidle')
    m = pg.locator('footer [data-motion-toggle]')
    m.click()
    paused = pg.evaluate("document.documentElement.dataset.motion === 'off' && [...document.querySelectorAll('*')].every((e) => getComputedStyle(e).animationName === 'none')")
    label = m.inner_text().strip()
    pg.reload()
    kept = pg.evaluate("document.documentElement.dataset.motion === 'off'") and m.get_attribute('aria-pressed') == 'true'
    m.click()
    out['motion'] = {'pauses': paused, 'label': label == 'Play animations', 'persists': kept,
                     'resumes': pg.evaluate("!document.documentElement.dataset.motion")}
    # Phone panels: closed at first, open on tap, button text and aria-expanded follow.
    b = pg.locator('#nvidia [data-clps]').first
    closed = not pg.locator('#nvidia .clps-body').first.is_visible()
    b.click()
    out['collapsible'] = {'starts_closed': closed, 'opens': pg.locator('#nvidia .clps-body').first.is_visible(),
                          'expanded': b.get_attribute('aria-expanded') == 'true', 'text': b.locator('.clps-text').inner_text().startswith('Hide')}
    # Nav links (mobile header) go to the right page and mark it current.
    nav = {}
    for name, path in [('Work', 'work/'), ('Projects', 'projects/'), ('Writing', 'writing/'), ('About', 'about/')]:
        pg.goto(base)
        pg.get_by_role('navigation', name='Main').get_by_role('link', name=name).click()
        pg.wait_for_load_state('networkidle')
        nav[name] = pg.url.endswith(path) and pg.get_by_role('link', name=name).first.get_attribute('aria-current') == 'page'
    out['nav'] = nav
    # Writing filters: each chip shows exactly the posts tagged with it, sets aria-pressed and the URL;
    # "All" shows every post. Skipped when the build has no published posts (no filter).
    pg.goto(base + 'writing/')
    out['filters'] = {'total': 0, 'chips': {}}
    if pg.locator('[data-island="PostFilter"]').count():
        pg.wait_for_selector('[data-island="PostFilter"][data-hydrated]', state='attached')
        pg.wait_for_timeout(200)
        shown = "[...document.querySelectorAll('#posts li[data-slug]')].map((li) => li.dataset.slug).sort()"
        posts = pg.evaluate("[...document.querySelectorAll('#posts li[data-slug]')].map((li) => ({ slug: li.dataset.slug, tags: li.dataset.tags.split('|') }))")
        chips = pg.get_by_role('group', name='Filter posts by topic').get_by_role('button')
        res = {}
        for i in range(chips.count()):
            c = chips.nth(i)
            name = c.inner_text().strip()
            c.click()
            pg.wait_for_timeout(50)
            want = sorted(p['slug'] for p in posts if name == 'All' or name in p['tags'])
            got = pg.evaluate(shown)
            res[name] = {'pressed': c.get_attribute('aria-pressed') == 'true', 'exact': got == want, 'shown': len(got),
                         'url': pg.url.split('/writing/')[1]}
        out['filters'] = {'total': len(posts), 'chips': res}
    # Projects disclosure.
    pg.goto(base + 'projects/')
    pg.locator('summary').first.click()
    out['details_open'] = pg.evaluate("document.querySelector('details').open")
    # Post navigation link (when there are at least two posts).
    out['post_nav'] = None
    if post:
        pg.goto(base + post)
        more = pg.get_by_role('navigation', name='More posts')
        if more.count():
            more.get_by_role('link').first.click()
            pg.wait_for_load_state('networkidle')
            out['post_nav'] = pg.url
    # 404 buttons point at real pages.
    pg.goto(base + '404.html')
    out['404_links'] = pg.eval_on_selector_all('main a', 'els => els.map(e => e.getAttribute("href"))')
    pg.close()
    # Pausing mid-run: the home career run must jump to its final step and stay there.
    pg = browser.new_page(viewport=SIZES['1440'])
    pg.goto(base)
    pg.wait_for_load_state('networkidle')
    final = None
    if pg.locator('[data-island="CareerRun"]').count():
        pg.locator('#so-far').scroll_into_view_if_needed()
        pg.wait_for_selector('[data-island="CareerRun"][data-hydrated]', state='attached')
        pg.wait_for_timeout(1800)
        at = lambda: int(pg.locator('#so-far ol[data-at]').get_attribute('data-at'))
        mid = at()
        pg.evaluate("document.querySelector('footer [data-motion-toggle]').click()")
        pg.wait_for_timeout(100)
        settled = at()
        pg.wait_for_timeout(3000)
        last = pg.locator('#so-far ol[data-at] > li').count() - 2  # the MS; the step after it waits for review
        final = {'was_running': 0 <= mid < last, 'settles': settled == last, 'stays': at() == settled}
        pg.evaluate("document.querySelector('footer [data-motion-toggle]').click()")
    out['career_pause'] = final
    pg.close()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://localhost:8000/')
    ap.add_argument('--out', default='.screens')
    ap.add_argument('--themes', default='light,dark')
    args = ap.parse_args()
    out = Path(args.out)
    links = set()
    out.mkdir(parents=True, exist_ok=True)
    report, failures = {}, []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # The first post, if this build has any (the live build may have none).
        pg = browser.new_page()
        pg.goto(args.base + 'writing/')
        first = pg.eval_on_selector_all('main a[href]', r"els => els.map((a) => a.href).filter((h) => /\/writing\/[^/]+\/$/.test(h))")
        post = first[0].replace(args.base, '') if first else None
        pg.close()
        pages = PAGES + ([post] if post else [])
        for theme in args.themes.split(','):
            for size, vp in SIZES.items():
                ctx = browser.new_context(viewport=vp, color_scheme=theme, reduced_motion='reduce')
                # A saved theme, as the site's own toggle would leave it.
                ctx.add_init_script(f"try {{ localStorage.setItem('gkk-theme', '{theme}'); }} catch (e) {{}}")
                for path in pages:
                    name = (path.strip('/').replace('/', '_').replace('.html', '') or 'home')
                    page = ctx.new_page()
                    r = check_page(page, args.base + path, str(out / f'{name}-{size}-{theme}.png'))
                    page.close()
                    key = f'{name}@{size}/{theme}'
                    report[key] = r
                    links.update(r.pop('links'))
                    if r['theme'] != theme:
                        failures.append(f'{key}: rendered in {r["theme"]} theme')
                    if r['docWidth'] > r['vw']:
                        failures.append(f'{key}: horizontal scroll ({r["docWidth"]} > {r["vw"]})')
                    for k in ('pastEdge', 'spill', 'overlap', 'covered', 'small', 'errors'):
                        if r[k]:
                            failures.append(f'{key}: {k}: {r[k][:4]}')
                ctx.close()
        report['interactions'] = it = interactions(browser, args.base, post)
        # Every internal link leads to a page that exists.
        req = browser.new_context().request
        broken = sorted({u.split('#')[0] for u in links if req.get(u.split('#')[0]).status >= 400})
        report['broken_links'] = broken
        failures += [f'broken link: {u}' for u in broken]
        browser.close()
    if not (it['theme']['flips'] and it['theme']['persists']):
        failures.append('theme toggle')
    if not all(it['motion'].values()):
        failures.append(f"motion toggle {it['motion']}")
    if not all(it['collapsible'].values()):
        failures.append(f"collapsible {it['collapsible']}")
    failures += [f'nav {k}' for k, v in it['nav'].items() if not v]
    for name, c in it['filters']['chips'].items():
        if not c['pressed'] or not c['exact'] or c['shown'] == 0:
            failures.append(f'filter {name}: {c}')
    if it['career_pause'] and not all(it['career_pause'].values()):
        failures.append(f"career run pause {it['career_pause']}")
    if not it['details_open']:
        failures.append('details')
    (out / 'report.json').write_text(json.dumps(report, indent=2))
    print(json.dumps({'interactions': it, 'failures': failures}, indent=2))
    sys.exit(1 if failures else 0)


if __name__ == '__main__':
    main()
