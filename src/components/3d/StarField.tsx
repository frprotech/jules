'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
  count?: number;
}

function createPRNG(initialSeed: number) {
  let s = initialSeed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function StarField({ count = 8000 }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Points>(null);

  // Distant Stars
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const rng = createPRNG(1337);

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#a0c8ff'),
      new THREE.Color('#ffd090'),
      new THREE.Color('#90e0ff'),
      new THREE.Color('#ffb0b0')
    ];

    for (let i = 0; i < count; i++) {
      const u = rng();
      const v = rng();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 300 + rng() * 600;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(rng() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.8 + rng() * 2.2;
    }

    return [pos, col, sz];
  }, [count]);

  // Ambient Foreground Space Dust Particles
  const dustCount = 1200;
  const [dustPositions, dustColors] = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    const col = new Float32Array(dustCount * 3);
    const rng = createPRNG(999);

    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (rng() - 0.5) * 350;
      pos[i * 3 + 1] = (rng() - 0.5) * 200;
      pos[i * 3 + 2] = (rng() - 0.5) * 350;

      const c = rng() > 0.5 ? new THREE.Color('#00e5ff') : new THREE.Color('#7b2cbf');
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [dustCount]);

  // Deep Cosmic Nebula Particles
  const nebulaCount = 800;
  const [nebulaPositions, nebulaColors] = useMemo(() => {
    const pos = new Float32Array(nebulaCount * 3);
    const col = new Float32Array(nebulaCount * 3);
    const rng = createPRNG(555);

    const nebulaColorsList = [
      new THREE.Color('#3a0ca3'),
      new THREE.Color('#7209b7'),
      new THREE.Color('#4cc9f0'),
      new THREE.Color('#4361ee')
    ];

    for (let i = 0; i < nebulaCount; i++) {
      const u = rng();
      const v = rng();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 250 + rng() * 250;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = nebulaColorsList[Math.floor(rng() * nebulaColorsList.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [nebulaCount]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.003;
      pointsRef.current.rotation.x += delta * 0.001;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.012;
      dustRef.current.rotation.z -= delta * 0.004;
    }
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y -= delta * 0.002;
    }
  });

  return (
    <group>
      {/* Distant Stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
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

      {/* Foreground Space Dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Deep Nebula Cloud Particles */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nebulaPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nebulaColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={4.0}
          vertexColors
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}
