'use client';

/* eslint-disable react-hooks/refs */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RingShader } from '@/shaders/ringShader';
import * as THREE from 'three';

interface SaturnRingsProps {
  planetRadius: number;
}

export function SaturnRings({ planetRadius }: SaturnRingsProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRadius = planetRadius * 1.4;
  const outerRadius = planetRadius * 2.8;

  const uniforms = useRef({
    uInnerColor: { value: new THREE.Color('#e0c083') },
    uOuterColor: { value: new THREE.Color('#9c8352') }
  });

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.01;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2.3, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 128]} />
      <shaderMaterial
        vertexShader={RingShader.vertexShader}
        fragmentShader={RingShader.fragmentShader}
        uniforms={uniforms.current}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
