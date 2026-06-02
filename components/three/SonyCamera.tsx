'use client';

// ============================================================
//  SONY ALPHA – echtes 3D-Modell (GLB), realistische Größe
//  HAUPTDARSTELLER der Scroll-Story. ALLES scroll-getrieben:
//    - 0.00–0.25 (Hero):     Kamera mittig, langsame Drehung
//    - 0.25–0.55 (Work):     gleitet nach links, kippt
//    - 0.55–0.80 (Showcase): rückt in die Tiefe, dreht weiter
//    - 0.80–1.00 (Finale):   kommt groß nach vorne zurück
//  Hoch scrollen = exakt rückwärts (Position = f(scroll)).
//  Maus: nur ganz subtiles Neigen (kein Auto-Spin).
// ============================================================

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SonyCameraProps {
  getProgress: () => number;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

// Keyframes der Story (Position, Rotation, Scale je Scroll-Abschnitt)
// Werte in Welt-Einheiten. Modell ist ~4.8u breit -> kleine Scales.
const STORY: { at: number; pos: [number, number, number]; rot: [number, number, number]; scale: number }[] = [
  { at: 0.00, pos: [0.0, -0.2, 0.5],  rot: [0.1, -0.4, 0.0], scale: 0.42 },
  { at: 0.28, pos: [-1.6, 0.1, -0.5], rot: [0.0, 0.6, 0.12], scale: 0.38 },
  { at: 0.55, pos: [1.4, -0.3, -2.0], rot: [0.15, 1.6, -0.1], scale: 0.30 },
  { at: 0.80, pos: [-0.8, 0.2, -1.0], rot: [-0.1, 2.4, 0.08], scale: 0.34 },
  { at: 1.00, pos: [0.0, -0.1, 0.8],  rot: [0.05, 3.2, 0.0], scale: 0.5 },
];

function sampleStory(t: number) {
  let a = STORY[0], b = STORY[STORY.length - 1];
  for (let i = 0; i < STORY.length - 1; i++) {
    if (t >= STORY[i].at && t <= STORY[i + 1].at) { a = STORY[i]; b = STORY[i + 1]; break; }
  }
  const span = b.at - a.at || 1;
  const k = THREE.MathUtils.clamp((t - a.at) / span, 0, 1);
  // weiche Ease zwischen Keyframes
  const e = k * k * (3 - 2 * k);
  return {
    pos: [
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], e),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], e),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], e),
    ] as [number, number, number],
    rot: [
      THREE.MathUtils.lerp(a.rot[0], b.rot[0], e),
      THREE.MathUtils.lerp(a.rot[1], b.rot[1], e),
      THREE.MathUtils.lerp(a.rot[2], b.rot[2], e),
    ] as [number, number, number],
    scale: THREE.MathUtils.lerp(a.scale, b.scale, e),
  };
}

export default function SonyCamera({ getProgress, mouse }: SonyCameraProps) {
  const group = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const mx = useRef(0);
  const my = useRef(0);

  const { scene } = useGLTF('/models/sony_alpha.glb', false, true);

  useFrame(() => {
    if (!group.current) return;

    // Scroll sanft folgen (Position ist reine Funktion des Scrolls -> reverse automatisch)
    const p = getProgress();
    smooth.current += (p - smooth.current) * 0.09;
    const t = smooth.current;

    const s = sampleStory(t);

    // Maus nur als feines Neigen (kein eigenständiges Drehen)
    mx.current = THREE.MathUtils.lerp(mx.current, mouse.current.x, 0.05);
    my.current = THREE.MathUtils.lerp(my.current, mouse.current.y, 0.05);

    group.current.position.set(s.pos[0] + mx.current * 0.15, s.pos[1] + my.current * 0.1, s.pos[2]);
    group.current.rotation.set(s.rot[0] - my.current * 0.12, s.rot[1] + mx.current * 0.18, s.rot[2]);
    group.current.scale.setScalar(s.scale);
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/sony_alpha.glb');
