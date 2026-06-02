'use client';

// ============================================================
//  HERO SECTION (Text-Overlay über der 3D-Welt)
//  Die 3D-Welt liegt dahinter (z-0). Hier nur der Text, der
//  beim Scrollen sanft ausgeblendet wird.
// ============================================================

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE } from '@/lib/data';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Hero-Text beim Scrollen ausblenden + leicht nach oben
      gsap.to('.hero-fade', {
        opacity: 0,
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  // Staggered Reveal Varianten
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 2.6 } },
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      ref={ref}
      id="top"
      className="relative z-10 flex h-screen w-full items-center justify-center"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="hero-fade pointer-events-none flex flex-col items-center px-6 text-center"
      >
        <motion.span
          variants={item}
          className="mb-6 font-mono text-xs uppercase tracking-widest2 text-accent"
        >
          {SITE.role} · {SITE.location}
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-[14vw] leading-[0.85] tracking-tightest text-bone md:text-[9vw]"
        >
          CINEMATIC
        </motion.h1>
        <motion.h1
          variants={item}
          className="font-display text-[14vw] leading-[0.85] tracking-tightest text-bone md:text-[9vw]"
        >
          STORIES
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-md font-body text-sm leading-relaxed text-smoke md:text-base"
        >
          {SITE.tagline} — Fotografie & Videografie von {SITE.owner}.
          Licht, Komposition, Emotion.
        </motion.p>
      </motion.div>

      {/* Scroll-Hinweis */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">
          Scroll
        </span>
        <div className="mx-auto mt-3 h-10 w-px overflow-hidden bg-ash">
          <div className="h-1/2 w-full animate-[shimmer_2s_ease-in-out_infinite] bg-accent" />
        </div>
      </motion.div>
    </section>
  );
}
