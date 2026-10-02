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
  const flareParticlesRef = useRef<THREE.Points>(null);

  const selectBody = useSolarStore((s) => s.selectBody);
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

  // Solar flare particles
  const [flarePositions, flareColors] = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const c1 = new THREE.Color('#ffaa00');
    const c2 = new THREE.Color('#ff3300');

    let seed = 777;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const r = SUN_DATA.radius * (1.05 + rng() * 0.45);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = c1.clone().lerp(c2, rng());
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    sunUniforms.current.uTime.value += delta;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z -= delta * 0.02;
    }
    if (flareParticlesRef.current) {
      flareParticlesRef.current.rotation.y += delta * 0.08;
      flareParticlesRef.current.rotation.x += delta * 0.03;
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

      {/* Solar Flare Particles */}
      <points ref={flareParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[flarePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[flareColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
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
