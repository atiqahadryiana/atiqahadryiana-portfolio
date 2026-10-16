import { ArrowDownRight, ArrowUpRight, FileText } from 'lucide-react';
import { motion as Motion, useReducedMotion } from 'motion/react';
import { profile } from '../data/portfolio';
import { isWebUrl, publicAsset } from '../utils/content';
import SocialLinks from '../components/SocialLinks';
import RoleDescriptor from '../components/RoleDescriptor';
import ThinkingBoard from '../components/ThinkingBoard';

export default function Hero() {
  const reduced = useReducedMotion();
  const hasName = profile.name && profile.name !== 'YOUR_NAME';
  const hasResume = publicAsset(profile.resume) || isWebUrl(profile.resume);
  const emphasis = profile.headlineEmphasis;
  const parts =
    emphasis && profile.headline.includes(emphasis) ? profile.headline.split(emphasis) : null;
  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="hero container">
        <Motion.div
          className="hero-copy"
          initial={false}
          animate={reduced ? {} : { y: [12, 0] }}
          transition={{ duration: 0.3 }}
        >
          <p className="hero-eyebrow">
            <span className="identity-dot" aria-hidden="true" />
            {profile.identity}
          </p>
          <h1 id="hero-title">
            {hasName ? (
              <>
                <span className="hero-greeting">Hi, I’m</span>{' '}
                <span className="hero-name accent">{profile.name}.</span>
                <span className="named-headline">{profile.headline}</span>
              </>
            ) : parts ? (
              <>
                {parts[0]}
                <span className="hero-emphasis">
                  {emphasis}
                  <svg viewBox="0 0 350 16" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M3 10C99 0 229 3 347 8" />
                  </svg>
                </span>
                {parts.slice(1).join(emphasis)}
              </>
            ) : (
              profile.headline
            )}
          </h1>
          <p className="hero-intro">{profile.introduction}</p>
          <div className="hero-actions">
            <a href="#projects" className="button">
              Explore my work <ArrowDownRight size={18} aria-hidden="true" />
            </a>
            <a href="#contact" className="button button-ghost">
              Get in touch <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            {hasResume && (
              <a
                className="button button-outline"
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={18} aria-hidden="true" />
                View resume
              </a>
            )}
          </div>
          <SocialLinks />
          <div className="hero-descriptor">
            <RoleDescriptor />
          </div>
        </Motion.div>
        <ThinkingBoard />
        <div className="hero-endnote">
          <span className="endnote-mark" aria-hidden="true" />
          <span>A collection of ideas, experiments & things I’m learning.</span>
          <a href="#about" className="hero-about-link">
            A little about me <ArrowDownRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
