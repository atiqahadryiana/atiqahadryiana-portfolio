import { ArrowUpRight, Award, BadgeCheck, BookOpen } from 'lucide-react';
import { awards, certifications } from '../data/portfolio';
import { imageUrl, isWebUrl } from '../utils/content';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
export default function Achievements() {
  return (
    <section
      id="achievements"
      className="section container"
      aria-label="Achievements and certifications"
    >
      <Reveal>
        <SectionHeading
          number="06"
          label="Learning & milestones"
          title="Achievements &"
          accent="certifications."
          description="Formal learning, certifications, and milestones along the way."
        />
        <h3 className="subsection-label">
          <BadgeCheck size={18} aria-hidden="true" /> Certifications & training
        </h3>
        <div className="credential-list">
          {certifications.map((item) => (
            <article className="credential" key={item.id}>
              <span className="credential-icon">
                <BookOpen size={24} strokeWidth={1.4} aria-hidden="true" />
              </span>
              <div>
                <span className="small-label">
                  {item.issuer}
                  {item.date ? ` · ${item.date}` : ''}
                </span>
                <h4>{item.title}</h4>
                <p>{item.note}</p>
                {imageUrl(item.image) && (
                  <a
                    className="text-link"
                    href={item.image}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View certificate image <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
              </div>
              {isWebUrl(item.verification) && (
                <a
                  className="icon-button"
                  href={item.verification}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Verify ${item.title}`}
                >
                  <ArrowUpRight size={20} aria-hidden="true" />
                </a>
              )}
            </article>
          ))}
          {!certifications.length && (
            <p className="empty-state">Certification entries will appear here when added.</p>
          )}
        </div>
        <div className="awards-section">
          <h3 className="subsection-label">
            <Award size={18} aria-hidden="true" /> Awards
          </h3>
          {awards.length ? (
            awards.map((item) => (
              <article key={item.id} className="award-entry">
                <h4>{item.title}</h4>
                <p>
                  {item.issuer}
                  {item.date ? ` · ${item.date}` : ''}
                </p>
                <p>{item.description}</p>
                {isWebUrl(item.proof) && (
                  <a
                    href={item.proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    View award <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </article>
            ))
          ) : (
            <p className="muted">This chapter is still being written. No awards have been added.</p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
