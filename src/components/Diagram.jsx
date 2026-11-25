import { Motif } from './Diagrams.jsx';

// A diagram placed in a page. Plain server-rendered SVG: the step animation is driven by a few lines
// of JavaScript in entry-client.jsx, so diagrams never load React.
export function Diagram(props) {
  return <Motif {...props} />;
}
