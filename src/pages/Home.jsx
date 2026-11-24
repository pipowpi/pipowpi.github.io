import { Layout } from '../components/Layout.jsx';
import { Island, Section, Wrap } from '../components/ui.jsx';
import { Hero } from '../components/home/Hero.jsx';
import { Focus, Lately, SelectedWork } from '../components/home/Sections.jsx';
import CareerRun from '../islands/CareerRun.jsx';

export default function Home() {
  return (
    <Layout active="home">
      <Hero />
      <Wrap>
        <Section id="so-far" wide label="The pipeline so far" note="Eight years, one stage at a time">
          <Island name="CareerRun" component={CareerRun} />
        </Section>
        <Section id="focus" wide label="What I work on" tight><Focus /></Section>
        <Section id="selected" label="Selected work" note="2 case studies"><SelectedWork /></Section>
        <Section id="lately" label="Lately" note="What I’m writing and building"><Lately /></Section>
      </Wrap>
    </Layout>
  );
}
