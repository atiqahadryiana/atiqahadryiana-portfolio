import SectionHeading from '../components/SectionHeading';
import Timeline from '../components/Timeline';
import Reveal from '../components/Reveal';
export default function Experience() {
  return (
    <section id="experience" className="section section-tinted" aria-label="Work experience">
      <Reveal className="container experience-layout">
        <div className="experience-intro">
          <SectionHeading
            number="03"
            label="Professional journey"
            title="Past work"
            accent="experience."
            description="Previous roles, internships, contract work, and the responsibilities behind them."
          />
          <p className="section-footnote">Only confirmed professional experience appears here.</p>
        </div>
        <Timeline />
      </Reveal>
    </section>
  );
}
