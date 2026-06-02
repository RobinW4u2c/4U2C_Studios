'use client';

// ============================================================
//  HAUPTSEITE (Single-Page Experience)
//  - 3D-Welt via dynamic() OHNE SSR (Three.js braucht window)
//  - Lenis Smooth Scroll Provider
//  - alle Sections in Reihenfolge
//  Reihenfolge der Sections = Reihenfolge des Kamera-Fluges.
// ============================================================

import dynamic from 'next/dynamic';

import SmoothScrollProvider from './providers';
import Preloader from '@/components/ui/Preloader';
import Navbar from '@/components/ui/Navbar';
import Cursor from '@/components/ui/Cursor';
import Grain from '@/components/ui/Grain';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CinematicBackground from '@/components/ui/CinematicBackground';
import ScrollPhotoLayer from '@/components/ui/ScrollPhotoLayer';

import Hero from '@/components/sections/Hero';
import FloatingGallery from '@/components/sections/FloatingGallery';
import BeforeAfter from '@/components/sections/BeforeAfter';
import VideoShowcase from '@/components/sections/VideoShowcase';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

// 3D Scene lazy laden (kein SSR, kein Server-Crash durch WebGL)
const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => null,
});

export default function Page() {
  return (
    <SmoothScrollProvider>
      {/* Intro */}
      <Preloader />

      {/* globale Overlays */}
      <Cursor />
      <Grain />
      <ScrollProgress />
      <Navbar />

      {/* Cinematic Atmosphäre-Hintergrund (z-1) */}
      <CinematicBackground />

      {/* 3D-Welt darüber (fixed, z-0 -> wir heben auf z-[2]) */}
      <Scene />

      {/* Inhalte über der 3D-Welt */}
      <main className="relative">
        {/* Scroll-gekoppelte Hintergrundbilder (über ganze Höhe) */}
        <ScrollPhotoLayer />

        <Hero />
        <FloatingGallery />
        <BeforeAfter />
        <VideoShowcase />
        <About />
        <Contact />
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
