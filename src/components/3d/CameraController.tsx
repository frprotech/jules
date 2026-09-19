'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import gsap from 'gsap';
import { useSolarStore } from '@/store/useSolarStore';
import { PLANETS_DATA, SUN_DATA } from '@/data/planets';

export function CameraController() {
  const { camera, scene } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetVector = useRef(new THREE.Vector3(0, 0, 0));

  const selectedBodyId = useSolarStore((s) => s.selectedBodyId);
  const cameraFocusSignal = useSolarStore((s) => s.cameraFocusSignal);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (!selectedBodyId) {
      // Transition back to overview
      gsap.to(camera.position, {
        x: 0,
        y: 60,
        z: 110,
        duration: 2.0,
        ease: 'power3.inOut'
      });
      gsap.to(controlsRef.current.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2.0,
        ease: 'power3.inOut',
        onUpdate: () => controlsRef.current?.update()
      });
      return;
    }

    const bodyData = selectedBodyId === 'sun' ? SUN_DATA : PLANETS_DATA.find((p) => p.id === selectedBodyId);
    if (!bodyData) return;

    // Find 3D object in scene
    const targetObj = scene.getObjectByName(selectedBodyId);
    if (targetObj) {
      targetObj.getWorldPosition(targetVector.current);
    } else {
      targetVector.current.set(bodyData.orbitRadius, 0, 0);
    }

    const offsetDistance = bodyData.radius * 4 + 4;
    const newCamPos = new THREE.Vector3()
      .copy(targetVector.current)
      .add(new THREE.Vector3(offsetDistance * 0.7, offsetDistance * 0.5, offsetDistance));

    gsap.to(camera.position, {
      x: newCamPos.x,
      y: newCamPos.y,
      z: newCamPos.z,
      duration: 1.8,
      ease: 'power2.out'
    });

    gsap.to(controlsRef.current.target, {
      x: targetVector.current.x,
      y: targetVector.current.y,
      z: targetVector.current.z,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => controlsRef.current?.update()
    });
  }, [selectedBodyId, cameraFocusSignal, camera, scene]);

  // Continuously track moving planet in real-time when selected
  useFrame(() => {
    if (selectedBodyId && controlsRef.current) {
      const targetObj = scene.getObjectByName(selectedBodyId);
      if (targetObj) {
        const currentWorldPos = new THREE.Vector3();
        targetObj.getWorldPosition(currentWorldPos);

        const deltaPos = new THREE.Vector3().subVectors(currentWorldPos, controlsRef.current.target);
        camera.position.add(deltaPos);
        controlsRef.current.target.copy(currentWorldPos);
        controlsRef.current.update();
      }
    }
  });

  return (
    // OrbitControls imported dynamically via R3F OrbitControls or standard three-stdlib
    null
  );
}
