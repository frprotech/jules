'use client';

/* eslint-disable */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
  count?: number;
}

// Shader for deep cosmic nebula clouds
const NebulaCloudShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;

    // Pseudo-noise function
    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = p * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;
      float dist = length(uv);
      if (dist > 1.0) discard;

      float n = fbm(vUv * 3.0 + vec2(uTime * 0.02, uTime * 0.015));
      float mask = smoothstep(1.0, 0.1, dist) * n;

      vec3 color = mix(uColorA, uColorB, n);
      gl_FragColor = vec4(color, mask * 0.25);
    }
  `
};

export function StarField({ count = 8000 }: StarFieldProps) {
  const distantStarsRef = useRef<THREE.Points>(null);
  const brightStarsRef = useRef<THREE.Points>(null);
  const spaceDustRef = useRef<THREE.Points>(null);
  const nebulaMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // 1. Distant Background Stars Layer
  const [distantPos, distantCol, distantSizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    let seed = 101;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#9bb0ff'),
      new THREE.Color('#ffcc66'),
      new THREE.Color('#66d9ff')
    ];

    for (let i = 0; i < count; i++) {
      const u = rng();
      const v = rng();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 400 + rng() * 600;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(rng() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.8 + rng() * 1.5;
    }

    return [pos, col, sz];
  }, [count]);

  // 2. Medium Bright Stars Layer
  const [brightPos, brightCol, brightSizes] = useMemo(() => {
    const bCount = Math.floor(count * 0.15);
    const pos = new Float32Array(bCount * 3);
    const col = new Float32Array(bCount * 3);
    const sz = new Float32Array(bCount);

    let seed = 202;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < bCount; i++) {
      const u = rng();
      const v = rng();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 250 + rng() * 450;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      col[i * 3] = 0.8 + rng() * 0.2;
      col[i * 3 + 1] = 0.9 + rng() * 0.1;
      col[i * 3 + 2] = 1.0;

      sz[i] = 2.5 + rng() * 3.0;
    }

    return [pos, col, sz];
  }, [count]);

  // 3. Floating Space Dust Foreground Particles Layer
  const [dustPos, dustCol] = useMemo(() => {
    const dCount = 400;
    const pos = new Float32Array(dCount * 3);
    const col = new Float32Array(dCount * 3);

    let seed = 303;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < dCount; i++) {
      pos[i * 3] = (rng() - 0.5) * 300;
      pos[i * 3 + 1] = (rng() - 0.5) * 200;
      pos[i * 3 + 2] = (rng() - 0.5) * 300;

      col[i * 3] = 0.0;
      col[i * 3 + 1] = 0.7 + rng() * 0.3;
      col[i * 3 + 2] = 0.9 + rng() * 0.1;
    }

    return [pos, col];
  }, []);

  const nebulaUniforms = useRef({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#3b0764') }, // Deep purple
    uColorB: { value: new THREE.Color('#0369a1') }  // Cosmic cyan
  });

  useFrame((_, delta) => {
    nebulaUniforms.current.uTime.value += delta;

    if (distantStarsRef.current) {
      distantStarsRef.current.rotation.y += delta * 0.002;
    }
    if (brightStarsRef.current) {
      brightStarsRef.current.rotation.y += delta * 0.003;
      brightStarsRef.current.rotation.x -= delta * 0.001;
    }
    if (spaceDustRef.current) {
      spaceDustRef.current.rotation.y += delta * 0.01;
      spaceDustRef.current.rotation.z += delta * 0.005;
    }
  });

  return (
    <group>
      {/* Distant Tiny Stars */}
      <points ref={distantStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[distantPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[distantCol, 3]} />
          <bufferAttribute attach="attributes-size" args={[distantSizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Bright Medium Glowing Stars */}
      <points ref={brightStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[brightPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[brightCol, 3]} />
          <bufferAttribute attach="attributes-size" args={[brightSizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={2.2}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Foreground Floating Space Dust */}
      <points ref={spaceDustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustCol, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          vertexColors
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Background Volumetric Nebula Cloud Backdrop */}
      <mesh position={[0, -20, -350]} rotation={[0, 0, 0.4]}>
        <planeGeometry args={[700, 400]} />
        <shaderMaterial
          ref={nebulaMaterialRef}
          vertexShader={NebulaCloudShader.vertexShader}
          fragmentShader={NebulaCloudShader.fragmentShader}
          uniforms={nebulaUniforms.current}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
