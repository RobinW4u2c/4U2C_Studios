'use client';

// ============================================================
//  FLYING CAMERA (Sony Alpha 7 III – prozedural, matt + Glow)
//  SCROLL-GESTEUERT:
//    - Runter scrollen  -> Kamera fliegt vorwärts, löst EINMAL
//                          den Blitz aus (Iris schließt, Cooldown)
//    - Hoch scrollen     -> Bewegung reverse, Iris öffnet wieder,
//                          KEIN Blitz
//    - Kein Scrollen     -> Kamera ruht (kein 9-Sekunden-Loop mehr)
//  Look: mattschwarz (hohe roughness), feine leuchtende
//        Gold-Konturen (emissive accent), cleaner.
// ============================================================

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shutterClose, shutterOpen } from '@/components/ui/ShutterFlash';

interface FlyingCameraProps {
  // liefert geglätteten Scroll-Fortschritt 0..1 + Richtung
  getScroll: () => { progress: number; direction: number };
}

export default function FlyingCamera({ getScroll }: FlyingCameraProps) {
  const group = useRef<THREE.Group>(null);
  const lensGlow = useRef<THREE.Mesh>(null);
  const flashLight = useRef<THREE.PointLight>(null);

  // Flugfortschritt folgt dem Scroll (0..1), geglättet
  const flightT = useRef(0);
  const lastDir = useRef(0);
  const flashedForward = useRef(false); // Blitz nur einmal pro Vorwärts-Phase

  // ---- MATTE MATERIALIEN (cleaner Look) ----
  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0e0e12', metalness: 0.2, roughness: 0.85 }),
    []
  );
  // Gold-Akzent mit leichtem Eigenleuchten (leuchtende Kontur)
  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c8a96a',
        metalness: 0.4,
        roughness: 0.4,
        emissive: '#c8a96a',
        emissiveIntensity: 0.5,
      }),
    []
  );
  const lensMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#070709', metalness: 0.3, roughness: 0.6 }),
    []
  );
  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#10202e',
        metalness: 0.8,
        roughness: 0.15,
        emissive: '#1d3a52',
        emissiveIntensity: 0.5,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!group.current) return;

    const { progress, direction } = getScroll();

    // Flugfortschritt sanft an Scroll koppeln
    flightT.current += (progress - flightT.current) * 0.07;
    const t = flightT.current;

    // ---- FLUGBAHN (an Scroll gebunden) ----
    // von rechts hinten (oben auf der Seite) -> Mitte nah -> links weg (unten)
    const x = THREE.MathUtils.lerp(3.2, -3.2, t);
    const z = -7 + Math.sin(t * Math.PI) * 8.5;     // Bogen nach vorne
    const y = THREE.MathUtils.lerp(1.2, -1.2, t) + Math.sin(t * Math.PI * 2) * 0.4;

    group.current.position.set(x, y, z);
    group.current.rotation.y = THREE.MathUtils.lerp(-0.7, 0.7, t) + Math.PI;
    group.current.rotation.z = Math.sin(t * Math.PI * 2) * 0.12;
    group.current.rotation.x = Math.sin(t * Math.PI) * 0.08;

    // ---- BLITZ-LOGIK (richtungsabhängig) ----
    const nearCenter = t > 0.44 && t < 0.56;

    if (direction > 0) {
      // RUNTER scrollen = vorwärts: einmal blitzen am Center
      lastDir.current = 1;
      if (nearCenter && !flashedForward.current) {
        flashedForward.current = true;
        shutterClose(true);                         // Iris zu + Blitz
        if (flashLight.current) flashLight.current.intensity = 16;
      }
      if (t > 0.6) {
        // nach dem Center wieder öffnen (für nächsten Durchlauf bereit)
        shutterOpen();
      }
      if (t < 0.4) {
        flashedForward.current = false;             // reset vor dem Center
        shutterOpen();
      }
    } else if (direction < 0) {
      // HOCH scrollen = reverse: Iris auf, KEIN Blitz
      lastDir.current = -1;
      flashedForward.current = false;
      shutterOpen();
    }

    // Blitzlicht abklingen
    if (flashLight.current) {
      flashLight.current.intensity = THREE.MathUtils.lerp(flashLight.current.intensity, 0, 0.1);
    }

    // Linse pulsiert dezent
    if (lensGlow.current) {
      const m = lensGlow.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.45 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <group ref={group} scale={0.6}>
      {/* ---- BODY ---- */}
      <mesh material={bodyMat}>
        <boxGeometry args={[2.2, 1.5, 1.0]} />
      </mesh>
      {/* Griff */}
      <mesh material={bodyMat} position={[1.0, -0.1, 0.1]}>
        <boxGeometry args={[0.6, 1.4, 1.1]} />
      </mesh>
      {/* Sucher-Buckel */}
      <mesh material={bodyMat} position={[-0.2, 0.95, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.8]} />
      </mesh>
      {/* Auslöser (leuchtender Gold-Akzent) */}
      <mesh material={accentMat} position={[1.0, 0.85, 0.3]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 24]} />
      </mesh>
      {/* Moduswahlrad */}
      <mesh material={bodyMat} position={[-0.7, 0.85, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.18, 24]} />
      </mesh>

      {/* ---- OBJEKTIV (Richtung +Z) ---- */}
      <group position={[0, -0.05, 0.7]}>
        <mesh material={lensMat} position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.7, 1.1, 48]} />
        </mesh>
        {/* Fokusring – leuchtende Gold-Kontur */}
        <mesh material={accentMat} position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.12, 48]} />
        </mesh>
        {/* Frontglas */}
        <mesh ref={lensGlow} material={glassMat} position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.08, 48]} />
        </mesh>
        {/* Glanzpunkt */}
        <mesh position={[0.15, 0.15, 1.1]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Blitzlicht */}
      <pointLight ref={flashLight} position={[0, 0, 1.6]} intensity={0} color="#ffffff" distance={42} decay={2} />
    </group>
  );
}
