import { motion as Motion, useReducedMotion } from 'motion/react';
export default function Reveal({ children, className = '' }) {
  const reduced = useReducedMotion();
  return (
    <Motion.div
      className={className}
      initial={false}
      whileInView={reduced ? {} : { y: [12, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      {children}
    </Motion.div>
  );
}
