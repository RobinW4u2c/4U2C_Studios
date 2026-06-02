'use client';

// ============================================================
//  MAGNETIC BUTTON
//  Der Button wird vom Cursor "angezogen" und federt zurück.
//  Wrappt beliebigen Inhalt. Auf Touch deaktiviert.
// ============================================================

import { useRef } from 'react';
import { lerp } from '@/lib/utils';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // wie stark angezogen wird (Pixel)
  onClick?: () => void;
}

export default function Magnetic({ children, className = '', strength = 28, onClick }: MagneticProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const raf = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });

  const animate = () => {
    cur.current.x = lerp(cur.current.x, target.current.x, 0.18);
    cur.current.y = lerp(cur.current.y, target.current.y, 0.18);
    if (ref.current) {
      ref.current.style.transform = `translate(${cur.current.x}px, ${cur.current.y}px)`;
    }
    raf.current = requestAnimationFrame(animate);
  };

  const onEnter = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(animate);
  };

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    // Distanz vom Button-Zentrum, skaliert auf strength
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    target.current = { x: relX * strength, y: relY * strength };
  };

  const onLeave = () => {
    target.current = { x: 0, y: 0 };
    // sanft zurückfedern, dann Loop stoppen
    setTimeout(() => cancelAnimationFrame(raf.current), 600);
  };

  return (
    <button
      ref={ref}
      className={className}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      data-cursor="hover"
      style={{ willChange: 'transform' }}
    >
      {children}
    </button>
  );
}
