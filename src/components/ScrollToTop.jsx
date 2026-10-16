import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 600);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    visible && (
      <button
        type="button"
        className="icon-button back-to-top"
        aria-label="Back to top"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'instant'
              : 'smooth',
          });
          document.getElementById('main-content')?.focus({ preventScroll: true });
        }}
      >
        <ArrowUp size={19} aria-hidden="true" />
      </button>
    )
  );
}
