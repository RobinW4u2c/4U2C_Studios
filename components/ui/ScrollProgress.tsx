'use client';

// ============================================================
//  SCROLL-FORTSCHRITTSBALKEN (vertikal, rechts)
//  Zeigt subtil die Position im Dokument.
// ============================================================

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed right-5 top-1/2 z-40 hidden h-40 w-px -translate-y-1/2 bg-ash md:block">
      <div
        className="w-full bg-accent transition-[height] duration-150 ease-linear"
        style={{ height: `${progress}%` }}
      />
    </div>
  );
}
