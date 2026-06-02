'use client';

// ============================================================
//  FOOTER
//  Brand, Social-Links, rechtliche Links, Copyright.
// ============================================================

import { SITE } from '@/lib/data';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-ash bg-ink/80 backdrop-blur">
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-12">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-center">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl tracking-tightest text-bone">{SITE.brand}</h3>
            <p className="mt-2 font-mono text-xs text-smoke">
              {SITE.owner} · {SITE.role}
            </p>
            <p className="mt-1 font-mono text-xs text-smoke">{SITE.location}</p>
          </div>

          {/* Socials */}
          <div className="flex gap-8">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="group relative font-mono text-xs uppercase tracking-widest2 text-smoke transition-colors hover:text-bone"
              >
                {s.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-ash pt-8 md:flex-row md:items-center">
          <span className="font-mono text-[10px] text-smoke">
            © {year} {SITE.brand}. Alle Rechte vorbehalten.
          </span>
          <div className="flex gap-6">
            {/* HIER: echte Links zu Impressum/Datenschutz einsetzen */}
            <a href="#" className="font-mono text-[10px] text-smoke hover:text-bone">
              Impressum
            </a>
            <a href="#" className="font-mono text-[10px] text-smoke hover:text-bone">
              Datenschutz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
