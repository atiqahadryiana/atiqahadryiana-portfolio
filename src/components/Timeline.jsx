import { ArrowUpRight } from 'lucide-react';
import { experience } from '../data/portfolio';
import { isWebUrl } from '../utils/content';
export default function Timeline() {
  if (!experience.length)
    return (
      <div className="empty-state experience-empty">
        <span>Work history</span>
        <p>Past work experience will appear here when a confirmed role is added.</p>
      </div>
    );
  return (
    <ol className="timeline">
      {experience.map((item, index) => (
        <li key={item.id}>
          <span className="timeline-year">{item.year || 'Date to be added'}</span>
          <details open={index === 0}>
            <summary>
              <span>
                <span className="timeline-org">{item.organization}</span>
                <span className="timeline-role">{item.title}</span>
              </span>
              <span className="expand-icon" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="timeline-detail">
              <p>{item.description}</p>
              {isWebUrl(item.proof) && (
                <a
                  href={item.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  View supporting link <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
