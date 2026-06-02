// ============================================================
//  ROOT LAYOUT
//  Lädt Fonts (Display: Cormorant Garamond, Body: Manrope,
//  Mono: JetBrains Mono) und globale Styles. Setzt Metadata
//  für SEO / Social Sharing.
// ============================================================

import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/data';

// --- Fonts (selbst-hostend via next/font, kein FOUT) ----------
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// --- SEO Metadata --------------------------------------------
export const metadata: Metadata = {
  title: `${SITE.brand} — ${SITE.owner} | ${SITE.role}`,
  description: `${SITE.tagline} Premium Fotografie & Videografie von ${SITE.owner}.`,
  keywords: ['Fotograf', 'Videograf', 'Cinematic', 'Ravensburg', SITE.brand, SITE.owner],
  authors: [{ name: SITE.owner }],
  openGraph: {
    title: `${SITE.brand} — ${SITE.owner}`,
    description: SITE.tagline,
    type: 'website',
    locale: 'de_DE',
    // HIER: echtes OG-Bild eintragen (1200x630)
    images: ['/images/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
