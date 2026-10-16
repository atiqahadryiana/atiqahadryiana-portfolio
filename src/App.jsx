import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import useTheme from './hooks/useTheme';
import IntroScreen from './components/IntroScreen';
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Admin = import.meta.env.DEV ? lazy(() => import('./pages/Admin')) : null;

function AdminShortcut({ onOpen }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    const openAdmin = (event) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.shiftKey ||
        !(event.ctrlKey || event.metaKey) ||
        event.key.toLowerCase() !== 'm'
      )
        return;
      if (
        event.target instanceof Element &&
        event.target.closest(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]',
        )
      )
        return;
      event.preventDefault();
      onOpen();
      if (pathname !== '/admin') navigate('/admin');
    };
    window.addEventListener('keydown', openAdmin);
    return () => window.removeEventListener('keydown', openAdmin);
  }, [navigate, pathname, onOpen]);
  return null;
}

function RouteScroll() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.scrollIntoView({ behavior: 'instant' });
          target.focus({ preventScroll: true });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname, hash, key]);
  return null;
}
export default function App() {
  const { theme, toggle } = useTheme();
  const { pathname, hash } = useLocation();
  const [introDone, setIntroDone] = useState(() => pathname !== '/' || Boolean(hash));
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const showIntro = !introDone && pathname === '/' && !hash;
  return (
    <MotionConfig reducedMotion="user">
      {Admin && <AdminShortcut onOpen={finishIntro} />}
      {showIntro ? (
        <IntroScreen onComplete={finishIntro} />
      ) : (
        <>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Navbar theme={theme} toggle={toggle} />
          <main id="main-content" tabIndex={-1}>
            <Suspense
              fallback={
                <div className="route-loading container" role="status">
                  Loading exploration…
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:slug" element={<ProjectDetails />} />
                {Admin && <Route path="/admin" element={<Admin />} />}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <RouteScroll />
            </Suspense>
          </main>
          <Footer />
          <ScrollToTop />
        </>
      )}
    </MotionConfig>
  );
}
