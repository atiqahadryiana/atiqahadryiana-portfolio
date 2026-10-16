import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Orbit } from 'lucide-react';
export default function NotFound({ project = false }) {
  useEffect(() => {
    document.title = 'Page not found — Portfolio';
  }, []);
  return (
    <section className="not-found container">
      <Orbit size={64} strokeWidth={1} aria-hidden="true" />
      <span className="error-number" aria-hidden="true">
        404
      </span>
      <h1>{project ? 'That project is still out there.' : 'A little off the beaten path.'}</h1>
      <p>
        {project
          ? 'This project could not be found. Explore the current selection instead.'
          : 'The page you’re looking for doesn’t exist. Let’s get you back to familiar ground.'}
      </p>
      <Link to={project ? '/#projects' : '/'} className="button">
        <ArrowLeft size={18} aria-hidden="true" />
        {project ? 'Back to projects' : 'Go home'}
      </Link>
    </section>
  );
}
