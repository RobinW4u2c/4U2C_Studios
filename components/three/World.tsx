'use client';

// ============================================================
//  DIE 3D-WELT (Scene Content)
//  - Sony Alpha (echtes GLB) scroll-gesteuert
//  - Lens Diaphragm (echtes GLB) Animation per Scroll gescrubbt
//  - schwebende Fotos, Licht, Partikel, Video-Screen
//  - Postprocessing: dezenter Bloom + DoF + Vignette
//  ALLES scroll-getrieben, keine Automatik, kein Blitz.
// ============================================================

import { Suspense } from 'react';
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

import CameraRig from './CameraRig';
import LightBeams from './LightBeams';
import Particles from './Particles';
import FloatingPhoto from './FloatingPhoto';
import VideoScreen from './VideoScreen';
import SonyCamera from './SonyCamera';
import LensDiaphragm from './LensDiaphragm';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { HERO_PHOTOS, VIDEOS } from '@/lib/data';

interface WorldProps {
  isMobile: boolean;
}

export default function World({ isMobile }: WorldProps) {
  // Scroll-Fortschritt (0..1) + Richtung
  const getScroll = useScrollDirection();
  const getProgress = () => getScroll().progress;

  return (
    <>
      {/* Nebel: Tiefe blendet ins Dunkle. Kein opaker Background
          -> driftende Bilderwand dahinter bleibt sichtbar. */}
      <fog attach="fog" args={['#0a0a0c', 8, 34]} />

      {/* Kamera-Steuerung (Betrachter-Kamera) */}
      <CameraRig />

      {/* Licht & Strahlen */}
      <LightBeams />

      {/* Partikel – dezent */}
      <Particles count={isMobile ? 300 : 800} color="#c8a96a" />

      {/* SONY ALPHA (echtes Modell) – dreht/bewegt sich beim Scrollen.
          Mobile: aus Performance-Gründen ebenfalls aktiv, da leicht (250KB). */}
      <Suspense fallback={null}>
        <SonyCamera getProgress={getProgress} />
      </Suspense>

      {/* LENS DIAPHRAGM (echtes Modell) – Blende öffnet/schließt per Scroll.
          Auf Mobile weggelassen (Vordergrund-Effekt, spart Leistung). */}
      {!isMobile && (
        <Suspense fallback={null}>
          <LensDiaphragm getProgress={getProgress} />
        </Suspense>
      )}

      {/* Schwebende Fotos */}
      <Suspense fallback={null}>
        {HERO_PHOTOS.map((p, i) => (
          <FloatingPhoto key={i} src={p.src} position={p.position} scale={p.scale} index={i} />
        ))}
      </Suspense>

      {/* Video-Screen in der Tiefe */}
      <Suspense fallback={null}>
        {VIDEOS[0] && <VideoScreen src={VIDEOS[0].src} position={[0, 0, -18]} scale={2.6} />}
      </Suspense>

      {/* POSTPROCESSING */}
      {isMobile ? (
        <EffectComposer>
          <Vignette eskil={false} offset={0.2} darkness={0.9} />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={4}>
          <DepthOfField focusDistance={0.015} focalLength={0.05} bokehScale={2.5} height={480} />
          <Bloom intensity={0.7} luminanceThreshold={0.45} luminanceSmoothing={0.95} mipmapBlur />
          <Noise opacity={0.022} premultiply blendFunction={BlendFunction.ADD} />
          <Vignette eskil={false} offset={0.22} darkness={0.92} />
        </EffectComposer>
      )}
    </>
  );
}
