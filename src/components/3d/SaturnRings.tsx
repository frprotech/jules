'use client';

import { RingShader } from '@/shaders/ringShader';
import * as THREE from 'three';
import { useMemo } from 'react';

interface SaturnRingsProps {
  planetRadius: number;
  innerColor?: string;
  outerColor?: string;
  ringScale?: number;
}

export function SaturnRings({
  planetRadius,
  innerColor = '#e0c083',
  outerColor = '#9c8352',
  ringScale = 2.8
}: SaturnRingsProps) {
  const innerRadius = planetRadius * 1.4;
  const outerRadius = planetRadius * ringScale;

  const uniforms = useMemo(
    () => ({
      uInnerColor: { value: new THREE.Color(innerColor) },
      uOuterColor: { value: new THREE.Color(outerColor) }
    }),
    [innerColor, outerColor]
  );

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
