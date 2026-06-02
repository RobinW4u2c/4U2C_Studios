'use client';

// ============================================================
//  SPLIT TEXT REVEAL
//  Enthüllt Text wort- oder buchstabenweise gestaffelt von
//  unten. Wiederverwendbar für Headlines. Reines Framer Motion.
// ============================================================

import { motion } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;        // Start-Verzögerung in Sekunden
  by?: 'word' | 'char';  // wort- oder buchstabenweise
  stagger?: number;      // Abstand zwischen den Teilen
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  by = 'char',
  stagger = 0.03,
}: SplitTextProps) {
  // in Wörter oder Buchstaben zerlegen
  const parts = by === 'word' ? text.split(' ') : text.split('');

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child = {
    hidden: { y: '110%', opacity: 0 },
    show: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <motion.span
      className={`inline-block overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {parts.map((part, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span variants={child} className="inline-block">
            {part === ' ' ? '\u00A0' : part}
            {by === 'word' && i < parts.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
