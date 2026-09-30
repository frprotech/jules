'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Nebula() {
  const nebulaGroupRef = useRef<THREE.Group>(null);
  const dustPointsRef = useRef<THREE.Points>(null);

  // Generate procedural particles for space dust & nebula clouds
  const [positions, colors, sizes] = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    let seed = 42;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const palette = [
      new THREE.Color('#3b82f6'), // Deep blue
      new THREE.Color('#8b5cf6'), // Purple
      new THREE.Color('#06b6d4'), // Cyan
      new THREE.Color('#ec4899')  // Soft Magenta
    ];

    for (let i = 0; i < count; i++) {
      const radius = 150 + rng() * 400;
      const theta = rng() * Math.PI * 2;
      const phi = (rng() - 0.5) * Math.PI * 0.6;

      pos[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      const color = palette[Math.floor(rng() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 1.5 + rng() * 3.5;
    }

    return [pos, col, sz];
  }, []);

  useFrame((_, delta) => {
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.y += delta * 0.002;
    }
    if (dustPointsRef.current) {
      dustPointsRef.current.rotation.y -= delta * 0.001;
    }
  });

  return (
    <group ref={nebulaGroupRef}>
      {/* Space Dust Particles Layer */}
      <points ref={dustPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={2.5}
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Subtle Volumetric Glow Meshes for Distant Cosmic Clouds */}
      <mesh position={[-200, 40, -300]} scale={[180, 180, 180]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#1e1b4b" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[250, -50, -250]} scale={[220, 220, 220]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#0c4a6e" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
