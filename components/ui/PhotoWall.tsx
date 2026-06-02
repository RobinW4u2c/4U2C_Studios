'use client';

// ============================================================
//  DRIFTING PHOTO WALL (Hintergrund-Bilderwand)
//  Mehrere Spalten mit Fotos, die endlos langsam nach oben/
//  unten driften (gegenläufig) + leichter Maus-Parallax.
//  Liegt hinter den Inhalten, dunkel abgedunkelt für Lesbarkeit.
//  Fehlende Bilder -> elegante Platzhalter (kein Broken-Icon).
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { GALLERY, HERO_PHOTOS } from '@/lib/data';
import { lerp } from '@/lib/utils';

// Bildquellen aus vorhandenen Daten sammeln (Galerie + Hero)
const SOURCES = [
  ...GALLERY.map((g) => g.src),
  ...HERO_PHOTOS.map((p) => p.src),
];

// in 4 Spalten aufteilen (verdoppelt für nahtlose Endlos-Schleife)
function buildColumns(): string[][] {
  const cols: string[][] = [[], [], [], []];
  SOURCES.forEach((src, i) => cols[i % 4].push(src));
  // jede Spalte verdoppeln für loop
  return cols.map((c) => [...c, ...c, ...c]);
}

export default function PhotoWall() {
  const wrap = useRef<HTMLDivElement>(null);
  const [columns] = useState(buildColumns);

  useEffect(() => {
    // sanfter Maus-Parallax auf der gesamten Wand
    const mouse = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const loop = () => {
      cur.x = lerp(cur.x, mouse.x, 0.05);
      cur.y = lerp(cur.y, mouse.y, 0.05);
      if (wrap.current) {
        wrap.current.style.transform = `translate3d(${cur.x * 25}px, ${cur.y * 25}px, 0) scale(1.1)`;
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
      {/* die Wand selbst */}
      <div
        ref={wrap}
        className="absolute inset-0 grid grid-cols-2 gap-3 will-change-transform md:grid-cols-4"
        style={{ transform: 'scale(1.1)' }}
      >
        {columns.map((col, ci) => (
          <div
            key={ci}
            className="flex flex-col gap-3"
            style={{
              // gegenläufige Drift: gerade Spalten hoch, ungerade runter
              animation: `${ci % 2 === 0 ? 'driftUp' : 'driftDown'} ${38 + ci * 6}s linear infinite`,
            }}
          >
            {col.map((src, i) => (
              <WallImage key={`${ci}-${i}`} src={src} index={ci + i} />
            ))}
          </div>
        ))}
      </div>

      {/* Abdunkelung + Vignette für Lesbarkeit des Texts darüber */}
      <div className="pointer-events-none absolute inset-0 bg-ink/72" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, transparent 30%, rgba(10,10,12,0.85) 100%)' }}
      />
    </div>
  );
}

// einzelnes Bild mit Fallback
function WallImage({ src, index }: { src: string; index: number }) {
  const [error, setError] = useState(false);
  return (
    <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-carbon">
      {!error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setError(true)}
          className="h-full w-full object-cover opacity-80 grayscale-[0.2]"
        />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background:
              index % 2 === 0
                ? 'linear-gradient(135deg, #1c1c22, #121216)'
                : 'linear-gradient(135deg, #121216, #1c1c22)',
          }}
        />
      )}
    </div>
  );
}
