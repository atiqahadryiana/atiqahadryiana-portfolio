import { useEffect, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'motion/react';
import { profile } from '../data/portfolio';

export default function RoleDescriptor() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || profile.roles.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % profile.roles.length),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [reduced]);
  if (!profile.roles.length) return null;
  return (
    <span className="hero-role">
      <span className="identity-dot" aria-hidden="true" />
      <span className="sr-only">{profile.roles.join(', ')}</span>
      <span className="role-descriptor" aria-hidden="true">
        <Motion.span
          key={index}
          initial={false}
          animate={reduced ? {} : { opacity: [0.5, 1], y: [4, 0] }}
          transition={{ duration: 0.2 }}
        >
          {profile.roles[index]}
        </Motion.span>
      </span>
    </span>
  );
}
