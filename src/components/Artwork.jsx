import { useState } from 'react';
import { imageUrl } from '../utils/content';

export default function Artwork({ project, large = false }) {
  const [failed, setFailed] = useState(false);
  const source = imageUrl(project.image);
  return (
    <div className={`project-art art-${project.art} ${large ? 'art-large' : ''}`}>
      <img
        src={!failed && source ? source : `/images/${project.art || 'fallback'}.svg`}
        alt={!failed && source ? `${project.title} project image` : ''}
        loading="lazy"
        width="800"
        height="500"
        onError={() => {
          if (!failed) setFailed(true);
        }}
      />
      <span className="art-caption">
        {source && !failed ? 'Project image' : 'Concept illustration'}
      </span>
      <span className="art-index" aria-hidden="true">
        {project.number} /
      </span>
    </div>
  );
}
