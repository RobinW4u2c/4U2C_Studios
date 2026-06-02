'use client';

// ============================================================
//  LICHTSTRAHLEN + NEBEL (Volumetric Look – Fake aber günstig)
//  Mehrere transparente Kegel als "Gottesstrahlen" + Fog im
//  Scene-Level (in World.tsx gesetzt). Sehr performant.
// ============================================================

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LightBeams() {
  const group = useRef<THREE.Group>(null);

  // langsame Rotation der Strahlen für lebendiges Licht
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
    }
  });

  // Konfiguration der einzelnen Strahlen
  const beams: { pos: [number, number, number]; rot: [number, number, number]; color: string }[] = [
    { pos: [-3, 6, -5], rot: [0, 0, 0.3], color: '#c8a96a' },
    { pos: [4, 7, -8], rot: [0, 0, -0.4], color: '#e3d3ad' },
    { pos: [0, 8, -12], rot: [0, 0, 0.1], color: '#ffffff' },
  ];

  return (
    <group ref={group}>
      {beams.map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot}>
          {/* schmaler langer Kegel als Lichtstrahl */}
          <coneGeometry args={[2.5, 14, 32, 1, true]} />
          <meshBasicMaterial
            color={b.color}
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* echtes Licht für die Foto-Planes */}
      <pointLight position={[0, 5, 2]} intensity={1.2} color="#e3d3ad" distance={30} />
      <ambientLight intensity={0.35} />
    </group>
  );
}
