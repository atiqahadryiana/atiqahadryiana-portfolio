import { Link } from 'react-router-dom';
import { ArrowUpRight, GitFork } from 'lucide-react';
import { isWebUrl } from '../utils/content';

export default function ProjectCard({ project }) {
  const repositoryUrl = isWebUrl(project.github) ? project.github : null;

  return (
    <article className="project-card">
      <div className="project-content">
        <div className="project-title">
          <h3>
            <Link to={`/projects/${project.slug}`}>
              {project.title}
              <span className="project-arrow" aria-hidden="true">
                <ArrowUpRight size={18} strokeWidth={1.5} />
              </span>
            </Link>
          </h3>
        </div>
        <p className="project-summary">{project.summary}</p>
        <div className="tags" aria-label={`Technologies used in ${project.title}`}>
          {project.technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        {repositoryUrl && (
          <a
            className="project-repository"
            href={repositoryUrl}
            aria-label={`View GitHub repository for ${project.title}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitFork size={16} aria-hidden="true" />
            View repository
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
