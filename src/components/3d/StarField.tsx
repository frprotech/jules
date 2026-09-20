'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
  count?: number;
}

export function StarField({ count = 8000 }: StarFieldProps) {
  const deepStarsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Background Distant Deep Stars
  const [starPositions, starColors, starSizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    let seed = 1337;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#a0c8ff'),
      new THREE.Color('#ffd090'),
      new THREE.Color('#90e0ff'),
      new THREE.Color('#ffb0b0'),
      new THREE.Color('#00ffff')
    ];

    for (let i = 0; i < count; i++) {
      const u = rng();
      const v = rng();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 350 + rng() * 650;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(rng() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.8 + rng() * 2.5;
    }

    return [pos, col, sz];
  }, [count]);

  // Foreground Cosmic Dust Particles
  const [dustPositions, dustColors] = useMemo(() => {
    const dustCount = Math.floor(count * 0.15);
    const pos = new Float32Array(dustCount * 3);
    const col = new Float32Array(dustCount * 3);

    let seed = 42;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const dustPalette = [
      new THREE.Color('#22d3ee'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#f59e0b')
    ];

    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (rng() - 0.5) * 250;
      pos[i * 3 + 1] = (rng() - 0.5) * 120;
      pos[i * 3 + 2] = (rng() - 0.5) * 250;

      const c = dustPalette[Math.floor(rng() * dustPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (deepStarsRef.current) {
      deepStarsRef.current.rotation.y += delta * 0.003;
      deepStarsRef.current.rotation.x += delta * 0.001;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y -= delta * 0.012;
    }
  });

  return (
    <group>
      {/* Distant Deep Stars Layer */}
      <points ref={deepStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
          <bufferAttribute attach="attributes-size" args={[starSizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.6}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Floating Foreground Cosmic Dust Layer */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.9}
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
