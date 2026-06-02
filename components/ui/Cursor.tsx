'use client';

// ============================================================
//  CUSTOM CURSOR
//  Folgt der Maus mit Lerp, vergrößert sich bei Hover über
//  interaktive Elemente. Auf Touch-Geräten deaktiviert.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { isMobileDevice, lerp } from '@/lib/utils';

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isMobileDevice()) return;
    setEnabled(true);

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: mouse.x, y: mouse.y };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      }
    };

    // Ring folgt verzögert (smooth)
    const loop = () => {
      ringPos.x = lerp(ringPos.x, mouse.x, 0.15);
      ringPos.y = lerp(ringPos.y, mouse.y, 0.15);
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    // Hover-Vergrößerung über interaktive Elemente
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [data-cursor="hover"]');
      if (ring.current) {
        ring.current.style.width = interactive ? '56px' : '32px';
        ring.current.style.height = interactive ? '56px' : '32px';
        ring.current.style.borderColor = interactive ? 'var(--accent)' : 'rgba(236,232,225,0.4)';
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ marginLeft: '-3px', marginTop: '-3px' }}
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-8 w-8 rounded-full border transition-[width,height,border-color] duration-300 ease-cine"
        style={{ marginLeft: '-16px', marginTop: '-16px', borderColor: 'rgba(236,232,225,0.4)' }}
      />
    </>
  );
}
