'use client';

/* eslint-disable react-hooks/refs */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSolarStore } from '@/store/useSolarStore';

export function Nebula() {
  const nebulaGroupRef = useRef<THREE.Group>(null);
  const dustGroupRef = useRef<THREE.Group>(null);
  const qualityPreset = useSolarStore((s) => s.qualityPreset);

  const dustCount = qualityPreset === 'ultra' ? 1500 : qualityPreset === 'high' ? 1000 : 500;

  // Foreground interactive space dust
  const [dustPositions, dustColors, dustSizes] = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    const col = new Float32Array(dustCount * 3);
    const sz = new Float32Array(dustCount);

    let seed = 42;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const colorsList = [
      new THREE.Color('#00e5ff'),
      new THREE.Color('#7b2cbf'),
      new THREE.Color('#3a86ff'),
      new THREE.Color('#ff007f'),
      new THREE.Color('#ffffff')
    ];

    for (let i = 0; i < dustCount; i++) {
      const u = rng();
      const v = rng();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 40 + rng() * 200;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = colorsList[Math.floor(rng() * colorsList.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.5 + rng() * 1.8;
    }

    return [pos, col, sz];
  }, [dustCount]);

  const nebulaUniforms = useRef({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#0f051d') },
    uColor2: { value: new THREE.Color('#031f38') },
    uColor3: { value: new THREE.Color('#1a0933') }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise2d(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 st = vUv * 3.0;
      float n1 = snoise2d(st + vec2(uTime * 0.01, uTime * 0.015));
      float n2 = snoise2d(st * 2.0 - vec2(uTime * 0.02));

      float cloud = n1 * 0.6 + n2 * 0.4;
      cloud = smoothstep(-0.2, 0.8, cloud);

      vec3 color = mix(uColor1, uColor2, cloud);
      color = mix(color, uColor3, n2 * 0.5 + 0.5);

      float edgeFade = 1.0 - smoothstep(0.3, 0.5, length(vUv - vec2(0.5)));

      gl_FragColor = vec4(color, cloud * edgeFade * 0.4);
    }
  `;

  useFrame((_, delta) => {
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.y += delta * 0.003;
      nebulaUniforms.current.uTime.value += delta;
    }
    if (dustGroupRef.current) {
      dustGroupRef.current.rotation.y += delta * 0.008;
      dustGroupRef.current.rotation.z -= delta * 0.003;
    }
  });

  return (
    <group>
      {/* Distant Volumetric Nebula Clouds */}
      <group ref={nebulaGroupRef}>
        <mesh position={[0, -20, -300]} scale={[800, 800, 1]}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={nebulaUniforms.current}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[200, 50, -400]} rotation={[0, Math.PI / 4, 0]} scale={[700, 700, 1]}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={nebulaUniforms.current}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Foreground Floating Space Dust Particles */}
      <points ref={dustGroupRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustColors, 3]} />
          <bufferAttribute attach="attributes-size" args={[dustSizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
