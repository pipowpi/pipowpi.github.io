import { hydrateRoot } from 'react-dom/client';
import { RootContext } from './components/ui.jsx';

// Island registry. Each island's code is its own chunk, loaded only when the page has one.
const ISLANDS = {
  CareerRun: () => import('./islands/CareerRun.jsx'),
  Diagram: () => import('./islands/Diagram.jsx'),
  PostFilter: () => import('./islands/PostFilter.jsx'),
};

const pageData = JSON.parse(document.getElementById('page-data').textContent);

// Takes island elements, or the first child of one (what entry-client.jsx watches for visibility).
export function hydrateIslands(elements) {
  const { root } = pageData;
  elements.forEach(async (node) => {
    const el = node.closest('[data-island]');
    // Skip an island inside another island: the outer one already runs it.
    if (!el || 'hydrating' in el.dataset || el.parentElement.closest('[data-island]')) return;
    el.dataset.hydrating = '';
    const load = ISLANDS[el.dataset.island];
    if (!load) return;
    const { default: Component } = await load();
    const props = JSON.parse(el.dataset.props || '{}');
    hydrateRoot(el, <RootContext.Provider value={root}><Component {...props} /></RootContext.Provider>);
    el.dataset.hydrated = '';
  });
}
