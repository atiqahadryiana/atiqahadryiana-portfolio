import { useEffect, useState } from 'react';

function initialTheme() {
  try {
    const saved = localStorage.getItem('portfolio-theme');
    if (['dark', 'light'].includes(saved)) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}
export default function useTheme() {
  const [theme, setTheme] = useState(initialTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#110d20' : '#f7f4fc');
  }, [theme]);
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)');
    const followSystem = (event) => {
      try {
        if (localStorage.getItem('portfolio-theme')) return;
      } catch {
        /* Storage may be blocked. */
      }
      setTheme(event.matches ? 'light' : 'dark');
    };
    query.addEventListener('change', followSystem);
    return () => query.removeEventListener('change', followSystem);
  }, []);
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('portfolio-theme', next);
    } catch {
      /* Theme still works in memory. */
    }
  };
  return { theme, toggle };
}
