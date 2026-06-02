'use client';

// ============================================================
//  FLOATING GALLERY (Section: Work)
//  DOM-basierte Galerie mit Maus-Parallax (Perspektiv-Shift)
//  und Scroll-Reveal. Bilder schweben auf verschiedenen
//  Tiefen-Ebenen. Fehlt ein Bild, zeigt sich ein eleganter
//  Platzhalter (kein Broken-Image-Icon).
// ============================================================

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GALLERY } from '@/lib/data';
import { lerp } from '@/lib/utils';

export default function FloatingGallery() {
  const section = useRef<HTMLElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1) Scroll-Reveal der Karten
    const ctx = gsap.context(() => {
      gsap.from('.gal-card', {
        opacity: 0,
        y: 80,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: section.current, start: 'top 70%' },
      });
    }, section);

    // 2) Maus-Parallax: Karten verschieben sich je nach data-depth
    const mouse = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const loop = () => {
      current.x = lerp(current.x, mouse.x, 0.06);
      current.y = lerp(current.y, mouse.y, 0.06);
      const cards = layer.current?.querySelectorAll<HTMLElement>('.gal-card');
      cards?.forEach((card) => {
        const depth = parseFloat(card.dataset.depth || '1');
        card.style.transform = `translate3d(${current.x * 18 * depth}px, ${current.y * 18 * depth}px, 0)`;
      });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={section}
      id="work"
      className="relative z-10 mx-auto min-h-screen max-w-[1600px] px-6 py-32 md:px-12"
    >
      {/* Section Header */}
      <div className="mb-20 flex items-end justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest2 text-accent">01 — Work</span>
          <h2 className="mt-4 font-display text-5xl tracking-tightest text-bone md:text-7xl">
            Selected Frames
          </h2>
        </div>
        <span className="hidden font-mono text-xs text-smoke md:block">
          Move your cursor — the gallery responds.
        </span>
      </div>

      {/* Galerie-Grid mit Parallax-Tiefen */}
      <div ref={layer} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY.map((g, i) => (
          <GalleryCard key={i} {...g} depth={(i % 3) + 0.5} index={i} />
        ))}
      </div>
    </section>
  );
}

// --- einzelne Galerie-Karte mit Bild-Fallback -----------------
function GalleryCard({
  src,
  title,
  category,
  depth,
  index,
}: {
  src: string;
  title: string;
  category: string;
  depth: number;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <figure
      className="gal-card glow-border group relative aspect-[4/5] overflow-hidden rounded-sm bg-carbon"
      data-depth={depth}
      data-cursor="hover"
      style={{ marginTop: index % 2 === 1 ? '3rem' : '0' }}
    >
      {/* Bild oder eleganter Platzhalter */}
      {!error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`h-full w-full object-cover transition-all duration-700 ease-cine group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ash to-carbon">
          <span className="font-display text-2xl tracking-tightest text-smoke/40">{title}</span>
        </div>
      )}

      {/* Overlay-Infos */}
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/90 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="font-display text-xl text-bone">{title}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-accent">
          {category}
        </span>
      </figcaption>
    </figure>
  );
}
