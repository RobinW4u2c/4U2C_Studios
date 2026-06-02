'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';

export default function CameraRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // minimale stabile Kamera (kein Crash, kein Effekt)
    camera.position.x += (target.current.x - camera.position.x) * 0.05;
    camera.position.y += (target.current.y - camera.position.y) * 0.05;
  });

  return null;
}