'use client';

// ============================================================
//  SONY ALPHA – echtes 3D-Modell (GLB), scroll-gesteuert
//  KEINE Automatik, KEIN Blitz. Alles folgt dem Scroll:
//    - runter scrollen -> Modell bewegt/dreht sich vorwärts
//    - hoch scrollen    -> exakt reverse (gleiche Kurve rückwärts)
//  Da die Position direkt an den Scroll-Fortschritt (0..1)
//  gebunden ist, ergibt sich "reverse" automatisch beim Hochscrollen.
//
//  Modell: /public/models/sony_alpha.glb (Draco/meshopt-komprimiert)
// ============================================================

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SonyCameraProps {
  // liefert geglätteten Scroll-Fortschritt 0..1
  getProgress: () => number;
}

export default function SonyCamera({ getProgress }: SonyCameraProps) {
  const group = useRef<THREE.Group>(null);
  const smooth = useRef(0);

  // GLB laden. 2. Arg = Draco (false), 3. Arg = meshOpt (true).
  // drei lädt den Meshopt-Decoder automatisch.
  const { scene } = useGLTF('/models/sony_alpha.glb', false, true);

  useFrame(() => {
    if (!group.current) return;

    // Scroll-Fortschritt sanft folgen
    const p = getProgress();
    smooth.current += (p - smooth.current) * 0.08;
    const t = smooth.current;

    // ---- BEWEGUNG komplett an t (0..1) gebunden ----
    // dreht sich um die eigene Achse, während man scrollt
    group.current.rotation.y = t * Math.PI * 2.2;          // gut 2 Umdrehungen über die Seite
    group.current.rotation.x = Math.sin(t * Math.PI) * 0.25;
    group.current.rotation.z = Math.sin(t * Math.PI * 2) * 0.08;

    // schwebt leicht nach unten + zurück in die Tiefe beim Scrollen
    group.current.position.y = THREE.MathUtils.lerp(0.4, -0.6, t) + Math.sin(t * Math.PI * 3) * 0.06;
    group.current.position.z = THREE.MathUtils.lerp(-1.5, -4.5, t);
    group.current.position.x = Math.sin(t * Math.PI) * 0.6;

    // beim Scrollen leicht größer -> kleiner (Atmen)
    const s = THREE.MathUtils.lerp(1.0, 0.78, t);
    group.current.scale.setScalar(s * BASE_SCALE);
  });

  return (
    <group ref={group} scale={BASE_SCALE}>
      <primitive object={scene} />
    </group>
  );
}

// Grund-Skalierung des Modells (anpassen, falls Kamera zu groß/klein)
const BASE_SCALE = 2.2;

// Vorladen für schnelleren ersten Frame
useGLTF.preload('/models/sony_alpha.glb');
