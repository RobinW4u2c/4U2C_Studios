'use client';

// ============================================================
//  3D VIDEO-SCREEN
//  Spielt ein Video als Textur auf einer Plane (stummgeschaltet,
//  loop, autoplay – Browser-Policy konform). Leichter Glanz-
//  Rahmen für den "Screen"-Look.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VideoScreenProps {
  src: string;
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
}

export default function VideoScreen({ src, position, scale = 3, rotationY = 0 }: VideoScreenProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  // Video-Element + VideoTexture erstellen (clientseitig)
  useEffect(() => {
    const video = document.createElement('video');
    video.src = src;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;        // nötig für Autoplay
    video.playsInline = true;
    video.autoplay = true;

    const playPromise = video.play();
    if (playPromise) playPromise.catch(() => { /* Autoplay ggf. blockiert – ignorieren */ });

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    setTexture(tex);

    return () => {
      video.pause();
      video.src = '';
      tex.dispose();
    };
  }, [src]);

  // sanftes Schweben
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Rahmen */}
      <mesh scale={[scale * 1.78 + 0.15, scale + 0.15, 1]} position={[0, 0, -0.02]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#1c1c22" />
      </mesh>

      {/* Video-Fläche (16:9) */}
      <mesh ref={mesh} scale={[scale * 1.78, scale, 1]}>
        <planeGeometry args={[1, 1]} />
        {texture ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#000000" />
        )}
      </mesh>
    </group>
  );
}
