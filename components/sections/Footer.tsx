'use client';

// ============================================================
//  FOOTER – das saubere Ende der Seite
//  OPAKER Hintergrund (deckt 3D-Welt & Hintergrund ab) +
//  umlaufender Rahmen, damit die Seite sichtbar "abschließt"
//  und sich kein Endlos-Scroll-Gefühl mehr einstellt.
// ============================================================

import { SITE, NAV } from '@/lib/data';
import { getLenis } from '@/hooks/useSmoothScroll';

export default function Footer() {
  const year = new Date().getFullYear();

  const goTo = (href: string) => {
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // relative + z-20 + OPAKER bg: schließt die Seite vollständig ab
    <footer className="relative z-20 bg-ink">
      {/* feiner Trennstrich oben (Brand-Akzent) */}
      <div className="mx-auto h-px max-w-[1600px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* großer Call-Schriftzug als Abschluss */}
      <div className="mx-auto max-w-[1600px] px-6 pt-24 pb-12 md:px-12">
        <div className="border-b border-ash pb-16">
          <p className="eyebrow mb-5">Bereit für dein Projekt?</p>
          <button
            onClick={() => goTo('#contact')}
            data-cursor="hover"
            className="group block text-left"
          >
            <span className="block font-display text-[12vw] font-bold leading-[0.9] tracking-tightest text-bone transition-colors duration-500 group-hover:text-accent md:text-[7vw]">
              Let&apos;s create.
            </span>
          </button>
        </div>

        {/* Info-Zeile */}
        <div className="mt-16 flex flex-col items-start justify-between gap-12 md:flex-row">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tightest text-bone">
              {SITE.brand}
            </h3>
            <p className="mt-2 font-body text-sm text-smoke">
              {SITE.owner} · {SITE.role}
            </p>
            <p className="mt-1 font-body text-sm text-smoke">{SITE.location}</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 inline-block font-mono text-sm text-accent transition-colors hover:text-accentSoft"
            >
              {SITE.email}
            </a>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <span className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-smoke/60">
              Navigation
            </span>
            {NAV.map((item) => (
              <button
                key={item.href}
                onClick={() => goTo(item.href)}
                data-cursor="hover"
                className="text-left font-body text-sm text-bone/80 transition-colors hover:text-accent"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-3">
            <span className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-smoke/60">
              Social
            </span>
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="font-body text-sm text-bone/80 transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* untere Leiste */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ash pt-8 md:flex-row md:items-center">
          <span className="font-mono text-[11px] text-smoke">
            © {year} {SITE.brand}. Alle Rechte vorbehalten.
          </span>
          <div className="flex gap-6">
            {/* HIER: echte Links zu Impressum/Datenschutz einsetzen */}
            <a href="#" data-cursor="hover" className="font-mono text-[11px] text-smoke transition-colors hover:text-bone">
              Impressum
            </a>
            <a href="#" data-cursor="hover" className="font-mono text-[11px] text-smoke transition-colors hover:text-bone">
              Datenschutz
            </a>
          </div>
        </div>

        {/* 3D-Modell Credit – PFLICHT bei CC-BY (nicht entfernen) */}
        <p className="mt-6 font-mono text-[10px] leading-relaxed text-smoke/50">
          3D-Blende basiert auf &laquo;Lens Diaphragm&raquo; von jvvince (Sketchfab), lizenziert unter CC-BY-4.0.
        </p>
      </div>
    </footer>
  );
}
