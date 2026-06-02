'use client';

// ============================================================
//  KAMERA-RIG (Scroll Driven Flythrough)
//  Die Kamera fliegt entlang eines Pfades durch die Welt –
//  gesteuert durch den globalen Scroll-Fortschritt (0..1).
//  Zusätzlich leichter Maus-Parallax für lebendige Tiefe.
// ============================================================

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useMouse } from '@/hooks/useMouse';
import { lerp } from '@/lib/utils';

// Wegpunkte der Kamera (z-Tiefe nimmt zu = Flug nach vorne/hinten).
// Jeder Eintrag: Position + Blickziel (lookAt).
const WAYPOINTS: { pos: THREE.Vector3; look: THREE.Vector3 }[] = [
  { pos: new THREE.Vector3(0, 0, 6), look: new THREE.Vector3(0, 0, -1) },
  { pos: new THREE.Vector3(-0.6, 0.3, 5.4), look: new THREE.Vector3(0, 0, -1.5) },
  { pos: new THREE.Vector3(0.7, -0.2, 5.0), look: new THREE.Vector3(0, -0.2, -2) },
  { pos: new THREE.Vector3(-0.3, 0.4, 4.8), look: new THREE.Vector3(0, 0.1, -1.5) },
  { pos: new THREE.Vector3(0, 0, 4.2), look: new THREE.Vector3(0, 0, -0.5) },
];

// interpoliert zwischen den Wegpunkten anhand t (0..1)
function sampleWaypoints(t: number, out: { pos: THREE.Vector3; look: THREE.Vector3 }) {
  const seg = t * (WAYPOINTS.length - 1);
  const i = Math.min(Math.floor(seg), WAYPOINTS.length - 2);
  const local = seg - i;

  out.pos.copy(WAYPOINTS[i].pos).lerp(WAYPOINTS[i + 1].pos, local);
  out.look.copy(WAYPOINTS[i].look).lerp(WAYPOINTS[i + 1].look, local);
}

export default function CameraRig() {
  const { camera } = useThree();
  const { update } = useScrollProgress();
  const mouse = useMouse();

  // wiederverwendbare Vektoren (keine Allocation im Frameloop)
  const target = useRef({ pos: new THREE.Vector3(), look: new THREE.Vector3() });
  const currentLook = useRef(new THREE.Vector3(0, 0, -5));

  useFrame(() => {
    const progress = update(0.06); // geglätteter Scroll-Fortschritt
    sampleWaypoints(progress, target.current);

    // Maus-Parallax (kleiner Offset auf die Zielposition)
    const px = mouse.current.x * 0.6;
    const py = mouse.current.y * 0.4;

    // Kamera weich zur Zielposition bewegen
    camera.position.x = lerp(camera.position.x, target.current.pos.x + px, 0.08);
    camera.position.y = lerp(camera.position.y, target.current.pos.y + py, 0.08);
    camera.position.z = lerp(camera.position.z, target.current.pos.z, 0.08);

    // Blickrichtung weich nachführen
    currentLook.current.lerp(target.current.look, 0.08);
    camera.lookAt(currentLook.current);
  });

  return null;
}
