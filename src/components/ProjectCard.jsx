import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Artwork from './Artwork';

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <Link to={`/projects/${project.slug}`} className="art-link" tabIndex={-1} aria-hidden="true">
        <Artwork project={project} />
      </Link>
      <div className="project-content">
        <div className="project-meta">
          <span>{project.category}</span>
          <span className="status">
            <span />
            {project.status}
          </span>
        </div>
        <Link to={`/projects/${project.slug}`} className="project-title">
          <span className="project-folio-number" aria-hidden="true">
            {project.number}
          </span>
          <h3>{project.title}</h3>
          <span className="project-arrow">
            <ArrowUpRight size={22} aria-hidden="true" />
          </span>
        </Link>
        <p>{project.summary}</p>
        <p className="project-goal">{project.goal}</p>
        <div className="tags" aria-label="Technologies">
          {project.technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
