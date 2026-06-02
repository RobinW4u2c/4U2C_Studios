'use client';

// ============================================================
//  LENIS SMOOTH SCROLL + GSAP SCROLLTRIGGER SYNC
//  Stellt globales, weiches Scrolling bereit und verbindet
//  es mit GSAP, damit ScrollTrigger korrekt mitläuft.
// ============================================================

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/utils';

// globale Lenis-Instanz, damit andere Komponenten darauf zugreifen können
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useSmoothScroll() {
  useEffect(() => {
    // Wenn Nutzer reduzierte Bewegung will: kein Smooth Scroll
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,                 // Scroll-Dauer (höher = weicher/träger)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponentielles Easing
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisInstance = lenis;

    // Lenis-Scroll an GSAP ScrollTrigger koppeln
    lenis.on('scroll', ScrollTrigger.update);

    // Lenis im GSAP-Ticker laufen lassen (ein einziger RAF-Loop)
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
