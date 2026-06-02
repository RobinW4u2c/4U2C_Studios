// ============================================================
//  ALLGEMEINE UTILITIES
// ============================================================

// className merger (klein gehalten, keine Extra-Dependency nötig)
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Clamp-Helfer für Mathe (z.B. Scroll-Progress)
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// lineares Mapping von einem Bereich in einen anderen
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

// lineare Interpolation (für smoothes Easing)
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// einfache Mobile-Erkennung (für 3D-Fallback). Nur clientseitig aufrufen.
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  );
}

// prüft ob Nutzer reduzierte Bewegung bevorzugt (Accessibility)
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
