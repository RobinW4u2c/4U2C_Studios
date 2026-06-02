'use client';

// ============================================================
//  3D CANVAS WRAPPER
//  Mountet den R3F-Canvas mit performanten Defaults und gibt
//  die Welt aus. Erkennt Mobile, um Effekte zu reduzieren.
//  Wird in der Page via dynamic() ohne SSR geladen.
// ============================================================

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import World from './World';
import { isMobileDevice } from '@/lib/utils';

export default function Scene() {
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMobile(isMobileDevice());
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <Canvas
      // Kamera-Grundeinstellung (FOV etc.)
      camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 100 }}
      // dpr begrenzen für Performance (Retina nicht voll ausreizen)
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      // Frameloop läuft immer (Animationen brauchen das)
      frameloop="always"
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <World isMobile={mobile} />
    </Canvas>
  );
}
