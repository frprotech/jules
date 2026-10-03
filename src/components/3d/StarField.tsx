'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
  count?: number;
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function StarField({ count = 8000 }: StarFieldProps) {
  const farStarsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Distant Starfield Layer
  const [starPositions, starColors, starSizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#a0c8ff'),
      new THREE.Color('#ffd090'),
      new THREE.Color('#90e0ff'),
      new THREE.Color('#ffb0b0'),
      new THREE.Color('#e0b0ff')
    ];

    for (let i = 0; i < count; i++) {
      const u = pseudoRandom(i * 3 + 1);
      const v = pseudoRandom(i * 3 + 2);
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 350 + pseudoRandom(i * 3 + 3) * 650;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(pseudoRandom(i * 7) * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.8 + pseudoRandom(i * 11) * 2.5;
    }

    return [pos, col, sz];
  }, [count]);

  // Foreground Cosmic Dust Layer
  const dustCount = Math.floor(count * 0.15);
  const [dustPositions, dustColors] = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    const col = new Float32Array(dustCount * 3);

    const cyan = new THREE.Color('#00e5ff');
    const gold = new THREE.Color('#ffaa00');

    for (let i = 0; i < dustCount; i++) {
      const u = pseudoRandom(i * 5 + 10000);
      const v = pseudoRandom(i * 5 + 10001);
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 20 + pseudoRandom(i * 5 + 10002) * 220;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = pseudoRandom(i * 5 + 10003) > 0.5 ? cyan : gold;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [dustCount]);

  useFrame((_, delta) => {
    if (farStarsRef.current) {
      farStarsRef.current.rotation.y += delta * 0.003;
      farStarsRef.current.rotation.x += delta * 0.001;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y -= delta * 0.008;
      dustRef.current.rotation.z += delta * 0.003;
    }
  });

  return (
    <group>
      {/* Background Starfield */}
      <points ref={farStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
          <bufferAttribute attach="attributes-size" args={[starSizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Floating Foreground Cosmic Dust Particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          vertexColors
          transparent
          opacity={0.45}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
