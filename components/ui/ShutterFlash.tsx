'use client';

// ============================================================
//  SHUTTER FLASH OVERLAY ("in der Linse"-Moment)
//  - Weißer Blitz, wenn die 3D-Kamera auslöst
//  - Danach eine Blenden-Iris (Aperture Blades), die sich
//    kurz schließt und wieder öffnet -> als wäre man in der
//    Linse / im Sucher.
//  Gesteuert über eine global geteilte Trigger-Funktion.
// ============================================================

import { useEffect, useRef, useState } from 'react';

// global geteilter Trigger: FlyingCamera ruft window-Event,
// dieses Overlay hört darauf. Entkoppelt R3F von DOM.
export function triggerShutterFlash() {
  window.dispatchEvent(new CustomEvent('shutter-flash'));
}

export default function ShutterFlash() {
  const [flashing, setFlashing] = useState(false);
  const [iris, setIris] = useState(false);
  const cooldown = useRef(false);

  useEffect(() => {
    const onFlash = () => {
      if (cooldown.current) return; // Mehrfach-Trigger vermeiden
      cooldown.current = true;

      // 1) greller Flash
      setFlashing(true);
      setTimeout(() => setFlashing(false), 180);

      // 2) Iris/Blende schließt sich kurz
      setTimeout(() => setIris(true), 60);
      setTimeout(() => setIris(false), 700);

      // Cooldown bis nächster Zyklus erlaubt ist
      setTimeout(() => { cooldown.current = false; }, 2000);
    };

    window.addEventListener('shutter-flash', onFlash);
    return () => window.removeEventListener('shutter-flash', onFlash);
  }, []);

  return (
    <>
      {/* WEISSER BLITZ */}
      <div
        className="pointer-events-none fixed inset-0 z-[70] bg-white transition-opacity duration-150"
        style={{ opacity: flashing ? 0.85 : 0 }}
        aria-hidden
      />

      {/* BLENDEN-IRIS (Aperture Blades als SVG, 8 Lamellen) */}
      <div
        className="pointer-events-none fixed inset-0 z-[69] flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: iris ? 1 : 0 }}
        aria-hidden
      >
        <svg
          viewBox="0 0 100 100"
          className="h-[140vmax] w-[140vmax] transition-transform duration-700 ease-cine"
          style={{ transform: iris ? 'scale(1)' : 'scale(1.6)' }}
        >
          {/* 8 Blenden-Lamellen, rotierend angeordnet */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <polygon
                key={i}
                points="50,50 50,-20 90,-5"
                fill="#0a0a0c"
                transform={`rotate(${angle} 50 50)`}
                opacity={0.97}
              />
            );
          })}
          {/* feiner Rand-Ring */}
          <circle cx="50" cy="50" r="49" fill="none" stroke="#c8a96a" strokeWidth="0.4" opacity="0.5" />
        </svg>
      </div>
    </>
  );
}
