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
import { HERO_PHOTOS, VIDEOS } from '@/lib/data';

interface WorldProps {
  isMobile: boolean;
}

export default function World({ isMobile }: WorldProps) {
  return (
    <>
      {/* Nebel: blendet die Tiefe ins Dunkle aus (Atmosphäre) */}
      <fog attach="fog" args={['#0a0a0c', 6, 32]} />
      <color attach="background" args={['#0a0a0c']} />

      {/* Kamera-Steuerung */}
      <CameraRig />

      {/* Licht & Strahlen */}
      <LightBeams />

      {/* Partikel – auf Mobile reduzierte Anzahl für Performance */}
      <Particles count={isMobile ? 400 : 1400} color="#c8a96a" />

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
          {/* Tiefenunschärfe: fokussiert Mitte, blurrt vorne/hinten */}
          <DepthOfField
            focusDistance={0.012}
            focalLength={0.04}
            bokehScale={3.5}
            height={480}
          />
          {/* Bloom: lässt Lichter glühen (cinematic) */}
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          {/* leichtes Filmkorn */}
          <Noise opacity={0.035} premultiply blendFunction={BlendFunction.ADD} />
          <Vignette eskil={false} offset={0.18} darkness={0.95} />
        </EffectComposer>
      )}
    </>
  );
}
