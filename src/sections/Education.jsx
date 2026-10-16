import { ArrowUpRight, GraduationCap, Network } from 'lucide-react';
import { education } from '../data/portfolio';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
export default function Education() {
  return (
    <section
      id="education"
      className="section section-tinted education-section"
      aria-label="Education journey"
    >
      <Reveal className="container">
        <SectionHeading number="02" label="Academic background" title="My" accent="education." />
        <div className="education-grid">
          {education.map((item, index) => (
            <article key={item.id} className="education-card">
              <div className="education-card-top">
                <span className="small-label">{item.stage}</span>
                {index === 0 ? (
                  <GraduationCap size={24} aria-hidden="true" />
                ) : (
                  <Network size={24} aria-hidden="true" />
                )}
              </div>
              <h3>{item.title}</h3>
              {item.institution && <p>{item.institution}</p>}
              <p className="muted">{item.detail}</p>
              {item.dates && <p className="small-label">{item.dates}</p>}
              <ArrowUpRight
                size={32}
                strokeWidth={1}
                className="education-arrow"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
        {!education.length && (
          <p className="empty-state">Education entries will appear here when added.</p>
        )}
      </Reveal>
    </section>
  );
}
