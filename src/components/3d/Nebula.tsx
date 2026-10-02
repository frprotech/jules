'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NebulaProps {
  count?: number;
}

export function Nebula({ count = 2000 }: NebulaProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const cloudGroupRef = useRef<THREE.Group>(null);

  // Floating space dust particles
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    let seed = 42;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const palette = [
      new THREE.Color('#00e5ff'),
      new THREE.Color('#7b2cbf'),
      new THREE.Color('#ff007f'),
      new THREE.Color('#3a86ff')
    ];

    for (let i = 0; i < count; i++) {
      const radius = 80 + rng() * 350;
      const theta = rng() * Math.PI * 2;
      const phi = (rng() - 0.5) * Math.PI;

      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const color = palette[Math.floor(rng() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 1.5 + rng() * 3.5;
    }

    return [pos, col, sz];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.003;
    }
    if (cloudGroupRef.current) {
      cloudGroupRef.current.rotation.y += delta * 0.001;
    }
  });

  return (
    <group>
      {/* Volumetric Glowing Nebula Cloud Clusters */}
      <group ref={cloudGroupRef}>
        {/* Cyan Cosmic Dust Cluster */}
        <mesh position={[-150, 40, -200]} scale={[180, 120, 180]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color="#0066aa"
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Magenta Purple Cosmic Dust Cluster */}
        <mesh position={[200, -60, -250]} scale={[220, 150, 220]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color="#550088"
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Deep Indigo Core Dust */}
        <mesh position={[0, -100, -300]} scale={[300, 200, 300]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color="#110033"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Interactive Space Dust Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={2.0}
          vertexColors
          transparent
          opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
