'use client';

// ============================================================
//  LENS DIAPHRAGM – echtes 3D-Modell (GLB)
//  Eingebaute Blenden-Animation wird per SCROLL gescrubbt
//  (runter = öffnen, hoch = reverse). Zusätzlich MAUS-Parallax,
//  damit die Linse lebendig auf den Cursor reagiert.
//  KEIN Timer, KEIN Blitz.
// ============================================================

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface LensDiaphragmProps {
  getProgress: () => number;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

export default function LensDiaphragm({ getProgress, mouse }: LensDiaphragmProps) {
  const group = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const mx = useRef(0);
  const my = useRef(0);

  const { scene, animations } = useGLTF('/models/lens.glb', false, true);
  const { actions, mixer, names } = useAnimations(animations, group);

  useEffect(() => {
    if (!names.length) return;
    const action = actions[names[0]];
    if (action) {
      action.play();
      action.paused = true;          // Zeit steuern wir selbst
      action.clampWhenFinished = true;
    }
  }, [actions, names]);

  useFrame(() => {
    if (!group.current) return;

    const p = getProgress();
    smooth.current += (p - smooth.current) * 0.1;
    const t = smooth.current;

    // Maus sanft folgen
    mx.current = THREE.MathUtils.lerp(mx.current, mouse.current.x, 0.05);
    my.current = THREE.MathUtils.lerp(my.current, mouse.current.y, 0.05);

    // Blenden-Animation an Scroll binden
    if (names.length) {
      const action = actions[names[0]];
      const clip = action?.getClip();
      if (action && clip) {
        action.time = t * clip.duration;
        mixer.update(0);
      }
    }

    // Linse dreht mit Scroll + neigt sich zur Maus
    group.current.rotation.z = t * Math.PI * 0.5;
    group.current.rotation.x = my.current * 0.15;
    group.current.rotation.y = mx.current * 0.15;
  });

  return (
    <group ref={group} position={[0, 0, 1.5]} scale={LENS_SCALE}>
      <primitive object={scene} />
    </group>
  );
}

// Skalierung der Linse (anpassen, bis der Ring schön rahmt)
const LENS_SCALE = 1.4;

useGLTF.preload('/models/lens.glb');
