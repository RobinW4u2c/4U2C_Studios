'use client';

// ============================================================
//  REALISTISCHE BLENDEN-IRIS + FLASH ("in der Linse")
//  - Realistische Lamellen (gekrümmt, überlappend) wie ein
//    echtes Objektiv, mattschwarz, mit gravierter Beschriftung
//    und leuchtendem Gold-Konturring.
//  - Wird über Scroll gesteuert:
//      runter scrollen -> schließt + Blitz (einmalig, Cooldown)
//      hoch scrollen   -> öffnet wieder (reverse, kein Blitz)
//
//  Steuerung kommt aus FlyingCamera via window-Events:
//    'shutter-close'  (mit detail.flash: boolean)
//    'shutter-open'
// ============================================================

import { useEffect, useRef, useState } from 'react';

// Trigger-Helfer, die FlyingCamera aufruft
export function shutterClose(withFlash: boolean) {
  window.dispatchEvent(new CustomEvent('shutter-close', { detail: { flash: withFlash } }));
}
export function shutterOpen() {
  window.dispatchEvent(new CustomEvent('shutter-open'));
}
// Rückwärtskompatibel (falls noch irgendwo aufgerufen)
export function triggerShutterFlash() {
  shutterClose(true);
}

// Anzahl Lamellen (wie echtes Objektiv)
const BLADES = 9;

export default function ShutterFlash() {
  // closeAmount: 0 = ganz offen, 1 = fast geschlossen
  const [closeAmount, setCloseAmount] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const targetClose = useRef(0);
  const flashCooldown = useRef(false);

  useEffect(() => {
    const onClose = (e: Event) => {
      const withFlash = (e as CustomEvent).detail?.flash;
      targetClose.current = 1;
      if (withFlash && !flashCooldown.current) {
        flashCooldown.current = true;
        setFlashing(true);
        setTimeout(() => setFlashing(false), 160);
        setTimeout(() => { flashCooldown.current = false; }, 1200);
      }
    };
    const onOpen = () => { targetClose.current = 0; };

    window.addEventListener('shutter-close', onClose);
    window.addEventListener('shutter-open', onOpen);

    // sanftes Interpolieren der Iris-Position
    let raf = 0;
    const loop = () => {
      setCloseAmount((c) => c + (targetClose.current - c) * 0.12);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('shutter-close', onClose);
      window.removeEventListener('shutter-open', onOpen);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Lamellen-Geometrie: jede Lamelle ist ein gekrümmtes Segment,
  // das sich zur Mitte schiebt, je größer closeAmount.
  // Bei closeAmount 0 sind sie am Rand (offen), bei 1 fast zu.
  const center = 50;
  // wie weit die Lamellenspitze zur Mitte reicht
  const reach = 8 + closeAmount * 34; // 8 (offen) -> 42 (fast zu)

  const blades = Array.from({ length: BLADES }).map((_, i) => {
    const angle = (i * 360) / BLADES;
    // gekrümmte Lamelle via quadratischer Bezier-Kurve
    const a0 = (angle - 360 / BLADES / 1.6) * (Math.PI / 180);
    const a1 = (angle + 360 / BLADES / 1.6) * (Math.PI / 180);
    const rOuter = 62;
    // äußere Ankerpunkte (am Lamellen-Ring)
    const x0 = center + Math.cos(a0) * rOuter;
    const y0 = center + Math.sin(a0) * rOuter;
    const x1 = center + Math.cos(a1) * rOuter;
    const y1 = center + Math.sin(a1) * rOuter;
    // innere Spitze (wandert zur Mitte)
    const aMid = (angle * Math.PI) / 180;
    const xi = center + Math.cos(aMid) * reach;
    const yi = center + Math.sin(aMid) * reach;
    // Kontrollpunkt für die Krümmung (seitlich versetzt = gebogene Kante)
    const aCtrl = ((angle + 22) * Math.PI) / 180;
    const cx = center + Math.cos(aCtrl) * (reach + 18);
    const cy = center + Math.sin(aCtrl) * (reach + 18);

    return `M ${x0} ${y0} L ${x1} ${y1} Q ${cx} ${cy} ${xi} ${yi} Z`;
  });

  // Iris ist sichtbar, sobald sie sich auch nur leicht schließt
  const irisVisible = closeAmount > 0.01;

  return (
    <>
      {/* WEISSER BLITZ */}
      <div
        className="pointer-events-none fixed inset-0 z-[72] bg-white transition-opacity duration-150"
        style={{ opacity: flashing ? 0.8 : 0 }}
        aria-hidden
      />

      {/* REALISTISCHE LINSE / IRIS */}
      <div
        className="pointer-events-none fixed inset-0 z-[71] flex items-center justify-center"
        style={{ opacity: irisVisible ? 1 : 0, transition: 'opacity 0.4s ease' }}
        aria-hidden
      >
        <svg
          viewBox="0 0 100 100"
          className="h-[150vmax] w-[150vmax]"
          style={{
            // leichtes Zoomen, damit es "atmet"
            transform: `scale(${1 + (1 - closeAmount) * 0.05})`,
          }}
        >
          <defs>
            {/* radialer Verlauf für matte Lamellen-Tiefe */}
            <radialGradient id="bladeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1a1f" />
              <stop offset="70%" stopColor="#0d0d10" />
              <stop offset="100%" stopColor="#050506" />
            </radialGradient>
            {/* sanfter Glow für die Gold-Kontur */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Lamellen */}
          <g filter="url(#goldGlow)">
            {blades.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="url(#bladeGrad)"
                stroke="#c8a96a"
                strokeWidth="0.18"
                strokeOpacity="0.45"
              />
            ))}
          </g>

          {/* leuchtender Gold-Konturring (innen) */}
          <circle
            cx="50"
            cy="50"
            r={reach + 1}
            fill="none"
            stroke="#e3d3ad"
            strokeWidth="0.3"
            strokeOpacity={0.6 * closeAmount}
            filter="url(#goldGlow)"
          />
        </svg>
      </div>
    </>
  );
}
