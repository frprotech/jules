'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MoonData } from '@/types/solar';

interface MoonProps {
  data: MoonData;
  parentRadius: number;
}

export function Moon({ data, parentRadius }: MoonProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const orbitRadius = parentRadius + data.distance;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * data.orbitSpeed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} position={[orbitRadius, 0, 0]}>
        <sphereGeometry args={[data.radius, 16, 16]} />
        <meshStandardMaterial
          color={data.color}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
