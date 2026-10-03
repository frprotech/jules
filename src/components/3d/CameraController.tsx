'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import gsap from 'gsap';
import { useSolarStore } from '@/store/useSolarStore';
import { PLANETS_DATA, SUN_DATA } from '@/data/planets';

export function CameraController() {
  const { camera, scene, controls } = useThree();
  const targetVector = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioningRef = useRef(false);

  const selectedBodyId = useSolarStore((s) => s.selectedBodyId);
  const cameraFocusSignal = useSolarStore((s) => s.cameraFocusSignal);

  useEffect(() => {
    const orbitControls = controls as unknown as OrbitControlsImpl;
    if (!orbitControls) return;

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(orbitControls.target);

    if (!selectedBodyId) {
      isTransitioningRef.current = true;
      gsap.to(camera.position, {
        x: 0,
        y: 60,
        z: 110,
        duration: 2.0,
        ease: 'power3.inOut'
      });
      gsap.to(orbitControls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2.0,
        ease: 'power3.inOut',
        onUpdate: () => orbitControls.update(),
        onComplete: () => {
          isTransitioningRef.current = false;
        }
      });
      return;
    }

    const bodyData = selectedBodyId === 'sun' ? SUN_DATA : PLANETS_DATA.find((p) => p.id === selectedBodyId);
    if (!bodyData) return;

    const targetObj = scene.getObjectByName(selectedBodyId);
    if (targetObj) {
      targetObj.getWorldPosition(targetVector.current);
    } else {
      targetVector.current.set(bodyData.orbitRadius, 0, 0);
    }

    const offsetDistance = bodyData.radius * 3.5 + 4;
    const newCamPos = new THREE.Vector3()
      .copy(targetVector.current)
      .add(new THREE.Vector3(offsetDistance * 0.7, offsetDistance * 0.5, offsetDistance));

    isTransitioningRef.current = true;

    gsap.to(camera.position, {
      x: newCamPos.x,
      y: newCamPos.y,
      z: newCamPos.z,
      duration: 1.8,
      ease: 'power2.out'
    });

    gsap.to(orbitControls.target, {
      x: targetVector.current.x,
      y: targetVector.current.y,
      z: targetVector.current.z,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => orbitControls.update(),
      onComplete: () => {
        isTransitioningRef.current = false;
      }
    });
  }, [selectedBodyId, cameraFocusSignal, camera, scene, controls]);

  // Continuously track moving planet in real-time when selected
  useFrame(() => {
    const orbitControls = controls as unknown as OrbitControlsImpl;
    if (selectedBodyId && orbitControls && !isTransitioningRef.current) {
      const targetObj = scene.getObjectByName(selectedBodyId);
      if (targetObj) {
        const currentWorldPos = new THREE.Vector3();
        targetObj.getWorldPosition(currentWorldPos);

        const deltaPos = new THREE.Vector3().subVectors(currentWorldPos, orbitControls.target);
        camera.position.add(deltaPos);
        orbitControls.target.copy(currentWorldPos);
        orbitControls.update();
      }
    }
  });

  return null;
}
