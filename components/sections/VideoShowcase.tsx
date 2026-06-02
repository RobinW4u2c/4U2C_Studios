'use client';

// ============================================================
//  VIDEO SHOWCASE
//  - Hover über Karte = Vorschau-Playback (muted)
//  - Klick = Vollbild Cinematic Mode (mit Ton, Controls)
//  Mehrere Projekte aus lib/data (VIDEOS).
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VIDEOS } from '@/lib/data';

export default function VideoShowcase() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState<(typeof VIDEOS)[number] | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.vid-card', {
        opacity: 0,
        y: 70,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: section.current, start: 'top 70%' },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  // Fullscreen schließen mit ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section
      ref={section}
      id="showcase"
      className="relative z-10 mx-auto max-w-[1600px] px-6 py-32 md:px-12"
    >
      <div className="mb-20">
        <span className="font-mono text-xs uppercase tracking-widest2 text-accent">
          03 — Showreel
        </span>
        <h2 className="mt-4 font-display text-5xl tracking-tightest text-bone md:text-7xl">
          Motion Work
        </h2>
      </div>

      {/* Video-Karten */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((v) => (
          <VideoCard key={v.id} video={v} onOpen={() => setActive(v)} />
        ))}
      </div>

      {/* Fullscreen Cinematic Mode */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-lg md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={active.src}
                poster={active.poster}
                controls
                autoPlay
                playsInline
                className="aspect-video w-full rounded-sm bg-black"
              />
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl text-bone">{active.title}</h3>
                  <p className="font-mono text-xs text-smoke">
                    {active.client} · {active.year}
                  </p>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="rounded-full border border-ash px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 text-smoke transition-colors hover:border-accent hover:text-accent"
                >
                  Close · ESC
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// --- einzelne Video-Karte mit Hover-Preview -------------------
function VideoCard({
  video,
  onOpen,
}: {
  video: (typeof VIDEOS)[number];
  onOpen: () => void;
}) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [posterError, setPosterError] = useState(false);

  const onEnter = () => {
    const el = vidRef.current;
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => { /* Autoplay evtl. blockiert */ });
    }
  };
  const onLeave = () => {
    const el = vidRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  };

  return (
    <div
      className="vid-card glow-border group relative aspect-video cursor-pointer overflow-hidden rounded-sm bg-carbon"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onOpen}
      data-cursor="hover"
    >
      {/* Vorschau-Video (muted, spielt nur bei Hover) */}
      <video
        ref={vidRef}
        src={video.src}
        poster={posterError ? undefined : video.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover transition-transform duration-700 ease-cine group-hover:scale-105"
        onError={() => setPosterError(true)}
      />

      {/* Dunkles Overlay + Play-Icon */}
      <div className="absolute inset-0 flex items-center justify-center bg-ink/30 transition-opacity duration-500 group-hover:bg-ink/10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-bone/40 backdrop-blur transition-transform duration-500 group-hover:scale-110">
          <span className="ml-1 text-xl text-bone">▶</span>
        </div>
      </div>

      {/* Info-Leiste */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/90 to-transparent p-5">
        <div>
          <h3 className="font-display text-xl text-bone">{video.title}</h3>
          <p className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">
            {video.client}
          </p>
        </div>
        <span className="font-mono text-[10px] text-accent">{video.year}</span>
      </div>
    </div>
  );
}
