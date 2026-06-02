'use client';

// ============================================================
//  FILMKORN OVERLAY
//  Liegt über allem (pointer-events: none) und gibt der Seite
//  eine analoge, cinematic Textur. Reines CSS/SVG-Noise.
// ============================================================

export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] opacity-[0.06] mix-blend-overlay animate-grain"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: '180px 180px',
      }}
    />
  );
}
