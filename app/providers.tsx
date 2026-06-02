'use client';

// ============================================================
//  SMOOTH SCROLL PROVIDER
//  Aktiviert Lenis global. Umschließt die Seiteninhalte.
// ============================================================

import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useSmoothScroll();
  return <>{children}</>;
}
