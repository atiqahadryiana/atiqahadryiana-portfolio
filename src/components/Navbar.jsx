import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navigation, profile } from '../data/portfolio';
import ThemeToggle from './ThemeToggle';
import BrandMark from './BrandMark';

export default function Navbar({ theme, toggle }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const trigger = useRef(null);
  const location = useLocation();
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const outside = (event) => {
      if (!event.target.closest('.site-header')) setOpen(false);
    };
    const media = window.matchMedia('(min-width: 1120px)');
    const resize = (event) => {
      if (event.matches) setOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    media.addEventListener('change', resize);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', outside);
      media.removeEventListener('change', resize);
    };
  }, [open]);
  useEffect(() => {
    if (location.pathname !== '/' || !('IntersectionObserver' in window)) return;
    const sections = navigation.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link
          className="wordmark"
          to="/#home"
          aria-label={`${profile.name} home`}
          onClick={() => setOpen(false)}
        >
          <BrandMark />
          <span className="brand-name">
            {profile.name}
            <span className="brand-descriptor">Personal portfolio</span>
          </span>
        </Link>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={`nav-links ${open ? 'is-open' : ''}`}
        >
          {navigation.map(({ id, label }) => (
            <Link
              key={id}
              to={`/#${id}`}
              onClick={() => setOpen(false)}
              aria-current={location.pathname === '/' && active === id ? 'location' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <ThemeToggle theme={theme} toggle={toggle} />
          <button
            ref={trigger}
            className="icon-button menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="primary-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
