'use client';

/* eslint-disable react-hooks/refs */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBody } from '@/types/solar';
import { AtmosphereShader } from '@/shaders/atmosphereShader';
import { EarthNightShader } from '@/shaders/earthNightShader';
import { SaturnRings } from './SaturnRings';
import { Moon } from './Moon';
import { useSolarStore } from '@/store/useSolarStore';
import { Html } from '@react-three/drei';

interface PlanetProps {
  data: CelestialBody;
}

export function Planet({ data }: PlanetProps) {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const cloudMeshRef = useRef<THREE.Mesh>(null);

  const selectBody = useSolarStore((s) => s.selectBody);
  const selectedBodyId = useSolarStore((s) => s.selectedBodyId);
  const hoveredBodyId = useSolarStore((s) => s.hoveredBodyId);
  const setHoveredBody = useSolarStore((s) => s.setHoveredBody);
  const isPlaying = useSolarStore((s) => s.isPlaying);
  const simulationSpeed = useSolarStore((s) => s.simulationSpeed);
  const showLabels = useSolarStore((s) => s.showLabels);

  const isSelected = selectedBodyId === data.id;
  const isHovered = hoveredBodyId === data.id;

  // Custom Earth Night Shader Uniforms
  const earthUniforms = useRef({
    uDayColor: { value: new THREE.Color('#2b82c5') },
    uNightColor: { value: new THREE.Color('#030814') },
    uNightLightsColor: { value: new THREE.Color('#ffaa33') }
  });

  // Atmosphere Rim Uniforms
  const atmosphereUniforms = useRef({
    uColor: { value: new THREE.Color(data.atmosphereColor || '#4da6ff') }
  });

  useFrame((_, delta) => {
    if (isPlaying) {
      // Orbital revolving movement
      if (orbitGroupRef.current) {
        orbitGroupRef.current.rotation.y += delta * data.orbitSpeed * simulationSpeed;
      }
      // Planet axial rotation
      if (planetMeshRef.current) {
        planetMeshRef.current.rotation.y += delta * data.rotationSpeed;
      }
      // Earth clouds subtle differential rotation
      if (cloudMeshRef.current) {
        cloudMeshRef.current.rotation.y += delta * (data.rotationSpeed * 1.3);
      }
    }
  });

  return (
    <group ref={orbitGroupRef}>
      <group position={[data.orbitRadius, 0, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(data.axialTilt)]}>
        {/* Main Planet Mesh */}
        <mesh
          ref={planetMeshRef}
          name={data.id}
          onClick={(e) => {
            e.stopPropagation();
            selectBody(data.id);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            selectBody(data.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredBody(data.id);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredBody(null);
            document.body.style.cursor = 'auto';
          }}
          scale={isHovered ? 1.08 : 1.0}
        >
          <sphereGeometry args={[data.radius, 48, 48]} />

          {data.textureType === 'earth' ? (
            <shaderMaterial
              vertexShader={EarthNightShader.vertexShader}
              fragmentShader={EarthNightShader.fragmentShader}
              uniforms={earthUniforms.current}
            />
          ) : (
            <meshStandardMaterial
              color={data.color}
              roughness={data.type === 'gas_giant' ? 0.4 : 0.8}
              metalness={0.1}
            />
          )}
        </mesh>

        {/* Earth Specific Clouds Layer */}
        {data.id === 'earth' && (
          <mesh ref={cloudMeshRef} scale={1.03}>
            <sphereGeometry args={[data.radius, 32, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Atmospheric Scattering Outer Rim */}
        {data.atmosphereColor && (
          <mesh scale={1.15}>
            <sphereGeometry args={[data.radius, 32, 32]} />
            <shaderMaterial
              vertexShader={AtmosphereShader.vertexShader}
              fragmentShader={AtmosphereShader.fragmentShader}
              uniforms={atmosphereUniforms.current}
              transparent
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Saturn / Uranus Rings */}
        {data.hasRings && <SaturnRings planetRadius={data.radius} />}

        {/* Orbiting Moons */}
        {data.moonsList.map((moon) => (
          <Moon key={moon.id} data={moon} parentRadius={data.radius} />
        ))}

        {/* 3D Label & Tooltip */}
        {(showLabels || isHovered || isSelected) && (
          <Html position={[0, data.radius + 1.2, 0]} center distanceFactor={25}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                selectBody(data.id);
              }}
              className={`px-2.5 py-1 rounded-md backdrop-blur-md text-xs tracking-wider font-mono whitespace-nowrap cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-cyan-950/90 border border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30 font-bold scale-110'
                  : isHovered
                  ? 'bg-slate-900/80 border border-slate-400 text-white font-semibold'
                  : 'bg-black/40 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {data.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
