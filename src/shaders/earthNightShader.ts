// Earth Night Lights & Continents Shader

export const EarthNightShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vSunDirection;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;

      // Sun direction relative to world origin (0,0,0)
      vSunDirection = normalize(-worldPosition.xyz);

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uDayColor;
    uniform vec3 uNightColor;
    uniform vec3 uNightLightsColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vSunDirection;

    // Simple procedural continent generator based on sine/cosine harmonic frequencies
    float proceduralContinent(vec2 uv) {
      float lon = uv.x * 3.14159265 * 2.0;
      float lat = (uv.y - 0.5) * 3.14159265;

      float n1 = sin(lon * 3.0 + cos(lat * 2.0)) * cos(lat * 3.0);
      float n2 = cos(lon * 5.0 - sin(lat * 4.0)) * 0.5;
      float n3 = sin(lon * 8.0) * cos(lat * 8.0) * 0.25;

      return step(0.1, n1 + n2 + n3);
    }

    void main() {
      float sunDot = dot(vNormal, vSunDirection);
      float dayMix = smoothstep(-0.25, 0.25, sunDot);

      float isLand = proceduralContinent(vUv);
      vec3 oceanColor = vec3(0.05, 0.2, 0.5);
      vec3 landColor = vec3(0.15, 0.45, 0.25);
      vec3 daySurface = mix(oceanColor, landColor, isLand);

      // Night side city light networks on land masses
      float nightFactor = 1.0 - dayMix;
      vec3 nightCityLights = isLand * uNightLightsColor * nightFactor * 1.5;

      vec3 finalColor = mix(uNightColor + nightCityLights, daySurface * max(sunDot, 0.1), dayMix);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};
