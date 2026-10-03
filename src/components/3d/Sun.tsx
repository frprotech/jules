'use client';

/* eslint-disable react-hooks/refs */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SunShader, CoronaGlowShader } from '@/shaders/sunShader';
import { SUN_DATA } from '@/data/planets';
import { useSolarStore } from '@/store/useSolarStore';
import { Html } from '@react-three/drei';

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

  const selectBody = useSolarStore((s) => s.selectBody);
  const triggerCameraFocus = useSolarStore((s) => s.triggerCameraFocus);
  const selectedBodyId = useSolarStore((s) => s.selectedBodyId);
  const hoveredBodyId = useSolarStore((s) => s.hoveredBodyId);
  const setHoveredBody = useSolarStore((s) => s.setHoveredBody);

  const isSelected = selectedBodyId === 'sun';
  const isHovered = hoveredBodyId === 'sun';

  const sunUniforms = useRef({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#ffaa11') },
    uColor2: { value: new THREE.Color('#ff2200') }
  });

  const coronaUniforms = useRef({
    uColor: { value: new THREE.Color('#ffaa22') }
  });

  useFrame((_, delta) => {
    sunUniforms.current.uTime.value += delta;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z -= delta * 0.02;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sun Point Light Source */}
      <pointLight color="#fff0d0" intensity={3.5} distance={300} decay={0.2} castShadow />
      <ambientLight intensity={0.15} />

      {/* Sun Mesh with Plasma Shader */}
      <mesh
        ref={meshRef}
        name="sun"
        onClick={(e) => {
          e.stopPropagation();
          selectBody('sun');
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          triggerCameraFocus('sun');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredBody('sun');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredBody(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[SUN_DATA.radius, 64, 64]} />
        <shaderMaterial
          vertexShader={SunShader.vertexShader}
          fragmentShader={SunShader.fragmentShader}
          uniforms={sunUniforms.current}
        />
      </mesh>

      {/* Volumetric Corona Glow Mesh */}
      <mesh ref={coronaRef} scale={1.25}>
        <sphereGeometry args={[SUN_DATA.radius, 32, 32]} />
        <shaderMaterial
          vertexShader={CoronaGlowShader.vertexShader}
          fragmentShader={CoronaGlowShader.fragmentShader}
          uniforms={coronaUniforms.current}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 3D Hover Tooltip */}
      {(isHovered || isSelected) && (
        <Html position={[0, SUN_DATA.radius + 2, 0]} center distanceFactor={25}>
          <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/50 shadow-lg shadow-amber-500/20 text-white text-xs tracking-wider uppercase font-mono whitespace-nowrap pointer-events-none">
            {SUN_DATA.name} <span className="text-amber-400 font-bold ml-1">Star</span>
          </div>
        </Html>
      )}
    </group>
  );
}
