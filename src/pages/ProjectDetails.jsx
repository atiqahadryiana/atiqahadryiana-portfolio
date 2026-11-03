import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, GitFork, Lightbulb } from 'lucide-react';
import { projects } from '../data/portfolio';
import { imageUrl, isWebUrl } from '../utils/content';
import Artwork from '../components/Artwork';
import NotFound from './NotFound';

function DetailBlock({ number, title, children }) {
  return (
    <section className="detail-block">
      <span className="detail-block-number" aria-hidden="true">
        {number}
      </span>
      <div>
        <h2>{title}</h2>
        {children || <p className="detail-pending">Not documented yet.</p>}
      </div>
    </section>
  );
}
export default function ProjectDetails() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  useEffect(() => {
    if (project) document.title = `${project.title} — Portfolio`;
  }, [project]);
  if (!project) return <NotFound project />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <article className="project-detail container">
      <Link className="text-link detail-back" to="/#projects">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to projects
      </Link>
      <div className="detail-heading">
        <div className="detail-heading-copy">
          <div className="detail-heading-meta">
            <span className="small-label">Project {project.number}</span>
            <span aria-hidden="true">/</span>
            <span>{project.category}</span>
          </div>
          <h1>
            {project.title}
            <span className="accent">.</span>
          </h1>
          <p>{project.summary}</p>
        </div>
        <div className="detail-status">
          <span className="small-label">Current stage</span>
          <span className="status">
            <span />
            {project.status}
          </span>
        </div>
      </div>
      <Artwork key={slug} project={project} large />
      <p className="project-caveat">
        <Lightbulb size={19} aria-hidden="true" />
        {project.caveat}
      </p>
      <div className="detail-layout">
        <div className="detail-story">
          <DetailBlock number="01" title="The overview">
            {project.overview && <p>{project.overview}</p>}
          </DetailBlock>
          <DetailBlock number="02" title="The problem">
            {project.problem && <p>{project.problem}</p>}
          </DetailBlock>
          <DetailBlock number="03" title="Who it’s for">
            {project.users && <p>{project.users}</p>}
          </DetailBlock>
          <DetailBlock number="04" title="The approach">
            {project.approach && <p>{project.approach}</p>}
          </DetailBlock>
          <DetailBlock number="05" title="Core features">
            {project.features.length > 0 && (
              <>
                <p className="muted">Planned scope; implementation is not confirmed.</p>
                <ul className="feature-list">
                  {project.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
          </DetailBlock>
          <DetailBlock number="06" title="Challenges & lessons">
            {project.challenges && <p>{project.challenges}</p>}
          </DetailBlock>
          <DetailBlock number="07" title="Outcome & next steps">
            {project.outcome && <p>{project.outcome}</p>}
          </DetailBlock>
          {project.gallery.filter((item) => imageUrl(item.src)).length > 0 && (
            <DetailBlock title="Project gallery">
              <div className="detail-gallery">
                {project.gallery
                  .filter((item) => imageUrl(item.src))
                  .map((item) => (
                    <figure key={item.src}>
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.hidden = true;
                        }}
                      />
                      <figcaption>
                        {item.caption || 'Project image unavailable if not shown.'}
                      </figcaption>
                    </figure>
                  ))}
              </div>
            </DetailBlock>
          )}
        </div>
        <aside className="detail-sidebar">
          <span className="small-label">Project file</span>
          <h2>At a glance</h2>
          <dl>
            <dt>Status</dt>
            <dd>{project.status}</dd>
            <dt>My role</dt>
            <dd>{project.role || 'Details coming soon.'}</dd>
            <dt>Project goal</dt>
            <dd>{project.goal}</dd>
            <dt>Technologies</dt>
            <dd>
              <div className="tags">
                {project.technologies.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p className="section-footnote">{project.technologyNote}</p>
            </dd>
          </dl>
          {isWebUrl(project.github) && (
            <a
              className="button button-outline"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitFork size={17} aria-hidden="true" />
              View source
            </a>
          )}
          {isWebUrl(project.demo) && (
            <a className="button" href={project.demo} target="_blank" rel="noopener noreferrer">
              Live demo <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          )}
        </aside>
      </div>
      {next && next !== project && (
        <Link className="next-project" to={`/projects/${next.slug}`}>
          <span>
            <span className="small-label">Next exploration</span>
            <strong>{next.title}</strong>
          </span>
          <ArrowUpRight size={36} strokeWidth={1} aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
