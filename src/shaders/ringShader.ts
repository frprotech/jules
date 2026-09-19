// Saturn Procedural Ring Shader

export const RingShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    uniform vec3 uInnerColor;
    uniform vec3 uOuterColor;

    void main() {
      // Calculate distance from center (vUv ranges 0.0 to 1.0)
      float dist = length(vUv - vec2(0.5));
      if (dist < 0.25 || dist > 0.49) {
        discard;
      }

      // Procedural ring banding gaps (Cassini Division, Encke Gap)
      float band1 = sin(dist * 200.0) * 0.5 + 0.5;
      float band2 = cos(dist * 450.0) * 0.3 + 0.7;
      float gap1 = smoothstep(0.36, 0.37, dist) - smoothstep(0.38, 0.39, dist); // Cassini division

      float alpha = (band1 * band2) * (1.0 - gap1 * 0.85);
      alpha *= smoothstep(0.25, 0.27, dist) * (1.0 - smoothstep(0.47, 0.49, dist));

      vec3 ringColor = mix(uInnerColor, uOuterColor, (dist - 0.25) / 0.24);

      gl_FragColor = vec4(ringColor, alpha * 0.85);
    }
  `
};
