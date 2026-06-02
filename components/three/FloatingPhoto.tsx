'use client';

// ============================================================
//  SCHWEBENDE FOTO-PLANE (3D)
//  Lädt eine Textur, zeigt sie mit cinematic Shader, schwebt
//  sanft und reagiert auf Hover (Aufhellung). Fehlt das Bild,
//  wird eine neutrale Platzhalter-Farbe genutzt (kein Crash).
// ============================================================

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

import vertexShader from '@/shaders/photo.vert';
import fragmentShader from '@/shaders/photo.frag';

interface FloatingPhotoProps {
  src: string;
  position: [number, number, number];
  scale?: number;
  index?: number;
}

// Fallback-Textur (1x1 dunkelgrau) falls Bild fehlt
function useSafeTexture(src: string): THREE.Texture {
  // useTexture wirft bei Fehler – wir fangen über Suspense in World ab.
  // Zusätzlich erzeugen wir hier eine Daten-Textur als Default-Memo.
  const fallback = useMemo(() => {
    const data = new Uint8Array([28, 28, 34, 255]); // entspricht --carbon
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }, []);

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const tex = useTexture(src);
    (tex as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
    return tex as THREE.Texture;
  } catch {
    return fallback;
  }
}

export default function FloatingPhoto({ src, position, scale = 2.4, index = 0 }: FloatingPhotoProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const hoverValue = useRef(0);

  const texture = useSafeTexture(src);

  // Seitenverhältnis aus der Textur ableiten (Standard 3:2)
  const aspect = texture.image ? texture.image.width / texture.image.height : 1.5;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uOpacity: { value: 0 }, // startet unsichtbar, faded ein
    }),
    [texture]
  );

  useFrame((state, delta) => {
    if (!mesh.current || !matRef.current) return;

    const t = state.clock.elapsedTime;

    // sanftes Schweben, je Index leicht versetzt
    mesh.current.position.y = position[1] + Math.sin(t * 0.4 + index) * 0.18;
    mesh.current.rotation.z = Math.sin(t * 0.2 + index) * 0.02;

    // Hover smooth interpolieren
    hoverValue.current += ((hovered ? 1 : 0) - hoverValue.current) * 0.1;

    // sanftes Einblenden
    const targetOpacity = 1;
    matRef.current.uniforms.uOpacity.value +=
      (targetOpacity - matRef.current.uniforms.uOpacity.value) * 0.05;

    matRef.current.uniforms.uTime.value = t;
    matRef.current.uniforms.uHover.value = hoverValue.current;
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      scale={[scale * aspect, scale, 1]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <planeGeometry args={[1, 1, 24, 24]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
