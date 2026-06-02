'use client';

// ============================================================
//  BEFORE / AFTER SLIDER (RAW vs Final Edit)
//  Ziehbarer Trenner. Maus + Touch unterstützt. Sanftes
//  Folgen via Lerp. Bild-Fallback wie in der Galerie.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BEFORE_AFTER } from '@/lib/data';
import { clamp, lerp } from '@/lib/utils';

export default function BeforeAfter() {
  const section = useRef<HTMLElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Zielwert & aktueller (geglätteter) Wert in Prozent
  const target = useRef(50);
  const [pos, setPos] = useState(50);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.ba-reveal', {
        opacity: 0,
        y: 60,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section.current, start: 'top 70%' },
      });
    }, section);

    // Position aus Pointer-Event berechnen
    const setFromClientX = (clientX: number) => {
      const rect = container.current?.getBoundingClientRect();
      if (!rect) return;
      target.current = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    };

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      setFromClientX(e.clientX);
    };
    const onMove = (e: PointerEvent) => {
      if (dragging.current) setFromClientX(e.clientX);
    };
    const onUp = () => { dragging.current = false; };

    const el = container.current;
    el?.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    // smoothes Nachführen
    let raf = 0;
    const loop = () => {
      setPos((p) => lerp(p, target.current, 0.15));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      ctx.revert();
      el?.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={section}
      className="relative z-10 mx-auto max-w-[1400px] px-6 py-40 md:px-12"
    >
      <div className="ba-reveal mb-16 text-center">
        <span className="font-mono text-xs uppercase tracking-widest2 text-accent">
          02 — {BEFORE_AFTER.subtitle}
        </span>
        <h2 className="readable mt-4 font-display text-5xl font-bold tracking-tightest text-bone md:text-7xl">
          {BEFORE_AFTER.title}
        </h2>
      </div>

      {/* Slider */}
      <div
        ref={container}
        className="ba-reveal relative aspect-[16/9] w-full cursor-ew-resize select-none overflow-hidden rounded-sm bg-carbon"
        data-cursor="hover"
      >
        {/* AFTER (Hintergrund, volle Breite) */}
        <BaImage src={BEFORE_AFTER.after} label="FINAL" labelSide="right" />

        {/* BEFORE (clip-path nach Position) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <BaImage src={BEFORE_AFTER.before} label="RAW" labelSide="left" grayscale />
        </div>

        {/* Trenner-Linie + Griff */}
        <div
          className="absolute top-0 bottom-0 z-20 w-px bg-bone/80"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/60 bg-ink/60 backdrop-blur">
            <span className="font-mono text-xs text-bone">↔</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Einzelbild mit Label + Fallback --------------------------
function BaImage({
  src,
  label,
  labelSide,
  grayscale = false,
}: {
  src: string;
  label: string;
  labelSide: 'left' | 'right';
  grayscale?: boolean;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="absolute inset-0">
      {!error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          draggable={false}
          onError={() => setError(true)}
          className={`h-full w-full object-cover ${grayscale ? 'saturate-[0.4] brightness-90' : ''}`}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center ${
            grayscale ? 'bg-ash' : 'bg-gradient-to-br from-carbon to-ash'
          }`}
        >
          <span className="font-display text-3xl tracking-tightest text-smoke/30">{label}</span>
        </div>
      )}

      <span
        className={`absolute top-5 ${
          labelSide === 'left' ? 'left-5' : 'right-5'
        } rounded-full bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 text-bone backdrop-blur`}
      >
        {label}
      </span>
    </div>
  );
}
