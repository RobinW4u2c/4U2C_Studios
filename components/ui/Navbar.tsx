'use client';

// ============================================================
//  NAVIGATION (Fixed Header)
//  Smooth-Scroll zu Sections via Lenis. Blendet beim Scrollen
//  einen subtilen Hintergrund ein.
// ============================================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SITE, NAV } from '@/lib/data';
import { getLenis } from '@/hooks/useSmoothScroll';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Smooth-Scroll zu Anker-Sections über Lenis (Fallback: native)
  const goTo = (href: string) => {
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 2.4 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'bg-ink/70 backdrop-blur-md border-b border-ash/60' : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
        {/* Brand */}
        <button onClick={() => goTo('#top')} className="group flex flex-col leading-none">
          <span className="font-display text-lg tracking-tightest text-bone">{SITE.brand}</span>
          <span className="font-mono text-[10px] tracking-widest2 text-smoke">{SITE.owner}</span>
        </button>

        {/* Links (Desktop) */}
        <ul className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => goTo(item.href)}
                className="group relative font-mono text-xs uppercase tracking-widest2 text-smoke transition-colors hover:text-bone"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 ease-cine group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => goTo('#contact')}
          className="rounded-full border border-accent/40 px-5 py-2 font-mono text-[11px] uppercase tracking-widest2 text-accent transition-all duration-500 hover:bg-accent hover:text-ink"
        >
          Let&apos;s talk
        </button>
      </nav>
    </motion.header>
  );
}
