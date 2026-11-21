import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

const data = JSON.parse(document.getElementById('page-data').textContent);
hydrateRoot(document.getElementById('root'), <App page={data.page} root={data.root} slug={data.slug} />);

// Pause looping CSS animations (status dots, spinners, the rotating headline) while they are off screen.
// Each animated element is watched through its parent, because a moving element can be clipped out of
// view by its own animation (the busy bar) and must not pause itself there.
const LOOPS = '.rot, .ping, .busy-fill, .tline, [class*="animate-"]';
if ('IntersectionObserver' in window) {
  const kids = new Map();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) kids.get(e.target).forEach((el) => el.toggleAttribute('data-paused', !e.isIntersecting));
  });
  requestAnimationFrame(() => document.querySelectorAll(LOOPS).forEach((el) => {
    const host = el.parentElement;
    if (!kids.has(host)) { kids.set(host, []); io.observe(host); }
    kids.get(host).push(el);
  }));
}
