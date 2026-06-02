import type { Config } from 'tailwindcss';

// ============================================================
//  TAILWIND THEME – 4U2C STUDIOS
//  Cinematic / Editorial Look. Farben & Fonts hier zentral.
//  Austauschen: --ink, --accent etc. unten anpassen.
// ============================================================

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Basis Cinematic Dunkel-Palette (lesbarer, premium)
        ink: '#08080b',
        carbon: '#101015',
        ash: '#20202a',
        smoke: '#a8a8b2',
        bone: '#f4f1ea',
        accent: '#d4b074',
        accentSoft: '#ecd9ad',
      },
      fontFamily: {
        // Display Font (Headlines) & Body Font – in globals.css geladen
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.06em',
        widest2: '0.35em',
      },
      transitionTimingFunction: {
        // Apple-artige Easing-Kurve
        cine: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-5%,-5%)' },
          '30%': { transform: 'translate(3%,-2%)' },
          '50%': { transform: 'translate(-2%,4%)' },
          '70%': { transform: 'translate(4%,2%)' },
          '90%': { transform: 'translate(-3%,3%)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 3s linear infinite',
        grain: 'grain 0.6s steps(2) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
