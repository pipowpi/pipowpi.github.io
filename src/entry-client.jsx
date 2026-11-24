// Runs on every page. Plain JavaScript only (no React), so pages without islands stay light.
// React and the island components are loaded on demand from hydrate.jsx.
const html = document.documentElement;

// ---- Theme toggle (light / dark), remembered in localStorage.
function syncThemeButtons() {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-label', `Switch to ${next} mode`);
    b.title = `Switch to ${next} mode`;
  });
}

// ---- Motion toggle: pauses every animation on the site, remembered in localStorage.
function syncMotionButtons() {
  const off = html.getAttribute('data-motion') === 'off';
  document.querySelectorAll('[data-motion-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(off));
    const label = b.querySelector('.motion-label');
    if (label) label.textContent = off ? 'Play animations' : 'Pause animations';
  });
}

function store(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
}

document.addEventListener('click', (e) => {
  const theme = e.target.closest('[data-theme-toggle]');
  if (theme) {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    store('gkk-theme', next);
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', next === 'dark' ? '#121316' : '#F4F4F2'));
    syncThemeButtons();
    return;
  }
  const motion = e.target.closest('[data-motion-toggle]');
  if (motion) {
    const off = html.getAttribute('data-motion') !== 'off';
    if (off) html.setAttribute('data-motion', 'off'); else html.removeAttribute('data-motion');
    store('gkk-motion', off ? 'off' : 'on');
    syncMotionButtons();
    return;
  }
  // ---- Phone panels (Collapsible): open and close.
  const clps = e.target.closest('[data-clps]');
  if (clps) {
    const box = clps.parentElement;
    const open = !box.hasAttribute('data-open');
    box.toggleAttribute('data-open', open);
    clps.setAttribute('aria-expanded', String(open));
    clps.querySelector('.clps-text').textContent = `${open ? 'Hide' : 'Show'} ${clps.dataset.label}`;
    clps.querySelector('.clps-sign').textContent = open ? '−' : '+';
  }
});
syncThemeButtons();
syncMotionButtons();

// ---- Pause looping CSS animations while they are off screen. Each animated element is watched
// through its parent, because a moving element can be clipped out of view by its own animation.
const LOOPS = '.rot, .ping, .busy-fill, .tline, .conn, .mt-spin, .mt-scan, .mt-draw, .tassel, .door-glow, [class*="animate-"]';
if ('IntersectionObserver' in window) {
  const kids = new Map();
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) kids.get(en.target).forEach((el) => el.toggleAttribute('data-paused', !en.isIntersecting));
  });
  requestAnimationFrame(() => document.querySelectorAll(LOOPS).forEach((el) => {
    const host = el.parentElement;
    if (!kids.has(host)) { kids.set(host, []); io.observe(host); }
    kids.get(host).push(el);
  }));
}

// ---- Islands: load React and hydrate only the interactive parts, each one as it comes near the
// screen. Until then the server-rendered HTML is already complete, so nothing is missing.
const islands = [...document.querySelectorAll('[data-island]')];
if (islands.length) {
  const hydrate = (els) => import('./hydrate.jsx').then((m) => m.hydrateIslands(els));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      const near = entries.filter((en) => en.isIntersecting).map((en) => en.target);
      if (!near.length) return;
      near.forEach((el) => io.unobserve(el));
      hydrate(near);
    }, { rootMargin: '300px 0px' });
    // display: contents boxes have no size, so watch each island's first child element.
    islands.forEach((el) => { io.observe(el.firstElementChild || el); });
  } else hydrate(islands);
}
