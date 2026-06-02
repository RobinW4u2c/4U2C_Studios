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
import SplitText from '@/components/ui/SplitText';

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
        className="hero-fade text-veil pointer-events-none flex flex-col items-center px-6 text-center"
      >
        <motion.span
          variants={item}
          className="readable mb-8 font-mono text-[11px] uppercase tracking-widest2 text-accent md:text-xs"
        >
          {SITE.role} · {SITE.location}
        </motion.span>

        <motion.h1
          variants={item}
          className="readable font-display text-[15vw] font-extrabold leading-[0.82] tracking-tightest text-bone md:text-[9.5vw]"
        >
          <SplitText text="CINEMATIC" by="char" delay={2.7} stagger={0.04} />
        </motion.h1>
        <motion.h1
          variants={item}
          className="readable font-display text-[15vw] font-extrabold leading-[0.82] tracking-tightest text-accent md:text-[9.5vw]"
        >
          <SplitText text="STORIES" by="char" delay={3.0} stagger={0.04} />
        </motion.h1>

        <motion.p
          variants={item}
          className="readable mt-10 max-w-lg font-body text-base leading-relaxed text-bone/85 md:text-lg"
        >
          Premium Fotografie &amp; Videografie von {SITE.owner}.
          <br className="hidden md:block" />
          Wir erzählen deine Geschichte in Licht, Komposition und Emotion.
        </motion.p>
      </motion.div>

      {/* Scroll-Hinweis */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <span className="readable font-mono text-[10px] uppercase tracking-widest2 text-bone/70">
          Scroll
        </span>
        <div className="mx-auto mt-3 h-10 w-px overflow-hidden bg-ash">
          <div className="h-1/2 w-full animate-[shimmer_2s_ease-in-out_infinite] bg-accent" />
        </div>
      </motion.div>
    </section>
  );
}
