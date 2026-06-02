'use client';

// ============================================================
//  ABOUT ROBIN WERDICH
//  Cinematic Porträt-Section mit Storytelling: Text-Zeilen
//  enthüllen sich beim Scrollen, Porträt mit Parallax + Grade.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ABOUT, SITE } from '@/lib/data';

export default function About() {
  const section = useRef<HTMLElement>(null);
  const [portraitError, setPortraitError] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Porträt-Parallax
      gsap.to('.about-portrait', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Text-Zeilen gestaffelt enthüllen
      gsap.from('.about-line', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: { trigger: section.current, start: 'top 65%' },
      });

      // Stats Counter
      gsap.from('.about-stat', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: { trigger: '.about-stats', start: 'top 85%' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      id="about"
      className="relative z-10 mx-auto max-w-[1600px] px-6 py-40 md:px-12"
    >
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Porträt */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-carbon">
          <div className="about-portrait absolute inset-0 scale-110">
            {!portraitError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ABOUT.portrait}
                alt={SITE.owner}
                onError={() => setPortraitError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ash to-carbon">
                <span className="font-display text-3xl tracking-tightest text-smoke/30">
                  {SITE.owner}
                </span>
              </div>
            )}
          </div>
          {/* cinematic Vignette overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/20" />
        </div>

        {/* Text */}
        <div>
          <span className="font-mono text-xs uppercase tracking-widest2 text-accent">
            04 — About
          </span>
          <h2 className="about-line readable mt-4 font-display text-5xl font-bold tracking-tightest text-bone md:text-7xl">
            {ABOUT.heading}
          </h2>

          <div className="mt-10 space-y-6">
            {ABOUT.paragraphs.map((p, i) => (
              <p key={i} className="about-line max-w-xl font-body text-lg leading-relaxed text-bone/80">
                {p}
              </p>
            ))}
          </div>

          {/* Stats */}
          <div className="about-stats mt-14 flex gap-12 border-t border-ash pt-10">
            {ABOUT.stats.map((s, i) => (
              <div key={i} className="about-stat">
                <div className="font-display text-4xl tracking-tightest text-bone">{s.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-smoke">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
