'use client';

// ============================================================
//  FLYING CAMERA (Sony Alpha 7 III – prozedural gebaut)
//  Eine spiegellose Kamera fliegt durch den Hero, dreht sich
//  und löst einen Blitz aus. Der Blitz triggert (via Callback)
//  den weißen Flash-Overlay + den "Shutter/Iris"-Moment.
//
//  AUSTAUSCHEN: Willst du ein echtes Sony-Modell, kannst du
//  hier später ein GLB laden (useGLTF) und diese Geometrie
//  ersetzen. Aktuell rein prozedural = keine externen Assets.
// ============================================================

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlyingCameraProps {
  // wird aufgerufen, wenn die Kamera "auslöst" (Blitz)
  onFlash: () => void;
}

export default function FlyingCamera({ onFlash }: FlyingCameraProps) {
  const group = useRef<THREE.Group>(null);
  const lensGlow = useRef<THREE.Mesh>(null);
  const flashLight = useRef<THREE.PointLight>(null);

  // Zustand des Flug-/Blitz-Zyklus
  const cycle = useRef(0);          // läuft 0..1 und wiederholt sich
  const flashedThisCycle = useRef(false);

  // Materialien einmalig erzeugen
  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#15151a', metalness: 0.7, roughness: 0.35 }),
    []
  );
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c8a96a', metalness: 0.9, roughness: 0.2 }),
    []
  );
  const lensMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0a0a0c', metalness: 0.5, roughness: 0.1 }),
    []
  );
  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a2a3a',
        metalness: 1,
        roughness: 0.05,
        emissive: '#2a4a6a',
        emissiveIntensity: 0.4,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!group.current) return;

    // Zyklus vorantreiben (ein kompletter Durchflug ~ 9s)
    cycle.current += delta / 9;
    if (cycle.current >= 1) {
      cycle.current = 0;
      flashedThisCycle.current = false;
    }
    const t = cycle.current;

    // FLUGBAHN: von rechts hinten -> Mitte (nah) -> links weg
    // x: rechts (3.5) -> links (-3.5)
    // z: hinten (-8) -> vorne nah (1.5) -> hinten (-8)
    const x = THREE.MathUtils.lerp(3.5, -3.5, t);
    const z = -8 + Math.sin(t * Math.PI) * 9.5; // Bogen nach vorne und zurück
    const y = Math.sin(t * Math.PI * 2) * 0.8;  // leichtes Auf/Ab

    group.current.position.set(x, y, z);

    // Kamera dreht sich, "schaut" Richtung Betrachter wenn nah
    group.current.rotation.y = THREE.MathUtils.lerp(-0.8, 0.8, t) + Math.PI;
    group.current.rotation.z = Math.sin(t * Math.PI * 2) * 0.15;
    group.current.rotation.x = Math.sin(t * Math.PI) * 0.1;

    // BLITZ-MOMENT: genau wenn die Kamera am nächsten ist (t ~ 0.5)
    const nearPeak = t > 0.46 && t < 0.54;
    if (nearPeak && !flashedThisCycle.current) {
      flashedThisCycle.current = true;
      onFlash();                              // Flash-Overlay triggern
      if (flashLight.current) flashLight.current.intensity = 18; // greller Lichtblitz
    }

    // Blitzlicht schnell abklingen lassen
    if (flashLight.current) {
      flashLight.current.intensity = THREE.MathUtils.lerp(flashLight.current.intensity, 0, 0.12);
    }

    // Objektiv-Glas pulsiert leicht (lebendig)
    if (lensGlow.current) {
      const m = lensGlow.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group ref={group} scale={0.6}>
      {/* ---- KAMERA-BODY ---- */}
      <mesh material={bodyMat}>
        <boxGeometry args={[2.2, 1.5, 1.0]} />
      </mesh>

      {/* Griff (rechts am Body) */}
      <mesh material={bodyMat} position={[1.0, -0.1, 0.1]}>
        <boxGeometry args={[0.6, 1.4, 1.1]} />
      </mesh>

      {/* Sucher-Buckel oben (typisch spiegellos, mittig) */}
      <mesh material={bodyMat} position={[-0.2, 0.95, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.8]} />
      </mesh>

      {/* Auslöser-Knopf (gold-Akzent) */}
      <mesh material={accentMat} position={[1.0, 0.85, 0.3]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 24]} />
      </mesh>

      {/* Moduswahlrad */}
      <mesh material={bodyMat} position={[-0.7, 0.85, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.18, 24]} />
      </mesh>

      {/* ---- OBJEKTIV (zeigt nach +Z = Richtung Betrachter) ---- */}
      <group position={[0, -0.05, 0.7]}>
        {/* Objektiv-Tubus */}
        <mesh material={lensMat} position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.7, 1.1, 48]} />
        </mesh>
        {/* Fokusring (Akzent) */}
        <mesh material={accentMat} position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.18, 48]} />
        </mesh>
        {/* Frontlinse / Glas */}
        <mesh ref={lensGlow} material={glassMat} position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.08, 48]} />
        </mesh>
        {/* innerer Glanzpunkt der Linse */}
        <mesh position={[0.15, 0.15, 1.1]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ---- BLITZLICHT (Lichtquelle, die beim Auslösen aufleuchtet) ---- */}
      <pointLight ref={flashLight} position={[0, 0, 1.6]} intensity={0} color="#ffffff" distance={40} decay={2} />
    </group>
  );
}
