'use client';

// ============================================================
//  SONY ALPHA – echtes 3D-Modell (GLB)
//  Reagiert auf SCROLL + MAUS, elegant schwebend & rotierend.
//  KEINE Automatik-Blitze. Hochwertige Beleuchtung kommt aus
//  World.tsx (Environment + Spotlights).
//
//  - Scroll: dreht & bewegt das Modell durch die Tiefe
//  - Maus:   sanftes Neigen Richtung Cursor (lebendig, edel)
//  - Idle:   minimales Schweben (Floating Motion)
// ============================================================

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SonyCameraProps {
  getProgress: () => number;          // Scroll 0..1
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

export default function SonyCamera({ getProgress, mouse }: SonyCameraProps) {
  const group = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const mx = useRef(0);
  const my = useRef(0);

  const { scene } = useGLTF('/models/sony_alpha.glb', false, true);

  useFrame((state) => {
    if (!group.current) return;

    // Scroll sanft folgen
    const p = getProgress();
    smooth.current += (p - smooth.current) * 0.08;
    const t = smooth.current;

    // Maus sanft folgen (Parallax-Neigung)
    mx.current = THREE.MathUtils.lerp(mx.current, mouse.current.x, 0.06);
    my.current = THREE.MathUtils.lerp(my.current, mouse.current.y, 0.06);

    const time = state.clock.elapsedTime;

    // ---- ROTATION: Scroll-getrieben + Maus-Neigung + Idle-Schweben ----
    group.current.rotation.y = t * Math.PI * 2.0 + mx.current * 0.4 + Math.sin(time * 0.2) * 0.05;
    group.current.rotation.x = Math.sin(t * Math.PI) * 0.2 - my.current * 0.25;
    group.current.rotation.z = Math.sin(time * 0.3) * 0.03;

    // ---- POSITION: Scroll schiebt in die Tiefe, Idle-Schweben ----
    group.current.position.y =
      THREE.MathUtils.lerp(0.3, -0.7, t) + Math.sin(time * 0.6) * 0.08;
    group.current.position.z = THREE.MathUtils.lerp(-1.0, -4.0, t);
    group.current.position.x = Math.sin(t * Math.PI) * 0.5 + mx.current * 0.3;

    // dezentes "Atmen" der Größe beim Scrollen
    const s = THREE.MathUtils.lerp(1.0, 0.8, t) * BASE_SCALE;
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group} scale={BASE_SCALE}>
      <primitive object={scene} />
    </group>
  );
}

// Grund-Skalierung (anpassen falls Kamera zu groß/klein erscheint)
const BASE_SCALE = 2.2;

useGLTF.preload('/models/sony_alpha.glb');
