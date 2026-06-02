'use client';

// ============================================================
//  DIE 3D-WELT (Scene Content)
//  Setzt Fog, Kamera-Rig, Licht, Partikel, schwebende Fotos
//  und Video-Screens zusammen. Postprocessing: Bloom + DoF.
//  Wird in Canvas (Scene.tsx) gemountet.
// ============================================================

import { Suspense } from 'react';
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

import CameraRig from './CameraRig';
import LightBeams from './LightBeams';
import Particles from './Particles';
import FloatingPhoto from './FloatingPhoto';
import VideoScreen from './VideoScreen';
import FlyingCamera from './FlyingCamera';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { HERO_PHOTOS, VIDEOS } from '@/lib/data';

interface WorldProps {
  isMobile: boolean;
}

export default function World({ isMobile }: WorldProps) {
  // Scroll-Richtung + Fortschritt für die fliegende Kamera
  const getScroll = useScrollDirection();

  return (
    <>
      {/* Nebel: blendet die Tiefe ins Dunkle aus. Kein opaker
          Background mehr -> driftende Bilderwand bleibt sichtbar. */}
      <fog attach="fog" args={['#0a0a0c', 8, 34]} />

      {/* Kamera-Steuerung */}
      <CameraRig />

      {/* Licht & Strahlen */}
      <LightBeams />

      {/* Partikel – dezenter für cleanen Look */}
      <Particles count={isMobile ? 300 : 800} color="#c8a96a" />

      {/* FLIEGENDE KAMERA (Sony Alpha) – scroll-gesteuert.
          Runter = vorwärts + Blitz, Hoch = reverse. Mobile: aus. */}
      {!isMobile && <FlyingCamera getScroll={getScroll} />}

      {/* Schwebende Fotos (lädt Texturen; Suspense fängt Ladezeit ab) */}
      <Suspense fallback={null}>
        {HERO_PHOTOS.map((p, i) => (
          <FloatingPhoto
            key={i}
            src={p.src}
            position={p.position}
            scale={p.scale}
            index={i}
          />
        ))}
      </Suspense>

      {/* Ein Video-Screen mittig in der Tiefe (erstes Showcase-Video) */}
      <Suspense fallback={null}>
        {VIDEOS[0] && (
          <VideoScreen src={VIDEOS[0].src} position={[0, 0, -18]} scale={2.6} />
        )}
      </Suspense>

      {/* POSTPROCESSING – auf Mobile reduziert (nur Vignette) */}
      {isMobile ? (
        <EffectComposer>
          <Vignette eskil={false} offset={0.2} darkness={0.9} />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={4}>
          {/* Tiefenunschärfe: fokussiert Mitte, blurrt vorne/hinten (dezenter) */}
          <DepthOfField
            focusDistance={0.015}
            focalLength={0.05}
            bokehScale={2.5}
            height={480}
          />
          {/* Bloom: nur die leuchtenden Konturen glühen lassen (cleaner) */}
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.95}
            mipmapBlur
          />
          {/* sehr feines Filmkorn (matter, ruhiger Look) */}
          <Noise opacity={0.022} premultiply blendFunction={BlendFunction.ADD} />
          <Vignette eskil={false} offset={0.22} darkness={0.92} />
        </EffectComposer>
      )}
    </>
  );
}
