'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitRingProps {
  radius: number;
  color?: string;
  isSelected?: boolean;
}

export function OrbitRing({ radius, color = '#3a4e68', isSelected = false }: OrbitRingProps) {
  const particlesRef = useRef<THREE.Points>(null);

  // Animate single particle travelling along the orbit path
  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Semi-transparent line ring */}
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 128 }, (_, i) => {
                  const theta = (i / 128) * Math.PI * 2;
                  return [Math.cos(theta) * radius, Math.sin(theta) * radius, 0];
                }).flat()
              ),
              3
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isSelected ? '#00e5ff' : color}
          transparent
          opacity={isSelected ? 0.7 : 0.2}
          linewidth={isSelected ? 2 : 1}
        />
      </lineLoop>

      {/* Travelling photon particles on orbit path when selected */}
      {isSelected && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(
                  Array.from({ length: 12 }, (_, i) => {
                    const theta = (i / 12) * Math.PI * 2;
                    return [Math.cos(theta) * radius, Math.sin(theta) * radius, 0];
                  }).flat()
                ),
                3
              ]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#00ffff"
            size={0.6}
            transparent
            opacity={0.9}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
}
