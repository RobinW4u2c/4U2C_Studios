'use client';

// ============================================================
//  MAUS-POSITION (normalisiert -1 .. 1)
//  Für Parallax / Perspektiv-Shift in der Floating Gallery
//  und im Hero. Touch-Geräte liefern 0,0 (kein Parallax).
// ============================================================

import { useEffect, useRef } from 'react';

export function useMouse() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // normalisiert: links/-1 oben/-1  ->  rechts/1 unten/1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return mouse;
}
