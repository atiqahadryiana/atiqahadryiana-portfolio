import { useEffect } from 'react';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Experience from '../sections/Experience';
import Achievements from '../sections/Achievements';
import Education from '../sections/Education';
import Contact from '../sections/Contact';
import { profile } from '../data/portfolio';
export default function Home() {
  useEffect(() => {
    document.title = `${profile.name} — Portfolio`;
  }, []);
  return (
    <>
      <Hero />
      <About />
      <Education />
      <Experience />
      <Skills />
      <Projects />
      <Achievements />
      <Contact />
    </>
  );
}
