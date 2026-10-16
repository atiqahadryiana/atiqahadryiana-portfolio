import SectionHeading from '../components/SectionHeading';
import SkillTabs from '../components/SkillTabs';
import Reveal from '../components/Reveal';
export default function Skills() {
  return (
    <section id="skills" className="section section-tinted" aria-label="Technical skills">
      <Reveal className="container">
        <SectionHeading
          number="04"
          label="My toolbox"
          title="Development skills"
          accent="& tools."
          description="A growing collection of technologies, tools, and ideas. Always a student, always exploring."
        />
        <SkillTabs />
        <p className="section-footnote">
          Technical exposure & interests. Learning is a process, not a percentage.
        </p>
      </Reveal>
    </section>
  );
}
