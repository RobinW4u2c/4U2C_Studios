'use client';

// ============================================================
//  LENS DIAPHRAGM – echtes 3D-Modell (GLB)
//  Story-Rolle: die "Blende", durch die man die Reise sieht.
//  Eingebaute Öffnen/Schließen-Animation wird per SCROLL
//  gescrubbt (runter = öffnen, hoch = schließen/reverse).
//  Position scroll-getrieben: kommt im Finale groß nach vorne.
//  Maus: feines Neigen. KEIN Timer, KEIN Auto-Spin, KEIN Blitz.
// ============================================================

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface LensDiaphragmProps {
  getProgress: () => number;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

// Story der Linse: meist im Hintergrund/Rand, im Finale zentral & groß
const STORY: { at: number; pos: [number, number, number]; scale: number; opacity: number }[] = [
  { at: 0.00, pos: [2.2, 1.0, -3.0], scale: 0.5, opacity: 0.0 },
  { at: 0.30, pos: [2.6, 0.6, -2.5], scale: 0.6, opacity: 0.5 },
  { at: 0.60, pos: [-2.4, -0.6, -2.0], scale: 0.7, opacity: 0.6 },
  { at: 0.85, pos: [0.0, 0.0, -1.0], scale: 1.1, opacity: 0.9 },
  { at: 1.00, pos: [0.0, 0.0, 0.2], scale: 1.6, opacity: 1.0 },
];

function sample(t: number) {
  let a = STORY[0], b = STORY[STORY.length - 1];
  for (let i = 0; i < STORY.length - 1; i++) {
    if (t >= STORY[i].at && t <= STORY[i + 1].at) { a = STORY[i]; b = STORY[i + 1]; break; }
  }
  const span = b.at - a.at || 1;
  const k = THREE.MathUtils.clamp((t - a.at) / span, 0, 1);
  const e = k * k * (3 - 2 * k);
  return {
    pos: [
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], e),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], e),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], e),
    ] as [number, number, number],
    scale: THREE.MathUtils.lerp(a.scale, b.scale, e),
    opacity: THREE.MathUtils.lerp(a.opacity, b.opacity, e),
  };
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
      action.paused = true;
      action.clampWhenFinished = true;
    }
  }, [actions, names]);

  useFrame(() => {
    if (!group.current) return;

    const p = getProgress();
    smooth.current += (p - smooth.current) * 0.1;
    const t = smooth.current;

    const s = sample(t);

    // Blenden-Animation an Scroll binden
    if (names.length) {
      const action = actions[names[0]];
      const clip = action?.getClip();
      if (action && clip) {
        action.time = t * clip.duration;
        mixer.update(0);
      }
    }

    mx.current = THREE.MathUtils.lerp(mx.current, mouse.current.x, 0.05);
    my.current = THREE.MathUtils.lerp(my.current, mouse.current.y, 0.05);

    group.current.position.set(s.pos[0], s.pos[1], s.pos[2]);
    group.current.scale.setScalar(s.scale);
    // sanftes Neigen zur Maus + scroll-gebundene Z-Drehung
    group.current.rotation.x = my.current * 0.12;
    group.current.rotation.y = mx.current * 0.12;
    group.current.rotation.z = t * Math.PI * 0.4;

    // Opacity der Linse (faded elegant ein/aus)
    group.current.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.transparent = true;
          mat.opacity = s.opacity;
        }
      }
    });
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/lens.glb');
