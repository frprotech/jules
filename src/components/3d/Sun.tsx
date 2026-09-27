'use client';

/* eslint-disable react-hooks/refs */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SunShader, CoronaGlowShader } from '@/shaders/sunShader';
import { SUN_DATA } from '@/data/planets';
import { useSolarStore } from '@/store/useSolarStore';
import { Html } from '@react-three/drei';

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const flarePointsRef = useRef<THREE.Points>(null);

  const selectBody = useSolarStore((s) => s.selectBody);
  const selectedBodyId = useSolarStore((s) => s.selectedBodyId);
  const hoveredBodyId = useSolarStore((s) => s.hoveredBodyId);
  const setHoveredBody = useSolarStore((s) => s.setHoveredBody);

  const isSelected = selectedBodyId === 'sun';
  const isHovered = hoveredBodyId === 'sun';

  const sunUniforms = useRef({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#ffb703') },
    uColor2: { value: new THREE.Color('#fb8500') }
  });

  const coronaUniforms = useRef({
    uColor: { value: new THREE.Color('#ffaa22') }
  });

  // Solar flare particle cloud
  const flareParticlesCount = 400;
  const [flarePositions, flareColors, flareSizes] = useMemo(() => {
    const pos = new Float32Array(flareParticlesCount * 3);
    const col = new Float32Array(flareParticlesCount * 3);
    const sz = new Float32Array(flareParticlesCount);

    let seed = 99;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < flareParticlesCount; i++) {
      const u = rng();
      const v = rng();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = SUN_DATA.radius * (1.0 + rng() * 0.35);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      col[i * 3] = 1.0;
      col[i * 3 + 1] = 0.5 + rng() * 0.4;
      col[i * 3 + 2] = 0.1;

      sz[i] = 0.8 + rng() * 2.0;
    }

    return [pos, col, sz];
  }, [flareParticlesCount]);

  useFrame((_, delta) => {
    sunUniforms.current.uTime.value += delta;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z -= delta * 0.02;
    }
    if (flarePointsRef.current) {
      flarePointsRef.current.rotation.y += delta * 0.08;
      flarePointsRef.current.rotation.x -= delta * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sun Point Light Source */}
      <pointLight color="#fff0d0" intensity={4.0} distance={400} decay={0.15} castShadow />
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
          selectBody('sun');
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
      <mesh ref={coronaRef} scale={1.28}>
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

      {/* Solar Flare Corona Particles */}
      <points ref={flarePointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[flarePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[flareColors, 3]} />
          <bufferAttribute attach="attributes-size" args={[flareSizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

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
