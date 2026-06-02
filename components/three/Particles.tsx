'use client';

// ============================================================
//  PARTIKEL-SYSTEM (Staub / Nebelpartikel in der 3D-Welt)
//  Nutzt die GLSL-Shader aus /shaders. Performant via Points.
// ============================================================

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import vertexShader from '@/shaders/particles.vert';
import fragmentShader from '@/shaders/particles.frag';

interface ParticlesProps {
  count?: number;   // Anzahl Partikel (mobil reduzieren!)
  color?: string;   // Partikelfarbe
}

export default function Particles({ count = 1200, color = '#c8a96a' }: ParticlesProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Geometrie & Attribute nur einmal erzeugen
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Partikel in einem großen Volumen um die Kamera verteilen
      positions[i * 3 + 0] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = -Math.random() * 40; // nach hinten in die Tiefe
      phases[i] = Math.random() * Math.PI * 2;
      scales[i] = 0.5 + Math.random() * 1.5;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [count]);

  // Uniforms für den Shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 18 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color]
  );

  // Zeit hochzählen
  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
