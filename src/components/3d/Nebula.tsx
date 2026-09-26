'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NebulaProps {
  count?: number;
}

export function Nebula({ count = 1200 }: NebulaProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    let seed = 4242;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const nebulaColors = [
      new THREE.Color('#00ffff'), // Cyan glow
      new THREE.Color('#3b82f6'), // Electric blue
      new THREE.Color('#8b5cf6'), // Indigo/Violet
      new THREE.Color('#ec4899'), // Cosmic pink
      new THREE.Color('#f59e0b')  // Amber flare
    ];

    for (let i = 0; i < count; i++) {
      // Create layered cloud clusters in deep space
      const radius = 250 + rng() * 450;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2.0 * rng() - 1.0);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.4; // Slightly flatter galactic disk
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = nebulaColors[Math.floor(rng() * nebulaColors.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 12.0 + rng() * 28.0;
    }

    return [pos, col, sz];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={20}
        vertexColors
        transparent
        opacity={0.18}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
