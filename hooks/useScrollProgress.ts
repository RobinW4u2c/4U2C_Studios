'use client';

// ============================================================
//  GLOBALER SCROLL-FORTSCHRITT (0 = oben, 1 = ganz unten)
//  Wird vom 3D-Kamera-Rig genutzt, um die Kamera durch die
//  Welt zu fliegen. Geglättet via requestAnimationFrame.
// ============================================================

import { useEffect, useRef } from 'react';
import { clamp, lerp } from '@/lib/utils';

export function useScrollProgress() {
  // raw = tatsächlicher Scroll, smooth = geglätteter Wert
  const raw = useRef(0);
  const smooth = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      raw.current = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // gibt eine Update-Funktion zurück, die im R3F-Frameloop
  // aufgerufen wird und den geglätteten Fortschritt liefert.
  const update = (factor = 0.08): number => {
    smooth.current = lerp(smooth.current, raw.current, factor);
    return smooth.current;
  };

  return { update, getRaw: () => raw.current };
}
