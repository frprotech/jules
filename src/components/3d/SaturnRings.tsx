'use client';

import { RingShader } from '@/shaders/ringShader';
import * as THREE from 'three';

interface SaturnRingsProps {
  planetRadius: number;
}

export function SaturnRings({ planetRadius }: SaturnRingsProps) {
  const innerRadius = planetRadius * 1.4;
  const outerRadius = planetRadius * 2.8;

  const uniforms = {
    uInnerColor: { value: new THREE.Color('#e0c083') },
    uOuterColor: { value: new THREE.Color('#9c8352') }
  };

  return (
    <mesh rotation={[-Math.PI / 2.3, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 128]} />
      <shaderMaterial
        vertexShader={RingShader.vertexShader}
        fragmentShader={RingShader.fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
