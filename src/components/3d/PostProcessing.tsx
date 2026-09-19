'use client';

import { useSolarStore } from '@/store/useSolarStore';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export function PostProcessing() {
  const qualityPreset = useSolarStore((s) => s.qualityPreset);

  if (qualityPreset === 'low') {
    return null;
  }

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={qualityPreset === 'ultra' ? 1.5 : 1.1}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.SCREEN}
      />
      {qualityPreset === 'ultra' && (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0012, 0.0012)}
        />
      )}
      <Vignette eskil={false} offset={0.1} darkness={0.8} />
    </EffectComposer>
  );
}
