'use client';

// ============================================================
//  CINEMATIC BACKGROUND (Premium Atmosphäre)
//  Ersetzt die alte Bilderwand durch einen hochwertigen,
//  filmischen Hintergrund:
//   - tiefer Gradient-Mesh (dunkel, kontrastreich)
//   - sanfte, langsam wandernde Lichtstrahlen (Light Sweeps)
//   - subtiler Nebel / Glow
//   - leichter Maus-Parallax auf den Lichtern
//  Reines CSS/Canvas, sehr performant, kein WebGL nötig.
// ============================================================

import { useEffect, useRef } from 'react';
import { lerp } from '@/lib/utils';

export default function CinematicBackground() {
  const sweep1 = useRef<HTMLDivElement>(null);
  const sweep2 = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mouse = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const loop = () => {
      cur.x = lerp(cur.x, mouse.x, 0.04);
      cur.y = lerp(cur.y, mouse.y, 0.04);
      // Lichter folgen der Maus minimal (Parallax-Tiefe)
      if (glow.current) {
        glow.current.style.transform = `translate(${cur.x * 40}px, ${cur.y * 40}px)`;
      }
      if (sweep1.current) {
        sweep1.current.style.transform = `translate(${cur.x * 20}px, ${cur.y * 15}px) rotate(8deg)`;
      }
      if (sweep2.current) {
        sweep2.current.style.transform = `translate(${cur.x * -25}px, ${cur.y * -18}px) rotate(-12deg)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1] overflow-hidden bg-ink" aria-hidden>
      {/* Basis: tiefer radialer Gradient-Mesh */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, #15151c 0%, #0a0a0c 55%, #060608 100%)',
        }}
      />

      {/* warmer Glow-Kern (Brand-Akzent), folgt der Maus */}
      <div
        ref={glow}
        className="absolute left-1/2 top-1/3 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #c8a96a 0%, transparent 60%)',
        }}
      />

      {/* Lichtstrahl 1 (Light Sweep) – langsam pulsierend */}
      <div
        ref={sweep1}
        className="absolute -left-1/4 top-[-20%] h-[160%] w-[40%] opacity-[0.07] blur-[60px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #e3d3ad, transparent)',
          animation: 'sweepPulse 9s ease-in-out infinite',
        }}
      />
      {/* Lichtstrahl 2 */}
      <div
        ref={sweep2}
        className="absolute right-[-15%] top-[-25%] h-[160%] w-[35%] opacity-[0.05] blur-[70px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #ffffff, transparent)',
          animation: 'sweepPulse 13s ease-in-out infinite 2s',
        }}
      />

      {/* feiner Nebel unten */}
      <div
        className="absolute inset-x-0 bottom-0 h-[50%]"
        style={{ background: 'linear-gradient(to top, rgba(10,10,12,0.9), transparent)' }}
      />

      {/* Vignette für filmische Tiefe */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, transparent 35%, rgba(6,6,8,0.85) 100%)' }}
      />
    </div>
  );
}
