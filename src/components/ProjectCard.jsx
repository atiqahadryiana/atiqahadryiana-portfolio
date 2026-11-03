import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Artwork from './Artwork';
import { isWebUrl } from '../utils/content';

function ProjectLink({ project, className, children, ...props }) {
  const externalUrl = isWebUrl(project.demo)
    ? project.demo
    : isWebUrl(project.github)
      ? project.github
      : null;

  if (externalUrl) {
    return (
      <a
        href={externalUrl}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={`/projects/${project.slug}`} className={className} {...props}>
      {children}
    </Link>
  );
}

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <ProjectLink project={project} className="art-link" tabIndex={-1} aria-hidden="true">
        <Artwork project={project} />
      </ProjectLink>
      <div className="project-content">
        <div className="project-meta">
          <span>{project.category}</span>
          <span className="status">
            <span />
            {project.status}
          </span>
        </div>
        <ProjectLink project={project} className="project-title">
          <span className="project-folio-number" aria-hidden="true">
            {project.number}
          </span>
          <h3>{project.title}</h3>
          <span className="project-arrow">
            <ArrowUpRight size={22} aria-hidden="true" />
          </span>
        </ProjectLink>
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
