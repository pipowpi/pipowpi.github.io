import { Layout } from '../components/Layout.jsx';
import { Button, PageHead, TextLink, Wrap } from '../components/ui.jsx';

// GitHub Pages serves 404.html for unknown paths at any depth, so this page uses root-absolute links.
export default function NotFound() {
  return (
    <Layout active="">
      <Wrap className="pb-12">
        <PageHead title="This job was never queued.">
          There is no page at this address (error 404). It may have moved, or the link may have a typo.
        </PageHead>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button primary href="/">Go to the home page</Button>
          <TextLink href="/work/">Work</TextLink>
          <TextLink href="/projects/">Projects</TextLink>
          <TextLink href="/writing/">Writing</TextLink>
        </div>
      </Wrap>
    </Layout>
  );
}
