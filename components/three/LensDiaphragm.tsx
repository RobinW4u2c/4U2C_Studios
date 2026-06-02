'use client';

// ============================================================
//  LENS DIAPHRAGM – echtes 3D-Modell (GLB) mit eingebauter
//  Öffnen/Schließen-Animation. SCROLL-GESCRUBBT:
//    - Die Animations-Zeitleiste wird direkt an den Scroll-
//      Fortschritt gebunden. Runter scrollen spielt vorwärts,
//      hoch scrollen spielt rückwärts (reverse) – automatisch,
//      weil die Zeit = Scrollposition ist.
//  KEINE Automatik, KEIN Timer, KEIN Blitz.
//
//  Modell: /public/models/lens.glb
//  Liegt als ringförmige "Linse" im Vordergrund, durch die
//  man die Szene sieht.
// ============================================================

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface LensDiaphragmProps {
  getProgress: () => number;
}

export default function LensDiaphragm({ getProgress }: LensDiaphragmProps) {
  const group = useRef<THREE.Group>(null);
  const smooth = useRef(0);

  // 2. Arg Draco=false, 3. Arg meshOpt=true (drei lädt Decoder automatisch)
  const { scene, animations } = useGLTF('/models/lens.glb', false, true);
  const { actions, mixer, names } = useAnimations(animations, group);

  // Animation vorbereiten: pausiert, wird manuell "gescrubbt"
  useEffect(() => {
    if (!names.length) return;
    const action = actions[names[0]];
    if (action) {
      action.play();
      action.paused = true;        // wir steuern die Zeit selbst
      action.clampWhenFinished = true;
    }
  }, [actions, names]);

  useFrame(() => {
    if (!group.current) return;

    const p = getProgress();
    smooth.current += (p - smooth.current) * 0.1;
    const t = smooth.current;

    // ---- ANIMATION an Scroll binden (Scrubbing) ----
    if (names.length) {
      const action = actions[names[0]];
      const clip = action?.getClip();
      if (action && clip) {
        // Zeit = Scrollfortschritt * Animationslänge
        action.time = t * clip.duration;
        mixer.update(0); // mit delta 0 -> nur die gesetzte Zeit anwenden
      }
    }

    // Die Linse dreht sich subtil mit dem Scrollen
    group.current.rotation.z = t * Math.PI * 0.5;
  });

  return (
    // Linse vor der Kamera platziert, Richtung Betrachter
    <group ref={group} position={[0, 0, 1.5]} scale={LENS_SCALE} rotation={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// Skalierung der Linse (anpassen, bis der Ring schön den Screen rahmt)
const LENS_SCALE = 1.4;

useGLTF.preload('/models/lens.glb');
