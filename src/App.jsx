import Home from './pages/Home.jsx';
import Work from './pages/Work.jsx';
import Projects from './pages/Projects.jsx';
import Writing from './pages/Writing.jsx';
import Post from './pages/Post.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Styleguide from './pages/Styleguide.jsx';
import { RootContext } from './components/ui.jsx';

const PAGES = { home: Home, work: Work, projects: Projects, writing: Writing, post: Post, about: About, styleguide: Styleguide, 404: NotFound };

// Each route is its own static HTML file; `root` is the relative path back to the site root.
export default function App({ page, root, slug }) {
  const Page = PAGES[page] || NotFound;
  return (
    <RootContext.Provider value={root}>
      <Page slug={slug} />
    </RootContext.Provider>
  );
}
