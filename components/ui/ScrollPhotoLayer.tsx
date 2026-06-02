'use client';

// ============================================================
//  SCROLL PHOTO LAYER (Hintergrundbilder, scroll-gekoppelt)
//  Wenige Fotos schweben auf Tiefen-Ebenen HINTER dem Inhalt.
//  ALLE Bewegungen sind an den Scroll-Fortschritt gebunden
//  (GSAP ScrollTrigger scrub) -> beim Hochscrollen laufen sie
//  sauber rückwärts. Effekte: Parallax (Y), sanfter Zoom,
//  Ein-/Ausblenden. Liegt zwischen Background (z1) und 3D (z2).
//  Fehlt ein Bild -> unsichtbar (kein Broken-Icon).
// ============================================================

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GALLERY } from '@/lib/data';

// Positionen der schwebenden Hintergrundbilder (vw/vh-basiert)
const FRAMES = [
  { src: GALLERY[0]?.src, top: '12%', left: '6%', w: '20vw', depth: 1.0, rot: -4 },
  { src: GALLERY[2]?.src, top: '55%', left: '72%', w: '22vw', depth: 1.6, rot: 5 },
  { src: GALLERY[4]?.src, top: '120%', left: '10%', w: '18vw', depth: 1.2, rot: 3 },
  { src: GALLERY[1]?.src, top: '175%', left: '68%', w: '21vw', depth: 1.8, rot: -6 },
  { src: GALLERY[5]?.src, top: '230%', left: '14%', w: '19vw', depth: 1.4, rot: 4 },
];

export default function ScrollPhotoLayer() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.bg-frame').forEach((el) => {
        const depth = parseFloat(el.dataset.depth || '1');
        // Parallax + Zoom, komplett scroll-gekoppelt (scrub) -> reversibel
        gsap.fromTo(
          el,
          { yPercent: 18 * depth, scale: 0.92, opacity: 0 },
          {
            yPercent: -18 * depth,
            scale: 1.06,
            opacity: 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
            },
          }
        );
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {FRAMES.map((f, i) => (
        <Frame key={i} {...f} />
      ))}
    </div>
  );
}

function Frame({
  src, top, left, w, depth, rot,
}: {
  src?: string; top: string; left: string; w: string; depth: number; rot: number;
}) {
  const [error, setError] = useState(false);
  if (!src || error) {
    // kein Bild -> nichts rendern (sauber)
    if (src) {
      // versteckt versuchen zu laden, um error zu setzen
    }
  }
  return (
    <div
      className="bg-frame absolute overflow-hidden rounded-sm"
      data-depth={depth}
      style={{ top, left, width: w, aspectRatio: '4 / 5', transform: `rotate(${rot}deg)`, filter: 'grayscale(0.3) brightness(0.7)' }}
    >
      {src && !error && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      )}
      {/* dunkler Schleier, damit Hintergrundbilder nicht vom Inhalt ablenken */}
      <div className="absolute inset-0 bg-ink/40" />
    </div>
  );
}
