import { useEffect, useState } from 'react';
import { profile } from '../data/portfolio';

export const INTRO_DURATION = 10000;

const introActions = [
  ['03_greeting_wave.png', 'Waving hello'],
  ['01_idle.png', 'Ready to begin'],
  ['16_thinking.png', 'Thinking through a problem'],
  ['31_new_idea.png', 'Finding a new idea'],
  ['10_hold_laptop.png', 'Building with technology'],
  ['12_work_at_desk.png', 'Working at the desk'],
  ['14_present_idea.png', 'Presenting an idea'],
  ['33_hold_portfolio.png', 'Sharing the portfolio'],
  ['15_thumbs_up.png', 'Giving a thumbs up'],
  ['19_cheer.png', 'Cheering'],
  ['21_celebrate.png', 'Celebrating'],
  ['36_goodbye_wave.png', 'Waving into the portfolio'],
];

export default function IntroScreen({ onComplete }) {
  const [seconds, setSeconds] = useState(10);
  const [actionIndex, setActionIndex] = useState(0);
  useEffect(() => {
    const deadline = Date.now() + INTRO_DURATION;
    document.title = `${profile.name} — Portfolio`;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(onComplete, INTRO_DURATION);
    const countdown = window.setInterval(() => {
      setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 250);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const actionTimer = reduceMotion
      ? null
      : window.setInterval(() => {
          setActionIndex((index) => Math.min(index + 1, introActions.length - 1));
        }, INTRO_DURATION / introActions.length);
    introActions.forEach(([file]) => {
      const image = new Image();
      image.src = `/intro-actions/${file}`;
    });
    const escape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onComplete();
      }
    };
    window.addEventListener('keydown', escape);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(countdown);
      if (actionTimer) window.clearInterval(actionTimer);
      window.removeEventListener('keydown', escape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);
  const [actionFile, actionLabel] = introActions[actionIndex];
  return (
    <main className="intro-screen" aria-labelledby="intro-title">
      <div className="intro-center">
        <div className="intro-character-stage">
          <span className="intro-character-halo" aria-hidden="true" />
          <img
            key={actionFile}
            className="intro-character"
            src={`/intro-actions/${actionFile}`}
            alt={actionLabel}
          />
        </div>
        <p className="intro-greeting">Hello, I’m</p>
        <h1 id="intro-title">
          {profile.name}
          <span className="accent">.</span>
        </h1>
        <p className="intro-welcome">Welcome to my portfolio.</p>
      </div>
      <div className="intro-bottomline">
        <div className="intro-progress-copy">
          <span>A little introduction before we begin.</span>
          <span aria-hidden="true">Opening in {seconds}s</span>
        </div>
        <div
          className="intro-progress"
          role="progressbar"
          aria-label="Introduction countdown"
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={10 - seconds}
          aria-valuetext={`${seconds} second${seconds === 1 ? '' : 's'} until the portfolio opens`}
        >
          <span style={{ transform: `scaleX(${(10 - seconds) / 10})` }} />
        </div>
        <p>
          Opening automatically. <span>Esc to skip</span>
        </p>
      </div>
    </main>
  );
}
