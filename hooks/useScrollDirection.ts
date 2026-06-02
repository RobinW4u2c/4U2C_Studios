'use client';

// ============================================================
//  SCROLL-RICHTUNG + FORTSCHRITT (für die fliegende Kamera)
//  Liefert:
//    progress  : 0..1 Position im Dokument
//    direction : +1 runter, -1 hoch, 0 ruht (klingt schnell ab)
//  Richtung wird nur kurz nach echter Scroll-Bewegung gehalten.
// ============================================================

import { useEffect, useRef } from 'react';
import { clamp } from '@/lib/utils';

export function useScrollDirection() {
  const progress = useRef(0);
  const direction = useRef(0);
  const lastY = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;

      const dy = window.scrollY - lastY.current;
      lastY.current = window.scrollY;
      if (Math.abs(dy) > 0.5) {
        direction.current = dy > 0 ? 1 : -1;
        // nach kurzer Ruhe Richtung auf 0 (Kamera ruht)
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => { direction.current = 0; }, 120);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // getter, den die 3D-Komponente im Frameloop aufruft
  const getScroll = () => ({ progress: progress.current, direction: direction.current });
  return getScroll;
}
