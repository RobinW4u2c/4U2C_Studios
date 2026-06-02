# 4U2C STUDIOS — Robin Werdich

Premium Cinematic Website · Fotografie & Videografie
Next.js 14 (App Router) · TypeScript · React Three Fiber · GSAP · Lenis · Framer Motion · Tailwind · GLSL

---

## ✨ Features

- **3D Hero World** (WebGL / Three.js) — Kamera fliegt durch eine cinematic Welt mit schwebenden Fotos, einem 3D-Video-Screen, Lichtstrahlen, Nebel & Partikeln. Postprocessing: **Bloom + Depth of Field + Vignette + Filmkorn**.
- **Scroll Driven Experience** — Scroll steuert die Kamerafahrt. Smooth Scroll via **Lenis**, synchronisiert mit **GSAP ScrollTrigger**.
- **Floating Gallery** — Bilder auf mehreren Tiefen-Ebenen mit Maus-Parallax (Perspektiv-Shift).
- **Before / After Slider** — RAW vs. Final Edit, ziehbar (Maus + Touch), smooth.
- **Video Showcase** — Hover = Vorschau-Playback, Klick = Vollbild Cinematic Mode (ESC schließt).
- **About Robin** — Cinematic Porträt mit Parallax & Storytelling-Reveals.
- **Contact System** — Vollformular (Name, E-Mail, Projekt-Art, Budget, Nachricht), Validierung, **Resend-ready Backend** + automatischer **mailto-Fallback**.
- **Custom Cursor**, **Preloader**, **Scroll-Progress**, **Grain Overlay**.
- **Mobile Fallback** — Effekte & Partikel reduziert; respektiert `prefers-reduced-motion`.

---

## 📂 Projektstruktur

```
4u2c-studios/
├── app/
│   ├── api/contact/route.ts      # Kontakt-API (Resend-ready)
│   ├── globals.css               # Basis-Styles, Variablen, Utility-Klassen
│   ├── layout.tsx                # Fonts + SEO Metadata
│   ├── page.tsx                  # Haupt-Single-Page (alle Sections)
│   └── providers.tsx             # Lenis Smooth-Scroll Provider
├── components/
│   ├── sections/                 # DOM-Sections
│   │   ├── Hero.tsx
│   │   ├── FloatingGallery.tsx
│   │   ├── BeforeAfter.tsx
│   │   ├── VideoShowcase.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── three/                    # 3D / WebGL
│   │   ├── Scene.tsx             # Canvas-Wrapper (dynamic, no SSR)
│   │   ├── World.tsx            # Szene + Postprocessing
│   │   ├── CameraRig.tsx        # Scroll-gesteuerte Kamera
│   │   ├── FloatingPhoto.tsx    # Foto-Plane (Shader)
│   │   ├── VideoScreen.tsx      # 3D-Video-Plane
│   │   ├── Particles.tsx        # Partikelsystem (Shader)
│   │   └── LightBeams.tsx       # Lichtstrahlen + Licht
│   └── ui/
│       ├── Navbar.tsx
│       ├── Preloader.tsx
│       ├── Cursor.tsx
│       ├── Grain.tsx
│       └── ScrollProgress.tsx
├── hooks/
│   ├── useSmoothScroll.ts        # Lenis + GSAP Sync
│   ├── useScrollProgress.ts      # globaler Scroll 0..1
│   └── useMouse.ts               # Maus -1..1 (Parallax)
├── lib/
│   ├── data.ts                   # ⭐ ALLE INHALTE (Texte/Bilder/Videos)
│   └── utils.ts                  # Helfer (lerp, clamp, mobile …)
├── shaders/                      # GLSL
│   ├── particles.vert / .frag
│   └── photo.vert / .frag
├── public/
│   ├── images/  (README mit benötigten Dateien)
│   └── videos/  (README mit benötigten Dateien)
├── shaders.d.ts                  # GLSL Typdeklarationen
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Installation

Voraussetzung: **Node.js 18.17+** (empfohlen 20 LTS).

```bash
# 1. Ins Projektverzeichnis
cd 4u2c-studios

# 2. Abhängigkeiten installieren
npm install
```

---

## 🧑‍💻 Development (Run)

```bash
npm run dev
```

Dann **http://localhost:3000** öffnen.

> Hinweis: Beim ersten Start lädt `next/font` die Fonts von Google (einmalig, dann lokal gecached). Internetverbindung beim ersten Build nötig.

---

## 🏗️ Build & Production

```bash
npm run build   # Production-Build erstellen
npm start       # Production-Server starten (Port 3000)
```

Typecheck separat:

```bash
npm run typecheck
```

---

## 🖼️ Eigene Inhalte einsetzen

**Alles Inhaltliche liegt in `lib/data.ts`** — Brand, Kontakt, Texte, Bild- und Videopfade, Projekte, Formular-Optionen.

1. Bilder nach `public/images/` legen (siehe `public/images/README.txt` für die exakten Dateinamen).
2. Videos nach `public/videos/` legen (siehe `public/videos/README.txt`).
3. Texte/Links in `lib/data.ts` anpassen.

> Fehlen Assets, zeigt die Seite **elegante Platzhalter** statt kaputter Icons — du kannst also sofort starten und Assets nachreichen.

**Farben / Branding:** in `tailwind.config.ts` (Sektion `colors`) und `app/globals.css` (`:root` Variablen). Akzentfarbe = `accent` / `--accent`.

**Fonts:** in `app/layout.tsx` austauschbar (aktuell Cormorant Garamond / Manrope / JetBrains Mono).

---

## 📧 Kontaktformular aktivieren (Resend)

Ohne Konfiguration nutzt das Formular automatisch **mailto**. Für echten Serverversand:

```bash
npm install resend
```

`.env.local` anlegen (Vorlage: `.env.local.example`):

```
RESEND_API_KEY=dein_resend_key
CONTACT_TO=hello@4u2c-studios.de
CONTACT_FROM="4U2C Studios <noreply@deine-domain.de>"
```

Dann in `app/api/contact/route.ts` den markierten **RESEND-Block einkommentieren**. Fertig.

---

## ☁️ Deployment (Vercel — empfohlen)

1. Repository zu GitHub pushen.
2. Auf [vercel.com](https://vercel.com) importieren.
3. (Optional) Env-Variablen für Resend setzen.
4. Deploy. Vercel erkennt Next.js automatisch.

---

## ⚡ Performance-Hinweise

- 3D-Szene wird via `dynamic(..., { ssr: false })` geladen (kein Server-Crash, kein Hydration-Mismatch).
- DPR begrenzt (mobil `[1,1.5]`, Desktop `[1,2]`).
- Partikelanzahl & Postprocessing auf Mobile reduziert.
- Bilder lazy (`loading="lazy"`), Videos `preload="metadata"`.
- Hero-Texturen idealerweise < 1 MB, als WebP/AVIF exportieren.

---

© 4U2C Studios — Robin Werdich
