#!/usr/bin/env python3
"""Browser check for every page: screenshots at 390px and 1440px, console errors,
horizontal overflow, elements wider than the viewport, and basic interactions.

    python3 scripts/check.py [out_dir]

Starts a static server on port 8123 from the repo root (the built site) and stops it at the end.
"""
import json
import os
import subprocess
import sys
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '.screens')
PORT = 8123
PAGES = ['', 'work/', 'projects/', 'writing/', 'writing/push-or-pull/', 'about/', 'missing-page/']
WIDTHS = {'mobile': 390, 'desktop': 1440}
SUFFIX = '-dark' if os.environ.get('THEME') == 'dark' else ''

os.makedirs(OUT, exist_ok=True)
server = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '--bind', '127.0.0.1'], cwd=ROOT,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)

OVERFLOW_JS = """() => {
  const vw = document.documentElement.clientWidth;
  const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const st = getComputedStyle(el);
    if (st.position === 'fixed') continue;
    let p = el.parentElement, clipped = false;
    while (p && p !== document.body) {
      const ps = getComputedStyle(p);
      if (/(hidden|clip|auto|scroll)/.test(ps.overflowX)) { const pr = p.getBoundingClientRect(); if (r.right > pr.right + 1 || r.left < pr.left - 1) { clipped = true; } break; }
      p = p.parentElement;
    }
    if (clipped) continue;
    if (r.right > vw + 1 || r.left < -1) bad.push((el.tagName + '.' + (el.className && el.className.baseVal === undefined ? el.className : '')).slice(0, 90) + ' right=' + Math.round(r.right));
  }
  // Text that overflows its own box (cut off or spilling out).
  const spill = [];
  for (const el of document.querySelectorAll('h1,h2,h3,p,a,span,button,dd,dt,li')) {
    if (el.children.length) continue;
    const st = getComputedStyle(el);
    if (st.overflow === 'visible' && el.scrollWidth > el.clientWidth + 2 && st.display !== 'inline' && el.clientWidth > 0) spill.push(el.textContent.trim().slice(0, 50));
  }
  return { docWidth: document.documentElement.scrollWidth, vw, bad: bad.slice(0, 12), spill: spill.slice(0, 12) };
}"""

report = {}
try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for label, width in WIDTHS.items():
            ctx = browser.new_context(viewport={'width': width, 'height': 900}, device_scale_factor=1,
                                      reduced_motion='reduce', color_scheme=os.environ.get('THEME', 'light'))
            page = ctx.new_page()
            for path in PAGES:
                errors = []
                page.on('console', lambda m, errors=errors: errors.append(m.text) if m.type == 'error' else None)
                page.on('pageerror', lambda e, errors=errors: errors.append(str(e)))
                resp = page.goto(f'http://127.0.0.1:{PORT}/{path}', wait_until='networkidle')
                page.wait_for_timeout(300)
                name = (path.strip('/').replace('/', '_') or 'home')
                page.screenshot(path=os.path.join(OUT, f'{name}-{label}{SUFFIX}.png'), full_page=True)
                info = page.evaluate(OVERFLOW_JS)
                info['status'] = resp.status if resp else None
                info['errors'] = [e for e in errors if 'fonts.g' not in e and 'ERR_' not in e][:5]
                report[f'{name}@{label}'] = info
            ctx.close()

        # Interactions (desktop): theme toggle, writing filter, details expander.
        ctx = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = ctx.new_page()
        page.goto(f'http://127.0.0.1:{PORT}/', wait_until='networkidle')
        before = page.evaluate("document.documentElement.getAttribute('data-theme')")
        page.locator('header button').click()
        theme = page.evaluate("document.documentElement.getAttribute('data-theme')")
        page.reload(wait_until='networkidle')
        theme_after_reload = page.evaluate("document.documentElement.getAttribute('data-theme')")
        label = page.locator('header button').get_attribute('aria-label')
        page.locator('header button').click()
        report['interaction:theme'] = {'before': before, 'after_click': theme, 'after_reload': theme_after_reload, 'label_after_reload': label,
                                        'after_second_click': page.evaluate("document.documentElement.getAttribute('data-theme')")}
        page.goto(f'http://127.0.0.1:{PORT}/writing/', wait_until='networkidle')
        cards_all = page.locator('main a[href*="writing/"], main a[href$="/"]').count()
        page.get_by_role('button', name='Security').click()
        shown = page.evaluate("[...document.querySelectorAll('main h2')].map(h => h.textContent)")
        pressed = page.get_by_role('button', name='Security').get_attribute('aria-pressed')
        report['interaction:filter'] = {'pressed': pressed, 'headings_after_filter': shown}
        page.goto(f'http://127.0.0.1:{PORT}/projects/', wait_until='networkidle')
        page.get_by_text('Why GNM').click()
        report['interaction:details'] = {'open': page.evaluate("document.querySelector('details').open")}
        ctx.close()
        browser.close()
finally:
    server.terminate()

print(json.dumps(report, indent=1))
