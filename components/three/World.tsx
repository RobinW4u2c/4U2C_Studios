'use client';

// ============================================================
//  DIE 3D-WELT (Premium Scene)
//  - Sony Alpha + Lens (GLB) reagieren auf Scroll UND Maus
//  - Hochwertige Beleuchtung: Environment + Key/Rim-Spotlights
//  - schwebende Fotos, Nebel, dezente Partikel
//  - Postprocessing: weicher Bloom (Glow statt Blitz) + DoF
//  Alles scroll-/maus-getrieben, keine Automatik, kein Blitz.
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
import { useMouse } from '@/hooks/useMouse';
import { HERO_PHOTOS, VIDEOS } from '@/lib/data';

interface WorldProps {
  isMobile: boolean;
}

export default function World({ isMobile }: WorldProps) {
  const getScroll = useScrollDirection();
  const getProgress = () => getScroll().progress;
  const mouse = useMouse(); // normalisierte Maus -1..1

  return (
    <>
      {/* Nebel: filmische Tiefe, kein opaker Background */}
      <fog attach="fog" args={['#0a0a0c', 9, 36]} />

      {/* Betrachter-Kamera-Rig */}
      <CameraRig />

      {/* ---- PREMIUM-BELEUCHTUNG (ohne externe HDR-Abhängigkeit) ---- */}
      {/* Hemisphere: weiches Grund-Ambiente (Himmel/Boden) */}
      <hemisphereLight args={['#2a2a38', '#06060a', 0.6]} />
      {/* Key Light (warm) */}
      <spotLight
        position={[5, 8, 5]}
        angle={0.5}
        penumbra={1}
        intensity={2.4}
        color="#e3d3ad"
        distance={40}
      />
      {/* Rim Light (kühl, hebt Konturen ab) */}
      <spotLight
        position={[-6, 3, -4]}
        angle={0.6}
        penumbra={1}
        intensity={1.6}
        color="#6a8ac8"
        distance={35}
      />
      {/* Fill (frontal, dezent) */}
      <pointLight position={[0, 1, 4]} intensity={0.8} color="#ffffff" distance={20} />
      <ambientLight intensity={0.2} />

      {/* Lichtstrahlen / Glow (kein Blitz) */}
      <LightBeams />

      {/* dezente Partikel */}
      <Particles count={isMobile ? 250 : 700} color="#c8a96a" />

      {/* ---- GLB-MODELLE (Scroll + Maus) ---- */}
      <Suspense fallback={null}>
        <SonyCamera getProgress={getProgress} mouse={mouse} />
      </Suspense>
      {!isMobile && (
        <Suspense fallback={null}>
          <LensDiaphragm getProgress={getProgress} mouse={mouse} />
        </Suspense>
      )}

      {/* schwebende Fotos */}
      <Suspense fallback={null}>
        {HERO_PHOTOS.map((p, i) => (
          <FloatingPhoto key={i} src={p.src} position={p.position} scale={p.scale} index={i} />
        ))}
      </Suspense>

      {/* Video-Screen in der Tiefe */}
      <Suspense fallback={null}>
        {VIDEOS[0] && <VideoScreen src={VIDEOS[0].src} position={[0, 0, -18]} scale={2.6} />}
      </Suspense>

      {/* ---- POSTPROCESSING (Glow statt Blitz) ---- */}
      {isMobile ? (
        <EffectComposer>
          <Vignette eskil={false} offset={0.2} darkness={0.9} />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={4}>
          <DepthOfField focusDistance={0.012} focalLength={0.045} bokehScale={3} height={480} />
          <Bloom intensity={0.6} luminanceThreshold={0.5} luminanceSmoothing={0.95} mipmapBlur />
          <Noise opacity={0.02} premultiply blendFunction={BlendFunction.ADD} />
          <Vignette eskil={false} offset={0.22} darkness={0.92} />
        </EffectComposer>
      )}
    </>
  );
}
