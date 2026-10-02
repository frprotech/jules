'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { OrbitRing } from './OrbitRing';
import { StarField } from './StarField';
import { Nebula } from './Nebula';
import { CameraController } from './CameraController';
import { PostProcessing } from './PostProcessing';
import { PLANETS_DATA } from '@/data/planets';
import { useSolarStore } from '@/store/useSolarStore';

export function SceneCanvas() {
  const showOrbits = useSolarStore((s) => s.showOrbits);
  const selectedBodyId = useSolarStore((s) => s.selectedBodyId);
  const qualityPreset = useSolarStore((s) => s.qualityPreset);

  const starCount = qualityPreset === 'ultra' ? 12000 : qualityPreset === 'high' ? 8000 : 4000;
  const nebulaCount = qualityPreset === 'ultra' ? 3000 : qualityPreset === 'high' ? 2000 : 1000;

  return (
    <div className="w-full h-full absolute inset-0 bg-black overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 65, 115], fov: 45, near: 0.1, far: 2000 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, qualityPreset === 'ultra' ? 2 : 1.5]}
      >
        <color attach="background" args={['#02040a']} />

        {/* Ambient & Star Lighting */}
        <ambientLight intensity={0.12} />
        <StarField count={starCount} />
        <Nebula count={nebulaCount} />

        {/* Orbit Path Lines */}
        {showOrbits &&
          PLANETS_DATA.map((planet) => (
            <OrbitRing
              key={planet.id}
              radius={planet.orbitRadius}
              isSelected={selectedBodyId === planet.id}
            />
          ))}

        {/* Sun Core */}
        <Sun />

        {/* Planets */}
        {PLANETS_DATA.map((planet) => (
          <Planet key={planet.id} data={planet} />
        ))}

        {/* Camera Rig & Orbit Controls */}
        <OrbitControls
          makeDefault
          enablePan
          enableZoom
          enableRotate
          minDistance={8}
          maxDistance={350}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
        />
        <CameraController />

        {/* Post-Processing Effects */}
        <PostProcessing />
      </Canvas>
    </div>
  );
}
