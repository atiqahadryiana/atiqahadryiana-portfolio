import { Code2, HeartHandshake, Sparkles, ArrowUpRight } from 'lucide-react';
import { pillars, profile } from '../data/portfolio';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
const icons = { code: Code2, sparkles: Sparkles, community: HeartHandshake };
export default function About() {
  return (
    <section id="about" className="section container" aria-label="About me">
      <Reveal>
        <div className="about-layout">
          <div className="about-heading">
            <SectionHeading
              number="01"
              label="A little context"
              title="Curiosity is"
              accent="the starting point."
            />
            <p className="about-margin-note">
              People first.
              <br />
              Then possibilities.
              <br />
              Then the code.
            </p>
          </div>
          <div className="about-story">
            {profile.about.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <a href="#education" className="text-link">
              Explore my journey <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="pillars">
          {pillars.map((pillar) => {
            const Icon = icons[pillar.icon] || Code2;
            return (
              <div className="pillar" key={pillar.title}>
                <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
