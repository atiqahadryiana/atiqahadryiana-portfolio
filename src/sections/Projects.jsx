import { useState } from 'react';
import { projects, projectFilters } from '../data/portfolio';
import ProjectCard from '../components/ProjectCard';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
export default function Projects() {
  const [filter, setFilter] = useState('All');
  const shown = projects.filter((item) => filter === 'All' || item.filters.includes(filter));
  return (
    <section id="projects" className="section container" aria-label="Featured projects">
      <Reveal>
        <SectionHeading
          number="05"
          label="The project shelf"
          title="Ideas taking"
          accent="shape."
          description="A selection of projects, concepts, and explorations. Each with its own purpose and story."
        />
        <div className="project-toolbar">
          <div className="filter-group" role="group" aria-label="Filter projects">
            {projectFilters.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="result-count" role="status">
            {shown.length} {shown.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
        <div className="projects-grid" data-count={shown.length}>
          {shown.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
        {!shown.length && (
          <p className="empty-state">No projects in this category yet. Try another filter.</p>
        )}
        <p className="section-footnote">Each project includes its current status and scope.</p>
      </Reveal>
    </section>
  );
}
