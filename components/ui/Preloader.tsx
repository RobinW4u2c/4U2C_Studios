'use client';

// ============================================================
//  PRELOADER
//  Cinematic Intro: Zähler 0→100, dann Vorhang öffnet sich.
//  Verhindert das Flackern beim Three.js-Mount.
// ============================================================

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE } from '@/lib/data';

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Zähler hochlaufen lassen (ca. 2 Sekunden)
    const start = performance.now();
    const duration = 2000;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease-out für angenehmes Verlangsamen am Ende
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 300);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="mb-6 font-display text-2xl tracking-tightest text-bone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {SITE.brand}
          </motion.span>

          {/* Großer Zähler */}
          <span className="font-display text-[18vw] leading-none text-bone/90 md:text-[12vw]">
            {count}
          </span>

          {/* Fortschrittsbalken */}
          <div className="mt-8 h-px w-48 overflow-hidden bg-ash">
            <div
              className="h-full bg-accent transition-[width] duration-100 ease-linear"
              style={{ width: `${count}%` }}
            />
          </div>

          <span className="mt-6 font-mono text-[10px] uppercase tracking-widest2 text-smoke">
            Loading Experience
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
