'use client';

// ============================================================
//  PAGE FRAME – cinematic Rahmen um die gesamte Seite
//  Feiner, fixer Rahmen (wie ein Filmkader / Sucher-Rahmen)
//  der der Seite einen edlen, abgeschlossenen Look gibt.
//  Liegt über allem, ohne Interaktion zu blockieren.
// ============================================================

export default function PageFrame() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      {/* dünner Rahmen mit etwas Abstand zum Rand */}
      <div className="absolute inset-3 rounded-sm border border-bone/10 md:inset-5" />
      {/* Ecken-Marken (wie Sucher-Ecken einer Kamera) */}
      {[
        'left-3 top-3 md:left-5 md:top-5 border-l border-t',
        'right-3 top-3 md:right-5 md:top-5 border-r border-t',
        'left-3 bottom-3 md:left-5 md:bottom-5 border-l border-b',
        'right-3 bottom-3 md:right-5 md:bottom-5 border-r border-b',
      ].map((pos, i) => (
        <span key={i} className={`absolute h-5 w-5 border-accent/50 ${pos}`} />
      ))}
    </div>
  );
}
