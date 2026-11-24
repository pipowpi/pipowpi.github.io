import { Island } from './ui.jsx';
import { Motif } from './Diagrams.jsx';

// A diagram placed on a page. Rendered on the server, then hydrated in the browser as an island so
// its animation can run (it plays while on screen and pauses when scrolled away).
export function Diagram({ name, tone = 'accent', className = '' }) {
  return <Island name="Diagram" component={Motif} props={{ name, tone, className }} />;
}
